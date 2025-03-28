import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import Contact from '../Contact';

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, style }) => {
    const iconName = typeof icon === 'object' ? icon.iconName : icon;
    return (
      <span 
        data-testid="icon" 
        data-icon={iconName}
        style={style}
        className={`fa-${iconName}`}
      >
        Icon
      </span>
    );
  }
}));

window.debounce = (fn, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      fn(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Mock the fetch function
globalThis.fetch = vi.fn();

describe('Contact Component', () => {
  const mockContacts = [
    {
      contact_id: 1,
      contact_name: 'John Doe',
      phone: '123-456-7890',
      email: 'john@example.com',
      note: 'Test note',
      tags: 'Friend, Work'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockContacts)
    });
    vi.useRealTimers();
  });

  test('displays contact list initially', async () => {
    render(<Contact onAddContact={() => {}} />);

    expect(screen.getByText('Loading contacts...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('All Contacts')).toBeInTheDocument();

      expect(screen.getByText('John Doe')).toBeInTheDocument();

      expect(screen.getByText('📱 123-456-7890')).toBeInTheDocument();
      expect(screen.getByText('✉️ john@example.com')).toBeInTheDocument();

      expect(screen.getByText('Friend')).toHaveClass('tagFriend');
      expect(screen.getByText('Work')).toHaveClass('tagWork');
    });
  });

  test('displays search input and add button', async () => {
    render(<Contact onAddContact={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('All Contacts')).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('Search by name, phone, or tag')).toHaveClass('search-input');
    const addButton = screen.getByRole('button', { className: 'add' });
    expect(addButton).toBeInTheDocument();
  });

  test('handles search functionality', async () => {
    render(<Contact onAddContact={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('All Contacts')).toBeInTheDocument();
    });


    globalThis.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            contact_id: 1,
            contact_name: 'John Doe',
            phone: '123-456-7890',
            email: 'john@example.com',
            note: 'Test note',
            tags: 'Friend, Work'
          }
        ])
      })
    );

    const searchInput = screen.getByPlaceholderText('Search by name, phone, or tag');
    

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Friend' } });
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
    });

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/contacts?search=Friend'
      );
    });
  });

  test('displays contact details when clicking on a contact', async () => {
    render(<Contact onAddContact={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const contactElement = screen.getByText('John Doe');
    const container = contactElement.closest('.summary-container');
    expect(container).toBeInTheDocument();
    fireEvent.click(container);

    await waitFor(() => {
      expect(screen.getByText('John Doe', { selector: '.contact-name' })).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('Phone Number: 123-456-7890'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('Email: john@example.com'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('Notes: Test note'))).toBeInTheDocument();
      const tagElements = screen.getAllByText(/Friend|Work/);
      expect(tagElements.some(el => el.className.includes('tagFriend'))).toBe(true);
      expect(tagElements.some(el => el.className.includes('tagWork'))).toBe(true);
    });
  });

  test('handles edit mode', async () => {
    render(<Contact onAddContact={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('John Doe'));

    await waitFor(() => {
      const editButton = screen.getByTestId('edit-button');
      fireEvent.click(editButton);
    });


    await waitFor(() => {
      expect(screen.getByPlaceholderText('Contact Name')).toHaveValue('John Doe');
      expect(screen.getByPlaceholderText('Phone Number')).toHaveValue('123-456-7890');
      expect(screen.getByPlaceholderText('Email Address')).toHaveValue('john@example.com');
      expect(screen.getByPlaceholderText('Add Notes')).toHaveValue('Test note');
      
      const tagElements = screen.getAllByText(/Friend|Work/);
      expect(tagElements.some(el => el.className.includes('tagFriend'))).toBe(true);
      expect(tagElements.some(el => el.className.includes('tagWork'))).toBe(true);
    });
  });

  test('handles delete contact', async () => {
    const mockConfirm = vi.fn(() => true);
    window.confirm = mockConfirm;

    globalThis.fetch.mockImplementation((url, options) => {
      if (url.includes('/contacts/1') && options?.method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Contact deleted' })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockContacts)
      });
    });

    render(<Contact onAddContact={() => {}} />);


    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const contactElement = screen.getByText('John Doe');
    const container = contactElement.closest('.summary-container');
    fireEvent.click(container);

    await waitFor(() => {
      const deleteButton = screen.getByRole('button', { name: /delete contact/i });
      fireEvent.click(deleteButton);
    });

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this contact?');

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/contacts/1',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });

  test('displays error message when fetch fails', async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<Contact onAddContact={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
    });
  });
}); 