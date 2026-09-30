import {test, expect} from '@playwright/test';

test('real judge flow: Firebase + Gemini + HOLD/PASS/BLOCK + approval + reload restore', async ({page}) => {
  test.setTimeout(120_000);
  page.on('dialog', dialog => dialog.accept());

  await page.goto('/', {waitUntil:'domcontentloaded'});

  const persistence = page.locator('#persistenceStatus');
  await expect(persistence).toContainText(/Firebase server read verified|Restored directly from Firebase/, {timeout:30_000});

  const syntheticSignal = 'Synthetic competition QA: Supplier B delivery is 48 hours late. 2 routes affected. Thursday capacity is not confirmed.';
  await page.locator('#disruptionInput').fill(syntheticSignal);
  await page.locator('#analyzeBtn').click();

  await expect(page.locator('#geminiResult')).toContainText('LIVE GEMINI VERIFIED', {timeout:45_000});
  await expect(page.locator('#decisionBanner')).toContainText('HOLD');

  await page.locator('#capacityInput').fill('120');
  await page.locator('#answerBtn').click();
  await expect(page.locator('#decisionBanner')).toContainText('DECISION READY', {timeout:20_000});

  await page.locator('[data-proof="balanced"]').click();
  await expect(page.locator('#proof')).toContainText('PASS', {timeout:20_000});

  await page.locator('[data-proof="unverified-aggressive"]').click();
  await expect(page.locator('#proof')).toContainText('BLOCK', {timeout:20_000});

  await page.locator('[data-proof="balanced"]').click();
  await expect(page.locator('#proof')).toContainText('PASS', {timeout:20_000});

  await page.locator('#approveBtn').click();
  await expect(persistence).toContainText('FIREBASE SAVE VERIFIED', {timeout:20_000});
  await expect(page.locator('#actions')).toContainText('APPROVED_SANDBOX');

  await page.reload({waitUntil:'domcontentloaded'});
  await expect(persistence).toContainText('Restored directly from Firebase', {timeout:30_000});
  await expect(page.locator('#actions')).toContainText('APPROVED_SANDBOX');
});
