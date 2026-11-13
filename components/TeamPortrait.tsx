'use client';

import { useState } from 'react';
import Image from 'next/image';

interface TeamPortraitProps {
  src: string;
  alt: string;
  initials: string;
}

export default function TeamPortrait({ src, alt, initials }: TeamPortraitProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="avatar">
      {failed ? (
        <span className="avatar-initials" aria-hidden="true">
          {initials}
        </span>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 640px) 96px, 80px"
          className="avatar-img"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
