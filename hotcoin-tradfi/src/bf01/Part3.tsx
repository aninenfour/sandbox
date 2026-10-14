// Bubble Files 01 · Part 3: chapter 4 ("The rules change"), 5 ("Silver Thursday"), 6 ("Aftermath"), 7 ("The lesson") and the end card.
// Same building blocks as Parts 1 and 2; shots are locked to sentences in public/bf01/vo/timeline.json.
// Facts: COMEX position limits Jan 1980 and "liquidation only" from Mon 21 Jan 1980; silver ~$10 down on 22 Jan;
// Volcker's Fed raised rates (fed funds ~17% by spring 1980) and pressed banks on speculative lending;
// Tiffany's ad in the NYT on 26 Mar 1980; $21.62 on 26 Mar to $10.80 on Thu 27 Mar 1980; Bache owed ~$120M;
// ~$1.1B bank loan to Placid Oil; Minpeco verdict (New York, 1988); bankruptcy 1988; 1989 settlement and trading ban;
// silver back above $50 in Oct 2025, record ~$65.63 in Dec 2025. In-between prices on the charts are approximate.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {AnimatedGrain} from '../alt/kit';
import {ANTON, Backdrop, FPS, Foot, INK, MONO, Paper, Print, RED, SANS, SILVER, Shot, Stamp, Tag, ease, f, lin, useFonts} from './Part1';
import {Advert, BigNumber, Calendar, Chart, Doc, Pin, Route, Still, Ticker, W, WorldMap} from './gfx';
import TL from '../../public/bf01/vo/timeline.json';

const C4 = TL[5], C5 = TL[6], C6 = TL[7], C7 = TL[8];
const CH4_AT = 0.6;
const CH5_AT = CH4_AT + C4.dur + 0.5;
const CH6_AT = CH5_AT + C5.dur + 1.6; // hold the SILVER THURSDAY title
const CH7_AT = CH6_AT + C6.dur + 0.5;
const END = CH7_AT + C7.dur + 4;
export const PART3_DURATION = Math.round(END * FPS);
const a = (i: number) => CH4_AT + C4.sentences[i].start;
const b = (i: number) => CH5_AT + C5.sentences[i].start;
const c = (i: number) => CH6_AT + C6.sentences[i].start;
const d = (i: number) => CH7_AT + C7.sentences[i].start;
const rel = (s: number, from: number) => f(s - from);

// Silver in 1980, day of year (17 Jan to 27 Mar). Endpoints from the record, the days between approximate.
const SLIDE: [number, number][] = [[14, 42], [16, 46.5], [17, 49.45], [18, 48], [21, 44], [22, 34], [32, 36], [46, 35], [56, 31], [63, 28], [74, 24], [86, 21.62], [87, 10.8]];
// Silver 1975 to today, approximate, for the footnote.
const LONG: [number, number][] = [[1975, 4.4], [1977, 4.6], [1978.5, 5.4], [1979.5, 8.6], [1979.95, 34], [1980.05, 49.5], [1980.25, 10.8], [1980.6, 16], [1981, 12], [1982.5, 6], [1983.2, 13], [1985, 6.1], [1987.3, 9.5], [1990, 5], [1993, 3.9], [1998, 6], [2001, 4.4], [2004, 6.5], [2006.3, 13.5], [2008.2, 20], [2008.8, 9.5], [2010, 17], [2011.3, 48.6], [2012, 32], [2013.5, 19], [2016, 14], [2016.5, 20], [2019, 15.5], [2020.2, 12], [2020.6, 28], [2021, 26], [2022.7, 18], [2024, 23], [2024.8, 33], [2025.3, 32], [2025.6, 38], [2025.8, 52], [2025.95, 65.63], [2026.2, 58], [2026.5, 62], [2026.78, 60]];

