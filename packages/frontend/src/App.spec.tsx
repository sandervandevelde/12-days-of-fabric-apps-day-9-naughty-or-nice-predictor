//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';

import App from '@/App';
import { drawQuestions, predict, questions } from './holiday-game';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('App', () => {
  it('loads one token, spins the three reels, and presents fresh questions and a token', () => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    vi.spyOn(Math, 'random').mockReturnValue(0.52);
    const { container } = render(<App />);
    const lever = screen.getByRole('button', { name: 'Pull lever' });
    const nice = screen.getByRole('button', { name: /^Nice/ });
    const initialPrompt = nice.textContent;
    expect(lever).toBeDisabled();
    fireEvent.click(nice);
    expect(screen.getByLabelText('Current odds: 45% Naughty, 55% Nice')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Insert token into slot' }));
    expect(lever).toHaveFocus();
    fireEvent.click(lever);
    expect(lever).toBeDisabled();
    expect(nice).toBeDisabled();
    expect(container.querySelectorAll('[data-rolling="true"]')).toHaveLength(3);

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText('You’re on the Nice List!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Insert a fresh token/ })).toHaveFocus();
    expect(nice.textContent).not.toBe(initialPrompt);
    expect(nice).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByLabelText('Current odds: 50% Naughty, 50% Nice')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Insert a fresh token/ }));
    fireEvent.click(lever);
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText('You’re on the Naughty List!')).toBeInTheDocument();
  });
});

describe('holiday game', () => {
  it('draws from two banks of 50 unique questions without repeating the previous pair', () => {
    expect(new Set(questions.naughty).size).toBe(50);
    expect(new Set(questions.nice).size).toBe(50);
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const first = drawQuestions();
    expect(first).toEqual({ naughty: 0, nice: 0 });
    expect(drawQuestions(first)).toEqual({ naughty: 1, nice: 1 });
  });

  it('moves the cutoff by exactly five percentage points in either direction', () => {
    expect(predict(null, 0.499)).toBe('nice');
    expect(predict(null, 0.5)).toBe('naughty');
    expect(predict('nice', 0.549)).toBe('nice');
    expect(predict('nice', 0.55)).toBe('naughty');
    expect(predict('naughty', 0.449)).toBe('nice');
    expect(predict('naughty', 0.45)).toBe('naughty');
  });
});
