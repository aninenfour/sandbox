// Bubble Files 01 · Part 2: chapter 2 ("Why silver") and chapter 3 ("The squeeze"), ending on the cliffhanger before the ad.
// Same building blocks as Part 1; shots are locked to sentences in public/bf01/vo/timeline.json.
// Facts: Executive Order 6102 (5 Apr 1933) and gold ownership legal again from 31 Dec 1974; silver ~$1.95 in 1973;
// ~50M oz by early 1974; IMIC with Saudi investors in 1979; COMEX silver contract = 5,000 oz; $34.45 on 31 Dec 1979;
// ~195M oz with partners by 1 Jan 1980, about half in futures; above $50 in Jan 1980.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {AnimatedGrain} from '../alt/kit';
import {Backdrop, FPS, Foot, INK, Paper, Print, Shot, Stamp, Tag, f, lin, useFonts} from './Part1';
import {BigNumber, Calendar, Chart, Doc, Pin, Route, Span, Still, W, WorldMap} from './gfx';
import TL from '../../public/bf01/vo/timeline.json';

const C2 = TL[2], C3 = TL[3];
const CH2_AT = 0.4;
const CH3_AT = CH2_AT + C2.dur + 0.5;
const END = CH3_AT + C3.dur + 0.4;
export const PART2_DURATION = Math.round(END * FPS);
const a = (i: number) => CH2_AT + C2.sentences[i].start;
const b = (i: number) => CH3_AT + C3.sentences[i].start;
const rel = (s: number, from: number) => f(s - from);

// Silver, Jan 1979 to the Jan 1980 peak (fractional years)
const CLIMB: [number, number][] = [[1979.0, 6.1], [1979.17, 6.9], [1979.33, 7.6], [1979.5, 8.6], [1979.62, 9.6], [1979.7, 13.5], [1979.77, 16.8], [1979.86, 17.4], [1979.93, 22], [1980.0, 34.45], [1980.047, 49.5]];

