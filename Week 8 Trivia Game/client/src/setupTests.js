import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import fetch, { Response, Request, Headers } from 'node-fetch';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.fetch = fetch;
global.Response = Response;
global.Request = Request;
global.Headers = Headers;

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { cleanup } from '@testing-library/react';

// Mock server setup
export const handlers = [
  // Mock OpenTDB API calls
  rest.get('https://opentdb.com/api.php', (req, res, ctx) => {
    return res(
      ctx.json({
        response_code: 0,
        results: [
          {
            category: "Entertainment: Japanese Anime & Manga",
            type: "boolean",
            difficulty: "easy",
            question: "In the anime 'Death Note', the character L's real name is Lawliet.",
            correct_answer: "True",
            incorrect_answers: ["False"]
          }
        ]
      })
    );
  }),

  // Mock session token request
  rest.get('https://opentdb.com/api_token.php', (req, res, ctx) => {
    return res(
      ctx.json({
        response_code: 0,
        token: "mock_session_token"
      })
    );
  }),

  // Mock local API calls
  rest.get('/api/questions', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          question: "What is unit testing?",
          options: ["Testing individual components", "Testing the whole app", "No testing", "Integration testing"],
          answer: "Testing individual components"
        }
      ])
    );
  })
];

const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
  cleanup();
});

// Clean up after all tests are done
afterAll(() => server.close()); 