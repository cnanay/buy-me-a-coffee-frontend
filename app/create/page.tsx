'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { FACTORY_ADDRESS, FACTORY_ABI } from '@/lib/factory';
import { addressExplorerUrl } from '@/lib/links';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Confetti } from '../components/Confetti';

const PERKS = [
  {
    icon: '🔑',
    title: 'You own it',
    body: 'The jar is a contract owned by your wallet. Only you can withdraw your tips — we never hold your money.',
  },
  {
    icon: '🌍',
    title: 'No signup, no KYC',
    body: 'No bank account, no country restrictions, no platform that can ban you. Connect a wallet and you’re live.',
  },
  {
    icon: '🧾',
    title: 'Fair, capped fee',
    body: 'A small platform fee on each tip (2.5% today) — hard-capped at 10% by the contract itself, forever.',
  },
];

function shortError(err: unknown): string | undefined {
  if (!err) return undefined;
  const e = err as { shortMessage?: string; message?: string };
  return e.shortMessage ?? e.message ?? 'Transaction failed';
}

function jarUrl(jar: string) {
  return `/jar/${jar}`;
}

function CopyLinkButton({ jar }: { jar: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(`${window.location.origin}${jarUrl(jar)}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-50"
    >
      {copied ? '✓ Copied!' : 'Copy share link'}
    </button>
  );
}

export default function CreateJar() {
  const { address, isConnected } = useAccount();

  // The default fee new jars are created with (basis points).
  const { data: feeBps } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'defaultFeeBps',
  });

  // Jars this wallet has already created.
  const { data: myJars, refetch: refetchJars } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'jarsOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
    reset,
  } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash });

  // Once creation confirms, refresh the jar list — the newest entry is theirs.
  useEffect(() => {
    if (isSuccess) refetchJars();
  }, [isSuccess, refetchJars]);

  const jars = (myJars as readonly `0x${string}`[] | undefined) ?? [];
  const newestJar = isSuccess && jars.length > 0 ? jars[jars.length - 1] : null;
  const busy = isPending || isConfirming;
  const error = shortError(writeError ?? receiptError);
  const feePercent = feeBps !== undefined ? Number(feeBps) / 100 : null;

  const handleCreate = () => {
    reset();
    writeContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: 'createJar',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-orange-100">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Header />

        {/* Hero */}
        <section className="mb-10 text-center sm:text-left">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-amber-950 sm:text-4xl">
            Get your own tip jar
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-amber-900/70 sm:mx-0 sm:text-lg">
            One click deploys a tip jar contract that belongs to your wallet.
            Share your link anywhere — README, blog, bio — and receive tips with
            messages, straight on-chain.
          </p>
        </section>

        {/* Perks */}
        <section className="mb-10 grid gap-4 sm:grid-cols-3">
          {PERKS.map((perk) => (
            <div
              key={perk.title}
              className="rounded-2xl bg-white/70 p-5 ring-1 ring-amber-100"
            >
              <div className="text-3xl">{perk.icon}</div>
              <h3 className="mt-2 font-semibold text-amber-900">
                {perk.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600">{perk.body}</p>
            </div>
          ))}
        </section>

        {/* Create */}
        <section className="mb-8 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-amber-100 sm:p-8">
          {!isConnected ? (
            <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/50 p-6 text-center">
              <p className="text-2xl">👛</p>
              <p className="mt-2 text-gray-600">
                Connect your wallet to create your jar.
              </p>
            </div>
          ) : newestJar ? (
            <div className="text-center">
              <p className="text-4xl">🎉</p>
              <h3 className="mt-3 text-xl font-bold text-amber-950 sm:text-2xl">
                Your jar is live!
              </h3>
              <p className="mt-2 break-all text-sm text-gray-500">
                {newestJar}
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href={jarUrl(newestJar)}
                  className="rounded-lg bg-amber-600 px-6 py-2 font-semibold text-white transition hover:bg-amber-700"
                >
                  Open your jar page →
                </Link>
                <CopyLinkButton jar={newestJar} />
                <a
                  href={addressExplorerUrl(newestJar)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-amber-700 underline-offset-2 hover:underline"
                >
                  View on Etherscan ↗
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={handleCreate}
                disabled={busy}
                className="w-full rounded-lg bg-amber-600 py-3 text-lg font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto sm:px-10"
              >
                {isPending
                  ? 'Confirm in wallet…'
                  : isConfirming
                    ? 'Deploying your jar…'
                    : 'Create my tip jar ☕'}
              </button>
              <p className="mt-3 text-xs text-gray-500">
                Deploys a contract owned by your wallet
                {feePercent !== null && (
                  <> · {feePercent}% platform fee on tips</>
                )}{' '}
                · only gas to pay
              </p>
              {error && (
                <p className="mt-3 text-sm font-medium text-red-700">{error}</p>
              )}
            </div>
          )}
        </section>

        {/* Existing jars */}
        {isConnected && jars.length > 0 && !newestJar && (
          <section className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-amber-100 sm:p-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 sm:text-xl">
              Your jars ({jars.length})
            </h3>
            <ul className="space-y-3">
              {jars.map((jar) => (
                <li
                  key={jar}
                  className="flex flex-col gap-2 rounded-xl border border-amber-100 bg-amber-50/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="break-all font-mono text-sm text-gray-700">
                    {jar.slice(0, 10)}…{jar.slice(-8)}
                  </span>
                  <span className="flex items-center gap-3">
                    <Link
                      href={jarUrl(jar)}
                      className="text-sm font-semibold text-amber-700 underline-offset-2 hover:underline"
                    >
                      Open →
                    </Link>
                    <CopyLinkButton jar={jar} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Footer />
      </main>

      {newestJar && <Confetti />}
    </div>
  );
}
