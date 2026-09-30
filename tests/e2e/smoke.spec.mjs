import {test, expect} from '@playwright/test';

test('Decision Command Center renders safely without page-level overflow', async ({page}, testInfo) => {
  const browserErrors=[];
  page.on('pageerror', err => browserErrors.push(`pageerror: ${err.message}`));
  page.on('console', msg => {
    if (msg.type() === 'error' && /(?:Uncaught|ReferenceError|TypeError|SyntaxError)/i.test(msg.text())) browserErrors.push(`console: ${msg.text()}`);
  });

  await page.goto('/', {waitUntil:'domcontentloaded'});
  await expect(page.locator('#commandCenter')).toBeVisible();
  await expect(page.getByText('LIVE RETAIL CONTINUITY INCIDENT')).toBeVisible();
  for (const label of ['KNOW','ASK','DECIDE','PROVE','ACT']) await expect(page.getByText(label,{exact:true})).toBeVisible();
  await expect(page.getByText(/Human authorization/i).first()).toBeVisible();
  await expect(page.locator('.incident-scope')).toHaveText('Controlled simulation');
  await expect(page.getByText('PASS',{exact:true}).first()).toBeVisible();
  await expect(page.getByText('HOLD',{exact:true}).first()).toBeVisible();
  await expect(page.getByText('BLOCK',{exact:true}).first()).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, `page-level horizontal overflow at ${testInfo.project.name}`).toBeLessThanOrEqual(1);
  expect(browserErrors).toEqual([]);
});
