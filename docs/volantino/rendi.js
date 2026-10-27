const { chromium } = require('playwright');
(async () => {
  const d = require("path").resolve(process.argv[2]);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 560, height: 794 }, deviceScaleFactor: 3.125 });
  await p.goto('file://' + d + '/volantino.html'); await p.waitForTimeout(300);
  await p.screenshot({ path: d + '/buonapp-volantino-a5.png' });
  await p.pdf({ path: d + '/buonapp-volantino-a5.pdf', width: '148mm', height: '210mm', printBackground: true });
  await b.close();
})();
