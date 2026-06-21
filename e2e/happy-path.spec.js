import { test, expect } from '@playwright/test';

const ONBOARDED_STATE = {
  state: {
    onboardingComplete: true,
    profile: { name: 'E2E User', location: 'mumbai', household: 2 },
    quizAnswers: {},
    quizResults: { dailyTotal: 10, monthlyTotal: 300, breakdown: { transport: 50 } },
    logs: [],
    history: [],
    completedActions: {},
    completedChallenges: {},
    challengeProgress: {},
    goals: { dailyTarget: 9, monthlyTarget: 270 },
    streak: { current: 0, longest: 0, lastLogDate: null },
    gamification: { xp: 0, totalXpEarned: 0, recentXpEvents: [] },
    earnedBadgeIds: [],
    theme: 'light',
  },
  version: 1,
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript((state) => {
    localStorage.setItem('ecotrack-storage', JSON.stringify(state));
  }, ONBOARDED_STATE);
});

test('dashboard shows eco assistant and navigation works', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Eco Assistant' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('E2E User');

  await page.getByLabel('Log', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Activity Log' })).toBeVisible();

  await page.getByLabel('Settings', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Retake Carbon Quiz/i })).toBeVisible();
});

test('user can log an activity', async ({ page }) => {
  await page.goto('/log');
  await page.locator('#log-activity').selectOption({ index: 1 });
  await page.locator('#log-quantity').fill('5');
  await page.getByRole('button', { name: 'Save Entry' }).click();

  await expect(page.getByText("Today's Logs")).toBeVisible();
});