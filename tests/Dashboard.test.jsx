import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../src/pages/Dashboard';

// Mock useNavigate from react-router-dom
const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
    useLocation: () => ({ pathname: '/dashboard' }),
  };
});

describe('Dashboard Component', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it('renders all sidebar links', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('SPY')).toBeInTheDocument();
    expect(screen.getByText('Ads Center')).toBeInTheDocument();
    expect(screen.getByText('Campaigns')).toBeInTheDocument();
    expect(screen.getByText('My Media')).toBeInTheDocument();
    expect(screen.getByText('Trends')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('navigates to correct route when link is clicked', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('SPY'));
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard/spy');
    });

    fireEvent.click(screen.getByText('Ads Center'));
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard/ads');
    });

    fireEvent.click(screen.getByText('Campaigns'));
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard/campaigns');
    });

    fireEvent.click(screen.getByText('My Media'));
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard/media');
    });

    fireEvent.click(screen.getByText('Trends'));
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard/trends');
    });

    fireEvent.click(screen.getByText('Settings'));
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard/settings');
    });
  });
});
