import {test, expect} from '@playwright/test';

async function enableCiAppCheck(page) {
  const token = process.env.FIREBASE_APPCHECK_DEBUG_TOKEN;
  if (token) await page.addInitScript(value => { self.FIREBASE_APPCHECK_DEBUG_TOKEN = value; }, token);
}

test('capture production judge evidence', async ({page}, testInfo) => {
  test.skip(process.env.EVIDENCE_CAPTURE !== '1', 'Evidence capture runs only against official Firebase production');
  test.setTimeout(120_000);
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
});
