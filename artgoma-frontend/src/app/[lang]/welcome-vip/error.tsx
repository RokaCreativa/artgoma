"use client"; // Error boundaries must be Client Components

import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
      <p className="text-white text-8xl font-semibold">404</p>
      <div>
        <Link className="text-white text-6 border border-red-600 bg-white/20 p-3 rounded-full" href={`/`}>
          Go home
        </Link>
      </div>
    </div>
  );
}
