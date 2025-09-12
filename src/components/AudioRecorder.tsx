import { useEffect, useRef, useState } from 'react';
import { getAudioCtx, setSamplePitch } from '../audio/engine';

type Status = 'idle' | 'recording' | 'stopped' | 'unsupported' | 'denied' | 'error';

type Props = {
  onSample?: (buffer: AudioBuffer) => void;
};

export default function AudioRecorder({ onSample }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [url, setUrl] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const [pitch, setPitch] = useState(0); // semitones -24..+24

  useEffect(() => {
    if (!('MediaRecorder' in window)) setStatus('unsupported');
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
        // Optionally decode to AudioBuffer for sampler usage
        if (onSample) {
          try {
            const ctx = getAudioCtx();
            const arr = await blob.arrayBuffer();
            const buf = await ctx.decodeAudioData(arr.slice(0));
            onSample(buf);
          } catch (e) {
            // ignore decode errors
          }
        }
      };

      mr.start();
      setElapsed(0);
      timerRef.current = window.setInterval(() => setElapsed((t) => t + 1), 1000);
      setStatus('recording');
    } catch (err: any) {
      if (err && err.name === 'NotAllowedError') setStatus('denied');
      else setStatus('error');
    }
  }

  function stop() {
    mediaRef.current?.stop();
    mediaRef.current?.stream.getTracks().forEach((t) => t.stop());
    if (timerRef.current) window.clearInterval(timerRef.current);
    setStatus('stopped');
  }

  function reset() {
    setUrl(null);
    setElapsed(0);
    setStatus('idle');
  }

  const mm = Math.floor(elapsed / 60)
    .toString()
    .padStart(2, '0');
  const ss = (elapsed % 60).toString().padStart(2, '0');

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button className="px-3 py-1 rounded border" onClick={start} disabled={status === 'recording' || status === 'unsupported'}>
          Record
        </button>
        <button className="px-3 py-1 rounded border" onClick={stop} disabled={status !== 'recording'}>
          Stop
        </button>
        <button className="px-3 py-1 rounded border" onClick={reset}>
          Reset
        </button>
        <span className="text-sm opacity-80">
          {status === 'recording' ? 'Recording… ' : 'Ready'} {mm}:{ss}
        </span>
      </div>
      {/* Pitch control for the recorded/loaded sample */}
      <label className="flex items-center gap-2 text-sm">
        <span>Pitch</span>
        <input
          type="range"
          min={-24}
          max={24}
          value={pitch}
          onChange={(e) => {
            const s = Number(e.target.value);
            setPitch(s);
            setSamplePitch(s);
          }}
        />
        <span className="tabular-nums w-12">{pitch >= 0 ? `+${pitch}` : `${pitch}`} st</span>
      </label>
      {status === 'unsupported' && (
        <div className="text-sm opacity-80">MediaRecorder not supported in this browser.</div>
      )}
      {status === 'denied' && (
        <div className="text-sm opacity-80">Microphone permission denied. Check browser settings.</div>
      )}
      {status === 'error' && <div className="text-sm opacity-80">Could not start recording.</div>}
      {url && (
        <div className="flex items-center gap-3">
          <audio controls src={url} />
          <a className="underline" href={url} download={`idea-${Date.now()}.webm`}>
            Download
          </a>
        </div>
      )}
    </div>
  );
}
