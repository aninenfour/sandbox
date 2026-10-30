import React from 'react';
import {Composition} from 'remotion';
import {Film, DURATION} from './Film';
import {AltA} from './alt/AltA';
import {AltB} from './alt/AltB';
import {AltC} from './alt/AltC';
import {Orbit, ORBIT_DURATION} from './alt/Orbit';
import {Horizon, HORIZON_DURATION} from './alt/Horizon';
import {Platform, PLATFORM_DURATION} from './platform/Platform';
import {Launch, LAUNCH_DURATION} from './v2/Launch';
import {Meme, MEME_DURATION} from './meme/Meme';
import {Carousel, CAROUSEL_W, CAROUSEL_H} from './referral/Carousel';
import {Uptober, UPTOBER_DURATION} from './uptober/Uptober';
import {Uptober2023, Uptober2024, Uptober2025, UptoberSoFar} from './uptober/UptoberSoFar';
import {StardropDNA} from './stardrop/Stardrop';
import {Rowing, ROWING_DURATION} from './rowing/Rowing';
import {Guess} from './guess/Guess';
import {GoldRush, GOLDRUSH_DURATION} from './goldrush/GoldRush';
import {T49, T49_DURATION} from './t49/T49';
import {TradeCarousel, TRADE_W, TRADE_H} from './trade/TradeCarousel';
import {History, HIST_DURATION} from './hist/History';
import {Raccoon} from './raccoon/Raccoon';
import {Live, LIVE_W, LIVE_H, SHOTS} from './live/Live';
import {StoryCollage, STORIES, STORY_W, STORY_H} from './live/Story';
import {ReplyPoster} from './promo/ReplyPoster';
import {Shine, SHINE_DURATION} from './shine/Shine';
import {Wrap, WRAP_DURATION} from './wrap/Wrap';
import {ReserveCard} from './reserve/Reserve';
import {CollabWrap, WRAP2_DURATION, WRAP2_FPS} from './wrap2/CollabWrap';
import {PhoneShot} from './promo4/PhoneShot';
import {LeaderboardShot} from './promo4/LeaderboardShot';
import {ChartShot} from './promo4/ChartShot';
import {CoinShot} from './promo4/CoinShot';
import {GuessMeme3D} from './guess2/GuessMeme3D';
import {MemeRiddle} from './riddle/MemeRiddle';
import {ScaryStories, ScaryStoriesTall, ScaryThumb, ScaryThumbTall, SCARY_DURATION} from './halloween/ScaryStories';
import {ScaryStories2, ScaryStories2Tall, ScaryThumb2, ScaryThumb2Tall, SCARY2_DURATION} from './halloween/ScaryStories2';
import {HalloweenGiveaway} from './halloween/Giveaway';
import {ScaryStories3, ScaryStories3Tall, ScaryThumb3, ScaryThumb3Tall, SCARY3_DURATION} from './halloween/ScaryStories3';
import {ScaryStories4, ScaryStories4Tall, ScaryThumb4, ScaryThumb4Tall, SCARY4_DURATION} from './halloween/ScaryStories4';
import {ScaryStories5, ScaryStories5Tall, ScaryThumb5, ScaryThumb5Tall, SCARY5_DURATION} from './halloween/ScaryStories5';
import {AuraEdit, AURA_DURATION} from './aura/AuraEdit';
import {GuessMeme} from './guess2/GuessMeme';
import {EthMaintenance, ZanoResume} from './notice/Notice';
import {Style2Logo, Style2TradFi, Style2Next90} from './style2/Style2';
import {PolicyMoney, PolicyMoves, PolicyOdds, PolicyVote} from './policy26/PolicyPulse';
import {R10Teaser, R10_DURATION, R10_FPS} from './r10/R10Teaser';
import {ChainBase, ChainDex, ChainStables, ChainPeak} from './chains26/ChainPulse';
import {GMFilm, GM_DURATION, GM_FPS} from './gm/GM';
import {IPhone1, IPhone2, IPhone3, IPhone4} from './iphone/IPhoneSeason';
import {MemeLiteSeason, MemeLiteHotcoin, MemeLiteSignals, MemeLitePeak} from './memes26/MemeLite';
import {SnapFilm, SNAP_DURATION, SNAP_FPS} from './ascii/Snap';
import {FeaturesFilm, FEATURES_DURATION} from './ascii/Features';
import {AsciiFilm, ASCII_DURATION, ASCII_FPS} from './ascii/AsciiFilm';
import {MemeSeason, MemeHotList} from './memes26/MemePulse';
import {FigQueue, FigBagTweets, FigMatryoshka, FigBalloon, FigMaterials, FigVizor, FigUS, FigFaces, FigTeamPhotos, FigAdvocacy, FigSideEvents, FIG_W} from './review/Figures';

