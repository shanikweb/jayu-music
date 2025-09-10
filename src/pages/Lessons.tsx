/**
 * Lessons page lists weekly lesson topics and resources.  This
 * component could later fetch data from an API or JSON file but
 * currently uses an inline array for simplicity.
 */
export default function Lessons() {
  const weeks = [
    { id: 1, title: 'Day 1 — Welcome + First Beat', links: [{ label: 'Slides', href: '/assets/day1-slides.pptx' }] },
    { id: 2, title: 'Week 2 — Sound Collecting & Sampling' },
    { id: 3, title: 'Week 3 — Core Idea / Loop' },
    { id: 4, title: 'Week 4 — Arrangement + Intro to Vocals', links: [{ label: 'Lyric prompt', href: '/assets/lyric.pdf' }] },
    { id: 5, title: 'Week 5 — Deep Work + Structure by Muting' },
    { id: 6, title: 'Week 6 — Layering & FX' },
    { id: 7, title: 'Week 7 — Mixing Basics' },
    { id: 8, title: 'Week 8 — Share & Celebrate' },
  ];
  return (
    <div className="grid gap-4">
      {weeks.map((w) => (
        <div key={w.id} className="card">
          <div className="font-medium">{w.title}</div>
          {w.links && (
            <ul className="mt-2 text-sm space-y-1">
              {w.links.map((l, i) => (
                <li key={i}>
                  <a href={l.href} className="underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}