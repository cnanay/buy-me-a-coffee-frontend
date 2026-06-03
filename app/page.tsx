'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { useState } from 'react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';

type Memo = {
  from: `0x${string}`;
  timestamp: bigint;
  name: string;
  message: string;
};

export default function Home() {
  const { address, isConnected } = useAccount();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('0.001');

  // Read the contract owner
  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'owner',
  });

  // Read all memos
  const { data: memos, refetch: refetchMemos } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getMemos',
  });

  // Write functions
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Refetch memos after a successful tx
  if (isSuccess) {
    refetchMemos();
  }

  const handleBuyCoffee = () => {
    if (!name || !message) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'buyCoffee',
      args: [name, message],
      value: parseEther(amount),
    });
  };

  const handleWithdraw = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'withdrawTips',
    });
  };

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();
  const memoList = (memos as Memo[] | undefined) ?? [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-amber-900">☕ Buy Me A Coffee</h1>
          <ConnectButton />
        </div>

        {/* Tip form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Send a tip</h2>

          {!isConnected ? (
            <p className="text-gray-500">Connect your wallet to send a tip.</p>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <textarea
                placeholder="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Amount (ETH):</span>
                <input
                  type="number"
                  step="0.001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                onClick={handleBuyCoffee}
                disabled={isPending || isConfirming || !name || !message}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition"
              >
                {isPending ? 'Confirm in wallet...' : isConfirming ? 'Sending...' : 'Buy a coffee ☕'}
              </button>
              {isSuccess && (
                <p className="text-green-600 text-sm">✓ Tip sent! Thank you.</p>
              )}
            </div>
          )}
        </div>

        {/* Owner withdraw */}
        {isOwner && (
          <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3 text-amber-900">Owner controls</h2>
            <button
              onClick={handleWithdraw}
              disabled={isPending || isConfirming}
              className="bg-amber-700 hover:bg-amber-800 disabled:bg-gray-300 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Withdraw all tips
            </button>
          </div>
        )}

        {/* Memo wall */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Supporters ({memoList.length})
          </h2>
          {memoList.length === 0 ? (
            <p className="text-gray-500">No tips yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {[...memoList].reverse().map((memo, i) => (
                <div key={i} className="border-l-4 border-amber-500 pl-4 py-2">
                  <p className="font-semibold text-gray-800">{memo.name}</p>
                  <p className="text-gray-600 italic">&ldquo;{memo.message}&rdquo;</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {memo.from.slice(0, 6)}...{memo.from.slice(-4)} ·{' '}
                    {new Date(Number(memo.timestamp) * 1000).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}