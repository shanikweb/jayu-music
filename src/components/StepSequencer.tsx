import { useEffect, useMemo, useRef, useState } from 'react';
import { getAudioCtx, playKick, playSnare, playClap, playHat, playSample, hasSample, stopOpenHats } from '../audio/engine';

type Voice = 'Kick' | 'Snare' | 'Clap' | 'Hat' | 'OpenHat' | 'Sample';
const VOICES: Voice[] = ['Kick', 'Snare', 'Clap', 'Hat', 'OpenHat', 'Sample'];

type Pattern = boolean[][]; // [row][step]

export default function StepSequencer() {
  const [bpm, setBpm] = useState(100);
  const [swing, setSwing] = useState(0); // 0..0.6 fraction of 16th delay
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [pattern, setPattern] = useState<Pattern>(() =>
    VOICES.map(() => new Array(16).fill(false))
  );
  const [volumes, setVolumes] = useState<number[]>(() => VOICES.map(() => 0.9));
  const [mutes, setMutes] = useState<boolean[]>(() => VOICES.map(() => false));
  const [solos, setSolos] = useState<boolean[]>(() => VOICES.map(() => false));

  // Some defaults
  useEffect(() => {
    setPattern((p) => {
      const copy = p.map((row) => row.slice());
      // Kick on 1 and 9
      copy[0][0] = true;
      copy[0][8] = true;
      // Snare on 5 and 13 (backbeat if thinking in 16ths)
      copy[1][4] = true;
      copy[1][12] = true;
      // Closed hat on 8ths
      for (let i = 0; i < 16; i += 2) copy[3][i] = true;
      return copy;
    });
  }, []);

  function toggle(row: number, step: number) {
    setPattern((p) => {
      const next = p.map((r) => r.slice());
      next[row][step] = !next[row][step];
      return next;
    });
  }

  function clearRow(row: number) {
    setPattern((p) => {
      const next = p.map((r, i) => (i === row ? r.map(() => false) : r.slice()));
      return next;
    });
  }

  // Scheduler
  const nextNoteTime = useRef(0);
  const stepRef = useRef(0);
  const timerId = useRef<number | null>(null);

  function nextStepInterval() {
    // 16th note interval in seconds
    return 60 / bpm / 4;
  }

  function scheduleStep(step: number, time: number) {
    const anySolo = solos.some(Boolean);
    pattern.forEach((row, rIdx) => {
      if (!row[step]) return;
      if (anySolo && !solos[rIdx]) return;
      if (!anySolo && mutes[rIdx]) return;
      const when = time;
      const gainMul = volumes[rIdx];
      switch (VOICES[rIdx]) {
        case 'Kick':
          playKick(when, gainMul);
          break;
        case 'Snare':
          playSnare(when, gainMul);
          break;
        case 'Clap':
          playClap(when, gainMul);
          break;
        case 'Hat':
          // choke open hat when a closed hat hits
          stopOpenHats();
          playHat(when, false, gainMul);
          break;
        case 'OpenHat':
          playHat(when, true, gainMul);
          break;
        case 'Sample':
          playSample(when, gainMul);
          break;
      }
    });
  }

  function schedulerLoop() {
    const ctx = getAudioCtx();
    while (nextNoteTime.current < ctx.currentTime + 0.1) {
      const interval = nextStepInterval();
      const isSwingStep = stepRef.current % 2 === 1;
      const swingOffset = isSwingStep ? swing * interval : 0;
      scheduleStep(stepRef.current, nextNoteTime.current + swingOffset);
      setCurrentStep(stepRef.current);
      nextNoteTime.current += nextStepInterval();
      stepRef.current = (stepRef.current + 1) % 16;
    }
    timerId.current = window.setTimeout(schedulerLoop, 25);
  }

  function start() {
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    nextNoteTime.current = ctx.currentTime + 0.05;
    stepRef.current = currentStep;
    setIsPlaying(true);
    schedulerLoop();
  }

  function stop() {
    if (timerId.current) window.clearTimeout(timerId.current);
    timerId.current = null;
    setIsPlaying(false);
    // Reset to beginning so the next play starts from step 0
    stepRef.current = 0;
    setCurrentStep(0);
  }

  // Keyboard input
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      const now = getAudioCtx().currentTime;
      if (key === 'a') playKick(now);
      if (key === 's') playSnare(now);
      if (key === 'd') playClap(now);
      if (key === 'f') playHat(now, false);
      if (key === 't') playHat(now, true);
      if (key === 'g') playSample(now);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const hasUserSample = useMemo(() => hasSample(), [pattern, bpm, isPlaying, currentStep]);

  // Persist state
  useEffect(() => {
    const state = { bpm, swing, pattern, volumes, mutes, solos };
    try {
      localStorage.setItem('jayu.seq', JSON.stringify(state));
    } catch {}
  }, [bpm, swing, pattern, volumes, mutes, solos]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('jayu.seq');
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s?.bpm) setBpm(s.bpm);
      if (typeof s?.swing === 'number') setSwing(s.swing);
      if (Array.isArray(s?.pattern)) setPattern(s.pattern);
      if (Array.isArray(s?.volumes)) setVolumes(s.volumes);
      if (Array.isArray(s?.mutes)) setMutes(s.mutes);
      if (Array.isArray(s?.solos)) setSolos(s.solos);
    } catch {}
  }, []);

  return (
    <div className="space-y-3">
      {/* Transport */}
      <div className="flex items-center gap-3 flex-wrap">
        <button className="px-3 py-1 rounded border" onClick={isPlaying ? stop : start}>
          {isPlaying ? 'Stop' : 'Play'}
        </button>
        <label className="flex items-center gap-2 text-sm">
          <span>Tempo</span>
          <input
            type="range"
            min={60}
            max={180}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
          />
          <span className="tabular-nums w-10">{bpm}</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span>Swing</span>
          <input
            type="range"
            min={0}
            max={60}
            value={Math.round(swing * 100)}
            onChange={(e) => setSwing(Number(e.target.value) / 100)}
          />
          <span className="tabular-nums w-10">{Math.round(swing * 100)}%</span>
        </label>
        <div className="text-xs opacity-70">Keys: A Kick, S Snare, D Clap, F Hat{hasUserSample ? ', G Sample' : ''}</div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse select-none">
          <tbody>
            {VOICES.map((v, rIdx) => (
              <tr key={v}>
                <td className="pr-3 py-2 whitespace-nowrap align-middle">
                  <div className="flex items-center gap-2">
                    <div className="w-20 opacity-80">{v === 'OpenHat' ? 'Open Hat' : v}</div>
                    <button className="text-xs underline opacity-70" onClick={() => clearRow(rIdx)}>Clear</button>
                    <button
                      className={`text-xs underline ${mutes[rIdx] ? 'opacity-100' : 'opacity-70'}`}
                      onClick={() => setMutes((m) => m.map((mm, i) => (i === rIdx ? !mm : mm)))}
                    >
                      Mute
                    </button>
                    <button
                      className={`text-xs underline ${solos[rIdx] ? 'opacity-100' : 'opacity-70'}`}
                      onClick={() => setSolos((s) => s.map((ss, i) => (i === rIdx ? !ss : ss)))}
                    >
                      Solo
                    </button>
                    <label className="flex items-center gap-1 text-xs opacity-80">
                      Vol
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={Math.round(volumes[rIdx] * 100)}
                        onChange={(e) =>
                          setVolumes((vv) => vv.map((x, i) => (i === rIdx ? Number(e.target.value) / 100 : x)))
                        }
                      />
                    </label>
                  </div>
                </td>
                {pattern[rIdx].map((on, step) => {
                  const active = isPlaying && step === currentStep;
                  const bar = Math.floor(step / 4);
                  return (
                    <td key={step} className="p-0 align-middle">
                      <button
                        onClick={() => toggle(rIdx, step)}
                        className="m-[2px] w-7 h-7 rounded-none border"
                        style={{
                          background: on ? 'var(--ink)' : 'transparent',
                          color: on ? 'white' : 'inherit',
                          borderColor: active ? 'var(--ink)' : 'var(--divider)',
                          boxShadow: active ? 'inset 0 0 0 1px var(--ink)' : 'none',
                        }}
                        aria-label={`${v} step ${step + 1}`}
                        title={`Bar ${bar + 1}, Step ${step % 4 + 1}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
