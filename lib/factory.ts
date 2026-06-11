// CoffeeFactory — lets anyone deploy their own tip jar (BuyMeACoffeeV2).
// The platform earns a small capped fee on tips across all jars.
export const FACTORY_ADDRESS = process.env
  .NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`;

export const FACTORY_ABI = [
  {
    inputs: [],
    name: 'createJar',
    outputs: [{ internalType: 'address', name: 'jar', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'creator', type: 'address' }],
    name: 'jarsOf',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllJars',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'jarCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'defaultFeeBps',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
      { indexed: true, internalType: 'address', name: 'jar', type: 'address' },
      { indexed: false, internalType: 'uint16', name: 'feeBps', type: 'uint16' },
    ],
    name: 'JarCreated',
    type: 'event',
  },
] as const;

// BuyMeACoffeeV2 jars expose the same tipping interface as the original
// contract (buyCoffee / getMemos / owner / withdrawTips — see lib/contract.ts),
// plus the fee fields below that we read for transparency on jar pages.
export const JAR_EXTRA_ABI = [
  {
    inputs: [],
    name: 'feeBps',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
