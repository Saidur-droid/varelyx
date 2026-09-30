import {test, expect} from '@playwright/test';

async function enableCiAppCheck(page) {
  const token = process.env.FIREBASE_APPCHECK_DEBUG_TOKEN;
  if (token) await page.addInitScript(value => { self.FIREBASE_APPCHECK_DEBUG_TOKEN = value; }, token);
}

test('capture production judge evidence', async ({page}, testInfo) => {
  test.skip(process.env.EVIDENCE_CAPTURE !== '1', 'Evidence capture runs only against official Firebase production');
  test.setTimeout(180_000);
  await enableCiAppCheck(page);

  await page.goto('/', {waitUntil:'domcontentloaded'});
  await expect(page.locator('#commandCenter')).toBeVisible();
  await expect(page.locator('.incident-scope')).toHaveText('Controlled simulation');

  const persistence = page.locator('#persistenceStatus');
  await expect(persistence).toContainText(/Firebase server read verified|Restored directly from Firebase/, {timeout:30_000});

  await page.screenshot({
    path: testInfo.outputPath(`varelyx-${testInfo.project.name}-opening.png`),
    fullPage: true
  });

  if (testInfo.project.name !== 'desktop-1440') return;

  await page.locator('#disruptionInput').fill(
    'Synthetic competition QA: Supplier B delivery is 48 hours late. 2 routes affected. Thursday capacity is not confirmed.'
  );
  await page.locator('#analyzeBtn').click();
  await expect(page.locator('#geminiResult')).toContainText('LIVE GEMINI VERIFIED', {timeout:60_000});
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
