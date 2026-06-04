'use client';

import { useEffect } from 'react';
import { txExplorerUrl } from '@/lib/links';

export type TxStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'error';

type Props = {
  status: TxStatus;
  hash?: `0x${string}`;
  errorMessage?: string;
  onDismiss: () => void;
};

const CONFIG: Record<
  Exclude<TxStatus, 'idle'>,
  { icon: string; title: string; body: string; accent: string; spin: boolean }
> = {
  pending: {
    icon: '🦊',
    title: 'Confirm in your wallet',
    body: 'Approve the transaction to send your tip.',
    accent: 'border-amber-300',
    spin: true,
  },
  confirming: {
    icon: '☕',
    title: 'Brewing your tip…',
    body: 'Waiting for the transaction to confirm on-chain.',
    accent: 'border-amber-400',
    spin: true,
  },
  success: {
    icon: '✅',
    title: 'Tip sent — thank you!',
    body: 'Your coffee is on its way.',
    accent: 'border-green-400',
    spin: false,
  },
  error: {
    icon: '⚠️',
    title: 'Transaction failed',
    body: 'Something went wrong. No tip was sent.',
    accent: 'border-red-400',
    spin: false,
  },
};

export function TxToast({ status, hash, errorMessage, onDismiss }: Props) {
  // Auto-dismiss terminal states after a few seconds.
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const t = setTimeout(onDismiss, 7000);
      return () => clearTimeout(t);
    }
  }, [status, onDismiss]);

  if (status === 'idle') return null;

  const cfg = CONFIG[status];

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:inset-x-auto sm:right-6 sm:justify-end"
    >
      <div
        className={`toast-in flex w-full max-w-sm items-start gap-3 rounded-xl border-l-4 bg-white p-4 shadow-xl ring-1 ring-black/5 ${cfg.accent}`}
      >
        <span
          className={`text-xl ${cfg.spin ? 'animate-pulse' : ''}`}
          aria-hidden
        >
          {cfg.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900">{cfg.title}</p>
          <p className="text-sm text-gray-500">
            {status === 'error' && errorMessage ? errorMessage : cfg.body}
          </p>
          {hash && status !== 'pending' && (
            <a
              href={txExplorerUrl(hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm font-medium text-amber-700 underline-offset-2 hover:underline"
            >
              View on Etherscan ↗
            </a>
          )}
        </div>
        <button
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="-mr-1 -mt-1 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
