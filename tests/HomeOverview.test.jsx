import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import HomeOverview from '../src/pages/HomeOverview';
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

describe('HomeOverview Component', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
    localStorage.clear();
    localStorage.setItem('adora_user', JSON.stringify({ name: 'Sujal Shrestha' }));
  });

  it('renders greeting with user name', () => {
    render(
      <BrowserRouter>
        <HomeOverview />
      </BrowserRouter>
    );

    const nameMatch = screen.getByText(/Good (morning|afternoon|evening), Sujal/i);
    expect(nameMatch).toBeInTheDocument();
  });

  it('renders all 6 dashboard tiles', () => {
    render(
      <BrowserRouter>
        <HomeOverview />
      </BrowserRouter>
    );

    const tiles = ['SPY', 'Ads Center', 'Campaigns', 'My Media', 'Trends', 'Settings'];
    tiles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('navigates when tile is clicked', () => {
    render(
      <BrowserRouter>
        <HomeOverview />
      </BrowserRouter>
    );

    const adsTile = screen.getByText('Ads Center');
    fireEvent.click(adsTile);

    expect(mockedNavigate).toHaveBeenCalledWith('/dashboard/ads');
  });
});
