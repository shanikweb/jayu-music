let audioCtx: AudioContext | null = null;

export function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

function env(
  ctx: AudioContext,
  duration = 0.2,
  gain = 1,
  startTime?: number,
  curve: 'lin' | 'exp' = 'exp'
) {
  const g = ctx.createGain();
  const t = startTime ?? ctx.currentTime;
  g.gain.setValueAtTime(0.00001, t);
  if (curve === 'exp') {
    g.gain.exponentialRampToValueAtTime(Math.max(0.00001, gain), t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.00001, t + duration);
  } else {
    g.gain.linearRampToValueAtTime(gain, t + 0.005);
    g.gain.linearRampToValueAtTime(0.00001, t + duration);
  }
  return g;
}

export function playKick(when?: number, gainMul = 1) {
  const ctx = getAudioCtx();
  const t = when ?? ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(40, t + 0.25);
  g.gain.setValueAtTime(1 * gainMul, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
  osc.connect(g).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.5);
}

export function playSnare(when?: number, gainMul = 1) {
  const ctx = getAudioCtx();
  const t = when ?? ctx.currentTime;
  // Noise burst
  const bufferSize = ctx.sampleRate * 0.2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1800;
  const g = env(ctx, 0.2, 0.6 * gainMul, t);
  noise.connect(bp).connect(g).connect(ctx.destination);
  noise.start(t);
  noise.stop(t + 0.2);
  // Body
  const osc = ctx.createOscillator();
  const og = env(ctx, 0.12, 0.3 * gainMul, t);
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(180, t);
  osc.connect(og).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.15);
}

export function playClap(when?: number, gainMul = 1) {
  const ctx = getAudioCtx();
  const t = when ?? ctx.currentTime;
  const makeNoise = (startOffset: number) => {
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1200;
    const g = env(ctx, 0.12, 0.5 * gainMul, t + startOffset);
    src.connect(hp).connect(g).connect(ctx.destination);
    src.start(t + startOffset);
    src.stop(t + startOffset + 0.12);
  };
  makeNoise(0);
  makeNoise(0.02);
  makeNoise(0.04);
}

let openHatSources: AudioBufferSourceNode[] = [];
export function stopOpenHats() {
  openHatSources.forEach((s) => {
    try { s.stop(); } catch {}
  });
  openHatSources = [];
}

export function playHat(when?: number, open = false, gainMul = 1) {
  const ctx = getAudioCtx();
  const t = when ?? ctx.currentTime;
  const bufferSize = ctx.sampleRate * (open ? 0.4 : 0.05);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 6000;
  if (!open) {
    // choke any ringing open hats
    stopOpenHats();
  }
  const g = env(ctx, open ? 0.35 : 0.07, (open ? 0.35 : 0.25) * gainMul, t);
  src.connect(hp).connect(g).connect(ctx.destination);
  src.start(t);
  src.stop(t + (open ? 0.35 : 0.07));
  if (open) {
    openHatSources.push(src);
    src.onended = () => {
      openHatSources = openHatSources.filter((s) => s !== src);
    };
  }
}

let sampleBuffer: AudioBuffer | null = null;
let sampleSemitones = 0; // global pitch offset for the user sample
export function setSample(buffer: AudioBuffer | null) {
  sampleBuffer = buffer;
}
export function setSamplePitch(semitones: number) {
  // clamp to reasonable musical range
  sampleSemitones = Math.max(-24, Math.min(24, Math.round(semitones)));
}
export function getSamplePitch() {
  return sampleSemitones;
}
export function hasSample() {
  return !!sampleBuffer;
}
export function playSample(when?: number, gainMul = 1) {
  if (!sampleBuffer) return;
  const ctx = getAudioCtx();
  const t = when ?? ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = sampleBuffer;
  // Apply pitch via playbackRate (semitones -> rate)
  const rate = Math.pow(2, sampleSemitones / 12);
  try {
    src.playbackRate.setValueAtTime(rate, t);
  } catch {
    // fallback: assign directly
    // @ts-ignore
    src.playbackRate.value = rate;
  }
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.85 * gainMul, t);
  src.connect(g).connect(ctx.destination);
  src.start(t);
}

export async function decodeToBuffer(blobOrUrl: Blob | string) {
  const ctx = getAudioCtx();
  const arrayBuffer =
    typeof blobOrUrl === 'string' ? await (await fetch(blobOrUrl)).arrayBuffer() : await blobToArrayBuffer(blobOrUrl);
  return await ctx.decodeAudioData(arrayBuffer.slice(0));
}

function blobToArrayBuffer(blob: Blob) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}
