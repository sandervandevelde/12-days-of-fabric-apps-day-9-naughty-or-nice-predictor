import type { ReelSymbol } from './holiday-game';

export function ReelArt({ symbol }: { symbol: ReelSymbol }) {
  return (
    <svg viewBox="0 0 96 96" className="reel-art" aria-hidden="true">
      <ellipse cx="48" cy="84" rx="33" ry="5" className="art-shadow" />
      {symbol === 'tree' && <>
        <path className="art-brown" d="M42 66h12v17H42z" />
        <path className="art-green" d="M48 13 24 45h10L16 66h13L19 77h58L66 66h14L62 45h10z" />
        <path className="art-mint" d="M48 26c-4 18-11 34-23 45h14c9-14 11-27 9-45z" />
        <path className="art-gold" d="m48 4 3 6 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" />
        <circle cx="34" cy="61" r="4" className="art-red" /><circle cx="56" cy="48" r="4" className="art-red" />
        <circle cx="58" cy="68" r="4" className="art-gold" /><circle cx="41" cy="42" r="3" className="art-gold" />
      </>}
      {symbol === 'gift' && <>
        <path className="art-gold-line" d="M48 31c-19 0-29-8-25-15 5-9 19-1 25 15 7-16 20-24 25-15 4 7-6 15-25 15z" />
        <rect x="17" y="38" width="62" height="43" rx="7" className="art-red" />
        <path className="art-deep" d="M17 44h62v11H17z" />
        <rect x="12" y="30" width="72" height="17" rx="5" className="art-coral" />
        <path className="art-gold" d="M42 29h12v52H42z" />
        <path className="art-ivory-line" d="M25 35h9m29 0h9M23 60v10" />
      </>}
      {symbol === 'bell' && <>
        <circle cx="48" cy="69" r="13" className="art-brown" />
        <path className="art-gold" d="M18 64c8-6 9-12 11-27 2-12 9-17 19-17s17 5 19 17c2 15 3 21 11 27 3 3 1 8-4 8H22c-5 0-7-5-4-8z" />
        <path className="art-ochre" d="M56 23c8 2 10 8 11 14 2 15 3 21 11 27 3 3 1 8-4 8H61c5-3 3-8 0-13-4-10 1-28-5-36z" />
        <path className="art-ivory-line" d="M37 33c-3 6-2 12-5 18m-7 14h33" />
        <path className="art-red" d="M49 22C29 32 22 17 28 11c5-4 13 1 21 8 8-7 16-12 21-8 6 6-1 21-21 11z" />
      </>}
      {symbol === 'cane' && <>
        <path className="art-cane-base" d="M28 34a20 20 0 1 1 38 8L47 77" />
        <path className="art-cane-stripes" d="M28 34a20 20 0 1 1 38 8L47 77" />
        <path className="art-green" d="M64 59c3-10 12-13 22-12-3 9-10 16-22 12zm-3-1c-10-2-15-9-15-18 9 2 17 9 15 18z" />
        <circle cx="65" cy="59" r="5" className="art-red" />
      </>}
      {symbol === 'coal' && <>
        <path className="art-coal" d="m13 62 13-27 22-13 25 9 12 27-11 20-38 4-20-9z" />
        <path className="art-slate" d="m26 35 22-13 25 9-19 11-17 22-24-2z" />
        <path className="art-coal-deep" d="m37 64 17-22 19-11 12 27-18 7-5 14-26 3z" />
        <path className="art-coal-line" d="m26 43 12-8m19-2 8 1M71 69l7-6" />
        <path className="art-ember" d="m62 9 2 5 5 2-5 2-2 5-2-5-5-2 5-2zM80 17l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" />
      </>}
      {symbol === 'snow' && <>
        <circle cx="48" cy="47" r="32" className="art-ice" />
        <g className="art-snow-line">
          {[0, 60, 120].map((rotation) => <path key={rotation} transform={`rotate(${rotation} 48 47)`} d="M48 14v66M40 23l8 7 8-7M40 71l8-7 8 7" />)}
        </g>
        <circle cx="48" cy="47" r="5" className="art-green" />
      </>}
    </svg>
  );
}