export const Root: React.FC = () => (
  <>
    <Composition id="TradFi-4x5" component={Film} durationInFrames={DURATION} fps={60} width={1080} height={1350} defaultProps={{square: false}} />
    <Composition id="TradFi-9x16" component={Film} durationInFrames={DURATION} fps={60} width={1080} height={1920} defaultProps={{square: false}} />
    <Composition id="TradFi-1x1" component={Film} durationInFrames={DURATION} fps={60} width={1080} height={1080} defaultProps={{square: true}} />
    <Composition id="Alt-A-Orbit" component={AltA} durationInFrames={120} fps={60} width={1080} height={1350} />
    <Composition id="Alt-B-Halftone" component={AltB} durationInFrames={120} fps={60} width={1080} height={1350} />
    <Composition id="Alt-C-Horizon" component={AltC} durationInFrames={120} fps={60} width={1080} height={1350} />
    <Composition id="Orbit-4x5" component={Orbit} durationInFrames={ORBIT_DURATION} fps={60} width={1080} height={1350} />
    <Composition id="Horizon-4x5" component={Horizon} durationInFrames={HORIZON_DURATION} fps={60} width={1080} height={1350} />
    <Composition id="Platform-4x5" component={Platform} durationInFrames={PLATFORM_DURATION} fps={60} width={1080} height={1350} />
    <Composition id="Launch-4x5" component={Launch} durationInFrames={LAUNCH_DURATION} fps={60} width={1080} height={1350} />
    {SHOTS.map((sh, i) => <Composition key={i} id={`Live-${i + 1}`} component={Live} defaultProps={{i}} durationInFrames={1} fps={30} width={sh.w ?? LIVE_W} height={sh.h ?? LIVE_H} />)}
    {STORIES.map((_, i) => <Composition key={'st' + i} id={`Story-${i + 1}`} component={StoryCollage} defaultProps={{i}} durationInFrames={1} fps={30} width={STORY_W} height={STORY_H} />)}
    <Composition id="Shine-9x16" component={Shine} durationInFrames={SHINE_DURATION} fps={60} width={1080} height={1920} />
    <Composition id="Shine-4x5" component={Shine} durationInFrames={SHINE_DURATION} fps={60} width={1080} height={1350} />
    <Composition id="Wrap-9x16" component={Wrap} durationInFrames={WRAP_DURATION} fps={60} width={1080} height={1920} />
    <Composition id="Wrap-4x5" component={Wrap} durationInFrames={WRAP_DURATION} fps={60} width={1080} height={1350} />
    <Composition id="Ascii-16x9" component={AsciiFilm} durationInFrames={ASCII_DURATION} fps={ASCII_FPS} width={1920} height={1080} defaultProps={{open: "symbol"}} />
    <Composition id="Features-16x9" component={FeaturesFilm} durationInFrames={FEATURES_DURATION} fps={ASCII_FPS} width={1920} height={1080} />
    <Composition id="Snap-16x9" component={SnapFilm} durationInFrames={SNAP_DURATION} fps={SNAP_FPS} width={1920} height={1080} />
    <Composition id="Ascii-open-ball" component={AsciiFilm} durationInFrames={ASCII_FPS * 11} fps={ASCII_FPS} width={1920} height={1080} defaultProps={{open: "ball"}} />
    <Composition id="Ascii-open-noise" component={AsciiFilm} durationInFrames={ASCII_FPS * 11} fps={ASCII_FPS} width={1920} height={1080} defaultProps={{open: "noise"}} />
    <Composition id="MemeSeason" component={MemeSeason} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="MemeHotList" component={MemeHotList} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="MemeLiteSeason" component={MemeLiteSeason} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="MemeLiteHotcoin" component={MemeLiteHotcoin} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="MemeLiteSignals" component={MemeLiteSignals} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="MemeLitePeak" component={MemeLitePeak} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="CollabWrap-16x9" component={CollabWrap} durationInFrames={WRAP2_DURATION} fps={WRAP2_FPS} width={1920} height={1080} />
    <Composition id="GM-16x9" component={GMFilm} durationInFrames={GM_DURATION} fps={GM_FPS} width={1920} height={1080} />
    <Composition id="ChainBase" component={ChainBase} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="ChainDex" component={ChainDex} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="ChainStables" component={ChainStables} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="ChainPeak" component={ChainPeak} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="R10Teaser" component={R10Teaser} durationInFrames={R10_DURATION} fps={R10_FPS} width={1920} height={1080} />
    <Composition id="PolicyMoney" component={PolicyMoney} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="PolicyMoves" component={PolicyMoves} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="PolicyOdds" component={PolicyOdds} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="PolicyVote" component={PolicyVote} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="HalloweenGiveaway" component={HalloweenGiveaway} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="ScaryStories3" component={ScaryStories3} durationInFrames={SCARY3_DURATION} fps={30} width={1080} height={1350} />
    <Composition id="ScaryStories3-9x16" component={ScaryStories3Tall} durationInFrames={SCARY3_DURATION} fps={30} width={1080} height={1920} />
    <Composition id="ScaryStories4" component={ScaryStories4} durationInFrames={SCARY4_DURATION} fps={30} width={1080} height={1350} />
    <Composition id="ScaryStories4-9x16" component={ScaryStories4Tall} durationInFrames={SCARY4_DURATION} fps={30} width={1080} height={1920} />
    <Composition id="ScaryThumb4" component={ScaryThumb4} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="ScaryThumb4-9x16" component={ScaryThumb4Tall} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="ScaryStories5" component={ScaryStories5} durationInFrames={SCARY5_DURATION} fps={30} width={1080} height={1350} />
    <Composition id="ScaryStories5-9x16" component={ScaryStories5Tall} durationInFrames={SCARY5_DURATION} fps={30} width={1080} height={1920} />
    <Composition id="ScaryThumb5" component={ScaryThumb5} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="ScaryThumb5-9x16" component={ScaryThumb5Tall} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="AuraEdit" component={AuraEdit} durationInFrames={AURA_DURATION} fps={30} width={1080} height={1920} />
    <Composition id="ScaryThumb3" component={ScaryThumb3} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="ScaryThumb3-9x16" component={ScaryThumb3Tall} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="ScaryStories2" component={ScaryStories2} durationInFrames={SCARY2_DURATION} fps={30} width={1080} height={1350} />
    <Composition id="ScaryStories2-9x16" component={ScaryStories2Tall} durationInFrames={SCARY2_DURATION} fps={30} width={1080} height={1920} />
    <Composition id="ScaryThumb2" component={ScaryThumb2} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="ScaryThumb2-9x16" component={ScaryThumb2Tall} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="ScaryStories" component={ScaryStories} durationInFrames={SCARY_DURATION} fps={30} width={1080} height={1350} />
    <Composition id="ScaryThumb" component={ScaryThumb} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="ScaryStories-9x16" component={ScaryStoriesTall} durationInFrames={SCARY_DURATION} fps={30} width={1080} height={1920} />
    <Composition id="ScaryThumb-9x16" component={ScaryThumbTall} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="MemeRiddle" component={MemeRiddle} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="Style2Logo" component={Style2Logo} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="Style2TradFi" component={Style2TradFi} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="Style2Next90" component={Style2Next90} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="EthMaintenance" component={EthMaintenance} durationInFrames={1} fps={30} width={1600} height={900} />
    <Composition id="GuessMeme" component={GuessMeme} durationInFrames={1} fps={30} width={1080} height={1080} />
    <Composition id="GuessMeme3D" component={GuessMeme3D} durationInFrames={1} fps={30} width={1080} height={1080} />
    <Composition id="ZanoResume" component={ZanoResume} durationInFrames={1} fps={30} width={1600} height={900} />
    <Composition id="P4Coin" component={CoinShot} durationInFrames={410} fps={60} width={1920} height={1080} />
    <Composition id="P4Phone" component={PhoneShot} durationInFrames={400} fps={60} width={1920} height={1080} />
    <Composition id="P4Leaders" component={LeaderboardShot} durationInFrames={400} fps={60} width={1920} height={1080} />
    <Composition id="P4Chart" component={ChartShot} durationInFrames={400} fps={60} width={1920} height={1080} />
    <Composition id="ReserveCard" component={ReserveCard} durationInFrames={1} fps={30} width={1600} height={900} />
    <Composition id="ReserveCard-zh" component={ReserveCard} durationInFrames={1} fps={30} width={1600} height={900} defaultProps={{lang: "zh"}} />
    <Composition id="ReserveCard-vi" component={ReserveCard} durationInFrames={1} fps={30} width={1600} height={900} defaultProps={{lang: "vi"}} />
    {[IPhone1, IPhone2, IPhone3, IPhone4].map((C, i) => <Composition key={"iph" + i} id={`IPhone-${i + 1}`} component={C} durationInFrames={1} fps={30} width={1080} height={1350} />)}
    <Composition id="Fig-queue" component={FigQueue} durationInFrames={1} fps={30} width={FIG_W} height={940} />
    <Composition id="Fig-bagtweets" component={FigBagTweets} durationInFrames={1} fps={30} width={FIG_W} height={1260} />
    <Composition id="Fig-matryoshka" component={FigMatryoshka} durationInFrames={1} fps={30} width={FIG_W} height={1100} />
    <Composition id="Fig-balloon" component={FigBalloon} durationInFrames={1} fps={30} width={FIG_W} height={1000} />
    <Composition id="Fig-materials" component={FigMaterials} durationInFrames={1} fps={30} width={FIG_W} height={1000} />
    <Composition id="Fig-vizor" component={FigVizor} durationInFrames={1} fps={30} width={FIG_W} height={840} />
    <Composition id="Fig-us" component={FigUS} durationInFrames={1} fps={30} width={FIG_W} height={990} />
    <Composition id="Fig-faces" component={FigFaces} durationInFrames={1} fps={30} width={FIG_W} height={960} />
    <Composition id="Fig-teamphotos" component={FigTeamPhotos} durationInFrames={1} fps={30} width={FIG_W} height={800} />
    <Composition id="Fig-advocacy" component={FigAdvocacy} durationInFrames={1} fps={30} width={FIG_W} height={900} />
    <Composition id="Fig-sideevents" component={FigSideEvents} durationInFrames={1} fps={30} width={FIG_W} height={880} />
    <Composition id="ReplyPoster" component={ReplyPoster} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="Raccoon" component={Raccoon} durationInFrames={1} fps={30} width={1440} height={1882} />
    <Composition id="History-9x16" component={History} durationInFrames={HIST_DURATION} fps={60} width={1080} height={1920} />
    <Composition id="History-4x5" component={History} durationInFrames={HIST_DURATION} fps={60} width={1080} height={1350} />
    <Composition id="Trade-Carousel" component={TradeCarousel} durationInFrames={1} fps={30} width={TRADE_W} height={TRADE_H} />
    <Composition id="T49-9x16" component={T49} durationInFrames={T49_DURATION} fps={60} width={1080} height={1920} />
    <Composition id="T49-4x5" component={T49} durationInFrames={T49_DURATION} fps={60} width={1080} height={1350} />
    <Composition id="GoldRush-4x5" component={GoldRush} durationInFrames={GOLDRUSH_DURATION} fps={60} width={1080} height={1350} />
    <Composition id="GoldRush-9x16" component={GoldRush} durationInFrames={GOLDRUSH_DURATION} fps={60} width={1080} height={1920} />
    <Composition id="Guess-1x1" component={Guess} durationInFrames={1} fps={30} width={1080} height={1080} />
    <Composition id="Rowing-9x16" component={Rowing} durationInFrames={ROWING_DURATION} fps={30} width={720} height={1280} />
    <Composition id="Uptober-4x5" component={Uptober} durationInFrames={UPTOBER_DURATION} fps={30} width={1080} height={1350} />
    <Composition id="Uptober2023" component={Uptober2023} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="Uptober2024" component={Uptober2024} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="Uptober2025" component={Uptober2025} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="StardropDNA" component={StardropDNA} durationInFrames={1} fps={30} width={1600} height={900} />
    <Composition id="UptoberSoFar" component={UptoberSoFar} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="Referral-Carousel" component={Carousel} durationInFrames={1} fps={60} width={CAROUSEL_W} height={CAROUSEL_H} />
    <Composition id="Meme-4x5" component={Meme} durationInFrames={MEME_DURATION} fps={60} width={1080} height={1350} />
  </>
);
