// Figures for the internal TOKEN2049 Singapore 2026 event review (Chinese for management, English subtitles).
// Annotated reference screenshots (public/review/x*.jpg, supplied by the marketing team) and concept drawings.
// Exchange logos for the nested-bag drawing come from CoinGecko (public/review/logo-*.{png,jpg}).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';
import '@fontsource/noto-sans-sc/400.css';
import '@fontsource/noto-sans-sc/700.css';
import '@fontsource/noto-sans-sc/900.css';

const INK = '#0B0E11', PANEL = '#14181D', LINE = '#262C33', LIME = '#B8F26A', GREEN = '#7EC25A', WHITE = '#F2F3EE', MUTED = '#9AA3AB', RED = '#FF4D4D';
const ZH = '"Noto Sans SC", "WenQuanYi Zen Hei", sans-serif', EN = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';
export const FIG_W = 1600;

const useFontsReady = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      Promise.all(['400 20px "Inter Tight"', '600 20px "Inter Tight"', '700 20px "JetBrains Mono"'].map((f) => document.fonts.load(f)))
        .then(() => document.fonts.ready).then(() => setTimeout(() => continueRender(h), 300));
    }));
  }, [h]);
};

// ---------- shared pieces ----------
const Frame: React.FC<{no: string; zh: string; en: string; children: React.ReactNode}> = ({no, zh, en, children}) => {
  useFontsReady();
  return (
    <AbsoluteFill style={{background: INK, padding: 56, fontFamily: ZH, color: WHITE}}>
      <AbsoluteFill style={{background: 'radial-gradient(60% 40% at 90% 0%, rgba(184,242,106,0.10), rgba(184,242,106,0) 70%)'}} />
      <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36}}>
        <div>
          <div style={{display: 'inline-block', fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: 3, color: INK, background: LIME, padding: '7px 26px 7px 12px', clipPath: 'polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)'}}>TOKEN2049 复盘 · {no}</div>
          <div style={{fontWeight: 900, fontSize: 46, lineHeight: 1.2, marginTop: 18}}>{zh}</div>
          <div style={{fontFamily: EN, fontSize: 22, color: MUTED, marginTop: 6}}>{en}</div>
        </div>
        <Img src={staticFile('brand/logo-official-white.png')} style={{width: 200, height: (200 * 328) / 2005, marginTop: 6}} />
      </div>
      <div style={{position: 'relative', flex: 1}}>{children}</div>
    </AbsoluteFill>
  );
};