export const BF01Part2: React.FC = () => {
  useFonts();
  const fr = useCurrentFrame();
  const jetEnd = a(10) + 2.4, mapEnd = a(10) + 5.0;
  const saudiEnd = b(2) + 4.6;
  return (
    <AbsoluteFill style={{background: INK}}>
      {/* CHAPTER 2 · WHY SILVER */}
      <Shot from={0} to={a(1)}>{(d) => <Still src="bf01/photos/gold-bars.jpg" dur={d} grade="contrast(1.08) saturate(0.85)" />}</Shot>
      <Shot from={a(1)} to={a(3)}>{() => <>
        <Paper />
        <Doc kicker="Executive Order 6102 · 5 April 1933" title="Forbidding the Hoarding of Gold Coin, Gold Bullion and Gold Certificates"
          lines={['All persons are hereby required to deliver on or before', 'May 1, 1933, to a Federal Reserve Bank', 'all gold coin, gold bullion and gold certificates', 'now owned by them...']}
          mark={2} markAt={14} y={460} />
        <Sequence from={rel(a(2), a(1))} layout="none"><SpanLayer /></Sequence>
      </>}</Shot>
      <Shot from={a(3)} to={a(6)}>{(d) => <>
        <Foot src="bf01/clips/silverCoins.mp4" dur={d} grade="silver" from={1.02} to={1.1} />
        <Tag text="Silver" sub="Legal to own" x={140} y={140} at={rel(a(4), a(3))} size={52} />
      </>}</Shot>
      <Shot from={a(6)} to={a(7)}>{(d) => <>
        <Still src="bf01/photos/silver-bars.jpg" dur={d} grade="grayscale(.5) contrast(1.1) brightness(.8)" />
        <Tag text="Silver · 1973" sub="About $2 an ounce" x={140} y={140} at={10} size={52} />
      </>}</Shot>
      <Shot from={a(7)} to={a(9)}>{(d) => <Foot src="bf01/clips/coinsMacro.mp4" dur={d} grade="silver" from={1.0} to={1.18} />}</Shot>
      <Shot from={a(9)} to={a(10)}>{(d) => <>
        <Paper />
        <Doc kicker="Silver futures · New York" title="A promise to deliver 5,000 ounces of silver, later"
          lines={['Most traders: settle in cash', 'The Hunts: take the actual metal']} mark={1} markAt={Math.max(10, d - 40)} y={520}
          stamp={<Stamp text="DELIVER IT" sub="THE REAL METAL" x={760} y={300} at={Math.max(14, d - 30)} />} />
      </>}</Shot>
      <Shot from={a(10)} to={jetEnd}>{(d) => <>
        <Foot src="bf01/clips/jet.mp4" dur={d} trim={3} grade="bw" from={1.04} to={1.1} />
        <Tag text="Chartered jets" sub="1973 to 1974 · reportedly" x={140} y={820} at={8} size={40} />
      </>}</Shot>
      <Shot from={jetEnd} to={mapEnd}>{() => (
        <WorldMap focus={[(W.pt('dallas')[0] + W.pt('zurich')[0]) / 2, 330]} zoom={2.0} fromZoom={1.4} moveLen={40}>
          <Pin at={W.pt('dallas')} /><Pin at={W.pt('zurich')} delay={30} />
          <Route a={W.pt('dallas')} b={W.pt('zurich')} at={6} len={44} bend={0.22} />
        </WorldMap>
      )}</Shot>
      <Shot from={jetEnd} to={mapEnd} hard>{() => <>
        <Tag text="Texas" x={380} y={640} at={10} size={36} dark />
        <Tag text="Swiss vaults" x={1240} y={420} at={48} size={36} dark />
      </>}</Shot>
      <Shot from={mapEnd} to={a(11)}>{(d) => <>
        <Foot src="bf01/clips/cowboyHorse.mp4" dur={d} trim={1} grade="bw" from={1.02} to={1.1} />
        <Tag text="Armed cowboys as guards" sub="Reportedly" x={140} y={820} at={8} size={40} />
      </>}</Shot>
      <Shot from={a(11)} to={a(12)}>{(d) => <>
        <Foot src="bf01/clips/vault.mp4" dur={d} grade="bw" rate={0.6} from={1.04} to={1.1} />
        <AbsoluteFill style={{background: 'rgba(14,15,17,.5)'}} />
        <BigNumber value={50_000_000} suffix=" oz" label="Bunker & Herbert Hunt" sub="Early 1974" />
      </>}</Shot>
      <Shot from={a(12)} to={CH3_AT}>{(d) => <Foot src="bf01/clips/alps.mp4" dur={d} grade="bw" from={1.02} to={1.08} />}</Shot>

      {/* CHAPTER 3 · THE SQUEEZE */}
      <Shot from={CH3_AT} to={b(1)}>{() => <Calendar head="FAST FORWARD" from="1974" to="1979" flipAt={18} />}</Shot>
      <Shot from={b(1)} to={b(2)}>{(d) => <>
        <Foot src="bf01/clips/dollarCount.mp4" dur={d} grade="bw" from={1.02} to={1.1} />
        <Tag text="U.S. inflation" sub="Double digits · 1979" x={140} y={140} at={10} size={46} />
      </>}</Shot>
      <Shot from={b(2)} to={saudiEnd}>{() => (
        <WorldMap focus={W.pt('riyadh')} zoom={3.2} fromFocus={W.pt('zurich')} fromZoom={1.8} highlight={['682']} moveLen={44}>
          <Pin at={W.pt('riyadh')} delay={40} />
        </WorldMap>
      )}</Shot>
      <Shot from={b(2)} to={saudiEnd} hard>{() => <Tag text="Saudi investors" sub="Partners with the Hunts · 1979" x={1060} y={600} at={50} size={40} />}</Shot>
      <Shot from={saudiEnd} to={b(3)}>{(d) => <>
        <Foot src="hunt/clips/floorWide.mp4" dur={d} grade="bw" from={1.0} to={1.08} />
        <Tag text="Futures" sub="A promise to receive silver later" x={140} y={820} at={10} size={44} />
      </>}</Shot>
      <Shot from={b(3)} to={b(4)}>{(d) => <Foot src="hunt/clips/agBoard.mp4" dur={d} grade="bw" from={1.02} to={1.1} />}</Shot>
      <Shot from={b(4)} to={b(5)}>{(d) => <>
        <Foot src="bf01/clips/dollarHands.mp4" dur={d} grade="bw" from={1.02} to={1.08} />
        <Tag text="Most traders" sub="Settle in cash" x={140} y={820} at={8} size={44} />
      </>}</Shot>
      <Shot from={b(5)} to={b(6)}>{(d) => <>
        <Still src="bf01/photos/silver-bars.jpg" dur={d} grade="grayscale(.5) contrast(1.1) brightness(.85)" />
        <Tag text="The Hunts" sub="Take the actual silver" x={140} y={820} at={8} size={44} />
      </>}</Shot>
      <Shot from={b(6)} to={b(7)}>{(d) => <>
        <Foot src="bf01/clips/coinsBlack.mp4" dur={d} trim={9} grade="bw" from={1.0} to={1.1} />
        <Tag text="Not enough real metal" x={140} y={140} at={20} size={44} />
      </>}</Shot>
      <Shot from={b(7)} to={b(12)}>{() => (
        <Chart data={CLIMB} t0={1979} t1={1980.1} vMax={55} years={[1979, 1980]} counter toIndex={9}
          a={rel(b(8), b(7)) - 4} b={rel(b(11), b(7)) + 20}
          labels={[
            {t: 1979.0, v: 6.1, text: '$6', at: rel(b(8), b(7))},
            {t: 1979.66, v: 10, text: '$10', at: rel(b(9), b(7)), side: 'l'},
            {t: 1979.92, v: 20.5, text: '$20', at: rel(b(10), b(7)), side: 'l'},
            {t: 1980.0, v: 34.45, text: '$34.45 · 31 Dec 1979', at: rel(b(11), b(7)) + 24, side: 'l', ring: true},
          ]} />
      )}</Shot>
      <Shot from={b(12)} to={b(13)}>{(d) => <>
        <Foot src="bf01/clips/silverCoins.mp4" dur={d} trim={8} grade="silver" from={1.04} to={1.1} />
        <AbsoluteFill style={{background: 'rgba(14,15,17,.55)'}} />
        <BigNumber value={195_000_000} suffix=" oz" label="The Hunts and partners · 1 Jan 1980" sub="About half in futures" y={330} />
      </>}</Shot>
      <Shot from={b(13)} to={b(14)}>{() => (
        <Chart data={CLIMB} t0={1979} t1={1980.1} vMax={55} years={[1979, 1980]} counter fromIndex={9}
          a={4} b={40}
          labels={[{t: 1980.047, v: 49.5, text: '$50 · Jan 1980', at: 42, side: 'l', ring: true}]} />
      )}</Shot>
      <Shot from={b(14)} to={b(15)}>{(d) => <Foot src="bf01/clips/silverChest.mp4" dur={d} trim={8} grade="warm" crop={1.14} />}</Shot>
      <Shot from={b(15)} to={b(15) + 2.8}>{(d) => <Foot src="bf01/clips/silverGlint.mp4" dur={d} trim={2} grade="warm" crop={1.14} from={1.0} to={1.08} />}</Shot>
      <Shot from={b(15) + 2.8} to={b(16)}>{(d) => <Foot src="hunt/clips/molten3.mp4" dur={d} grade="silver" rate={0.5} from={1.06} to={1.14} />}</Shot>
      <Shot from={b(16)} to={END}>{(d) => <>
        <Backdrop src="hunt/clips/floorWide.mp4" />
        <Print img="bf01/photos/aba-silver.jpg" x={960} y={540} w={1180} h={782} tilt={-1.2} at={0} from="down" objectPosition="50% 50%" zoom={0.08} />
        <AbsoluteFill style={{background: INK, opacity: lin(useCurrentFrame(), d - 16, d)}} />
      </>}</Shot>

      <AbsoluteFill style={{background: 'radial-gradient(120% 90% at 50% 50%, transparent 60%, rgba(0,0,0,.45) 100%)', pointerEvents: 'none'}} />
      <AnimatedGrain f={fr * 2} opacity={0.22} />

      {/* SOUND */}
      <Sequence from={f(CH2_AT)} layout="none"><Audio src={staticFile('bf01/vo/02-why-silver.wav')} /></Sequence>
      <Sequence from={f(CH3_AT)} layout="none"><Audio src={staticFile('bf01/vo/03-the-squeeze.wav')} /></Sequence>
      <Audio src={staticFile('bf01/music/188.mp3')} trimBefore={95 * FPS} volume={(x) => 0.24 * lin(x, 0, 40) * (1 - lin(x, f(CH3_AT) - 30, f(CH3_AT)))} />
      <Sequence from={f(CH3_AT) - 10} layout="none">
        <Audio src={staticFile('bf01/music/565.mp3')} trimBefore={10 * FPS} volume={(x) => 0.24 * lin(x, 0, 40) * (1 - lin(x, f(END - CH3_AT) - 50, f(END - CH3_AT)))} />
      </Sequence>
      {[a(1), a(3), a(10), jetEnd, b(2), b(7), b(13)].map((s, i) => (
        <Sequence key={i} from={Math.max(0, f(s) - 3)} layout="none"><Audio src={staticFile('sfx/foley/whoosh.wav')} volume={0.18} /></Sequence>
      ))}
      <Sequence from={f(CH3_AT) + 18} layout="none"><Audio src={staticFile('sfx/mechanical/press.mp3')} volume={0.5} /></Sequence>
      <Sequence from={f(b(13)) + 42} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};

const SpanLayer: React.FC = () => <Span from="1933" to="31 Dec 1974" label="Gold bullion off-limits for Americans" at={4} y={930} />;
