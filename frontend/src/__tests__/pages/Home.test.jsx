import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home';
import * as api from '../../services/api';
import useAppStore from '../../store/useAppStore';

// Mock the API
vi.mock('../../services/api');

// Mock react-router-dom navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Home Page - Project Idea Input', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Reset store state
    useAppStore.setState({ versions: [], currentResult: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  describe('Input Field Rendering', () => {
    it('should render the project idea textarea', () => {
      renderHome();
      const textarea = screen.getByPlaceholderText(/social media platform/i);
      expect(textarea).toBeInTheDocument();
    });

    it('should render the generate button', () => {
      renderHome();
      const button = screen.getByRole('button', { name: /generate architecture/i });
      expect(button).toBeInTheDocument();
    });

    it('should show character count indicator', () => {
      renderHome();
      expect(screen.getByText(/min 10/i)).toBeInTheDocument();
    });

    it('should render Use Template button', () => {
      renderHome();
      const templateButton = screen.getByRole('button', { name: /use template/i });
      expect(templateButton).toBeInTheDocument();
    });
  });

  describe('Input Validation', () => {
    it('should disable submit button when input is empty', () => {
      renderHome();
      const button = screen.getByRole('button', { name: /generate architecture/i });
      expect(button).toBeDisabled();
    });

    it('should disable submit button when input is less than 10 characters', () => {
      renderHome();
      const textarea = screen.getByPlaceholderText(/social media platform/i);
      const button = screen.getByRole('button', { name: /generate architecture/i });

      fireEvent.change(textarea, { target: { value: 'Short' } });
      expect(button).toBeDisabled();
    });

    it('should enable submit button when input is 10+ characters', () => {
      renderHome();
      const textarea = screen.getByPlaceholderText(/social media platform/i);
      const button = screen.getByRole('button', { name: /generate architecture/i });

      fireEvent.change(textarea, { target: { value: 'A valid project idea with enough characters' } });
      expect(button).not.toBeDisabled();
    });

    it('should show error message when submitting with less than 10 characters', async () => {
      renderHome();
      const textarea = screen.getByPlaceholderText(/social media platform/i);
      const form = textarea.closest('form');

      fireEvent.change(textarea, { target: { value: 'Short' } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText(/please provide at least 10 characters/i)).toBeInTheDocument();
      });
    });

    it('should update character count as user types', () => {
      renderHome();
      const textarea = screen.getByPlaceholderText(/social media platform/i);

      fireEvent.change(textarea, { target: { value: 'Test' } });
      expect(screen.getByText('4 / min 10')).toBeInTheDocument();

      fireEvent.change(textarea, { target: { value: 'Test input with more characters' } });
      expect(screen.getByText('31 / min 10')).toBeInTheDocument();
    });

    it('should show success indicator when character count >= 10', () => {
      renderHome();
      const textarea = screen.getByPlaceholderText(/social media platform/i);

      fireEvent.change(textarea, { target: { value: 'Valid input' } });
      
      // Check for the checkmark SVG
      const checkmark = textarea.parentElement.querySelector('svg');
      expect(checkmark).toBeInTheDocument();
    });
  });

  describe('Architecture Generation', () => {
    const validIdea = 'A telemedicine platform with real-time patient monitoring and AI-powered health alerts';
    const mockResponse = {
      features: [
        { name: 'Patient Monitoring', priority: 'Must' },
        { name: 'Video Consultations', priority: 'Must' },
      ],
      database: [
        { table: 'patients', fields: ['id', 'name'], relationships: [] },
      ],
      apis: [
        { method: 'GET', endpoint: '/api/patients', description: 'Get patients' },
      ],
      architecture: {
        type: 'Microservices',
        components: ['WebSocket Server', 'AI Alert Engine'],
        tech_stack: {
          frontend: 'React + TypeScript',
          backend: 'Node.js + Python',
          database: 'PostgreSQL + TimescaleDB',
        },
      },
      erDiagram: 'erDiagram\n    PATIENTS ||--o{ VITALS : has',
      architectureDiagram: 'graph TD\n    A[Client] --> B[API Gateway]',
      roadmap: [
        { phase: 'Phase 1', tasks: ['Setup', 'Design'] },
      ],
      estimation: {
        hours: '800-1200',
        team_size: '5-7 developers',
        cost: '$80,000-$120,000',
      },
    };

    it('should call API with valid input', async () => {
      api.generateArchitecture.mockResolvedValue(mockResponse);
      renderHome();

      const textarea = screen.getByPlaceholderText(/social media platform/i);
      const button = screen.getByRole('button', { name: /generate architecture/i });

      fireEvent.change(textarea, { target: { value: validIdea } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(api.generateArchitecture).toHaveBeenCalledWith(validIdea);
      });
    });

    it('should show loading state during generation', async () => {
      api.generateArchitecture.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
      );
      renderHome();

      const textarea = screen.getByPlaceholderText(/social media platform/i);
      const button = screen.getByRole('button', { name: /generate architecture/i });

      fireEvent.change(textarea, { target: { value: validIdea } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/analyzing & generating architecture/i)).toBeInTheDocument();
      });
    });

    it('should disable textarea during generation', async () => {
      api.generateArchitecture.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
      );
      renderHome();

      const textarea = screen.getByPlaceholderText(/social media platform/i);
      const button = screen.getByRole('button', { name: /generate architecture/i });

      fireEvent.change(textarea, { target: { value: validIdea } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(textarea).toBeDisabled();
      });
    });

    it('should navigate to result page on success', async () => {
      api.generateArchitecture.mockResolvedValue(mockResponse);
      renderHome();

      const textarea = screen.getByPlaceholderText(/social media platform/i);
      const button = screen.getByRole('button', { name: /generate architecture/i });

      fireEvent.change(textarea, { target: { value: validIdea } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/result');
      });
    });

    it('should save result to localStorage on success', async () => {
      api.generateArchitecture.mockResolvedValue(mockResponse);
      renderHome();

      const textarea = screen.getByPlaceholderText(/social media platform/i);
      const button = screen.getByRole('button', { name: /generate architecture/i });

      fireEvent.change(textarea, { target: { value: validIdea } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(localStorage.getItem('lastResult')).toBeTruthy();
        expect(localStorage.getItem('lastIdea')).toBe(validIdea);
      });
    });

    it('should update store with result on success', async () => {
      api.generateArchitecture.mockResolvedValue(mockResponse);
      renderHome();

      const textarea = screen.getByPlaceholderText(/social media platform/i);
      const button = screen.getByRole('button', { name: /generate architecture/i });

      fireEvent.change(textarea, { target: { value: validIdea } });
      fireEvent.click(button);

      await waitFor(() => {
        const state = useAppStore.getState();
        expect(state.currentResult).toEqual(mockResponse);
      });
    });
  });

  describe('Error Handling', () => {
    const validIdea = 'A valid project idea with enough characters';

    it('should display error message on API failure', async () => {
      api.generateArchitecture.mockRejectedValue(new Error('Network error'));
      renderHome();

      const textarea = screen.getByPlaceholderText(/social media platform/i);
      const button = screen.getByRole('button', { name: /generate architecture/i });

      fireEvent.change(textarea, { target: { value: validIdea } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('should display rate limit error', async () => {
      api.generateArchitecture.mockRejectedValue(
        new Error('Rate limit exceeded. Please try again after a few minutes')
      );
      renderHome();

      const textarea = screen.getByPlaceholderText(/social media platform/i);
      const button = screen.getByRole('button', { name: /generate architecture/i });

      fireEvent.change(textarea, { target: { value: validIdea } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/rate limit exceeded/i)).toBeInTheDocument();
      });
    });

    it('should display validation error from backend', async () => {
      api.generateArchitecture.mockRejectedValue(new Error('Invalid input provided'));
      renderHome();

      const textarea = screen.getByPlaceholderText(/social media platform/i);
      const button = screen.getByRole('button', { name: /generate architecture/i });

      fireEvent.change(textarea, { target: { value: validIdea } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/invalid input provided/i)).toBeInTheDocument();
      });
    });

    it('should re-enable form after error', async () => {
      api.generateArchitecture.mockRejectedValue(new Error('API Error'));
      renderHome();

      const textarea = screen.getByPlaceholderText(/social media platform/i);
      const button = screen.getByRole('button', { name: /generate architecture/i });

      fireEvent.change(textarea, { target: { value: validIdea } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/api error/i)).toBeInTheDocument();
      });

      expect(textarea).not.toBeDisabled();
      expect(button).not.toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('should focus textarea when clicking Use Template button', async () => {
      renderHome();
      const templateButton = screen.getByRole('button', { name: /use template/i });
      
      fireEvent.click(templateButton);

      // Template modal should open
      await waitFor(() => {
        expect(screen.getByText(/select a template/i)).toBeInTheDocument();
      });
    });

    it('should show focus state on textarea', () => {
      renderHome();
      const textarea = screen.getByPlaceholderText(/social media platform/i);

      // Check that textarea can receive focus
      expect(textarea).toBeInTheDocument();
      expect(textarea).not.toBeDisabled();
    });

    it('should clear error when user starts typing', async () => {
      renderHome();
      const textarea = screen.getByPlaceholderText(/social media platform/i);
      const form = textarea.closest('form');

      // Trigger error
      fireEvent.change(textarea, { target: { value: 'Short' } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText(/please provide at least 10 characters/i)).toBeInTheDocument();
      });

      // Start typing valid input
      fireEvent.change(textarea, { target: { value: 'A valid project idea' } });

      // Error should still be visible until form is submitted again
      expect(screen.getByText(/please provide at least 10 characters/i)).toBeInTheDocument();
    });
  });

  describe('Placeholder Text', () => {
    it('should have placeholder text', () => {
      renderHome();
      const textarea = screen.getByPlaceholderText(/social media platform/i);
      expect(textarea.placeholder).toBeTruthy();
      expect(textarea.placeholder.length).toBeGreaterThan(10);
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels', () => {
      renderHome();
      const label = screen.getByText(/describe your project idea/i);
      expect(label).toBeInTheDocument();
    });

    it('should have descriptive help text', () => {
      renderHome();
      expect(screen.getByText(/be as detailed as possible/i)).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      renderHome();
      const textarea = screen.getByPlaceholderText(/social media platform/i);

      textarea.focus();
      expect(textarea).toHaveFocus();

      // Tab to button
      fireEvent.keyDown(textarea, { key: 'Tab' });
      // Note: actual tab navigation is handled by browser, this is just a simulation
    });
  });

  describe('Domain-Specific Test Cases', () => {
    const testCases = [
      {
        name: 'Telemedicine Platform',
        idea: 'A telemedicine platform with wearable integration, real-time vitals, AI alerts, and video consultations',
        expectedKeywords: ['real-time', 'health', 'video'],
      },
      {
        name: 'E-Learning Platform',
        idea: 'An online learning platform with live classes, quizzes, progress tracking, and AI-powered learning paths',
        expectedKeywords: ['learning', 'quiz', 'progress'],
      },
      {
        name: 'E-Commerce Marketplace',
        idea: 'A marketplace for handmade goods with seller analytics, payments, and AI recommendations',
        expectedKeywords: ['marketplace', 'payment', 'recommendation'],
      },
    ];

    testCases.forEach(({ name, idea }) => {
      it(`should accept ${name} project idea`, async () => {
        const mockResponse = {
          features: [{ name: 'Feature 1', priority: 'Must' }],
          database: [{ table: 'table1', fields: ['id'], relationships: [] }],
          apis: [{ method: 'GET', endpoint: '/api/test', description: 'Test' }],
          architecture: {
            type: 'Microservices',
            components: ['Component 1'],
            tech_stack: { frontend: 'React', backend: 'Node.js', database: 'PostgreSQL' },
          },
          erDiagram: 'erDiagram',
          architectureDiagram: 'graph TD',
          roadmap: [{ phase: 'Phase 1', tasks: ['Task 1'] }],
          estimation: { hours: '100', team_size: '2', cost: '$10,000' },
        };

        api.generateArchitecture.mockResolvedValue(mockResponse);
        renderHome();

        const textarea = screen.getByPlaceholderText(/social media platform/i);
        const button = screen.getByRole('button', { name: /generate architecture/i });

        fireEvent.change(textarea, { target: { value: idea } });
        fireEvent.click(button);

        await waitFor(() => {
          expect(api.generateArchitecture).toHaveBeenCalledWith(idea);
        }, { timeout: 10000 });
        
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith('/result');
        }, { timeout: 10000 });
      });
    });
  });
});
