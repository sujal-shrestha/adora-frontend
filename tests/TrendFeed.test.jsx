import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import TrendFeed from '../src/pages/TrendFeed';
import { BrowserRouter } from 'react-router-dom';

// ✅ Mock global fetch using `api.post`
vi.mock('../src/api', () => ({
  default: {
    post: vi.fn(() =>
      Promise.resolve({
        data: {
          trends: [
            {
              title: 'Top 10 Fitness Hacks',
              description: 'Simple fitness strategies trending in 2025.',
              url: 'https://example.com/fitness-hacks',
              source: 'TrendRadar',
            },
          ],
        },
      })
    ),
  },
}));

describe('TrendFeed Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input and search button', () => {
    render(
      <BrowserRouter>
        <TrendFeed />
      </BrowserRouter>
    );

    expect(
      screen.getByPlaceholderText(/search a niche/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('fetches and displays trends on search', async () => {
    render(
      <BrowserRouter>
        <TrendFeed />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/search a niche/i), {
      target: { value: 'fitness' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() =>
      expect(screen.getByText(/top 10 fitness hacks/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/simple fitness strategies/i)).toBeInTheDocument();
    expect(screen.getByText(/source: trendradar/i)).toBeInTheDocument();
  });

  it('does not call API when input is empty', async () => {
    const api = (await import('../src/api')).default;
    render(
      <BrowserRouter>
        <TrendFeed />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    await waitFor(() => expect(api.post).not.toHaveBeenCalled());
  });
});