export const BF01Part3: React.FC = () => {
  useFonts();
  const fr = useCurrentFrame();
  const fed1 = a(11) + 3.4, fed2 = a(11) + 6.6, bank1 = a(11) + 8.6;
  const thu = b(6) + 3.4, crash = b(6) + 3.7;
  const loanDoc = c(0) + 3.6;
  // Minpeco map: camera framing
  const mapFocus: [number, number] = [(W.pt('lima')[0] + W.pt('newyork')[0]) / 2 + 60, (W.pt('lima')[1] + W.pt('newyork')[1]) / 2];
  const mapZoom = 1.9;
  const scr = (p: [number, number]) => [(p[0] - mapFocus[0]) * mapZoom + 960, (p[1] - mapFocus[1]) * mapZoom + 540];
  const lima = scr(W.pt('lima')), ny = scr(W.pt('newyork'));
  return (
    <AbsoluteFill style={{background: INK}}>
      {/* CHAPTER 4 · THE RULES CHANGE */}
      <Shot from={0} to={a(1)}>{(dur) => <Foot src="bf01/clips/floorAerial.mp4" dur={dur} grade="bw" from={1.02} to={1.1} />}</Shot>
      <Shot from={a(1)} to={a(2)}>{(dur) => <Foot src="bf01/clips/nyseExt.mp4" dur={dur} grade="bw" rate={0.8} from={1.04} to={1.12} />}</Shot>
      <Shot from={a(2)} to={a(3)}>{(dur) => <Push dur={dur}>
        <Paper />
        <Doc kicker="COMEX · New York · January 1980" title="Silver futures: new limits on how much one trader can hold"
          lines={['A cap on contracts per trader', 'Effective January 1980']} mark={0} markAt={f(5.2)} />
      </Push>}</Shot>
      <Shot from={a(3)} to={a(4)}>{() => <Calendar head="JAN 1980" from="20" to="21" foot="MONDAY" flipAt={14} />}</Shot>
      <Shot from={a(4)} to={a(6)}>{(dur) => <>
        <Foot src="bf01/clips/floorAerial2.mp4" dur={dur} grade="bw" rate={0.85} from={1.04} to={1.1} />
        <AbsoluteFill style={{background: 'rgba(14,15,17,.45)'}} />
        <Stamp text="LIQUIDATION ONLY" sub="COMEX · 21 JAN 1980" x={560} y={340} at={18} />
        <Tag text="No new buying" x={140} y={820} at={rel(a(5), a(4))} size={44} />
      </>}</Shot>
      <Shot from={a(6)} to={a(9)}>{() => <>
        <Backdrop src="hunt/clips/floorWide.mp4" />
        <Print img="bf01/photos/bunker-sworn.jpg" x={700} y={520} w={470} h={580} tilt={-2.5} at={0} from="left" objectPosition="40% 30%" />
        <Print img="bf01/photos/herbert-sworn.jpg" x={1220} y={560} w={470} h={580} tilt={2.2} at={8} from="right" objectPosition="45% 30%" />
        <Tag text="The Hunts' whole plan" sub="Keep buying" x={140} y={130} at={rel(a(7), a(6))} size={40} />
        <Stamp text="NOT ALLOWED" sub="FROM 21 JAN 1980" x={680} y={700} at={rel(a(8), a(6)) + 34} />
      </>}</Shot>
      <Shot from={a(9)} to={a(11)}>{(dur) => <>
        <Chart data={SLIDE} t0={13} t1={24} vMax={55} toIndex={5} a={8} b={dur - 40}
          xLabels={[{t: 14, text: '14 JAN'}, {t: 17, text: '17 JAN'}, {t: 21, text: '21 JAN'}, {t: 22, text: '22 JAN'}]}
          labels={[{t: 17, v: 49.45, text: 'About $50', at: 16}, {t: 22, v: 34, text: '', at: dur - 30, ring: true}]} />
        <Tag text="22 Jan · About −$10" sub="In a single day" x={860} y={600} at={dur - 26} size={40} />
      </>}</Shot>
      <Shot from={a(11)} to={fed1}>{(dur) => <>
        <Foot src="bf01/clips/printing.mp4" dur={dur} grade="bw" from={1.04} to={1.1} />
        <Tag text="Federal Reserve" sub="Chairman Paul Volcker" x={140} y={820} at={10} size={44} />
      </>}</Shot>
      <Shot from={fed1} to={fed2}>{() => <>
        <Foot src="hunt/clips/floorWide.mp4" dur={f(3.2)} grade="bw" />
        <AbsoluteFill style={{background: 'rgba(14,15,17,.72)'}} />
        <BigNumber value={17} suffix="%" label="U.S. interest rates · spring 1980" sub="Fed funds rate, about" y={330} at={2} len={30} />
      </>}</Shot>
      <Shot from={fed2} to={bank1}>{(dur) => <Foot src="bf01/clips/bankExt.mp4" dur={dur} grade="bw" from={1.02} to={1.08} />}</Shot>
      <Shot from={bank1} to={a(12)}>{(dur) => <>
        <Foot src="bf01/clips/savings.mp4" dur={dur} grade="bw" from={1.04} to={1.1} />
        <Tag text="Banks" sub="Pressed to stop lending to speculators" x={140} y={820} at={4} size={44} />
      </>}</Shot>
      <Shot from={a(12)} to={a(13)}>{(dur) => <Foot src="bf01/clips/check.mp4" dur={dur} grade="bw" rate={0.8} from={1.04} to={1.12} />}</Shot>
      <Shot from={a(13)} to={CH5_AT}>{() => <>
        <Backdrop src="hunt/clips/cash.mp4" dark={0.4} />
        <Stamp text="BORROWED" sub="ON MARGIN" x={700} y={380} at={4} />
      </>}</Shot>

      {/* CHAPTER 5 · SILVER THURSDAY */}
      <Shot from={CH5_AT} to={b(1)}>{(dur) => <Foot src="bf01/clips/phone75.mp4" dur={dur} grade="bw" rate={0.9} from={1.04} to={1.1} />}</Shot>
      <Shot from={b(1)} to={b(3)}>{(dur) => <Push dur={dur}>
        <Paper />
        <Doc kicker="How a margin call works" title="The price falls. Your broker calls. Pay up, or get sold out."
          lines={['Price drops: your loan is less covered', 'Broker asks for more cash']} mark={1} markAt={rel(b(2), b(1)) - 6}
          stamp={<Stamp text="MARGIN CALL" sub="PAY UP" x={780} y={380} at={rel(b(2), b(1)) + 6} />} />
      </Push>}</Shot>
      <Shot from={b(3)} to={b(4)}>{(dur) => <>
        <Chart data={SLIDE} t0={13} t1={90} vMax={55} fromIndex={5} toIndex={11} a={6} b={dur - 8}
          xLabels={[{t: 17, text: 'JAN'}, {t: 46, text: 'FEB'}, {t: 75, text: 'MAR'}]} />
        <Tag text="The calls kept coming" sub="February · March 1980" x={230} y={150} at={12} size={40} />
      </>}</Shot>
      <Shot from={b(4)} to={b(5)}>{() => <Advert wordAt={f(5.4)} />}</Shot>
      <Shot from={b(5)} to={b(6)}>{() => <>
        <Backdrop src="hunt/clips/floorWide.mp4" />
        <Print img="bf01/photos/herbert-sworn.jpg" x={760} y={540} w={560} h={700} tilt={-1.6} at={0} from="up" objectPosition="45% 30%" zoom={0.08} />
        <Tag text="W. Herbert Hunt" sub="We can't meet the calls" x={1110} y={620} at={rel(b(5) + 2.4, b(5))} size={42} />
      </>}</Shot>
      <Shot from={b(6)} to={thu}>{() => <Calendar head="MARCH 1980" from="26" to="27" foot="THURSDAY" flipAt={16} />}</Shot>
      <Shot from={thu} to={b(9)}>{(dur) => <Shake at={rel(crash, thu)} len={18}>
        <Chart data={SLIDE} t0={13} t1={90} vMax={55} fromIndex={11} a={rel(crash, thu)} b={rel(crash, thu) + 14} counter
          xLabels={[{t: 17, text: 'JAN'}, {t: 46, text: 'FEB'}, {t: 75, text: 'MAR'}]}
          labels={[
            {t: 86, v: 21.62, text: '$21.62 · Wed 26 Mar', at: rel(b(7), thu), side: 'l'},
            {t: 87, v: 10.8, text: '$10.80 · Thu 27 Mar', at: rel(crash, thu) + 18, side: 'l', ring: true},
          ]} />
        <Tag text="Half of it" sub="Gone in one day" x={760} y={160} at={Math.min(dur - 20, rel(b(8), thu))} size={56} />
      </Shake>}</Shot>
      <Shot from={b(9)} to={b(10)}>{(dur) => <>
        <Foot src="bf01/clips/huddle.mp4" dur={dur} grade="bw" rate={0.55} from={1.04} to={1.1} />
        <AbsoluteFill style={{background: 'rgba(14,15,17,.6)'}} />
        <BigNumber value={120_000_000} prefix="$" label="Owed to Bache, one of their brokers" sub="About" y={330} at={20} />
      </>}</Shot>
      <Shot from={b(10)} to={b(11)}>{(dur) => <>
        <Foot src="bf01/clips/tickerTape.mp4" dur={dur} grade="bw" trim={4} from={1.02} to={1.06} />
        <Ticker text="TRADING SUSPENDED" sub="BACHE" at={8} />
      </>}</Shot>
      <Shot from={b(11)} to={b(12)}>{(dur) => <>
        <Foot src="bf01/clips/bankExt.mp4" dur={dur} grade="bw" rate={0.9} from={1.08} to={1.16} />
        <Tag text="The fear" sub="It could pull banks down too" x={140} y={820} at={rel(b(11) + 1.6, b(11))} size={44} />
      </>}</Shot>
      <Shot from={b(12)} to={b(13)}>{(dur) => <Foot src="bf01/clips/worried.mp4" dur={dur} grade="bw" rate={0.6} from={1.02} to={1.08} />}</Shot>
      <Shot from={b(13)} to={CH6_AT}>{(dur) => <ChapterTitle dur={dur} kicker="27 MARCH 1980" title="SILVER THURSDAY" />}</Shot>

      {/* CHAPTER 6 · AFTERMATH */}
      <Shot from={CH6_AT} to={loanDoc}>{(dur) => <>
        <Foot src="hunt/clips/pumpjackOld.mp4" dur={dur} grade="bw" from={1.02} to={1.08} />
        <Tag text="Placid Oil" sub="The family's oil company" x={140} y={820} at={14} size={44} />
      </>}</Shot>
      <Shot from={loanDoc} to={c(2)}>{(dur) => <Push dur={dur}>
        <Paper />
        <Doc kicker="Bank loan · 1980" title="About $1 billion to Placid Oil, so the Hunts can pay what they owe"
          lines={['Lenders: a group of U.S. banks', 'Condition: none of it back into silver']} mark={1} markAt={rel(c(1), loanDoc) + 30}
          stamp={<Stamp text="$1.1 BILLION" sub="LOAN · PLACID OIL" x={780} y={390} at={rel(c(0) + 6.2, loanDoc)} />} />
      </Push>}</Shot>
      <Shot from={c(2)} to={c(3)}>{(dur) => <Foot src="bf01/clips/sellWrite.mp4" dur={dur} grade="bw" from={1.04} to={1.1} />}</Shot>
      <Shot from={c(3)} to={c(4)}>{() => (
        <WorldMap focus={mapFocus} zoom={mapZoom} fromZoom={1.3} highlight={['604', '840']} moveLen={40}>
          <Pin at={W.pt('lima')} delay={14} /><Pin at={W.pt('newyork')} delay={40} />
          <Route a={W.pt('lima')} b={W.pt('newyork')} at={30} len={40} bend={-0.2} />
        </WorldMap>
      )}</Shot>
      <Shot from={c(3)} to={c(4)} hard>{() => <>
        <Tag text="Minpeco · Peru" sub="Sues the Hunts" x={lima[0] + 50} y={lima[1] - 30} at={22} size={36} dark />
        <Tag text="New York" sub="Federal court" x={ny[0] + 50} y={ny[1] - 60} at={56} size={36} dark />
        <Stamp text="LIABLE" sub="JURY VERDICT · 1988" x={1180} y={760} at={rel(c(3) + 4.6, c(3))} />
      </>}</Shot>
      <Shot from={c(4)} to={c(5)}>{(dur) => <Push dur={dur}>
        <Paper />
        <Doc kicker="U.S. Bankruptcy Court · 1988" title="Nelson Bunker Hunt and W. Herbert Hunt file for bankruptcy"
          lines={['Chapter 11', 'Among the biggest personal bankruptcies in U.S. history']} mark={1} markAt={f(2.6)}
          stamp={<Stamp text="BANKRUPT" sub="1988" x={880} y={380} at={f(1.2)} />} />
      </Push>}</Shot>
      <Shot from={c(5)} to={c(6)}>{(dur) => <>
        <Foot src="bf01/clips/hooves.mp4" dur={dur} trim={4} grade="bw" from={1.02} to={1.08} />
        <AbsoluteFill style={{background: 'rgba(14,15,17,.35)'}} />
        <Print img="bf01/photos/bunker-1985-horse.jpg" x={1230} y={520} w={760} h={608} tilt={1.8} at={6} from="right" objectPosition="50% 30%" grade="grayscale(1) contrast(1.1)" />
        <Tag text="Bunker's racehorses" sub="Hundreds sold" x={140} y={820} at={16} size={44} />
      </>}</Shot>
      <Shot from={c(6)} to={CH7_AT}>{(dur) => <>
        <Foot src="bf01/clips/floorAerial.mp4" dur={dur} trim={4} grade="bw" from={1.08} to={1.14} />
        <AbsoluteFill style={{background: 'rgba(14,15,17,.5)'}} />
        <Tag text="1989 · Settlement with regulators" x={140} y={140} at={10} size={40} />
        <Stamp text="BANNED" sub="FROM TRADING COMMODITIES" x={620} y={400} at={rel(c(6) + 3.3, c(6))} />
      </>}</Shot>

      {/* CHAPTER 7 · THE LESSON */}
      <Shot from={CH7_AT} to={d(2)}>{(dur) => <Foot src="bf01/clips/silverGlint.mp4" dur={dur} trim={6} grade="warm" crop={1.14} from={1.0} to={1.06} />}</Shot>
      <Shot from={d(2)} to={d(3)}>{(dur) => <>
        <Foot src="bf01/clips/dollarCount.mp4" dur={dur} grade="bw" from={1.02} to={1.08} />
        <Tag text="Inflation" sub="They were right about it" x={140} y={140} at={10} size={46} />
      </>}</Shot>
      {/* hold the two words through the start of the next sentence so they can be read */}
      <Shot from={d(3)} to={d(4) + 3}>{() => <TwoWords first="SIZE" second="DEBT" firstAt={f(1.1)} secondAt={f(1.7)} />}</Shot>
      <Shot from={d(4) + 3} to={d(5)}>{() => <>
        <Backdrop src="hunt/clips/floorWide.mp4" />
        <Print img="bf01/photos/aba-silver.jpg" x={960} y={540} w={1180} h={782} tilt={-1.2} at={0} from="down" objectPosition="50% 50%" zoom={0.08} />
      </>}</Shot>
      <Shot from={d(5)} to={d(8)}>{(dur) => (
        <Chart data={LONG} t0={1974} t1={2028} vMax={75} ticks={[10, 20, 30, 40, 50, 60, 70]} a={rel(d(6), d(5))} b={rel(d(7), d(5)) + 30}
          title="SILVER · US DOLLARS PER OUNCE · APPROXIMATE" years={[1980, 1990, 2000, 2010, 2020]} refs={[{v: 50, text: '$50'}]}
          labels={[
            {t: 1980.05, v: 49.5, text: 'Jan 1980', at: rel(d(6), d(5)) + 8, ring: true},
            {t: 2025.8, v: 52, text: '2025 · Above $50 again', at: rel(d(7), d(5)) + 10, side: 'l', ring: true},
            {t: 2025.95, v: 65.63, text: 'Record · Dec 2025', at: Math.min(dur - 24, rel(d(7), d(5)) + 44), side: 'l'},
          ]} />
      )}</Shot>
      <Shot from={d(8)} to={d(9)}>{(dur) => <>
        <Foot src="bf01/clips/silverCoins.mp4" dur={dur} trim={4} grade="silver" from={1.04} to={1.1} />
        <AbsoluteFill style={{background: 'rgba(14,15,17,.6)'}} />
        <BigNumber value={200} prefix="$" label="The Hunts' $50 silver, in today's money" sub="Roughly" y={330} at={rel(d(8) + 3.4, d(8))} len={30} />
      </>}</Shot>
      <Shot from={d(9)} to={d(11)}>{(dur) => <>
        <Still src="bf01/photos/aba-silver.jpg" dur={dur} grade="grayscale(1) contrast(1.1)" from={1.04} to={1.14} />
        <AbsoluteFill style={{background: 'linear-gradient(transparent 55%, rgba(0,0,0,.6))'}} />
        <Tag text="Geniuses, or too close to the sun?" sub="Tell us in the comments" x={140} y={820} at={rel(d(10), d(9))} size={44} />
      </>}</Shot>
      <Shot from={d(11)} to={END}>{(dur) => <EndCard dur={dur} subAt={rel(d(12) + 1.2, d(11))} />}</Shot>

      <AbsoluteFill style={{background: 'radial-gradient(120% 90% at 50% 50%, transparent 60%, rgba(0,0,0,.45) 100%)', pointerEvents: 'none'}} />
      <AnimatedGrain f={fr * 2} opacity={0.22} />

      {/* SOUND */}
      <Sequence from={f(CH4_AT)} layout="none"><Audio src={staticFile('bf01/vo/05-the-rules-change.wav')} /></Sequence>
      <Sequence from={f(CH5_AT)} layout="none"><Audio src={staticFile('bf01/vo/06-silver-thursday.wav')} /></Sequence>
      <Sequence from={f(CH6_AT)} layout="none"><Audio src={staticFile('bf01/vo/07-aftermath.wav')} /></Sequence>
      <Sequence from={f(CH7_AT)} layout="none"><Audio src={staticFile('bf01/vo/08-so-what-s-the-lesson.wav')} /></Sequence>
      <Audio src={staticFile('bf01/music/184.mp3')} trimBefore={20 * FPS} volume={(x) => 0.22 * lin(x, 0, 40) * (1 - lin(x, f(CH5_AT) - 30, f(CH5_AT)))} />
      <Sequence from={f(CH5_AT) - 10} layout="none">
        {/* drops out for the crash, comes back for the fallout */}
        <Audio src={staticFile('bf01/music/silent-descent.mp3')} volume={(x) => {
          const t = x + f(CH5_AT) - 10;
          return 0.24 * lin(x, 0, 40) * (1 - lin(t, f(crash) - 8, f(crash)) + lin(t, f(b(9)) - 10, f(b(9)) + 30)) * (1 - lin(t, f(CH6_AT) - 30, f(CH6_AT)));
        }} />
      </Sequence>
      <Sequence from={f(CH6_AT) - 10} layout="none">
        <Audio src={staticFile('bf01/music/188.mp3')} trimBefore={60 * FPS} volume={(x) => {
          const t = x + f(CH6_AT) - 10;
          return lin(x, 0, 40) * (t > f(d(11)) ? 0.3 : 0.22) * (1 - lin(t, f(END) - 60, f(END)));
        }} />
      </Sequence>
      {[a(2), a(9), b(1), b(3), c(3), d(5)].map((s, i) => (
        <Sequence key={i} from={Math.max(0, f(s) - 3)} layout="none"><Audio src={staticFile('sfx/foley/whoosh.wav')} volume={0.18} /></Sequence>
      ))}
      {[a(3) + 14 / FPS, b(6) + 16 / FPS].map((s, i) => (
        <Sequence key={i} from={f(s)} layout="none"><Audio src={staticFile('sfx/mechanical/press.mp3')} volume={0.5} /></Sequence>
      ))}
      {[a(4) + 18 / FPS, a(6) + rel(a(8), a(6)) / FPS + 34 / FPS, a(13) + 4 / FPS, b(1) + rel(b(2), b(1)) / FPS + 6 / FPS, c(0) + 6.2, c(3) + 4.6, c(4) + 1.2, c(6) + 3.3].map((s, i) => (
        <Sequence key={i} from={f(s)} layout="none"><Audio src={staticFile('sfx/foley/thump.wav')} volume={0.6} /></Sequence>
      ))}
      <Sequence from={f(crash)} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.7} /></Sequence>
      <Sequence from={f(b(13))} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.6} /></Sequence>
      {/* subscribe button click on the end card (subAt + 40 frames) */}
      <Sequence from={f(d(12) + 1.2) + 40} layout="none"><Audio src={staticFile('sfx/mechanical/press.mp3')} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};

