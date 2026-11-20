const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const posts = require('./posts.js');
const OUT = process.argv[2];
const only = process.argv[3];
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  const story = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const p of posts) {
    if (only && !p.dir.includes(only)) continue;
    const dir = path.join(OUT, p.dir);
    fs.mkdirSync(dir, { recursive: true });
    for (let i = 0; i < p.slides.length; i++) {
      await page.goto('file://' + path.join(__dirname, 'template.html'));
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(([s, i, n]) => window.render(s, i, n), [p.slides[i], i, p.slides.length]);
      await page.evaluate(() => document.fonts.ready);
      const over = await page.evaluate(() => {
        const f = document.getElementById('f'); const last = f.lastElementChild;
        return last ? Math.round(last.getBoundingClientRect().bottom) : 0;
      });
      if (over > 1240) console.log(`WARN ${p.dir} slide ${i + 1} content bottom=${over}`);
      await page.screenshot({ path: path.join(dir, `ixeam-${i + 1}.jpg`), type: 'jpeg', quality: 92 });
    }
    const img = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(dir, 'ixeam-1.jpg')).toString('base64');
    await story.setContent(`<html><body style="margin:0;width:1080px;height:1920px;background:#f6f5fe;position:relative;overflow:hidden">
      <div style="position:absolute;top:0;left:0;right:0;height:24px;background:linear-gradient(90deg,#8b5cf6,#6d7bf7,#22d3ee)"></div>
      <img src="${img}" style="position:absolute;left:32px;top:265px;width:1016px">
      <div style="position:absolute;bottom:0;left:0;right:0;height:24px;background:linear-gradient(90deg,#8b5cf6,#6d7bf7,#22d3ee)"></div></body></html>`);
    await story.screenshot({ path: path.join(dir, 'story.jpg'), type: 'jpeg', quality: 92 });
    console.log('done', p.dir);
  }
  await browser.close();
})();
