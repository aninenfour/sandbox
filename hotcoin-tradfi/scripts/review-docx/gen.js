// Builds the TOKEN2049 review as two Word files (Chinese, English) from content.js.
const fs = require('fs');
const path = require('path');
const {imageSize} = require('./size');
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  HeadingLevel, AlignmentType, LevelFormat, ExternalHyperlink, Footer, Header, PageNumber, VerticalAlign, TableLayoutType,
} = require('docx');
const {zh, en, conn} = require('./content');

const OUT = process.argv[2];
const PAGE_W = 11906, MARGIN = 1080, CW = PAGE_W - 2 * MARGIN; // A4, content width in DXA
const IMG_W = 640; // px
const INK = '0B0E11', GREEN = '3E7A25', MUTED = '6B7280', RULE = 'D9DED3', HEAD_BG = 'EEF6E4';

const build = (L, lang) => {
  const font = lang === 'zh' ? {ascii: 'Arial', hAnsi: 'Arial', eastAsia: 'Microsoft YaHei', cs: 'Arial'} : 'Arial';
  let figNo = 0, listNo = 0;
  const runs = (text, opts = {}) => text.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((t) =>
    t.startsWith('**') ? new TextRun({text: t.slice(2, -2), bold: true, font, ...opts}) : new TextRun({text: t, font, ...opts}));
  const para = (text, opts = {}) => new Paragraph({children: runs(text, opts.run || {}), spacing: {after: 140, line: 312}, ...opts.p});
  const scaleCols = (ws) => {const s = ws.reduce((a, b) => a + b, 0); const out = ws.map((w) => Math.floor((w * CW) / s)); out[out.length - 1] += CW - out.reduce((a, b) => a + b, 0); return out;};
  const border = {style: BorderStyle.SINGLE, size: 4, color: RULE};
  const borders = {top: border, bottom: border, left: border, right: border};
  const cell = (children, w, head) => new TableCell({children, width: {size: w, type: WidthType.DXA}, borders, verticalAlign: VerticalAlign.CENTER,
    margins: {top: 80, bottom: 80, left: 110, right: 110}, shading: head ? {fill: HEAD_BG, type: ShadingType.CLEAR, color: 'auto'} : undefined});
  const small = (text, opts = {}) => new Paragraph({children: runs(text, {size: 18, ...opts}), spacing: {after: 40, line: 276}});
  const table = (head, rows, ws) => {
    const cols = scaleCols(ws);
    return new Table({width: {size: CW, type: WidthType.DXA}, columnWidths: cols, layout: TableLayoutType.FIXED, rows: [
      new TableRow({tableHeader: true, children: head.map((h, i) => cell([small(h, {bold: true})], cols[i], true))}),
      ...rows.map((r) => new TableRow({cantSplit: true, children: r.map((c, i) => cell([small(c)], cols[i]))})),
    ]});
  };
  const image = (file, caption) => {
    figNo += 1;
    const {w, h} = imageSize(file);
    const type = file.endsWith('.png') ? 'png' : 'jpg';
    return [
      new Paragraph({alignment: AlignmentType.CENTER, spacing: {before: 120, after: 60}, keepNext: true,
        children: [new ImageRun({type, data: fs.readFileSync(file), transformation: {width: IMG_W, height: Math.round((IMG_W * h) / w)}})]}),
      new Paragraph({alignment: AlignmentType.CENTER, spacing: {after: 240}, children: [new TextRun({text: `${L.fig} ${figNo}  ${caption}`, italics: true, size: 18, color: MUTED, font})]}),
    ];
  };
  const list = (items, ref) => {if (ref === 'num') listNo += 1; return items.map((t) => new Paragraph({numbering: {reference: ref, level: 0, instance: ref === 'num' ? listNo : 0}, children: runs(t), spacing: {after: 80, line: 300}}));};
  const connTable = () => {
    const cols = scaleCols([1250, 1900, 3100, 2500, 996]);
    const rows = conn.map(([thumb, name, company, stars, vz, nz, ve, ne]) => {
      const photo = thumb
        ? new Paragraph({alignment: AlignmentType.CENTER, children: [new ImageRun({type: 'jpg', data: fs.readFileSync(`/home/user/sandbox/hotcoin-tradfi/out/review/thumb/${thumb}.jpg`), transformation: {width: 64, height: 64}})]})
        : new Paragraph({alignment: AlignmentType.CENTER, children: [new TextRun({text: '—', color: MUTED, font})]});
      const who = [small(name, {bold: true}), small(lang === 'zh' ? company : company.replace(/（.*?）/g, '').replace('新加坡派对策划', 'Party planner, Singapore'), {color: MUTED})];
      return new TableRow({cantSplit: true, children: [
        cell([photo], cols[0]), cell(who, cols[1]), cell([small(lang === 'zh' ? vz : ve)], cols[2]), cell([small(lang === 'zh' ? nz : ne)], cols[3]),
        cell([small('★'.repeat(stars) + '☆'.repeat(5 - stars), {color: GREEN})], cols[4]),
      ]});
    });
    return new Table({width: {size: CW, type: WidthType.DXA}, columnWidths: cols, layout: TableLayoutType.FIXED, rows: [
      new TableRow({tableHeader: true, children: L.connHead.map((h, i) => cell([small(h, {bold: true})], cols[i], true))}), ...rows]});
  };

  const body = [
    new Paragraph({children: [new ImageRun({type: 'png', data: fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-black.png'), transformation: {width: 150, height: Math.round((150 * 328) / 2003)}})], spacing: {after: 240}}),
    new Paragraph({heading: HeadingLevel.TITLE, children: [new TextRun({text: L.title, font})], spacing: {after: 120}}),
    new Paragraph({children: [new TextRun({text: L.sub, color: MUTED, font})], spacing: {after: 360},
      border: {bottom: {style: BorderStyle.SINGLE, size: 12, color: 'B8F26A', space: 8}}}),
  ];
  for (const b of L.blocks) {
    const [k, a, c, d] = b;
    if (k === 'h1') body.push(new Paragraph({heading: HeadingLevel.HEADING_1, children: [new TextRun({text: a, font})]}));
    else if (k === 'h2') body.push(new Paragraph({heading: HeadingLevel.HEADING_2, children: [new TextRun({text: a, font})]}));
    else if (k === 'p') body.push(para(a));
    else if (k === 'bullets') body.push(...list(a, 'bul'));
    else if (k === 'nums') body.push(...list(a, 'num'));
    else if (k === 'checks') body.push(...list(a, 'chk'));
    else if (k === 'table') {body.push(table(a, c, d)); body.push(new Paragraph({spacing: {after: 120}, children: []}));}
    else if (k === 'img') body.push(...image(a, c));
    else if (k === 'conn') {body.push(connTable()); body.push(new Paragraph({spacing: {after: 120}, children: []}));}
    else if (k === 'links') a.forEach(([t, u]) => body.push(new Paragraph({numbering: {reference: 'bul', level: 0, instance: 0}, spacing: {after: 60},
      children: [new ExternalHyperlink({link: u, children: [new TextRun({text: t, style: 'Hyperlink', font, size: 20})]})]})));
  }

  return new Document({
    creator: 'Alexander, Hotcoin Marketing',
    title: L.title,
    styles: {
      default: {document: {run: {font, size: 21, color: INK}}},
      paragraphStyles: [
        {id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Normal', run: {size: 44, bold: true, color: INK, font}, paragraph: {spacing: {after: 120}}},
        {id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: {size: 32, bold: true, color: INK, font}, paragraph: {spacing: {before: 420, after: 160}, outlineLevel: 0, keepNext: true}},
        {id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: {size: 25, bold: true, color: GREEN, font}, paragraph: {spacing: {before: 260, after: 100}, outlineLevel: 1, keepNext: true}},
      ],
    },
    numbering: {config: [
      {reference: 'bul', levels: [{level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: {paragraph: {indent: {left: 440, hanging: 260}}}}]},
      {reference: 'num', levels: [{level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: {paragraph: {indent: {left: 440, hanging: 300}}}}]},
      {reference: 'chk', levels: [{level: 0, format: LevelFormat.BULLET, text: '☐', alignment: AlignmentType.LEFT, style: {paragraph: {indent: {left: 440, hanging: 300}}}}]},
    ]},
    sections: [{
      properties: {page: {size: {width: PAGE_W, height: 16838}, margin: {top: 1080, bottom: 1080, left: MARGIN, right: MARGIN}}},
      headers: {default: new Header({children: [new Paragraph({alignment: AlignmentType.RIGHT, children: [new TextRun({text: `Hotcoin · ${L.title}`, size: 16, color: MUTED, font})]})]})},
      footers: {default: new Footer({children: [new Paragraph({alignment: AlignmentType.CENTER, children: [new TextRun({children: [PageNumber.CURRENT], size: 16, color: MUTED, font})]})]})},
      children: body,
    }],
  });
};

(async () => {
  for (const [L, lang] of [[zh, 'zh'], [en, 'en']]) {
    const buf = await Packer.toBuffer(build(L, lang));
    fs.writeFileSync(path.join(OUT, L.file), buf);
    console.log('wrote', L.file, buf.length);
  }
})();
