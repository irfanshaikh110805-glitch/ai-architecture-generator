import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DatabaseSection from '../../components/DatabaseSection';

describe('DatabaseSection', () => {
  const mockDatabase = [
    {
      table: 'users',
      fields: ['id', 'email', 'password_hash'],
      relationships: ['FK -> sessions'],
    },
    {
      table: 'sessions',
      fields: ['id', 'user_id', 'token'],
      relationships: [],
    },
  ];

  it('should render all tables', () => {
    render(<DatabaseSection database={mockDatabase} />);
    expect(screen.getByText('users')).toBeInTheDocument();
    expect(screen.getByText('sessions')).toBeInTheDocument();
  });

  it('should display table fields', () => {
    render(<DatabaseSection database={mockDatabase} />);
    expect(screen.getByText(/email/)).toBeInTheDocument();
    expect(screen.getByText(/password_hash/)).toBeInTheDocument();
  });

  it('should show relationships', () => {
    render(<DatabaseSection database={mockDatabase} />);
    expect(screen.getByText(/FK -> sessions/)).toBeInTheDocument();
  });
});
