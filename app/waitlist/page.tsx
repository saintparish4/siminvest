"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement waitlist submission logic
    // This is where you would typically send the data to your backend
    
    // Simulate API call with 1 second delay to simulate a real API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setLoading(false);
  };

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

        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Join the Waitlist
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Be among the first to access Hex - the platform revolutionizing private market investments. 
            Get early access to exclusive investment opportunities in high-growth startups and tokenized assets.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 text-white bg-teal-500 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer transition-colors"
            >
              {loading ? "Submitting..." : "Join Waitlist"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-green-600 text-xl font-semibold">
              Thank you for joining our waitlist!
            </div>
            <p className="text-gray-600">
              We&apos;ll notify you when we&apos;re ready to launch. Stay tuned for updates!
            </p>
          </div>
        )}

        <Link
          href="/"
          className="flex items-center gap-2 text-sm sm:text-base group"
        >
          <span className="group-hover:underline group-hover:underline-offset-4">← Back to Home</span>
        </Link>
      </div>
    </main>
  );
}
