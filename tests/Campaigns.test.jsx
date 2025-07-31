// tests/Campaigns.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Campaigns from '../src/pages/Campaigns';
import { BrowserRouter } from 'react-router-dom';
import api from '../src/api';

vi.mock('../src/api');

describe('Campaigns Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const sampleCampaigns = [
    {
      _id: '1',
      name: 'Launch Promo',
      description: 'Big offer on launch day',
      date: new Date().toISOString(),
    },
  ];

  it('renders form inputs and campaign list', async () => {
    api.get.mockResolvedValue({ data: sampleCampaigns });

    render(
      <BrowserRouter>
        <Campaigns />
      </BrowserRouter>
    );

    expect(await screen.findByText('📅 Campaigns')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Campaign Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create campaign/i })).toBeInTheDocument();
  });

  it('creates a new campaign successfully', async () => {
    api.get.mockResolvedValue({ data: [] });
    api.post.mockResolvedValue({});

    render(
      <BrowserRouter>
        <Campaigns />
      </BrowserRouter>
    );

    const nameInput = screen.getByPlaceholderText('Campaign Name');
    const descInput = screen.getByPlaceholderText('Description');
    const createButton = screen.getByRole('button', { name: /create campaign/i });

    fireEvent.change(nameInput, { target: { value: 'New Campaign' } });
    fireEvent.change(descInput, { target: { value: 'Test description' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/campaigns', expect.objectContaining({ name: 'New Campaign' }));
    });
  });

  it('switches between list and calendar views', async () => {
    api.get.mockResolvedValue({ data: sampleCampaigns });

    render(
      <BrowserRouter>
        <Campaigns />
      </BrowserRouter>
    );

    expect(await screen.findByText('Launch Promo')).toBeInTheDocument();

    const calendarBtn = screen.getByRole('button', { name: /calendar/i });
    fireEvent.click(calendarBtn);

    expect(await screen.findByText(sampleCampaigns[0].name)).toBeInTheDocument();
  });
});
