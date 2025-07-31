import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from '../src/pages/Settings';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock navigate
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Mock api
vi.mock('../src/api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: { name: 'Jane Doe', email: 'jane@example.com' } })),
    put: vi.fn(() => Promise.resolve({})),
    delete: vi.fn(() => Promise.resolve({})),
  },
}));

import api from '../src/api';

describe('Settings Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders profile info and allows tab switching', async () => {
    render(
      <BrowserRouter>
        <Settings />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Security/i }));
    expect(screen.getByText(/Change Password/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Danger Zone/i }));
    expect(screen.getByText(/Deleting your account is permanent/i)).toBeInTheDocument();
  });

  it('updates profile successfully', async () => {
    render(
      <BrowserRouter>
        <Settings />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByDisplayValue('Jane Doe'));

    fireEvent.change(screen.getByDisplayValue('Jane Doe'), {
      target: { value: 'Updated Name' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(screen.getByText(/Profile updated ✅/i)).toBeInTheDocument();
    });

    expect(api.put).toHaveBeenCalledWith('/users/me', {
      name: 'Updated Name',
      email: 'jane@example.com',
    });
  });


  it('deletes account and navigates to login', async () => {
    render(
      <BrowserRouter>
        <Settings />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Danger Zone/i }));
    fireEvent.click(screen.getByRole('button', { name: /Delete My Account/i }));

    await waitFor(() =>
      expect(screen.getByText(/This action cannot be undone/i)).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole('button', { name: /Yes, Delete/i }));

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/users/me');
      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('logs out and navigates to login', async () => {
    render(
      <BrowserRouter>
        <Settings />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Log Out/i }));

    await waitFor(() =>
      expect(screen.getByText(/Are you sure you want to log out/i)).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole('button', { name: /Yes, Log Out/i }));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
