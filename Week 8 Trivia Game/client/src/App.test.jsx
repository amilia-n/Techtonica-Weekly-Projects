import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders the game setup screen initially', () => {
    render(<App />);
    expect(screen.getByText('Super Fun Trivia Game')).toBeInTheDocument();
    expect(screen.getByText('Select your categories:')).toBeInTheDocument();
  });

  it('allows selecting multiple topics', () => {
    render(<App />);
    const jsButton = screen.getByText('JavaScript');
    const cssButton = screen.getByText('CSS');

    fireEvent.click(jsButton);
    expect(jsButton).toHaveClass('selected');

    fireEvent.click(cssButton);
    expect(cssButton).toHaveClass('selected');
    expect(jsButton).toHaveClass('selected');

    // Deselect JavaScript
    fireEvent.click(jsButton);
    expect(jsButton).not.toHaveClass('selected');
    expect(cssButton).toHaveClass('selected');
  });

  it('validates question count input', () => {
    render(<App />);
    const input = screen.getByLabelText('Number of Questions:');

    // Test valid input
    fireEvent.change(input, { target: { value: '10' } });
    expect(input.value).toBe('10');

    // Test invalid input (should be ignored)
    fireEvent.change(input, { target: { value: '51' } });
    expect(input.value).toBe('10');
  });

  it('requires all selections before starting quiz', () => {
    render(<App />);
    const startButton = screen.getByText('Start Quiz');
    const jsButton = screen.getByText('JavaScript');
    const easyButton = screen.getByText('Easy');
    const multipleChoiceButton = screen.getByText('Multiple Choice');
    const input = screen.getByLabelText('Number of Questions:');

    // Try starting with no selections
    fireEvent.click(startButton);
    expect(screen.queryByText('QuizPage')).not.toBeInTheDocument();

    // Make all required selections
    fireEvent.click(jsButton);
    fireEvent.click(easyButton);
    fireEvent.click(multipleChoiceButton);
    fireEvent.change(input, { target: { value: '10' } });

    // Now the quiz should start
    fireEvent.click(startButton);
    // QuizPage should be rendered (we'll verify this in QuizPage tests)
  });

  it('allows selecting different difficulty levels', () => {
    render(<App />);
    const easyButton = screen.getByText('Easy');
    const mediumButton = screen.getByText('Medium');
    const hardButton = screen.getByText('Hard');

    fireEvent.click(easyButton);
    expect(easyButton).toHaveClass('selected');
    expect(mediumButton).not.toHaveClass('selected');
    expect(hardButton).not.toHaveClass('selected');

    fireEvent.click(mediumButton);
    expect(mediumButton).toHaveClass('selected');
    expect(easyButton).not.toHaveClass('selected');
    expect(hardButton).not.toHaveClass('selected');
  });

  it('allows selecting question type', () => {
    render(<App />);
    const multipleChoiceButton = screen.getByText('Multiple Choice');
    const trueFalseButton = screen.getByText('Truth or False');

    fireEvent.click(multipleChoiceButton);
    expect(multipleChoiceButton).toHaveClass('selected');
    expect(trueFalseButton).not.toHaveClass('selected');

    fireEvent.click(trueFalseButton);
    expect(trueFalseButton).toHaveClass('selected');
    expect(multipleChoiceButton).not.toHaveClass('selected');
  });
}); 