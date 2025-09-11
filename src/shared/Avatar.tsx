import { useState } from 'react';

type AvatarProps = {
  src?: string;
  alt?: string;
  size?: number; // pixels
  initials?: string;
};

export default function Avatar({ src, alt = 'Avatar', size = 96, initials = 'J' }: AvatarProps) {
  const [imgOk, setImgOk] = useState(true);
  const dim = `${size}px`;
  return (
    <div
      className="relative rounded-full overflow-hidden select-none"
      style={{ width: dim, height: dim, background: 'linear-gradient(135deg,#f6d365 0%,#fda085 100%)' }}
      aria-label={alt}
    >
      {src && imgOk ? (
        // Use object-cover to neatly crop any image
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover block"
          onError={() => setImgOk(false)}
          loading="eager"
        />
      ) : (
        <div className="w-full h-full grid place-items-center">
          <span className="text-white/90" style={{ fontSize: Math.max(16, size * 0.35) }}>{initials}</span>
        </div>
      )}
    </div>
  );
}

