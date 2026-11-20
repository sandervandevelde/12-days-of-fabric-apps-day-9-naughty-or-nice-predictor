//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, Gift, Moon, Snowflake, Sparkles, Sun } from 'lucide-react';
import { useAppTheme } from '@/hooks/use-theme';
import { drawQuestions, getOdds, predict, questions, symbols, type List, type ReelSymbol } from './holiday-game';
import { ReelArt } from './ReelArt';

const startingReels: ReelSymbol[] = ['tree', 'gift', 'bell'];
const durations = [1100, 1500, 1900];
const tokenMime = 'application/x-north-pole-token';
const lists = ['naughty', 'nice'] as const;

function Star({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c1.6 8.3 3.7 10.4 12 12-8.3 1.6-10.4 3.7-12 12C10.4 15.7 8.3 13.6 0 12 8.3 10.4 10.4 8.3 12 0Z" /></svg>;
}

function Forest() {
  return (
    <div className="arcade-scenery" aria-hidden="true">
      <Star className="sky-star sky-one" /><Star className="sky-star sky-two" />
      <Star className="sky-star sky-three" /><Star className="sky-star sky-four" />
      <svg viewBox="0 0 1200 350" preserveAspectRatio="xMidYMax slice" className="forest">
        <defs>
          <path id="pine" d="M60 0 27 60h16L17 102h19L5 150h45v25h20v-25h45l-31-48h19L77 60h16Z" />
        </defs>
        <g className="forest-back">
          <use href="#pine" transform="translate(-40 174) scale(1.05)" /><use href="#pine" transform="translate(82 202) scale(.8)" />
          <use href="#pine" transform="translate(189 225) scale(.68)" /><use href="#pine" transform="translate(886 224) scale(.68)" />
          <use href="#pine" transform="translate(986 189) scale(.94)" /><use href="#pine" transform="translate(1128 165) scale(1.1)" />
        </g>
        <g className="forest-front">
          <use href="#pine" transform="translate(30 145) scale(1.25)" /><use href="#pine" transform="translate(-54 228) scale(.78)" />
          <use href="#pine" transform="translate(128 250) scale(.65)" /><use href="#pine" transform="translate(1048 151) scale(1.2)" />
          <use href="#pine" transform="translate(983 251) scale(.64)" /><use href="#pine" transform="translate(1155 228) scale(.78)" />
        </g>
      </svg>
    </div>
  );
}

function Reel({ start, finish, index }: { start: ReelSymbol; finish?: ReelSymbol; index: number }) {
  const strip = finish
    ? [start, ...Array.from({ length: 19 + index * 6 }, (_, i) => symbols[(i + index * 2) % symbols.length]), finish]
    : [start];

  return (
    <div className="reel-window" aria-hidden="true">
      <div className="reel-strip" data-rolling={Boolean(finish)} style={{ '--travel': strip.length - 1, '--reel-time': `${durations[index]}ms` } as CSSProperties}>
        {strip.map((symbol, i) => <div className="reel-tile" key={i}><ReelArt symbol={symbol} /></div>)}
      </div>
    </div>
  );
}

function ResultEffect({ result }: { result: List }) {
  return (
    <div className="result-effect" data-result={result} aria-hidden="true">
      {Array.from({ length: result === 'nice' ? 18 : 10 }, (_, i) => (
        <i key={i} style={{
          '--particle-x': `${(i % 2 ? -1 : 1) * (45 + (i * 43) % 225)}px`,
          '--particle-y': `${-35 - (i * 37) % 130}px`,
          '--particle-rotation': `${i * 79}deg`,
          '--particle-delay': `${(i % 5) * 35}ms`,
        } as CSSProperties} />
      ))}
    </div>
  );
}

function App() {
  const { isDark, toggleTheme } = useAppTheme();
  const [phase, setPhase] = useState<'token' | 'ready' | 'spinning' | 'result'>('token');
  const [selection, setSelection] = useState<List | null>(null);
  const [pair, setPair] = useState(drawQuestions);
  const [reels, setReels] = useState(startingReels);
  const [pending, setPending] = useState<List | null>(null);
  const [result, setResult] = useState<List | null>(null);
  const [round, setRound] = useState(0);
  const [draggingToken, setDraggingToken] = useState(false);
  const [leverTravel, setLeverTravel] = useState(0);
  const pullStart = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lever = useRef<HTMLButtonElement>(null);
  const token = useRef<HTMLButtonElement>(null);
  const finishSymbol = pending === 'nice' ? 'gift' : 'coal';
  const hasToken = phase === 'token' || phase === 'result';

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (phase === 'ready') lever.current?.focus({ preventScroll: true });
    if (phase === 'result' && (document.activeElement === document.body || document.activeElement === lever.current)) {
      token.current?.focus({ preventScroll: true });
    }
  }, [phase]);

  function insertToken() {
    if (!hasToken) return;
    setDraggingToken(false);
    setResult(null);
    setPhase('ready');
  }

  function spin() {
    if (phase !== 'ready' || timer.current !== null) return;
    const outcome = predict(selection);
    const symbol = outcome === 'nice' ? 'gift' : 'coal';
    setPending(outcome);
    setPhase('spinning');
    timer.current = setTimeout(() => {
      timer.current = null;
      setReels([symbol, symbol, symbol]);
      setPending(null);
      setResult(outcome);
      setSelection(null);
      setPair((previous) => drawQuestions(previous));
      setRound((previous) => previous + 1);
      setPhase('result');
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 140 : durations[2] + 70);
  }

  const status = phase === 'spinning' ? 'Checking the list…' : phase === 'ready' ? 'Ready to pull!' : 'Insert a token';
  const odds = getOdds(selection);

  return (
    <div className="arcade">
      <Forest />
      <header className="arcade-header">
        <div className="arcade-brand"><span className="brand-mark"><Snowflake className="icon-size-300" /></span> North Pole <span>Arcade</span></div>
        <button type="button" className="theme-control" onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          {isDark ? <Sun className="icon-size-300" /> : <Moon className="icon-size-300" />}
        </button>
      </header>

      <main className="arcade-main">
        <section className="arcade-intro" aria-labelledby="arcade-title">
          <div className="arcade-kicker"><Star /> THE HOLIDAY EDITION <Star /></div>
          <h1 id="arcade-title"><span>Naughty</span> <em>or</em> <span>Nice?</span></h1>
          <p>One token, three reels, and a little North Pole magic.</p>
        </section>

        <section className="cabinet-stage" aria-label="Naughty or Nice slot machine">
          <div className="cabinet">
            <div className="cabinet-bulbs" aria-hidden="true">
              {Array.from({ length: 17 }, (_, i) => <i key={i} />)}
            </div>
            <div className="cabinet-plate">
              <div className="cabinet-label"><Star /> SANTA’S LIST PREDICTOR <Star /></div>
              <div className="reels-frame" data-result={result ?? undefined}>
                <div className="reels">
                  {reels.map((symbol, i) => <Reel key={`${round}-${i}`} start={symbol} finish={pending ? finishSymbol : undefined} index={i} />)}
                </div>
              </div>
              <div className="cabinet-status" data-result={result ?? undefined} role="status" aria-atomic="true">
                {result ? (
                  <>
                    <strong>{result === 'nice' ? 'You’re on the Nice List!' : 'You’re on the Naughty List!'}</strong>
                    <span>{result === 'nice' ? 'The elves have a little something for you.' : 'A little coal never hurt the holiday spirit.'}</span>
                  </>
                ) : <><Star /><strong>{status}</strong><Star /></>}
              </div>
            </div>
            <div className="cabinet-lower">
              <div className="cabinet-screws" aria-hidden="true"><i /><i /></div>
              <button
                type="button"
                className="token-slot"
                data-drop={draggingToken}
                disabled={!hasToken}
                aria-label="Insert token into slot"
                onClick={insertToken}
                onDragOver={(event) => {
                  if (hasToken && event.dataTransfer.types.includes(tokenMime)) {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = 'move';
                  }
                }}
                onDrop={(event) => {
                  if (!event.dataTransfer.types.includes(tokenMime)) return;
                  event.preventDefault();
                  insertToken();
                }}
              >
                <span className="slot-opening" />
                <span>{phase === 'ready' ? 'TOKEN IN' : phase === 'spinning' ? 'IN PLAY' : '1 TOKEN'}</span>
              </button>
              <div className="cabinet-screws" aria-hidden="true"><i /><i /></div>
            </div>
            {result && <ResultEffect key={round} result={result} />}
          </div>
          <button
            ref={lever}
            type="button"
            className="lever"
            aria-label="Pull lever"
            data-pulled={phase === 'spinning'}
            disabled={phase !== 'ready'}
            style={{ '--lever-travel': `${leverTravel}px` } as CSSProperties}
            onClick={spin}
            onPointerDown={(event) => {
              if (!event.isPrimary || event.button !== 0) return;
              pullStart.current = event.clientY;
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (pullStart.current !== null) setLeverTravel(Math.max(0, Math.min(42, event.clientY - pullStart.current)));
            }}
            onPointerUp={(event) => {
              if (pullStart.current !== null && event.clientY - pullStart.current >= 20) spin();
              pullStart.current = null;
              setLeverTravel(0);
            }}
            onLostPointerCapture={() => { pullStart.current = null; setLeverTravel(0); }}
          >
            <span className="lever-joint" /><span className="lever-arm" /><span className="lever-knob" />
            <span className="lever-caption">PULL <ChevronDown className="icon-size-100" /></span>
          </button>
          <div className="cabinet-foot" aria-hidden="true" />
        </section>

        <div className="token-tray">
          {hasToken ? (
            <button ref={token} type="button" className="token-action" draggable onClick={insertToken} onDragStart={(event) => {
              event.dataTransfer.setData(tokenMime, 'token');
              event.dataTransfer.effectAllowed = 'move';
              setDraggingToken(true);
            }} onDragEnd={() => setDraggingToken(false)}>
              <span className="token-coin"><Star /></span>
              <span><strong>{result ? 'Insert a fresh token' : 'Insert token'}</strong><small>{result ? 'Another spin awaits!' : 'Tap or drag to the slot'}</small></span>
              <ArrowRight className="icon-size-200" aria-hidden="true" />
            </button>
          ) : (
            <div className="token-action token-used">
              <span className="token-coin">{phase === 'ready' ? <Check /> : <Snowflake />}</span>
              <span><strong>{phase === 'ready' ? 'Token loaded' : 'Reels spinning'}</strong><small>{phase === 'ready' ? 'Pull the lever to spin' : 'The elves are on it'}</small></span>
              {phase === 'ready' && <ArrowDown className="icon-size-200 -rotate-135" aria-hidden="true" />}
            </div>
          )}
        </div>

        <section className="odds-section" aria-labelledby="odds-title">
          <div className="odds-heading">
            <div><h2 id="odds-title">Tip the odds</h2><p>Optional: answer “yes” to one before you spin.</p></div>
            <div className="odds-meter" role="status" aria-label={`Current odds: ${odds.naughty}% Naughty, ${odds.nice}% Nice`}><span>{odds.naughty}%</span><i /><span>{odds.nice}%</span></div>
          </div>
          <div className="question-grid">
            {lists.map((list) => {
              const Icon = list === 'naughty' ? Sparkles : Gift;
              return (
                <button key={list} type="button" className="question-card" data-list={list} disabled={phase === 'spinning'} aria-pressed={selection === list} onClick={() => setSelection(selection === list ? null : list)}>
                  <span className="question-icon"><Icon className="icon-size-300" aria-hidden="true" /></span>
                  <span className="question-copy"><span><strong>{list === 'naughty' ? 'Naughty' : 'Nice'}</strong> <small>+5 pts</small></span><span>{questions[list][pair[list]]}</span></span>
                  <span className="question-check" aria-hidden="true">{selection === list && <Check className="icon-size-100" />}</span>
                </button>
              );
            })}
          </div>
        </section>
      </main>
      <footer className="arcade-footer"><Snowflake className="icon-size-100" aria-hidden="true" /> JUST FOR FUN. EVEN SANTA LIKES A SURPRISE.</footer>
    </div>
  );
}

export default App;
