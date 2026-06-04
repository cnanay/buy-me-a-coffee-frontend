'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseEther } from 'viem';
import { useEffect, useState } from 'react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { addressExplorerUrl } from '@/lib/links';
import { CoffeeCup } from './components/CoffeeCup';
import { StatsBar } from './components/StatsBar';
import { Footer } from './components/Footer';
import { Confetti } from './components/Confetti';
import { TxToast, type TxStatus } from './components/TxToast';

type Memo = {
  from: `0x${string}`;
  timestamp: bigint;
  name: string;
  message: string;
};

const QUICK_PICKS = [
  { label: '☕', amount: '0.001' },
  { label: '☕☕', amount: '0.005' },
  { label: '☕☕☕', amount: '0.01' },
];

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

function shortError(err: unknown): string | undefined {
  if (!err) return undefined;
  const e = err as { shortMessage?: string; message?: string };
  return e.shortMessage ?? e.message ?? 'Transaction failed';
}

export default function Home() {
  const { address, isConnected } = useAccount();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('0.001');
  const [lastAction, setLastAction] = useState<'tip' | 'withdraw' | null>(null);

  // Read the contract owner
  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'owner',
  });

  // Read all memos
  const {
    data: memos,
    refetch: refetchMemos,
    isLoading: memosLoading,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getMemos',
  });

  // Write functions
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

  // Refetch the memo wall once a tip confirms so the new supporter appears.
  // (Only a refetch here — field clearing happens on toast dismiss to keep
  // this effect free of synchronous setState.)
  useEffect(() => {
    if (isSuccess && lastAction === 'tip') {
      refetchMemos();
    }
  }, [isSuccess, lastAction, refetchMemos]);

  const handleBuyCoffee = () => {
    if (!name || !message) return;
    setLastAction('tip');
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'buyCoffee',
      args: [name, message],
      value: parseEther(amount),
    });
  };

  const handleWithdraw = () => {
    setLastAction('withdraw');
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'withdrawTips',
    });
  };

  const dismissToast = () => {
    // Clear the form only after a successful tip is acknowledged.
    if (isSuccess && lastAction === 'tip') {
      setName('');
      setMessage('');
    }
    reset(); // clears hash/isPending/isSuccess so the toast returns to idle
    setLastAction(null);
  };

  const isOwner =
    address && owner && address.toLowerCase() === owner.toLowerCase();
  const memoList = (memos as Memo[] | undefined) ?? [];
  const busy = isPending || isConfirming;

  // Toast only follows the tipping flow (withdraw shows inline feedback).
  let toastStatus: TxStatus = 'idle';
  if (lastAction === 'tip') {
    if (writeError || receiptError) toastStatus = 'error';
    else if (isPending) toastStatus = 'pending';
    else if (isConfirming) toastStatus = 'confirming';
    else if (isSuccess) toastStatus = 'success';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-orange-100">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-amber-900 sm:text-3xl">
            ☕ Buy Me A Coffee
          </h1>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Sepolia Testnet
            </span>
            <ConnectButton
              showBalance={false}
              accountStatus="avatar"
              chainStatus="none"
            />
          </div>
        </header>

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
          </div>
        </section>

        {/* Live stats */}
        <StatsBar
          supporterCount={memoList.length}
          supportersLoading={memosLoading}
        />

        {/* Tip form */}
        <section className="mb-8 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-amber-100 sm:p-8">
          <h2 className="mb-6 text-xl font-semibold text-gray-800 sm:text-2xl">
            Send a tip
          </h2>

          {!isConnected ? (
            <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/50 p-6 text-center">
              <p className="text-2xl">👛</p>
              <p className="mt-2 text-gray-600">
                Connect your wallet to send a tip.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <textarea
                placeholder="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              {/* Quick-pick amounts */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-600">
                  Choose an amount
                </p>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {QUICK_PICKS.map((pick) => {
                    const active = amount === pick.amount;
                    return (
                      <button
                        key={pick.amount}
                        type="button"
                        onClick={() => setAmount(pick.amount)}
                        className={`rounded-xl border px-2 py-3 text-center transition ${
                          active
                            ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400'
                            : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/50'
                        }`}
                      >
                        <span className="block text-lg leading-none">
                          {pick.label}
                        </span>
                        <span className="mt-1 block text-sm font-semibold text-gray-700">
                          {pick.amount} ETH
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Manual amount */}
              <div className="flex items-center gap-2">
                <label htmlFor="amount" className="text-sm text-gray-600">
                  Or enter your own (ETH):
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.001"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-32 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                onClick={handleBuyCoffee}
                disabled={busy || !name || !message || Number(amount) <= 0}
                className="w-full rounded-lg bg-amber-600 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isPending
                  ? 'Confirm in wallet…'
                  : isConfirming
                    ? 'Sending…'
                    : `Buy a coffee for ${amount} ETH ☕`}
              </button>
            </div>
          )}
        </section>

        {/* Owner withdraw */}
        {isOwner && (
          <section className="mb-8 rounded-2xl border-2 border-amber-300 bg-amber-100 p-6">
            <h2 className="mb-3 text-lg font-semibold text-amber-900 sm:text-xl">
              Owner controls
            </h2>
            <button
              onClick={handleWithdraw}
              disabled={busy}
              className="rounded-lg bg-amber-700 px-6 py-2 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {lastAction === 'withdraw' && busy
                ? 'Withdrawing…'
                : 'Withdraw all tips'}
            </button>
            {lastAction === 'withdraw' && isSuccess && (
              <p className="mt-3 text-sm font-medium text-green-700">
                ✓ Tips withdrawn to your wallet.
              </p>
            )}
            {lastAction === 'withdraw' && (writeError || receiptError) && (
              <p className="mt-3 text-sm font-medium text-red-700">
                {shortError(writeError ?? receiptError)}
              </p>
            )}
          </section>
        )}

        {/* Memo wall */}
        <section className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-amber-100 sm:p-8">
          <h2 className="mb-6 text-xl font-semibold text-gray-800 sm:text-2xl">
            Supporters{' '}
            {!memosLoading && (
              <span className="text-amber-600">({memoList.length})</span>
            )}
          </h2>

          {memosLoading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="border-l-4 border-amber-200 py-2 pl-4">
                  <div className="skeleton h-4 w-28 rounded" />
                  <div className="skeleton mt-2 h-4 w-3/4 rounded" />
                  <div className="skeleton mt-2 h-3 w-40 rounded" />
                </div>
              ))}
            </div>
          ) : memoList.length === 0 ? (
            <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/40 py-10 text-center">
              <p className="text-4xl">🫖</p>
              <p className="mt-3 font-medium text-gray-700">No tips yet.</p>
              <p className="text-sm text-gray-500">
                Be the first to buy a coffee!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...memoList].reverse().map((memo, i) => (
                <div
                  key={`${memo.from}-${memo.timestamp}-${i}`}
                  className="rounded-r-lg border-l-4 border-amber-500 bg-amber-50/30 py-2 pl-4 pr-2"
                >
                  <p className="font-semibold text-gray-800">{memo.name}</p>
                  <p className="italic text-gray-600">
                    &ldquo;{memo.message}&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    <a
                      href={addressExplorerUrl(memo.from)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-amber-600 hover:underline"
                    >
                      {memo.from.slice(0, 6)}…{memo.from.slice(-4)}
                    </a>{' '}
                    · {new Date(Number(memo.timestamp) * 1000).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

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

      {/* Global overlays */}
      <TxToast
        status={toastStatus}
        hash={hash}
        errorMessage={shortError(writeError ?? receiptError)}
        onDismiss={dismissToast}
      />
      {toastStatus === 'success' && <Confetti />}
    </div>
  );
}
