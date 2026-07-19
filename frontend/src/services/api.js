import axios from 'axios';
import { validateProjectIdea, validateArchitectureResponse } from '../utils/validation';
import useAuthStore from '../store/useAuthStore';
import { supabase, dbHelpers } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL + API_VERSION,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 90000, // 90 second timeout (increased to match backend)
});

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Exponential backoff retry logic
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const shouldRetry = (error) => {
  // Never retry on 429 Too Many Requests - retrying immediately worsens rate limits
  if (error.response?.status === 429) return false;
  
  // Retry on network errors or 5xx server errors
  if (!error.response) return true;
  if (error.response.status >= 500 && error.response.status < 600) return true;
  return false;
};


// Request interceptor for validation and sanitization
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.headers['X-Request-Time'] = new Date().toISOString();
    
    // Add auth token if available (Supabase token)
    const token = useAuthStore.getState().getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Store original config for retry
    config.retryCount = config.retryCount || 0;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling with retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Handle 401 Unauthorized - logout user
    if (error.response?.status === 401) {
      useAuthStore.getState().signOut();
      window.location.href = '/login';
      return Promise.reject(new Error('Session expired. Please login again.'));
    }
    
    // Retry logic
    if (shouldRetry(error) && (!config.retryCount || config.retryCount < MAX_RETRIES)) {
      config.retryCount = (config.retryCount || 0) + 1;
      
      // Calculate exponential backoff
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, config.retryCount - 1);
      const jitter = Math.random() * 1000;
      
      console.log(`Retry attempt ${config.retryCount}/${MAX_RETRIES} after ${(delay + jitter).toFixed(0)}ms`);
      
      await sleep(delay + jitter);
      return api(config);
    }
    
    // Error handling after retries exhausted
    if (error.response) {
      // Handle rate limiting
      if (error.response.status === 429) {
        const retryAfter = error.response.headers['retry-after'] || 'a few minutes';
        throw new Error(`Rate limit exceeded. Please try again after ${retryAfter}`);
      }
      
      // Handle validation errors
      if (error.response.status === 422) {
        throw new Error(error.response.data.detail || 'Invalid input provided');
      }
      
      // Handle server errors
      if (error.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      throw new Error(error.response.data.detail || 'An error occurred');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
);

// ============================================================================
// AUTHENTICATION APIs (Legacy - for backward compatibility)
// ============================================================================

export const signup = async (username, email, password) => {
  try {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    // FastAPI OAuth2 expects form data
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 uses 'username' field
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

export const generateApiKey = async () => {
  try {
    const response = await api.post('/auth/api-key');
    return response.data;
  } catch (error) {
    console.error('Generate API key error:', error);
    throw error;
  }
};

// ============================================================================
// ARCHITECTURE APIs
// ============================================================================

export const generateArchitecture = async (idea) => {
  // Validate and sanitize input on frontend
  const validation = validateProjectIdea(idea);
  
  if (!validation.success) {
    throw new Error(validation.error);
  }
  
  try {
    const response = await api.post('/generate', { 
      idea: validation.data.idea 
    });
    
    // Validate response data
    const responseValidation = validateArchitectureResponse(response.data);
    
    if (!responseValidation.success) {
      console.error('Invalid response format:', responseValidation.error);
      // Return data anyway but log the issue
      return response.data;
    }
    
    // Save to Supabase if user is authenticated and Supabase is configured
    const user = useAuthStore.getState().user;
    if (user && responseValidation.data && supabase) {
      try {
        await saveArchitectureToSupabase(user.id, idea, responseValidation.data);
      } catch (supabaseError) {
        console.error('Failed to save to Supabase:', supabaseError);
        // Don't fail the request if Supabase save fails
      }
    }
    
    return responseValidation.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Helper function to save architecture to Supabase
const saveArchitectureToSupabase = async (userId, idea, architectureData) => {
  try {
    // Create architecture record
    const ideaHash = await generateHash(idea);
    const architecture = await dbHelpers.createArchitecture({
      user_id: userId,
      idea: idea,
      idea_hash: ideaHash,
      architecture_type: architectureData.architecture?.type || null,
      tech_stack_frontend: architectureData.architecture?.tech_stack?.frontend || null,
      tech_stack_backend: architectureData.architecture?.tech_stack?.backend || null,
      tech_stack_database: architectureData.architecture?.tech_stack?.database || null,
      er_diagram: architectureData.erDiagram || null,
      architecture_diagram: architectureData.architectureDiagram || null,
      estimation_hours: architectureData.estimation?.hours || null,
      estimation_team_size: architectureData.estimation?.team_size || null,
      estimation_cost: architectureData.estimation?.cost || null,
    });

    console.log('Architecture saved to Supabase:', architecture);
    
    const archId = architecture.id;
    
    // Save features
    if (architectureData.features && Array.isArray(architectureData.features)) {
      const features = architectureData.features.map((feature, index) => ({
        architecture_id: archId,
        name: feature.name || 'Unnamed Feature',
        priority: feature.priority || 'Should',
        description: feature.description || null,
        order: index,
      }));
      
      if (features.length > 0) {
        const { error: featuresError } = await supabase
          .from('features')
          .insert(features);
        
        if (featuresError) {
          console.error('Error saving features:', featuresError);
        } else {
          console.log(`Saved ${features.length} features`);
        }
      }
    }
    
    // Save database tables
    if (architectureData.database?.tables && Array.isArray(architectureData.database.tables)) {
      const tables = architectureData.database.tables.map((table, index) => ({
        architecture_id: archId,
        table_name: table.name || 'unnamed_table',
        fields: table.fields || {},
        relationships: table.relationships || null,
        order: index,
      }));
      
      if (tables.length > 0) {
        const { error: tablesError } = await supabase
          .from('database_tables')
          .insert(tables);
        
        if (tablesError) {
          console.error('Error saving database tables:', tablesError);
        } else {
          console.log(`Saved ${tables.length} database tables`);
        }
      }
    }
    
    // Save APIs
    if (architectureData.apis && Array.isArray(architectureData.apis)) {
      const apis = architectureData.apis.map((api, index) => ({
        architecture_id: archId,
        method: api.method || 'GET',
        endpoint: api.endpoint || '/',
        description: api.description || null,
        order: index,
      }));
      
      if (apis.length > 0) {
        const { error: apisError } = await supabase
          .from('apis')
          .insert(apis);
        
        if (apisError) {
          console.error('Error saving APIs:', apisError);
        } else {
          console.log(`Saved ${apis.length} APIs`);
        }
      }
    }
    
    // Save components
    if (architectureData.components && Array.isArray(architectureData.components)) {
      const components = architectureData.components.map((component, index) => ({
        architecture_id: archId,
        component_name: component.name || 'Unnamed Component',
        description: component.description || null,
        order: index,
      }));
      
      if (components.length > 0) {
        const { error: componentsError } = await supabase
          .from('components')
          .insert(components);
        
        if (componentsError) {
          console.error('Error saving components:', componentsError);
        } else {
          console.log(`Saved ${components.length} components`);
        }
      }
    }
    
    // Save roadmap phases
    if (architectureData.roadmap?.phases && Array.isArray(architectureData.roadmap.phases)) {
      const phases = architectureData.roadmap.phases.map((phase, index) => ({
        architecture_id: archId,
        phase_name: phase.name || `Phase ${index + 1}`,
        tasks: phase.tasks || [],
        order: index,
      }));
      
      if (phases.length > 0) {
        const { error: phasesError } = await supabase
          .from('roadmap_phases')
          .insert(phases);
        
        if (phasesError) {
          console.error('Error saving roadmap phases:', phasesError);
        } else {
          console.log(`Saved ${phases.length} roadmap phases`);
        }
      }
    }
    
    return architecture;
  } catch (error) {
    console.error('Error saving to Supabase:', error);
    throw error;
  }
};

// Helper function to generate SHA-256 hash
const generateHash = async (text) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// ============================================================================
// SUPABASE DIRECT APIs (for features that don't need backend)
// ============================================================================

export const getArchitectures = async () => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('User not authenticated');
  
  if (!supabase) {
    console.warn('Supabase not configured. Architecture history unavailable.');
    return [];
  }
  
  try {
    return await dbHelpers.getArchitectures(user.id);
  } catch (error) {
    console.error('Failed to get architectures:', error);
    throw error;
  }
};

export const getArchitectureById = async (id) => {
  if (!supabase) {
    throw new Error('Supabase not configured. Architecture history unavailable.');
  }
  
  try {
    return await dbHelpers.getArchitectureById(id);
  } catch (error) {
    console.error('Failed to get architecture:', error);
    throw error;
  }
};

export const deleteArchitecture = async (id) => {
  if (!supabase) {
    throw new Error('Supabase not configured. Architecture history unavailable.');
  }
  
  try {
    await dbHelpers.deleteArchitecture(id);
  } catch (error) {
    console.error('Failed to delete architecture:', error);
    throw error;
  }
};

export default api;
