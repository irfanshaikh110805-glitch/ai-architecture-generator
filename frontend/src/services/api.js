import axios from 'axios';
import { validateProjectIdea, validateArchitectureResponse } from '../utils/validation';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL + API_VERSION,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 second timeout
});

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Exponential backoff retry logic
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const shouldRetry = (error) => {
  // Retry on network errors or 5xx server errors
  if (!error.response) return true;
  if (error.response.status >= 500 && error.response.status < 600) return true;
  // Don't retry on 4xx client errors (except 429)
  if (error.response.status === 429) return true;
  return false;
};

// Request interceptor for validation and sanitization
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.headers['X-Request-Time'] = new Date().toISOString();
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
    
    return responseValidation.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
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

export default api;
