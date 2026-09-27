// Captures the real TradFi asset tabs from hotcoin.com into public/site (3x device scale).
// Needs the proxy CA in the browser trust store (see README in this folder).
const {chromium} = require('playwright');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({viewport: {width: 1600, height: 1000}, deviceScaleFactor: 3});
  await p.goto('https://www.hotcoin.com/en_US/tradFi', {waitUntil: 'domcontentloaded', timeout: 90000});
  await p.waitForTimeout(6000);
  const h = p.locator("text=Trade the World's Leading Futures").first();
  await h.scrollIntoViewIfNeeded();
  for (const [tab, name] of [['US stocks', 'us'], ['Metal', 'metal'], ['ETF', 'etf']]) {
    await p.locator(`text="${tab}"`).first().click();
    await p.waitForTimeout(1800);
    const box = await h.boundingBox();
    await p.screenshot({path: `public/site/tab-${name}.png`, clip: {x: 180, y: box.y - 20, width: 1240, height: 430}});
  }
  await b.close();
})();
