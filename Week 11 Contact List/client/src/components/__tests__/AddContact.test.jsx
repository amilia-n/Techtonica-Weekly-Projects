import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import AddContact from '../AddContact';

globalThis.fetch = vi.fn();

describe('AddContact Component', () => {
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders add contact form', () => {
    render(<AddContact onCancel={mockOnCancel} />);

    expect(screen.getByText('Add New Contact')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Notes')).toBeInTheDocument();
  });

  test('displays required field indicators', () => {
    render(<AddContact onCancel={mockOnCancel} />);

    const requiredFields = ['First Name', 'Last Name', 'Phone Number'];
    requiredFields.forEach(field => {
      const input = screen.getByPlaceholderText(field);
      expect(input.parentElement).toHaveClass('required-field');
    });

    const emailInput = screen.getByPlaceholderText('Email');
    expect(emailInput.parentElement).not.toHaveClass('required-field');
  });

  test('handles form input changes', () => {
    render(<AddContact onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
      target: { value: '123-456-7890' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter Notes'), {
      target: { value: 'Test note' }
    });

    expect(screen.getByPlaceholderText('First Name')).toHaveValue('John');
    expect(screen.getByPlaceholderText('Last Name')).toHaveValue('Doe');
    expect(screen.getByPlaceholderText('Phone Number')).toHaveValue('123-456-7890');
    expect(screen.getByPlaceholderText('Email')).toHaveValue('john@example.com');
    expect(screen.getByPlaceholderText('Enter Notes')).toHaveValue('Test note');
  });

  test('handles tag selection', () => {
    render(<AddContact onCancel={mockOnCancel} />);

    const friendTag = screen.getByText('Friend');
    fireEvent.click(friendTag);

    expect(friendTag).toHaveClass('tagFriend selected');

    fireEvent.click(friendTag);
    expect(friendTag).not.toHaveClass('selected');
  });

  test('validates required fields on submit', async () => {
    render(<AddContact onCancel={mockOnCancel} />);

    const submitButton = screen.getByText('Done');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('First Name is required')).toBeInTheDocument();
    });
  });

  test('successfully submits form with valid data', async () => {

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Contact added successfully' })
    });

    render(<AddContact onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
      target: { value: '123-456-7890' }
    });

    const submitButton = screen.getByText('Done');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/contacts',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
    });
  });

  test('handles cancel button click', () => {
    render(<AddContact onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('displays error message on API failure', async () => {

    globalThis.fetch.mockRejectedValueOnce(new Error('Failed to add contact'));

    render(<AddContact onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
      target: { value: '123-456-7890' }
    });

    const submitButton = screen.getByText('Done');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to add contact')).toBeInTheDocument();
    });
  });
}); 