import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeaturesSection from '../../components/FeaturesSection';

describe('FeaturesSection', () => {
  const mockFeatures = [
    { name: 'User Authentication', priority: 'Must' },
    { name: 'Dashboard', priority: 'Should' },
    { name: 'Analytics', priority: 'Could' },
  ];

  it('should render all features', () => {
    render(<FeaturesSection features={mockFeatures} />);
    expect(screen.getByText('User Authentication')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('should display priority badges', () => {
    render(<FeaturesSection features={mockFeatures} />);
    const mustBadges = screen.getAllByText('Must');
    const shouldBadges = screen.getAllByText('Should');
    const couldBadges = screen.getAllByText('Could');
    
    expect(mustBadges.length).toBeGreaterThan(0);
    expect(shouldBadges.length).toBeGreaterThan(0);
    expect(couldBadges.length).toBeGreaterThan(0);
  });

  it('should handle empty features array', () => {
    render(<FeaturesSection features={[]} />);
    expect(screen.queryByText('User Authentication')).not.toBeInTheDocument();
  });
});
