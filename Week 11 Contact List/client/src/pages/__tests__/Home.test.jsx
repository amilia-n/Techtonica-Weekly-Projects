import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Home from '../Home';

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="icon">Icon</span>
}));

vi.mock('../../components/Contact', () => ({
  default: ({ onAddContact }) => (
    <div>
      <button className="add" data-testid="add-button" onClick={onAddContact}>
        Add Contact
      </button>
    </div>
  )
}));

vi.mock('../components/AddContact', () => ({
  default: ({ onCancel, isEditing }) => (
    <div className="overlay" data-testid="add-contact-form">
      <div>{isEditing ? 'Edit Contact' : 'Add New Contact'}</div>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}));

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders home page with contact list', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByTestId('add-button')).toBeInTheDocument();
    });
  });

  test('shows add contact form when add button is clicked', async () => {
    render(<Home />);
    
    await waitFor(() => {
      const addButton = screen.getByTestId('add-button');
      fireEvent.click(addButton);
    });

    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
  });

  test('hides add contact form when cancel is clicked', async () => {
    render(<Home />);
    
    await waitFor(() => {
      const addButton = screen.getByTestId('add-button');
      fireEvent.click(addButton);
    });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByPlaceholderText('First Name')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Last Name')).not.toBeInTheDocument();
  });
}); 