type Box = {x: number; y: number; w: number; h: number; n?: number; color?: string};
// A screenshot shown at `width`, with outlined regions (source pixel coords) and numbered pins.
const Shot: React.FC<{src: string; sw: number; sh: number; width: number; crop?: [number, number]; boxes?: Box[]; style?: React.CSSProperties}> = ({src, sw, sh, width, crop, boxes = [], style}) => {
  const k = width / sw, y0 = crop ? crop[0] : 0, y1 = crop ? crop[1] : sh, h = (y1 - y0) * k;
  return (
    <div style={{position: 'relative', width, height: h, borderRadius: 14, overflow: 'hidden', border: `1px solid ${LINE}`, flex: 'none', ...style}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: -y0 * k, width, height: sh * k}} />
      {boxes.map((b, i) => {
        const c = b.color ?? LIME;
        return (
          <div key={i} style={{position: 'absolute', left: b.x * k, top: (b.y - y0) * k, width: b.w * k, height: b.h * k, border: `4px solid ${c}`, borderRadius: 10, boxShadow: `0 0 0 3px rgba(0,0,0,0.35), 0 0 24px ${c}66`}}>
            {b.n ? <Pin n={b.n} color={c} style={{position: 'absolute', left: -18, top: -18}} /> : null}
          </div>
        );
      })}
    </div>
  );
};
const Pin: React.FC<{n: number; color?: string; style?: React.CSSProperties}> = ({n, color = LIME, style}) => (
  <div style={{width: 36, height: 36, borderRadius: 18, background: color, color: INK, fontFamily: MONO, fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', ...style}}>{n}</div>
);
const Note: React.FC<{n?: number; zh: React.ReactNode; en?: string; color?: string}> = ({n, zh, en, color}) => (
  <div style={{display: 'flex', gap: 16, alignItems: 'flex-start'}}>
    {n ? <Pin n={n} color={color} /> : null}
    <div>
      <div style={{fontSize: 25, lineHeight: 1.5, fontWeight: 400}}>{zh}</div>
      {en ? <div style={{fontFamily: EN, fontSize: 17, lineHeight: 1.4, color: MUTED, marginTop: 4}}>{en}</div> : null}
    </div>
  </div>
);
const Hl: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: LIME, fontWeight: 700}}>{children}</span>;
// Chinese translation card for a tweet
const Tr: React.FC<{who: string; zh: React.ReactNode; stat?: string; style?: React.CSSProperties}> = ({who, zh, stat, style}) => (
  <div style={{background: PANEL, border: `1px solid ${LINE}`, borderLeft: `5px solid ${LIME}`, borderRadius: 12, padding: '22px 26px', ...style}}>
    <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: 2, color: LIME, marginBottom: 10}}>中文翻译 · {who}</div>
    <div style={{fontSize: 25, lineHeight: 1.55}}>{zh}</div>
    {stat ? <div style={{fontFamily: MONO, fontSize: 15, color: MUTED, marginTop: 12}}>{stat}</div> : null}
  </div>
);
const Takeaway: React.FC<{zh: React.ReactNode; en: string}> = ({zh, en}) => (
  <div style={{background: 'rgba(184,242,106,0.10)', border: `2px solid ${LIME}`, borderRadius: 14, padding: '20px 26px'}}>
    <div style={{fontWeight: 700, fontSize: 27, lineHeight: 1.45}}>{zh}</div>
    <div style={{fontFamily: EN, fontSize: 18, color: MUTED, marginTop: 6}}>{en}</div>
  </div>
);

// ---------- 1. BingX queue lane ----------
export const FigQueue: React.FC = () => (
  <Frame no="01" zh="参考 BingX：排队通道 + 等候区" en="BingX: a roped queue lane and a waiting zone under the brand mark">
    <div style={{display: 'flex', gap: 44}}>
      <Shot src="review/x29.jpg" sw={900} sh={600} width={930} boxes={[{x: 92, y: 100, w: 250, h: 372, n: 1}, {x: 762, y: 462, w: 136, h: 84, n: 2, color: RED}, {x: 450, y: 60, w: 300, h: 110, n: 3}]} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 30, paddingTop: 6}}>
        <Note n={1} zh={<>品牌标志下方是<Hl>等候区</Hl>：排队的人能看到说明，边等边下载 App、完成注册。</>} en="Under the X: people wait, read the steps and register while they queue." />
        <Note n={2} color={RED} zh={<><Hl>红色围栏</Hl>划出排队动线，人流有序，不会堵在展位正中。</>} en="The red rope gives the line a path, so the crowd never blocks the counter." />
        <Note n={3} zh={<>排队的人站在品牌墙前，自然形成<Hl>拍照区</Hl>，每个新面孔都在为品牌出镜。</>} en="The queue stands in front of the logo: a natural photo zone of new faces." />
        <Takeaway zh={<>轮到他时已经有账户，工作人员只需发奖和讲解。</>} en="By the time they reach the counter they already have an account." />
      </div>
    </div>
  </Frame>
);

