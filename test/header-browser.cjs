const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

test('receiving header: click-only wallet, reject/change/disconnect, IPFS gates, About/focus and 375px', async t => {
  const project = path.resolve(__dirname, '..');
  const root = fs.existsSync(path.join(project, 'course')) ? path.join(project, 'course') : path.join(project, 'public');
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
  const server = http.createServer((req, res) => {
    const file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    fs.readFile(file, (error, bytes) => {
      res.writeHead(error ? 404 : 200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      res.end(error ? '' : bytes);
    });
  });
  server.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  t.after(async () => { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); });
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 375, height: 800 }, reducedMotion: 'reduce' });
  const external = [];
  await context.route('**/*', route => {
    if (route.request().url().startsWith(base + '/')) return route.continue();
    external.push(route.request().url()); return route.abort();
  });
  await context.addInitScript(() => {
    window.walletCalls = []; window.rejectWallet = true;
    const handlers = {};
    window.ethereum = {
      request: async ({ method }) => {
        window.walletCalls.push(method);
        if (method === 'eth_requestAccounts') {
          if (window.rejectWallet) throw new Error('Rejected by user');
          return ['0x1111111111111111111111111111111111111111'];
        }
        if (method === 'eth_chainId') return '0x89';
        throw new Error(`Unexpected wallet method: ${method}`);
      },
      on: (name, handler) => { handlers[name] = handler; },
      removeListener: name => { delete handlers[name]; }
    };
    window.emitWallet = (name, value) => handlers[name]?.(value);
  });
  const page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  const wallet = page.locator('decent-header wallet-connect #connect');
  await wallet.waitFor();
  assert.deepEqual(await page.evaluate(() => window.walletCalls), []);
  await wallet.click();
  await page.locator('decent-header wallet-connect #status').getByText('Rejected by user').waitFor();
  assert.equal(await page.evaluate(() => window.DecentHead.getWallet().snapshot().connected), false);
  await page.evaluate(() => { window.rejectWallet = false; });
  await wallet.click();
  await page.waitForFunction(() => window.DecentHead.getWallet().snapshot().connected);
  await page.evaluate(() => window.emitWallet('accountsChanged', ['0x2222222222222222222222222222222222222222']));
  assert.match(await page.evaluate(() => window.DecentHead.getWallet().snapshot().address), /2222/);
  await page.evaluate(() => window.emitWallet('chainChanged', '0x1'));
  assert.equal(await page.evaluate(() => window.DecentHead.getWallet().snapshot().chainId), '0x1');
  await wallet.click();
  assert.equal(await page.evaluate(() => window.DecentHead.getWallet().snapshot().connected), false);
  assert.ok(!(await page.evaluate(() => window.walletCalls)).some(method => /sign|send|switch|add/i.test(method)));
  const ipfs = page.locator('decent-header ipfs-controls #open');
  await ipfs.click();
  await page.locator('decent-header ipfs-controls #backup-status').getByText('unavailable').waitFor();
  assert.equal(await page.locator('decent-header ipfs-controls [data-capability="backup"]').isDisabled(), true);
  await page.locator('decent-header ipfs-controls #provider-settings > summary').click();
  await page.locator('decent-header ipfs-controls #provider').selectOption('local');
  await page.locator('decent-header ipfs-controls #save-provider').click();
  assert.match(await page.locator('decent-header ipfs-controls #provider-message').textContent(), /not yet verified/);
  await page.keyboard.press('Escape');
  assert.equal(await ipfs.evaluate(node => node.getRootNode().activeElement === node), true);
  const about = page.locator('decent-header app-title button');
  await about.click();
  const dialog = page.locator('decent-header about-modal dialog');
  const bounds = await dialog.boundingBox();
  assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 375);
  await page.keyboard.press('Escape');
  assert.equal(await about.evaluate(node => node.getRootNode().activeElement === node), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.ok(external.every(url => url === 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap'),
    'Only the pre-existing host font request may be attempted; it is blocked.');
  assert.deepEqual(errors, []);
});
