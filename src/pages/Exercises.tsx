/**
 * Exercises page outlines interactive tools that will be added in
 * future iterations.  These tools may include a drag and drop
 * arrangement builder, a quick voice recorder, or a sample pad.
 */
export default function Exercises() {
  return (
    <div className="grid gap-4">
      <div className="card">
        <div className="font-medium mb-1">Bar Blocks (arrangement)</div>
        <p className="opacity-80 text-sm">
          Drag Intro/Main/Break/Outro blocks to sketch your structure
          (coming next commit).
        </p>
      </div>
      <div className="card">
        <div className="font-medium mb-1">Quick Recorder</div>
        <p className="opacity-80 text-sm">
          Record an idea in-browser and download to import to GarageBand/Note.
        </p>
      </div>
    </div>
  );
}