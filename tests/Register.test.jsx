import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Register from '../src/pages/Register';
import { BrowserRouter } from 'react-router-dom';

// Mock useNavigate
const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

import axios from 'axios';

describe('Register Component', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
    axios.post.mockReset();
  });

  it('renders register form elements correctly', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('submits form successfully and navigates to login', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Registered' } });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { value: 'John Doe', name: 'name' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'john@example.com', name: 'email' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'secret123', name: 'password' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:10010/api/auth/register',
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'secret123',
        }
      );
      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('shows error message on failed register', async () => {
    axios.post.mockRejectedValue({
      response: { data: { message: 'Email already exists' } },
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { value: 'Jane Doe', name: 'name' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'jane@example.com', name: 'email' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password', name: 'password' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });
});
