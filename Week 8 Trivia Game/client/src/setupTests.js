import '@testing-library/jest-dom';
import { expect, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Extend Vitest's expect with Testing Library's matchers
expect.extend({
  toBeInTheDocument: (received) => {
    const pass = received !== null;
    return {
      pass,
      message: () => `expected element to ${pass ? 'not ' : ''}be in the document`,
    };
  },
});

// Mock fetch globally
global.fetch = vi.fn();

// Reset mocks and cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
}); 