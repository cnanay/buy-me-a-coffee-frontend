import { formatEther } from 'viem';
import { CONTRACT_ADDRESS } from '@/lib/contract';

// The contract's Memo struct doesn't store the tip amount, so we recover it from
// each transaction's value via the Etherscan API (the same source Etherscan's UI
// uses). Done server-side here so the API key never reaches the browser.

type EtherscanTx = {
  value: string;
  hash: string;
  isError: string;
  to: string;
};

const SEPOLIA_CHAIN_ID = 11155111;

export async function GET() {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  if (!apiKey) {
    return Response.json({ tips: [], total: '0', error: 'missing-key' });
  }

  const url =
    `https://api.etherscan.io/v2/api?chainid=${SEPOLIA_CHAIN_ID}` +
    `&module=account&action=txlist&address=${CONTRACT_ADDRESS}` +
    `&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

  let data: { status: string; result: EtherscanTx[] | string };
  try {
    const res = await fetch(url);
    data = await res.json();
  } catch {
    return Response.json({ tips: [], total: '0', error: 'fetch-failed' });
  }

  if (data.status !== '1' || !Array.isArray(data.result)) {
    // "No transactions found" or an upstream error — return empty gracefully.
    return Response.json({ tips: [], total: '0' });
  }

  // buyCoffee is the only payable function and the contract has no fallback, so
  // every successful (isError=0) value>0 tx to the contract is a tip. These line
  // up 1:1, in ascending order, with the memos from getMemos().
  const coffeeTxs = data.result.filter(
    (tx) =>
      tx.isError === '0' &&
      tx.to.toLowerCase() === CONTRACT_ADDRESS.toLowerCase() &&
      BigInt(tx.value) > BigInt(0),
  );

  const totalWei = coffeeTxs.reduce(
    (sum, tx) => sum + BigInt(tx.value),
    BigInt(0),
  );
  const tips = coffeeTxs.map((tx) => ({
    amount: formatEther(BigInt(tx.value)),
    hash: tx.hash as `0x${string}`,
  }));

  return Response.json(
    { tips, total: formatEther(totalWei) },
    {
      headers: {
        // Let the CDN cache briefly so we don't hammer Etherscan on every load.
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    },
  );
}