// ---------- 2. biggest-bag tweets ----------
export const FigBagTweets: React.FC = () => (
  <Frame no="02" zh="社媒热议：谁的袋子最大" en="On X after the event: the 'biggest bag' joke, and why it is free advertising">
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 44, rowGap: 34}}>
      <div style={{display: 'flex', gap: 22}}>
        <Shot src="review/x30.jpg" sw={1115} sh={2000} width={340} crop={[0, 1470]} boxes={[{x: 165, y: 80, w: 900, h: 220}, {x: 455, y: 790, w: 240, h: 200}]} />
        <Tr who="@godemodegame" zh={<>嘿 @token2049，我有个问题：<br />这到底是加密大会，还是<Hl>比谁的袋子最大</Hl>？</>} stat="图中：OKX 主舞台前，MEXC 超大袋装着其他品牌的袋子" style={{flex: 1, alignSelf: 'flex-start'}} />
      </div>
      <div style={{display: 'flex', gap: 22}}>
        <Shot src="review/x31.jpg" sw={1170} sh={1843} width={340} boxes={[{x: 20, y: 220, w: 1130, h: 600}]} />
        <Tr who="@CryptoCyn" zh={<>这是什么情况？@token2049 必须点名一下。为什么项目方要浪费这么多周边？<Hl>投资回报率在哪里？</Hl>人们又为什么会囤这么多周边？CT 来解释一下！</>} stat="2.4 万浏览 · 53 条评论（2026/10/8）" style={{flex: 1, alignSelf: 'flex-start'}} />
      </div>
      <div style={{display: 'flex', gap: 22}}>
        <Shot src="review/x32.jpg" sw={1170} sh={1472} width={340} crop={[760, 1472]} boxes={[{x: 170, y: 830, w: 990, h: 540}]} />
        <Tr who="@CryptoGuyT…（回复）" zh={<>想象一下，拎着一个有半个人那么大、印满“BloFin”的袋子，走过一个满是世界上最有钱的人的商场。再乘以 100 次。<Hl>你买的不是被大家习惯性忽略的广告位，你买的是有人说“我有这个”。</Hl></>} style={{flex: 1, alignSelf: 'flex-start'}} />
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
        <div style={{display: 'flex', gap: 22}}>
          <Shot src="review/x33.jpg" sw={1170} sh={329} width={340} boxes={[{x: 160, y: 45, w: 620, h: 215}]} />
          <Tr who="@Tractor3000k（回复）" zh={<><Hl>最大的袋子 = 免费广告。</Hl>这就是新玩法。</>} style={{flex: 1, alignSelf: 'flex-start'}} />
        </div>
        <Takeaway zh={<>Hotcoin 这次没有自己的袋子，礼品都被装进了别家的袋子里。</>} en="Hotcoin had no bag of its own, so our gifts left the venue inside other brands' bags." />
      </div>
    </div>
  </Frame>
);

