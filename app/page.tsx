import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8 md:p-20">
      <div className="flex flex-col items-center justify-center text-center max-w-[90vw] sm:max-w-[80vw] md:max-w-[70vw] gap-8">
        <div className="flex items-center gap-1">
          <Image 
            src="/logos/hex-black.svg" 
            alt="Hex" 
            width={400} 
            height={400} 
            className="w-40 h-40 sm:w-24 sm:h-24 md:w-32 md:h-32" 
            priority
          />
          <span className="px-1 py-1 text-base font-medium text-gray-500 -mt-4">BETA</span>
        </div>
        <p className="text-xl sm:text-2xl">
          Hex is a full-stack investment platform that enables users to discover, analyze, and participate in private funding rounds for high-growth startups and tokenized assets. Hex bridges the gap between retail and institutional investing in early-stage ventures.
        </p>
        <Link
          className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-500 hover:text-gray-700 transition-colors no-underline hover:underline hover:underline-offset-4"
          href="/waitlist"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={20}
            height={20}
          />
          Join Waitlist →
        </Link>
        <Link
          className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-500 hover:text-gray-700 transition-colors no-underline hover:underline hover:underline-offset-4"
          href="/auth"
        >
          Sign Up →
        </Link>
      </div>
    </main>
  );
}
