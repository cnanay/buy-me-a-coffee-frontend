'use client';

import { useBalance } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESS } from '@/lib/contract';

type Props = {
  supporterCount: number;
  supportersLoading: boolean;
  /** Which jar to show the balance of (defaults to the original contract). */
  address?: `0x${string}`;
};

function StatCard({
  label,
  value,
  loading,
  icon,
}: {
  label: string;
  value: string;
  loading: boolean;
  icon: string;
}) {
  return (
    <div className="flex-1 rounded-2xl bg-white/70 p-5 text-center shadow-sm ring-1 ring-amber-100 backdrop-blur sm:text-left">
      <div className="flex items-center justify-center gap-2 sm:justify-start">
        <span className="text-2xl" aria-hidden>
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-amber-900/50">
          {label}
        </span>
      </div>
      {loading ? (
        <div className="skeleton mx-auto mt-3 h-8 w-28 rounded-md sm:mx-0" />
      ) : (
        <p className="mt-2 text-3xl font-bold text-amber-900">{value}</p>
      )}
    </div>
  );
}

export function StatsBar({
  supporterCount,
  supportersLoading,
  address = CONTRACT_ADDRESS,
}: Props) {
  // Live contract balance. Note: this is the jar's *current* balance — it
  // drops back to 0 after the owner withdraws, since the contract doesn't
  // store a cumulative lifetime total.
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address,
    chainId: sepolia.id,
  });

  const ethValue = balance
    ? `${Number(formatEther(balance.value)).toFixed(4)} ETH`
    : '0 ETH';

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row">
      <StatCard
        label="In the jar"
        value={ethValue}
        loading={balanceLoading}
        icon="💰"
      />
      <StatCard
        label="Supporters"
        value={supporterCount.toString()}
        loading={supportersLoading}
        icon="🙌"
      />
    </div>
  );
}
