/**
 * Resources page collects useful external links for the students.
 */
export default function Resources() {
  return (
    <div className="card">
      <div className="font-medium mb-2">Links</div>
      <ul className="list-disc pl-4 space-y-1">
        <li>
          <a href="https://learningmusic.ableton.com" className="underline">
            Ableton Learning Music
          </a>
        </li>
        <li>
          <span>GarageBand for iPad: Apple User Guide</span>
        </li>
        <li>
          <span>Ableton Note: Quickstart</span>
        </li>
      </ul>
    </div>
  );
}