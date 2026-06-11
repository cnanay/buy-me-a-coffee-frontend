'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { isAddress, getAddress } from 'viem';
import { useReadContract } from 'wagmi';
import { CONTRACT_ABI } from '@/lib/contract';
import { addressExplorerUrl } from '@/lib/links';
import { CoffeeCup } from '../../components/CoffeeCup';
import { Header } from '../../components/Header';
import { StatsBar } from '../../components/StatsBar';
import { Footer } from '../../components/Footer';
import { JarPanel } from '../../components/JarPanel';

export default function JarPage() {
  const params = useParams<{ address: string }>();
  const raw = params?.address ?? '';
  const valid = isAddress(raw);
  // Normalize to the checksummed form for display + contract calls.
  const jarAddress = valid ? getAddress(raw) : undefined;

  const [supporters, setSupporters] = useState({ count: 0, loading: true });
  const onSupporters = useCallback(
    (count: number, loading: boolean) => setSupporters({ count, loading }),
    [],
  );

  // The creator who owns this jar (shown so tippers know who they're paying).
  const { data: owner } = useReadContract({
    address: jarAddress,
    abi: CONTRACT_ABI,
    functionName: 'owner',
    query: { enabled: !!jarAddress },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-orange-100">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Header />

        {!jarAddress ? (
          <section className="rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-amber-100">
            <p className="text-4xl">🤔</p>
            <h2 className="mt-3 text-xl font-bold text-amber-950">
              That doesn&apos;t look like a jar
            </h2>
            <p className="mt-2 text-gray-600">
              The address in the link isn&apos;t a valid Ethereum address.
            </p>
            <Link
              href="/create"
              className="mt-6 inline-block rounded-lg bg-amber-600 px-6 py-2 font-semibold text-white transition hover:bg-amber-700"
            >
              Create your own jar →
            </Link>
          </section>
        ) : (
          <>
            {/* Hero */}
            <section className="mb-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              <CoffeeCup className="h-24 w-24 shrink-0 drop-shadow-sm sm:h-28 sm:w-28" />
              <div className="min-w-0">
                <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-amber-950 sm:text-4xl">
                  Buy this creator a coffee
                </h2>
                <p className="mt-3 text-base text-amber-900/70 sm:text-lg">
                  Tips and messages go straight to their wallet — no middleman
                  holding the money.
                </p>
                <p className="mt-2 break-all text-xs text-amber-900/50">
                  Jar:{' '}
                  <a
                    href={addressExplorerUrl(jarAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:underline"
                  >
                    {jarAddress}
                  </a>
                  {owner && (
                    <>
                      {' '}
                      · Owner:{' '}
                      <a
                        href={addressExplorerUrl(owner)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-offset-2 hover:underline"
                      >
                        {owner.slice(0, 6)}…{owner.slice(-4)}
                      </a>
                    </>
                  )}
                </p>
              </div>
            </section>

            {/* Live stats for this jar */}
            <StatsBar
              address={jarAddress}
              supporterCount={supporters.count}
              supportersLoading={supporters.loading}
            />

            {/* Tip form + owner withdraw + supporter wall */}
            <JarPanel address={jarAddress} onSupporters={onSupporters} />
          </>
        )}

        <Footer />
      </main>
    </div>
  );
}
