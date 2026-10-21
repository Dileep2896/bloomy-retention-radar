import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
for (const route of ['/radar', '/story']) {
  test(`${route} fits desktop and phone widths with no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    const external: string[] = [];
    page.on('request', (r) => {
      if (!r.url().startsWith('http://127.0.0.1:4173') && !r.url().startsWith('data:'))
        external.push(r.url());
    });
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    for (const width of [1440, 768, 414, 390, 375, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${route} at ${width}px`,
      ).toBe(true);
      // Check content edges too: root overflow clipping must not mask broken cards.
      const clipped = await page
        .locator(
          'main h1, main h2, .group-card, .overview-panel, .plan-banner, .story-section, .formula-block',
        )
        .evaluateAll((nodes) =>
          nodes
            .filter((n) => {
              const r = n.getBoundingClientRect();
              return r.left < -0.5 || r.right > innerWidth + 0.5;
            })
            .map((n) => n.className),
        );
      expect(clipped).toEqual([]);
    }
    expect(errors).toEqual([]);
    expect(external).toEqual([]);
  });
}
test('Echo pass, failure, suggested plan, and reset work through the UI', async ({ page }) => {
  await page.goto('/radar');
  await page.getByRole('button', { name: 'View group' }).first().click();
  await page
    .getByTestId('student-row-student-1')
    .getByRole('button', { name: 'Run Echo check' })
    .click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button', { name: 'Submit Echo check' })).toBeDisabled();
  for (const group of await dialog.getByRole('group').all())
    await group.getByRole('radio').first().check();
  await dialog.getByRole('button', { name: 'Submit Echo check' }).click();
  await expect(dialog.getByText('3 / 3')).toBeVisible();
  await expect(dialog.locator('.before-after-score')).toContainText('100%');
  await expect(dialog.getByText(/Next review: Nov 9/)).toBeVisible();
  await dialog.getByRole('button', { name: 'Back to Radar' }).click();
  await expect(page.getByLabel('Class retention: 63%')).toBeVisible();
  await page
    .getByTestId('student-row-student-2')
    .getByRole('button', { name: 'Run Echo check' })
    .click();
  const qs = await dialog.getByRole('group').all();
  await qs[0].getByRole('radio').first().check();
  await qs[1].getByRole('radio').nth(1).check();
  await qs[2].getByRole('radio').nth(1).check();
  await dialog.getByRole('button', { name: 'Submit Echo check' }).click();
  await expect(dialog.getByText('1 / 3')).toBeVisible();
  await expect(dialog.getByText('Relearn → back to practice')).toBeVisible();
  await dialog.getByRole('button', { name: 'Back to Radar' }).click();
  await page.getByRole('button', { name: 'Run suggested checks' }).click();
  await expect(page.getByLabel('Class retention: 84%')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Back to practice' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo classroom' }).click();
  await expect(page.getByLabel('Class retention: 61%')).toBeVisible();
});
test('student navigation, filters, and mobile dialog are usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/radar');
  await page.getByRole('tab', { name: /All students/ }).click();
  await page.getByLabel('Find a student').fill('Destiny');
  await page.getByRole('link', { name: /Destiny G/ }).click();
  await expect(page.getByRole('heading', { name: 'Destiny G.' })).toBeVisible();
  await page.getByRole('button', { name: 'Run Echo check' }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(await page.getByRole('dialog').evaluate((n) => n.scrollWidth <= n.clientWidth)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('link', { name: 'Back to Radar' }).click();
  await page.getByLabel('Filter by domain').selectOption('VOCAB');
  await expect(page.getByTestId('group-card')).toHaveCount(1);
  await expect(page.getByTestId('group-card')).toContainText('Using context clues');
});
test('reduced motion renders story final states immediately', async ({ page }) => {
  await page.goto('/story');
  await expect(page.getByTestId('story-page')).toHaveAttribute('data-reduced-motion', 'true');
  await expect(page.getByLabel('Class retention: 84%')).toContainText('84%');
  await expect(page.locator('.story-section')).toHaveCount(7);
  const concealed = await page
    .locator('.story-section h1, .story-section h2, .company-numbers strong')
    .evaluateAll((nodes) =>
      nodes.some((n) => {
        for (let el: Element | null = n; el; el = el.parentElement) {
          if (getComputedStyle(el).opacity === '0') return true;
        }
        return false;
      }),
    );
  expect(concealed).toBe(false);
});
test('motion-enabled story reveals on scroll and reaches 84%', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/story');
  await page
    .getByRole('heading', { name: 'Small checks. Lasting learning.' })
    .scrollIntoViewIfNeeded();
  await expect(page.getByLabel('Class retention: 84%')).toContainText('84%', { timeout: 6000 });
  await expect(page.locator('.impact-section')).toBeVisible();
});
test('capture reviewable screenshots', async ({ page }) => {
  await mkdir('docs', { recursive: true });
  await page.goto('/radar');
  await expect(page.getByLabel('Class retention: 61%')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'docs/radar.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/radar');
  await expect(page.getByLabel('Class retention: 61%')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'docs/radar-mobile.png' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/story');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'docs/story.png' });
  await page.locator('.before-after-diagram').scrollIntoViewIfNeeded();
  await page.locator('.before-after-diagram').screenshot({ path: 'docs/story-before-after.png' });
});
