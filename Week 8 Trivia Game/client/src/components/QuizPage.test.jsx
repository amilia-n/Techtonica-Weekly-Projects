import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuizPage from './QuizPage';

describe('QuizPage Integration Tests', () => {
  const mockProps = {
    selectedTopics: ['Japanese Anime'],
    questionCount: '3',
    difficulty: 'Medium',
    questionType: 'Truth or False',
    onReturnToStart: vi.fn()
  };

  const mockAnimeQuestions = {
    response_code: 0,
    results: [
      {
        category: "Entertainment: Japanese Anime & Manga",
        type: "boolean",
        difficulty: "medium",
        question: "In 'JoJo&#039;s Bizarre Adventure', the Stand 'Made in Heaven' is able to accelerate time.",
        correct_answer: "True",
        incorrect_answers: ["False"]
      },
      {
        category: "Entertainment: Japanese Anime & Manga",
        type: "boolean",
        difficulty: "medium",
        question: "The anime 'Lucky Star' follows the story of one girl who is unaware she is God.",
        correct_answer: "False",
        incorrect_answers: ["True"]
      }
    ]
  };

  beforeEach(() => {
    // Reset fetch mock
    vi.resetAllMocks();
    
    // Mock successful token fetch
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ response_code: 0, token: "mock_token" })
      })
    );
  });

  it('fetches and displays questions from OpenTDB', async () => {
    // Mock questions fetch
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAnimeQuestions)
      })
    );

    render(<QuizPage {...mockProps} />);

    // Check loading state
    expect(screen.getByText('Loading questions...')).toBeInTheDocument();

    // Wait for questions to load
    await waitFor(() => {
      expect(screen.getByText(/In 'JoJo's Bizarre Adventure'/)).toBeInTheDocument();
    });

    // Check if options are displayed
    expect(screen.getByText('True')).toBeInTheDocument();
    expect(screen.getByText('False')).toBeInTheDocument();
  });

  it('handles OpenTDB API errors gracefully', async () => {
    // Mock API error
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ response_code: 1, results: [] })
      })
    );

    render(<QuizPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText(/No results found/)).toBeInTheDocument();
    });
  });

  it('handles rate limiting correctly', async () => {
    // Mock rate limit response
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 429
      })
    );

    render(<QuizPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText(/Rate limit exceeded/)).toBeInTheDocument();
    });
  });

  it('progresses through questions correctly', async () => {
    // Mock questions fetch
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAnimeQuestions)
      })
    );

    render(<QuizPage {...mockProps} />);

    // Wait for first question
    await waitFor(() => {
      expect(screen.getByText(/In 'JoJo's Bizarre Adventure'/)).toBeInTheDocument();
    });

    // Answer first question
    fireEvent.click(screen.getByText('True'));

    // Wait for second question
    await waitFor(() => {
      expect(screen.getByText(/Lucky Star/)).toBeInTheDocument();
    });

    // Check score update
    expect(screen.getByText('Score: 1')).toBeInTheDocument();
  });

  it('shows game end screen with correct score', async () => {
    // Mock questions fetch
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAnimeQuestions)
      })
    );

    render(<QuizPage {...mockProps} />);

    // Wait for questions to load
    await waitFor(() => {
      expect(screen.getByText(/In 'JoJo's Bizarre Adventure'/)).toBeInTheDocument();
    });

    // Answer questions
    fireEvent.click(screen.getByText('True'));
    await waitFor(() => {
      expect(screen.getByText(/Lucky Star/)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('False'));

    // Check end screen
    await waitFor(() => {
      expect(screen.getByText(/You Win!/)).toBeInTheDocument();
      expect(screen.getByText(/Score: 100/)).toBeInTheDocument();
    });
  });
});

describe('QuizPage Local API Tests', () => {
  const mockProps = {
    selectedTopics: ['JavaScript'],
    questionCount: '10',
    difficulty: 'Easy',
    questionType: 'Multiple Choice',
    onReturnToStart: vi.fn()
  };

  const mockLocalQuestions = [
    {
      question: "What is unit testing?",
      options: ["Testing individual components", "Testing the whole app", "No testing", "Integration testing"],
      answer: "Testing individual components"
    }
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock local API response
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockLocalQuestions)
      })
    );
  });

  it('fetches and displays local API questions', async () => {
    render(<QuizPage {...mockProps} />);
    
    // Should show loading initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for question to load
    await waitFor(() => {
      expect(screen.getByText('What is unit testing?')).toBeInTheDocument();
    });

    // Check if options are displayed
    expect(screen.getByText('Testing individual components')).toBeInTheDocument();
    expect(screen.getByText('Testing the whole app')).toBeInTheDocument();
    expect(screen.getByText('No testing')).toBeInTheDocument();
    expect(screen.getByText('Integration testing')).toBeInTheDocument();
  });

  it('handles local API errors gracefully', async () => {
    // Mock API error
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500
      })
    );

    render(<QuizPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('tracks score correctly for local questions', async () => {
    render(<QuizPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('What is unit testing?')).toBeInTheDocument();
    });

    // Answer correctly
    fireEvent.click(screen.getByText('Testing individual components'));

    await waitFor(() => {
      expect(screen.getByText(/score: 1/i)).toBeInTheDocument();
    });
  });

  it('allows returning to start screen', async () => {
    render(<QuizPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('What is unit testing?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/return to start/i));
    expect(mockProps.onReturnToStart).toHaveBeenCalled();
  });
}); 