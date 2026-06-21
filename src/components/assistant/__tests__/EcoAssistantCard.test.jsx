import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EcoAssistantCard from '../EcoAssistantCard';
import { useStore } from '../../../store/useStore';

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('EcoAssistantCard', () => {
  it('renders assistant summary for onboarded user', () => {
    useStore.setState({
      onboardingComplete: true,
      profile: { name: 'Test User', location: 'mumbai' },
      logs: [],
      goals: { dailyTarget: 10, monthlyTarget: 300 },
      streak: { current: 0, longest: 0 },
      quizResults: { dailyTotal: 12 },
      completedActions: {},
      challengeProgress: {},
    });

    renderWithRouter(<EcoAssistantCard />);
    expect(screen.getByText('Eco Assistant')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/Test User/)).toBeInTheDocument();
  });
});