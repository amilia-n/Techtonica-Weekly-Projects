import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Question } from './QuizPage';

describe('Question Component', () => {
  const mockProps = {
    question: 'What is the capital of Japan?',
    options: ['Tokyo', 'Kyoto', 'Osaka', 'Nagoya'],
    correctAnswer: 'Tokyo',
    onAnswer: jest.fn()
  };

  it('renders question and options correctly', () => {
    render(<Question {...mockProps} />);
    
    // Check if question is rendered
    expect(screen.getByText(mockProps.question)).toBeInTheDocument();
    
    // Check if all options are rendered with correct labels
    mockProps.options.forEach((option, index) => {
      const label = String.fromCharCode(65 + index) + ')';
      expect(screen.getByText(option)).toBeInTheDocument();
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('handles option selection correctly', async () => {
    render(<Question {...mockProps} />);
    
    // Click correct answer
    fireEvent.click(screen.getByText('Tokyo'));
    
    // Check if correct feedback is shown
    await waitFor(() => {
      expect(screen.getByText('✓')).toBeInTheDocument();
    });
    
    // Verify callback was called with true
    await waitFor(() => {
      expect(mockProps.onAnswer).toHaveBeenCalledWith(true);
    });
  });

  it('handles incorrect answer selection', async () => {
    render(<Question {...mockProps} />);
    
    // Click incorrect answer
    fireEvent.click(screen.getByText('Kyoto'));
    
    // Check if incorrect feedback is shown
    await waitFor(() => {
      expect(screen.getByText('✗')).toBeInTheDocument();
    });
    
    // Verify callback was called with false
    await waitFor(() => {
      expect(mockProps.onAnswer).toHaveBeenCalledWith(false);
    });
  });

  it('disables options after selection', async () => {
    render(<Question {...mockProps} />);
    
    // Click an option
    fireEvent.click(screen.getByText('Tokyo'));
    
    // Check if all options are disabled
    mockProps.options.forEach(option => {
      expect(screen.getByText(option).closest('button')).toBeDisabled();
    });
  });

  it('handles HTML entities in question text', () => {
    const propsWithEntities = {
      ...mockProps,
      question: 'What &amp; Why?'
    };
    
    render(<Question {...propsWithEntities} />);
    expect(screen.getByText('What & Why?')).toBeInTheDocument();
  });
}); 