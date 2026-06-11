'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

/** Shared page header: brand, nav, network badge, wallet connect. */
export function Header() {
  return (
    <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="whitespace-nowrap text-2xl font-bold text-amber-900 transition hover:text-amber-700 sm:text-3xl"
        >
          ☕ Buy Me A Coffee
        </Link>
        <Link
          href="/create"
          className="hidden whitespace-nowrap rounded-full bg-amber-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 sm:inline-block"
        >
          Create your jar
        </Link>
      </div>
      <div className="flex shrink-0 items-center gap-3 whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-300">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Sepolia Testnet
        </span>
        <ConnectButton
          label="Connect"
          showBalance={false}
          accountStatus="avatar"
          chainStatus="none"
        />
      </div>
      {/* Mobile CTA (full-width button under the header row) */}
      <Link
        href="/create"
        className="rounded-full bg-amber-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 sm:hidden"
      >
        Create your jar
      </Link>
    </header>
  );
}
