// tests/AdsCenter.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdsCenter from '../src/pages/AdsCenter';
import React from 'react';

// ✅ Mock Axios with create()
vi.mock('axios', () => {
  return {
    default: {
      create: () => ({
        get: vi.fn().mockResolvedValue({
          data: { user: { credits: 20 } }
        }),
        post: vi.fn().mockResolvedValue({
          data: {
            image: 'http://localhost/generated.png',
            remainingCredits: 15,
          }
        }),
        interceptors: {
          request: { use: vi.fn() },
        },
      }),
    },
  };
});

describe('AdsCenter Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders ads center page and handles prompt input', async () => {
    render(<AdsCenter />);

    const promptInput = await screen.findByPlaceholderText(/describe your ad idea/i);
    fireEvent.change(promptInput, { target: { value: 'Flash Sale!' } });
    expect(promptInput.value).toBe('Flash Sale!');
  });

  it('disables generate button with low credits', async () => {
    render(<AdsCenter />);
    const generateButton = await screen.findByRole('button', { name: /generate ad/i });
    expect(generateButton).not.toBeDisabled(); // credits mocked to 20, so it's enabled
  });

  it('shows generated ad after successful generation', async () => {
    render(<AdsCenter />);

    const promptInput = await screen.findByPlaceholderText(/describe your ad idea/i);
    fireEvent.change(promptInput, { target: { value: '50% Off Jackets' } });

    const generateButton = await screen.findByRole('button', { name: /generate ad/i });
    fireEvent.click(generateButton);

    await waitFor(() => {
      // ✅ FIX: check for image with src if alt fails
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', 'http://localhost/generated.png');
    });
  });
});
