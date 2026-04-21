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

// Comprehensive input sanitization
export const sanitizeInput = (input) => {
  if (!input) return '';
  
  // Remove HTML tags
  let cleaned = sanitizeHTML(input);
  
  // Remove SQL injection patterns
  cleaned = sanitizeSQL(cleaned);
  
  // Remove null bytes
  // eslint-disable-next-line no-control-regex
  cleaned = cleaned.replace(/\x00/g, '');
  
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

// API response validation
export const architectureResponseSchema = z.object({
  features: z.array(z.object({
    name: z.string(),
    priority: z.string()
  })).default([]),
  database: z.array(z.object({
    table: z.string(),
    fields: z.array(z.string()),
    relationships: z.array(z.string())
  })).default([]),
  apis: z.array(z.object({
    method: z.string(),
    endpoint: z.string(),
    description: z.string()
  })).default([]),
  architecture: z.object({
    type: z.string(),
    components: z.array(z.string()),
    tech_stack: z.object({
      frontend: z.string(),
      backend: z.string(),
      database: z.string()
    })
  }),
  erDiagram: z.string(),
  architectureDiagram: z.string(),
  roadmap: z.array(z.object({
    phase: z.string(),
    tasks: z.array(z.string())
  })).default([]),
  estimation: z.object({
    hours: z.string(),
    team_size: z.string(),
    cost: z.string()
  })
});

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
    return { 
      success: false, 
      error: 'Invalid response format from server' 
    };
  }
};
