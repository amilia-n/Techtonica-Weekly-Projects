import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuizPage from './QuizPage';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

describe('QuizPage Integration Tests', () => {
  const mockProps = {
    selectedTopics: ['Japanese Anime'],
    questionCount: '3',
    difficulty: 'Medium',
    questionType: 'Truth or False',
    onReturnToStart: vi.fn()
  };

  const server = setupServer(
    // Mock OpenTDB API
    http.get('https://opentdb.com/api.php', () => {
      return HttpResponse.json({
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
      });
    }),

    // Mock session token
    http.get('https://opentdb.com/api_token.php', () => {
      return HttpResponse.json({
        response_code: 0,
        token: "mock_token"
      });
    })
  );

  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('fetches and displays questions from OpenTDB', async () => {
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
    server.use(
      http.get('https://opentdb.com/api.php', () => {
        return HttpResponse.json({
          response_code: 1,
          results: []
        });
      })
    );

    render(<QuizPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText(/No results found/)).toBeInTheDocument();
    });
  });

  it('handles rate limiting correctly', async () => {
    server.use(
      http.get('https://opentdb.com/api.php', () => {
        return new HttpResponse(null, { status: 429 });
      })
    );

    render(<QuizPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText(/Rate limit exceeded/)).toBeInTheDocument();
    });
  });

  it('progresses through questions correctly', async () => {
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

  it('handles local API questions correctly', async () => {
    const localProps = {
      ...mockProps,
      selectedTopics: ['Testing']
    };

    server.use(
      http.get('/api/questions', () => {
        return HttpResponse.json([
          {
            question: "What is unit testing?",
            options: ["Testing individual components", "Testing the whole app", "No testing", "Integration testing"],
            answer: "Testing individual components"
          }
        ]);
      })
    );

    render(<QuizPage {...localProps} />);

    await waitFor(() => {
      expect(screen.getByText(/What is unit testing?/)).toBeInTheDocument();
    });

    expect(screen.getByText('Testing individual components')).toBeInTheDocument();
  });
}); 