import { z } from 'zod';
import DOMPurify from 'dompurify';

/**
 * Input sanitization utilities
 */

// Sanitize HTML to prevent XSS
export const sanitizeHTML = (input) => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [] 
  });
};

// Remove SQL injection patterns
export const sanitizeSQL = (input) => {
  const dangerousPatterns = [
    /(\bDROP\b|\bDELETE\b|\bTRUNCATE\b|\bEXEC\b|\bEXECUTE\b)/gi,
    /(--|;|\/\*|\*\/)/g,
    /(\bUNION\b.*\bSELECT\b)/gi,
    /(\bINSERT\b.*\bINTO\b)/gi,
    /(\bUPDATE\b.*\bSET\b)/gi
  ];
  
  let cleaned = input;
  dangerousPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  return cleaned.trim();
};

// Comprehensive input sanitization with improved security
export const sanitizeInput = (input) => {
  if (!input) return '';
  
  // Convert to string if not already
  let cleaned = String(input);
  
  // Remove HTML tags
  cleaned = sanitizeHTML(cleaned);
  
  // Remove SQL injection patterns
  cleaned = sanitizeSQL(cleaned);
  
  // Remove null bytes and other control characters
  // eslint-disable-next-line no-control-regex
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Remove multiple consecutive spaces
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  // Trim and return
  return cleaned.trim();
};

/**
 * Zod validation schemas
 */

// Project idea validation schema
export const projectIdeaSchema = z.object({
  idea: z.string()
    .min(10, 'Project idea must be at least 10 characters')
    .max(5000, 'Project idea must not exceed 5000 characters')
    .refine(
      (val) => val.trim().length >= 10,
      'Project idea cannot be empty or contain only whitespace'
    )
    .transform(sanitizeInput)
});

// API response validation with fallback defaults
export const architectureResponseSchema = z.object({
  features: z.array(z.object({
    name: z.string().default('Unnamed Feature'),
    priority: z.string().default('Should'),
    description: z.string().nullable().optional()
  })).default([]),
  database: z.array(z.object({
    table: z.string().default('unnamed_table'),
    fields: z.array(z.string()).default([]),
    relationships: z.array(z.string()).nullable().optional().default([])
  })).default([]),
  apis: z.array(z.object({
    method: z.string().default('GET'),
    endpoint: z.string().default('/'),
    description: z.string().nullable().optional().default('')
  })).default([]),
  architecture: z.object({
    type: z.string().default('Monolith'),
    components: z.array(z.string()).default([]),
    tech_stack: z.object({
      frontend: z.string().nullable().optional().default(''),
      backend: z.string().nullable().optional().default(''),
      database: z.string().nullable().optional().default('')
    }).default({})
  }).default({}),
  erDiagram: z.string().nullable().optional().default(''),
  architectureDiagram: z.string().nullable().optional().default(''),
  roadmap: z.array(z.object({
    phase: z.string().default('Phase 1'),
    tasks: z.array(z.string()).default([])
  })).default([]),
  estimation: z.object({
    hours: z.string().nullable().optional().default(''),
    team_size: z.string().nullable().optional().default(''),
    cost: z.string().nullable().optional().default('')
  }).default({}),
  _fallback: z.boolean().nullable().optional().default(false),
  _message: z.string().nullable().optional().default(null)
}).passthrough(); // Allow additional fields

/**
 * Validation helper functions
 */

export const validateProjectIdea = (idea) => {
  try {
    const result = projectIdeaSchema.parse({ idea });
    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: error.errors[0]?.message || 'Invalid input' 
    };
  }
};

export const validateArchitectureResponse = (data) => {
  try {
    const result = architectureResponseSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    console.error('Response validation error:', error);
    console.error('Invalid data:', JSON.stringify(data, null, 2));
    return { 
      success: false, 
      error: 'Invalid response format from server',
      details: error.errors 
    };
  }
};
