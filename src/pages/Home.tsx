import { useReveal } from '../shared/useReveal';

/**
 * Home page introduces the program and gives a quick summary of
 * upcoming activities.  Sections fade in as the user scrolls down
 * using the useReveal hook.
 */
export default function Home() {
  const introRef = useReveal<HTMLDivElement>();
  const weekRef = useReveal<HTMLDivElement>({ delay: 0.05 });
  return (
    <div className="space-y-6">
      <section ref={introRef} className="card">
        <h1 className="text-2xl font-semibold mb-2">Welcome</h1>
        <p className="opacity-80">
          A clean, minimal course hub for our youth music program — beats,
          found sound and storytelling.  Explore lessons, record ideas and
          share your creations.
        </p>
      </section>
      <section ref={weekRef} className="card">
        <h2 className="text-xl font-medium mb-2">This Week</h2>
        <ul className="list-disc pl-4 opacity-85 space-y-1">
          <li>Arrange your loop (Intro → Main → Break → Outro)</li>
          <li>Optionally add vocals (4 lines)</li>
          <li>Goal: 1–2 minute draft by Week 8</li>
        </ul>
      </section>
    </div>
  );
}