// ---------- 3. matryoshka bag ----------
const Tote: React.FC<{w: number; h: number; fill: string; stroke: string; handle?: string; logo?: string; label?: React.ReactNode; style?: React.CSSProperties; children?: React.ReactNode; dashed?: boolean}> = ({w, h, fill, stroke, handle, logo, label, style, children, dashed}) => (
  <div style={{position: 'absolute', width: w, height: h, ...style}}>
    {/* handles */}
    <div style={{position: 'absolute', left: w * 0.24, top: -h * 0.16, width: w * 0.2, height: h * 0.3, border: `${Math.max(4, w * 0.02)}px solid ${handle ?? stroke}`, borderBottom: 'none', borderRadius: '60px 60px 0 0'}} />
    <div style={{position: 'absolute', left: w * 0.56, top: -h * 0.16, width: w * 0.2, height: h * 0.3, border: `${Math.max(4, w * 0.02)}px solid ${handle ?? stroke}`, borderBottom: 'none', borderRadius: '60px 60px 0 0'}} />
    <div style={{position: 'absolute', inset: 0, background: fill, border: `3px ${dashed ? 'dashed' : 'solid'} ${stroke}`, borderRadius: 14, boxShadow: '0 18px 40px rgba(0,0,0,0.45)', overflow: 'visible'}}>
      {logo ? <Img src={staticFile(logo)} style={{position: 'absolute', left: 14, top: 14, width: Math.min(64, w * 0.22), height: Math.min(64, w * 0.22), borderRadius: 10}} /> : null}
      {label ? <div style={{position: 'absolute', left: logo ? Math.min(64, w * 0.22) + 26 : 16, top: 16, fontFamily: EN, fontWeight: 600, fontSize: Math.min(24, w * 0.08), color: WHITE}}>{label}</div> : null}
      {children}
    </div>
  </div>
);
export const FigMatryoshka: React.FC = () => {
  const W = 720, H = 600, ox = 60, oy = 190;
  return (
    <Frame no="03" zh="套娃式大袋子：把所有品牌装进 Hotcoin" en="The nesting bag: one huge Hotcoin bag that carries every other brand's bag">
      <div style={{position: 'relative', height: 860}}>
        {/* balloon tied to the right handle */}
        <svg width={1600} height={400} style={{position: 'absolute', left: 0, top: 0}}>
          <path d={`M ${ox + W * 0.66} ${oy - H * 0.14} C ${ox + W * 0.8} ${oy - 150}, ${ox + W + 60} ${oy - 20}, ${ox + W + 105} 228`} stroke={MUTED} strokeWidth="3" fill="none" />
        </svg>
        <div style={{position: 'absolute', left: ox + W + 10, top: 10, width: 190, height: 215, borderRadius: '50% 50% 48% 48%', background: LIME, boxShadow: 'inset -20px -24px 0 rgba(0,0,0,0.12), 0 14px 30px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Img src={staticFile('review/qr.png')} style={{width: 110, height: 110, borderRadius: 8}} />
        </div>
        <div style={{position: 'absolute', left: ox + W + 230, top: 70, width: 300, fontSize: 21, lineHeight: 1.55, color: MUTED}}>气球系在提手上：<br />一面 logo，一面 App 二维码</div>
        <Tote w={W} h={H} fill={`linear-gradient(160deg, ${GREEN}, ${LIME})`} stroke={INK} handle={GREEN} style={{left: ox, top: oy}}>
          <div style={{position: 'absolute', left: 30, top: 26, display: 'flex', alignItems: 'center', gap: 16}}>
            <Img src={staticFile('brand/logo-official-black.png')} style={{width: 260, height: (260 * 328) / 2003}} />
          </div>
          <div style={{position: 'absolute', right: 30, top: 30, fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: 2, color: INK}}>9 YEARS · BUILT FOR TRADERS</div>
          {/* the cut-away window */}
          <div style={{position: 'absolute', left: 40, top: 110, right: 40, bottom: 40, background: 'rgba(11,14,17,0.82)', borderRadius: 12, border: `3px dashed ${INK}`}}>
            <Tote w={570} h={400} fill="#1B1F24" stroke="#5B636B" logo="review/logo-okex.png" label="OKX" style={{left: 40, top: 40}}>
              <Tote w={450} h={290} fill="#2A2410" stroke="#8A7A3A" logo="review/logo-binance.jpg" label="Binance" style={{left: 50, top: 88}}>
                <Tote w={340} h={190} fill="#13203A" stroke="#4466AA" logo="review/logo-bingx.jpg" label="BingX" style={{left: 50, top: 84}}>
                  <Tote w={240} h={96} fill="#122236" stroke="#3B6FB0" logo="review/logo-mexc.jpg" label="MEXC" style={{left: 50, top: 86}}>
                    <svg width={46} height={46} viewBox="0 0 46 46" style={{position: 'absolute', right: 12, bottom: 10}}><circle cx="23" cy="23" r="21" fill={WHITE} stroke={INK} strokeWidth="3" /><polygon points="23,14 31,20 28,30 18,30 15,20" fill={INK} /></svg>
                    <div style={{position: 'absolute', right: 64, bottom: 18, fontSize: 15, color: MUTED}}>小礼品</div>
                  </Tote>
                </Tote>
              </Tote>
            </Tote>
          </div>
        </Tote>
        <div style={{position: 'absolute', left: ox + W + 70, top: 290, width: 610, display: 'flex', flexDirection: 'column', gap: 26}}>
          <Note n={1} zh={<>袋子要<Hl>最大</Hl>：其他品牌的袋子都能装进去，最后被看见的只有 Hotcoin。</>} en="Make it the biggest, so every other brand's bag ends up inside ours." />
          <Note n={2} zh={<>走出会场，就是在新加坡市中心<Hl>移动的广告牌</Hl>。</>} en="Outside the venue it is a moving billboard in central Singapore." />
          <Note n={3} zh={<>袋子本身很便宜；里面可以放<Hl>很小的礼品</Hl>，反差本身就是话题。</>} en="The bag is cheap; a tiny gift inside makes the contrast part of the joke." />
          <Note n={4} zh={<>系上<Hl>印二维码的气球</Hl>：袋子装不下，全场都看得到。</>} en="Tie a QR balloon to it: nobody can hide a balloon inside a bag." />
        </div>
      </div>
    </Frame>
  );
};

// ---------- 4. OKX balloons ----------
export const FigBalloon: React.FC = () => (
  <Frame no="04" zh="参考 OKX：会飘的品牌气球" en="OKX: heart balloons in brand colour, carried around the whole venue">
    <div style={{display: 'flex', gap: 48, alignItems: 'flex-start'}}>
      <Shot src="review/x34.jpg" sw={510} sh={680} width={560} boxes={[{x: 55, y: 355, w: 420, h: 280, n: 1}, {x: 430, y: 185, w: 80, h: 150, n: 2}]} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 30, width: 840}}>
        <Note n={1} zh={<>OKX 用品牌荧光色的心形氦气球，<Hl>logo 印在正面</Hl>，放在展台上就是装饰。</>} en="Brand-colour helium hearts with the logo: decoration while they sit on the counter." />
        <Note n={2} zh={<>被领走后<Hl>飘在人群上方</Hl>，整场活动都在做广告，而且没法藏进袋子里。</>} en="Once handed out they float above the crowd all day, and nobody can bag them." />
        <div style={{display: 'flex', gap: 40, alignItems: 'flex-end', marginTop: 18}}>
          {[0, 1].map((side) => (
            <div key={side} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
              <div style={{width: 230, height: 250, borderRadius: '50% 50% 48% 48%', background: side ? LIME : INK, border: side ? 'none' : `4px solid ${LIME}`, boxShadow: 'inset -22px -26px 0 rgba(0,0,0,0.14), 0 14px 30px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {side ? <Img src={staticFile('review/qr.png')} style={{width: 130, height: 130, borderRadius: 8}} /> : <Img src={staticFile('brand/symbol-official-white.png')} style={{width: 110, height: 110}} />}
              </div>
              <div style={{width: 3, height: 70, background: MUTED}} />
              <div style={{fontSize: 22, color: WHITE}}>{side ? '背面：App 下载二维码' : '正面：Hotcoin 标志'}</div>
              <div style={{fontFamily: EN, fontSize: 16, color: MUTED}}>{side ? 'Back: app QR code' : 'Front: Hotcoin mark'}</div>
            </div>
          ))}
          <div style={{flex: 1, marginLeft: 10}}>
            <Takeaway zh={<>Hotcoin 版本：气球系在大袋子上，一面 logo，一面二维码。</>} en="Our version: tied to the big bag, logo on one side, QR on the other." />
          </div>
        </div>
      </div>
    </div>
  </Frame>
);

// ---------- 5. booth materials: tablets + partner booklet ----------
const Tablet: React.FC<{title: string; rows: [string, string, string][]; tag: string}> = ({title, rows, tag}) => (
  <div style={{width: 300, height: 400, background: '#05070A', borderRadius: 26, border: '10px solid #2A3038', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', padding: 18, display: 'flex', flexDirection: 'column', gap: 12}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <Img src={staticFile('brand/logo-official-white.png')} style={{width: 96, height: (96 * 328) / 2005}} />
      <div style={{fontFamily: MONO, fontSize: 12, color: INK, background: LIME, padding: '3px 8px', borderRadius: 4}}>{tag}</div>
    </div>
    <div style={{fontFamily: EN, fontWeight: 600, fontSize: 20, color: WHITE}}>{title}</div>
    {rows.map(([a, b, c], i) => (
      <div key={i} style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 15, color: WHITE, borderBottom: `1px solid ${LINE}`, paddingBottom: 8}}>
        <span>{a}</span><span style={{color: MUTED}}>{b}</span><span style={{color: c.startsWith('-') ? RED : LIME}}>{c}</span>
      </div>
    ))}
  </div>
);
export const FigMaterials: React.FC = () => (
  <Frame no="05" zh="展位资料升级：演示平板 + 合作与收益手册" en="Booth materials: demo tablets on the counter and a 'ways to work with us' booklet">
    <div style={{display: 'flex', gap: 48}}>
      <div style={{width: 960}}>
        <div style={{display: 'flex', gap: 26, justifyContent: 'center', alignItems: 'flex-end', position: 'relative', zIndex: 2}}>
          <Tablet title="Markets" tag="DEMO" rows={[['BTC', 'USDT', '+1.2%'], ['ETH', 'USDT', '+0.8%'], ['SOL', 'USDT', '-0.4%'], ['XAU', 'USDT', '+0.3%'], ['NVDA', 'USDT', '+1.6%']]} />
          <Tablet title="Futures · demo account" tag="DEMO" rows={[['BTCUSDT', '20x', 'LONG'], ['Margin', '100', 'USDT'], ['PnL', 'live', '+12.4%'], ['TP / SL', 'set', 'ON'], ['Copy', 'trade', 'ON']]} />
          <Tablet title="Copy trading" tag="DEMO" rows={[['Trader A', '30D', '+18.2%'], ['Trader B', '30D', '+11.5%'], ['Trader C', '30D', '+9.7%'], ['Trader D', '30D', '-2.1%'], ['Follow', '1 tap', 'ON']]} />
        </div>
        <div style={{height: 70, marginTop: -40, background: 'linear-gradient(180deg, #E9ECEF, #C9CED3)', borderRadius: 12, position: 'relative', zIndex: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}} />
        <div style={{height: 160, margin: '0 40px', background: 'linear-gradient(180deg, #1A1F25, #101418)', borderRadius: '0 0 14px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24}}>
          <div style={{width: 6, height: 70, background: LIME, borderRadius: 3}} />
          <div style={{fontSize: 28, fontWeight: 700}}>人人都能上手试用 Hotcoin App</div>
        </div>
        <div style={{fontFamily: EN, fontSize: 18, color: MUTED, textAlign: 'center', marginTop: 16}}>Like the OKX booth: tablets with the app open on a demo account, an Apple Store-style first try</div>
        <div style={{fontSize: 16, color: MUTED, textAlign: 'center', marginTop: 6}}>示意图：平板画面为占位，非真实行情或费率</div>
      </div>
      <div style={{flex: 1, background: '#F4F2EC', color: INK, borderRadius: 16, padding: '30px 32px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', transform: 'rotate(1.2deg)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Img src={staticFile('brand/logo-official-black.png')} style={{width: 150, height: (150 * 328) / 2003}} />
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 14, letterSpacing: 2, background: INK, color: LIME, padding: '4px 10px'}}>PARTNERS</div>
        </div>
        <div style={{fontWeight: 900, fontSize: 34, marginTop: 22}}>合作与收益方式</div>
        <div style={{fontFamily: EN, fontSize: 18, color: '#555', marginBottom: 18}}>Ways to work with Hotcoin</div>
        {[
          ['VIP 计划', '按 30 天交易量分级：更低费率、更高提现额度、专属客服；支持凭其他平台 VIP 快速升级'],
          ['联盟 / KOL 计划', '最高 80% 持续返佣，每日 02:00（UTC+8）结算，可发展二级代理'],
          ['机构与大客户', '出入金、做市、API 接入：business@hotcoin.com 专人对接'],
          ['P2P 商家计划', '认证商家标识、自定义广告、优先处理纠纷'],
          ['真实数字', '每一项都写清费率、门槛和联系人，现场能直接谈'],
        ].map(([a, b], i) => (
          <div key={i} style={{display: 'flex', gap: 14, padding: '12px 0', borderTop: '1px solid #D6D2C8'}}>
            <div style={{width: 10, height: 10, marginTop: 11, background: GREEN, flex: 'none'}} />
            <div>
              <div style={{fontWeight: 700, fontSize: 22}}>{a}</div>
              <div style={{fontSize: 18, lineHeight: 1.5, color: '#333'}}>{b}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

// ---------- 6. Vizor: instant reward on the spot ----------
export const FigVizor: React.FC = () => (
  <Frame no="06" zh="参考 Vizor：现场下载，当场到账，用户自发发推" en="Vizor: download on the spot, reward lands the same day, the user posts about it">
    <div style={{display: 'flex', gap: 30, alignItems: 'flex-start'}}>
      <Shot src="review/x35.jpg" sw={1169} sh={1519} width={420} boxes={[{x: 170, y: 70, w: 980, h: 470, n: 1}]} />
      <Shot src="review/x36.jpg" sw={924} sh={2000} width={250} crop={[600, 1700]} boxes={[{x: 40, y: 690, w: 860, h: 260, n: 2}]} />
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 24}}>
        <Tr who="@iamgaurangdesai" zh={<>Zooko 正在台上讲 Zcash 的时间线，旁边有人问我要不要领 $ZEC 空投，我说当然要。<Hl>于是直接下载了 Vizor App，领取了券……</Hl></>} />
        <Note n={2} zh={<>App 里马上显示：<Hl>兑换礼品卡 +0.1 ZEC，10 月 9 日</Hl>，当天到账。</>} en="The app shows the gift card redeemed, +0.1 ZEC, on the same day." />
        <Takeaway zh={<>奖励当场到账，用户自己就会发推。我们这次奖励 4 天后才到，这种时刻没有发生。</>} en="An instant reward turns into a free post. Ours landed 4 days later, so this moment never happened." />
      </div>
    </div>
  </Frame>
);

// ---------- 7. New York edition chatter ----------
export const FigUS: React.FC = () => (
  <Frame no="07" zh="下一站：TOKEN2049 纽约站" en="Next: TOKEN2049 New York, announced at TOKEN2049 Singapore 2026">
    <div style={{display: 'flex', gap: 40, alignItems: 'flex-start'}}>
      <Shot src="review/x37.jpg" sw={924} sh={2000} width={380} crop={[220, 1700]} boxes={[{x: 15, y: 420, w: 900, h: 340, n: 1}, {x: 140, y: 1600, w: 770, h: 70, n: 2}]} />
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 24}}>
        <Tr who="@0xLoki_Zeng（原文为中文）" zh={<>明年 TOKEN2049 在美国办是好事吧？<Hl>如果连创始人都拿不到美国签证</Hl>，你还敢买他的币、敢把钱存在他那里吗？</>} stat="9,500 浏览（2026/10/9）" />
        <Tr who="评论" zh={<>“不难，只要你有友好国家的证件。签证官会一直跟你聊。”<br />“<Hl>终于不用再去新加坡了</Hl>。”</>} />
        <div style={{background: PANEL, border: `1px solid ${LINE}`, borderRadius: 14, padding: '22px 26px', display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 22, rowGap: 12, fontSize: 23}}>
          <span style={{color: MUTED}}>时间</span><span><Hl>2027 年 6 月 16–17 日</Hl></span>
          <span style={{color: MUTED}}>地点</span><span>纽约（TOKEN2049 首个美国站）</span>
          <span style={{color: MUTED}}>规模</span><span>主办方预计约 15,000 人，另有全城 TOKEN2049 Week 周边活动</span>
        </div>
        <Takeaway zh={<>建议至少以周边活动形式出现；提前规划团队签证。</>} en="Be there at least with a side event, and plan the team's US visas early." />
      </div>
    </div>
  </Frame>
);
