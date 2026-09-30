import {test, expect} from '@playwright/test';

test('capture production judge evidence', async ({page}, testInfo) => {
  test.skip(process.env.EVIDENCE_CAPTURE !== '1', 'Evidence capture runs only against official Firebase production');
  test.setTimeout(120_000);

  await page.goto('/', {waitUntil:'networkidle'});
  await expect(page.locator('#commandCenter')).toBeVisible();
  await expect(page.locator('.incident-scope')).toHaveText('Controlled simulation');

  const persistence = page.locator('#persistenceStatus');
  await expect(persistence).toContainText(/Firebase server read verified|Restored directly from Firebase/, {timeout:30_000});

  await page.screenshot({
    path: testInfo.outputPath(`varelyx-${testInfo.project.name}-opening.png`),
    fullPage: true
  });

  await page.locator('#disruptionInput').fill(
    'Synthetic competition QA: Supplier B delivery is 48 hours late. 2 routes affected. Thursday capacity is not confirmed.'
  );
  await page.locator('#analyzeBtn').click();
  await expect(page.locator('#geminiResult')).toContainText('LIVE GEMINI VERIFIED', {timeout:45_000});
  await expect(page.locator('#decisionBanner')).toContainText('HOLD');

  await page.locator('#capacityInput').fill('120');
  await page.locator('#answerBtn').click();
  await expect(page.locator('#decisionBanner')).toContainText('DECISION READY', {timeout:20_000});

  await page.locator('[data-proof="balanced"]').click();
  await expect(page.locator('#proof')).toContainText('PASS', {timeout:20_000});

  await page.screenshot({
    path: testInfo.outputPath(`varelyx-${testInfo.project.name}-pass.png`),
    fullPage: true
  });
});
