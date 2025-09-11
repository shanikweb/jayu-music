import { useRef } from 'react';
import BarBlocks from '../components/BarBlocks';
import AudioRecorder from '../components/AudioRecorder';
import { useSmoothAnchors } from '../shared/useSmoothAnchors';

/**
 * Resources page now includes interactive tools and smooth in-page navigation.
 */
export default function Resources() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useSmoothAnchors(containerRef.current);

  return (
    <div ref={containerRef} className="space-y-6">
      {/* In-page nav */}
      <div className="card">
        <div className="font-medium mb-2">Resources</div>
        <div className="text-sm opacity-80 mb-2">Jump to:</div>
        <nav className="flex flex-wrap gap-3 text-sm">
          <a className="underline" href="#arrangement">BarBlocks (arrangement)</a>
          <a className="underline" href="#recorder">Audio Recorder</a>
          <a className="underline" href="#links">Helpful Links</a>
        </nav>
      </div>

      {/* BarBlocks */}
      <section id="arrangement" className="card">
        <div className="font-medium mb-1">BarBlocks — Arrange Your Sections</div>
        <p className="opacity-80 text-sm mb-3">
          Drag blocks to reorder your song structure. Add or remove Intro/Main/Break/Outro
          sections to sketch an arrangement.
        </p>
        <BarBlocks />
      </section>

      {/* Audio Recorder */}
      <section id="recorder" className="card">
        <div className="font-medium mb-1">Quick Recorder — Capture an Idea</div>
        <p className="opacity-80 text-sm mb-3">
          Use your microphone to record a quick idea. Download and import into your DAW.
          Your browser may ask for permission.
        </p>
        <AudioRecorder />
      </section>

      {/* External Links */}
      <section id="links" className="card">
        <div className="font-medium mb-2">Helpful Links</div>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <a href="https://learningmusic.ableton.com" className="underline">
              Ableton Learning Music
            </a>
          </li>
          <li>
            <a className="underline" href="https://support.apple.com/guide/garageband-ipad/welcome/ipados">
              GarageBand for iPad — Apple User Guide
            </a>
          </li>
          <li>
            <a className="underline" href="https://www.ableton.com/en/note/">
              Ableton Note — Quickstart
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
