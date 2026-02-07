import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter', () => {
  it('should render the counter with correct format', () => {
    render(<Counter guessedCount={0} totalCount={195} />);
    
    expect(screen.getByText('0/195')).toBeInTheDocument();
  });

  it('should display correct progress', () => {
    render(<Counter guessedCount={42} totalCount={195} />);
    
    expect(screen.getByText('42/195')).toBeInTheDocument();
  });

  it('should update when guessedCount changes', () => {
    const { rerender } = render(<Counter guessedCount={0} totalCount={195} />);
    expect(screen.getByText('0/195')).toBeInTheDocument();
    
    rerender(<Counter guessedCount={1} totalCount={195} />);
    expect(screen.getByText('1/195')).toBeInTheDocument();
    
    rerender(<Counter guessedCount={100} totalCount={195} />);
    expect(screen.getByText('100/195')).toBeInTheDocument();
  });

  it('should display completion state correctly', () => {
    render(<Counter guessedCount={195} totalCount={195} />);
    
    expect(screen.getByText('195/195')).toBeInTheDocument();
  });

  it('should handle zero total count', () => {
    render(<Counter guessedCount={0} totalCount={0} />);
    
    expect(screen.getByText('0/0')).toBeInTheDocument();
  });

  it('should have correct styling applied', () => {
    const { container } = render(<Counter guessedCount={10} totalCount={195} />);
    const counterDiv = container.firstChild as HTMLElement;
    
    expect(counterDiv).toHaveStyle({
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#ffffff',
    });
  });

  it('should render as a div element', () => {
    const { container } = render(<Counter guessedCount={5} totalCount={195} />);
    
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('should handle large numbers correctly', () => {
    render(<Counter guessedCount={999} totalCount={9999} />);
    
    expect(screen.getByText('999/9999')).toBeInTheDocument();
  });
});
