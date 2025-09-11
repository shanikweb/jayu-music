import { Link } from 'react-router-dom';
import { useReveal } from '../shared/useReveal';
import Avatar from '../shared/Avatar';

/**
 * Hub-style homepage inspired by frankchimero.com
 * - Bio header with avatar
 * - Grid of thumbnail cards that link to sections
 * Keeps the clean, minimal look using the existing tokens/classes.
 */
export default function Home() {
  const introRef = useReveal<HTMLDivElement>();
  const gridRef = useReveal<HTMLDivElement>({ delay: 0.05 });

  // Use a public asset if present; otherwise Avatar shows initials.
  const avatarSrc = `${import.meta.env.BASE_URL}avatar.jpg`;

  const tiles = [
    {
      to: '/lessons',
      title: 'Lessons',
      desc: 'Weekly topics, slides and prompts',
      emoji: '📚',
      bg: 'from-[#e6eefc] to-[#f7fbff]',
    },
    {
      to: '/exercises',
      title: 'Exercises',
      desc: 'Hands-on tools and practice',
      emoji: '🎛️',
      bg: 'from-[#ffe9d6] to-[#fff7ec]',
    },
    {
      to: '/resources',
      title: 'Resources',
      desc: 'Guides and external links',
      emoji: '🧭',
      bg: 'from-[#e8f6ef] to-[#f6fef9]',
    },
    {
      to: '/showcase',
      title: 'Showcase',
      desc: 'Student work and highlights',
      emoji: '✨',
      bg: 'from-[#f1ecff] to-[#faf8ff]',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header / Bio */}
      <section ref={introRef} className="card">
        <div className="flex items-start gap-4">
          <Avatar src={avatarSrc} alt="Bio photo" size={96} initials="J" />
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold mb-2">JAYU Music</h1>
            <p className="opacity-80 leading-relaxed">
              A minimal, friendly hub for our youth music program — beats, found sound
              and storytelling. Explore lessons, try interactive exercises, and discover
              helpful resources. Share your creations in the showcase.
            </p>
          </div>
        </div>
      </section>

      {/* Hub Grid */}
      <section ref={gridRef}>
        <div className="grid gap-4 sm:grid-cols-2">
          {tiles.map((t) => (
            <Link key={t.to} to={t.to} className="block group">
              <div className="card p-0 overflow-hidden">
                {/* Thumbnail */}
                <div
                  className={`h-32 w-full bg-gradient-to-br ${t.bg} grid place-items-center`}
                  aria-hidden
                >
                  <span className="text-3xl opacity-90 select-none">{t.emoji}</span>
                </div>
                {/* Meta */}
                <div className="p-4">
                  <div className="flex items-baseline gap-2">
                    <div className="font-medium group-hover:underline">{t.title}</div>
                    <span className="text-xs opacity-60">→</span>
                  </div>
                  <div className="text-sm opacity-75 mt-1">{t.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
