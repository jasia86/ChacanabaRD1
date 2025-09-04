import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the header', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', {
        name: /Sastrería Premium - Gestión de Chacabanas/i,
      })
    ).toBeTruthy();
  });
});