// slow push on a graphic page
const Push: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const fr = useCurrentFrame();
  return <AbsoluteFill style={{transform: `scale(${1 + 0.05 * ease(lin(fr, 0, dur))})`}}>{children}</AbsoluteFill>;
};

// the one screen shake in the video: Silver Thursday
const Shake: React.FC<{at: number; len: number; children: React.ReactNode}> = ({at, len, children}) => {
  const fr = useCurrentFrame();
  const k = fr >= at && fr < at + len ? (1 - (fr - at) / len) * 22 : 0;
  const x = k * Math.sin(fr * 2.7), y = k * Math.cos(fr * 3.3);
  return <AbsoluteFill style={{transform: `translate(${x}px, ${y}px)`}}>{children}</AbsoluteFill>;
};

const ChapterTitle: React.FC<{dur: number; kicker: string; title: string}> = ({dur, kicker, title}) => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Foot src="hunt/clips/molten3.mp4" dur={dur} grade="silver" rate={0.5} from={1.08} to={1.14} />
      <AbsoluteFill style={{background: 'rgba(14,15,17,.62)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center'}}>
        <div style={{font: `500 32px ${MONO}`, letterSpacing: 14, color: SILVER, opacity: lin(fr, 2, 10)}}>{kicker}</div>
        <div style={{font: `400 200px/1 ${ANTON}`, color: '#fff', letterSpacing: 6, marginTop: 24, opacity: lin(fr, 4, 12), transform: `scale(${1.08 - 0.08 * ease(lin(fr, 4, 30))})`}}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const TwoWords: React.FC<{first: string; second: string; firstAt: number; secondAt: number}> = ({first, second, firstAt, secondAt}) => {
  const fr = useCurrentFrame();
  const w = (at: number) => ({opacity: lin(fr, at, at + 4), transform: `scale(${1.25 - 0.25 * ease(lin(fr, at, at + 10))})`});
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', gap: 120, font: `400 260px/1 ${ANTON}`, color: '#fff'}}>
        <span style={w(firstAt)}>{first}</span>
        <span style={{...w(secondAt), color: RED}}>{second}</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 650, textAlign: 'center', font: `600 38px ${SANS}`, letterSpacing: 8, color: SILVER, opacity: lin(fr, secondAt + 10, secondAt + 20)}}>THE REAL MISTAKE</div>
    </AbsoluteFill>
  );
};

