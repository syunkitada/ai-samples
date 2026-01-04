import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EmptyState } from '../../../src/components/EmptyState';

describe('EmptyState', () => {
  it('displays "No tasks available" message', () => {
    render(<EmptyState />);
    expect(screen.getByText('No tasks available')).toBeInTheDocument();
  });

  it('renders as a div with appropriate class', () => {
    const { container } = render(<EmptyState />);
    const emptyStateDiv = container.querySelector('.empty-state');
    expect(emptyStateDiv).toBeInTheDocument();
  });
});
