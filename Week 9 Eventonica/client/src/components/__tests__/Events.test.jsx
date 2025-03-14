import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Events from '../../pages/Events';

// Mock data for testing
const mockEvents = [
  {
    id: 1,
    name: "Tech Conference 2024",
    start_time: "2024-03-20T09:00:00Z",
    end_time: "2024-03-22T17:00:00Z",
    location: "San Francisco",
    description: "Annual tech conference",
    category: "conference"
  },
  {
    id: 2,
    name: "JavaScript Workshop",
    start_time: "2024-04-15T13:00:00Z",
    end_time: "2024-04-15T17:00:00Z",
    location: "Online",
    description: "Hands-on JavaScript workshop",
    category: "workshop"
  }
];

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockEvents)
  })
);

describe('Events Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('fetches and displays events', async () => {
    render(<Events />);
    
    // Wait for events to be loaded
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/events');
    });

    // Check if events are displayed
    expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument();
    expect(screen.getByText('JavaScript Workshop')).toBeInTheDocument();
  });

  it('filters events by search term', async () => {
    render(<Events />);
    
    await waitFor(() => {
      expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search events...');
    fireEvent.change(searchInput, { target: { value: 'JavaScript' } });

    expect(screen.queryByText('Tech Conference 2024')).not.toBeInTheDocument();
    expect(screen.getByText('JavaScript Workshop')).toBeInTheDocument();
  });

  it('filters events by category', async () => {
    render(<Events />);
    
    await waitFor(() => {
      expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument();
    });

    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'workshop' } });

    expect(screen.queryByText('Tech Conference 2024')).not.toBeInTheDocument();
    expect(screen.getByText('JavaScript Workshop')).toBeInTheDocument();
  });
}); 