// Thanks for watching, then a subscribe button that gets clicked. No brand on the end card.
const EndCard: React.FC<{dur: number; subAt: number}> = ({dur, subAt}) => {
  const fr = useCurrentFrame();
  const pop = fr < subAt ? 0 : ease(lin(fr, subAt, subAt + 12));
  const clickAt = subAt + 40;
  const clicked = fr >= clickAt;
  const cur = ease(lin(fr, subAt + 14, clickAt));
  const press = fr >= clickAt && fr < clickAt + 6 ? 0.94 : 1;
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', transform: `scale(${1 + 0.03 * ease(lin(fr, 0, dur))})`}}>
        <div style={{font: `400 160px/1 ${ANTON}`, color: '#fff', letterSpacing: 6, opacity: lin(fr, 6, 16), transform: `translateY(${(1 - ease(lin(fr, 6, 22))) * 30}px)`}}>THANKS FOR WATCHING</div>
        <div style={{font: `600 38px ${SANS}`, color: SILVER, letterSpacing: 4, marginTop: 34, opacity: lin(fr, subAt - 10, subAt)}}>MORE STORIES FROM THE HISTORY OF MONEY</div>
      </div>
      <div style={{position: 'absolute', left: 960, top: 780, translate: '-50% 0', opacity: pop, transform: `scale(${(0.8 + 0.2 * pop) * press})`,
        background: clicked ? '#3a3d42' : RED, color: clicked ? '#cfd2d6' : '#fff', borderRadius: 60, padding: '26px 64px', font: `700 44px ${SANS}`, letterSpacing: 3, whiteSpace: 'nowrap'}}>
        {clicked ? 'SUBSCRIBED' : 'SUBSCRIBE'}
      </div>
      {pop > 0 && fr < clickAt + 30 && (
        <svg width={60} height={70} viewBox="0 0 24 28" style={{position: 'absolute', left: 1260 - 200 * cur, top: 980 - 120 * cur, opacity: 1 - lin(fr, clickAt + 16, clickAt + 30)}}>
          <path d="M2 1 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.8 L18 15.8 Z" fill="#fff" stroke="#000" strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      )}
      <AbsoluteFill style={{background: INK, opacity: lin(fr, dur - 30, dur)}} />
    </AbsoluteFill>
  );
};
