'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { CONTRACT_ADDRESS } from '@/lib/contract';
import { CoffeeCup } from './components/CoffeeCup';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { Footer } from './components/Footer';
import { JarPanel } from './components/JarPanel';

const HOW_IT_WORKS = [
  {
    icon: '🔌',
    title: 'Connect',
    body: 'Link your wallet on the Sepolia testnet — no real money needed.',
  },
  {
    icon: '✍️',
    title: 'Leave a note',
    body: 'Add your name, a message, and pick how many coffees to send.',
  },
  {
    icon: '⛓️',
    title: 'Tip on-chain',
    body: 'Your tip and message are stored permanently on the blockchain.',
  },
];

export default function Home() {
  const [supporters, setSupporters] = useState({ count: 0, loading: true });
  const onSupporters = useCallback(
    (count: number, loading: boolean) => setSupporters({ count, loading }),
    [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-orange-100">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Header />

        {/* Hero */}
        <section className="mb-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <CoffeeCup className="h-28 w-28 shrink-0 drop-shadow-sm sm:h-32 sm:w-32" />
          <div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-amber-950 sm:text-4xl">
              Tip me a coffee on-chain
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base text-amber-900/70 sm:mx-0 sm:text-lg">
              Send a small tip and a message straight to my wallet — recorded
              forever on the Ethereum blockchain. Powered by a smart contract on
              the Sepolia testnet.
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm text-amber-900/60 sm:mx-0">
              Want your own tip jar?{' '}
              <Link
                href="/create"
                className="font-semibold text-amber-700 underline-offset-2 hover:underline"
              >
                Create one in one click →
              </Link>
            </p>
          </div>
        </section>

        {/* Live stats */}
        <StatsBar
          supporterCount={supporters.count}
          supportersLoading={supporters.loading}
        />

        {/* Tip form + owner withdraw + supporter wall (+ toast/confetti) */}
        <JarPanel address={CONTRACT_ADDRESS} onSupporters={onSupporters} />

        {/* How it works */}
        <section className="mt-8 rounded-2xl bg-white/60 p-6 ring-1 ring-amber-100 sm:p-8">
          <h2 className="mb-6 text-xl font-semibold text-gray-800 sm:text-2xl">
            How it works
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.title} className="text-center sm:text-left">
                <div className="text-3xl">{step.icon}</div>
                <h3 className="mt-2 font-semibold text-amber-900">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
