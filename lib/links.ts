import { CONTRACT_ADDRESS } from './contract';

// Sepolia block explorer helpers
export const ETHERSCAN_BASE = 'https://sepolia.etherscan.io';

export const contractExplorerUrl = `${ETHERSCAN_BASE}/address/${CONTRACT_ADDRESS}`;

export const txExplorerUrl = (hash: `0x${string}`) =>
  `${ETHERSCAN_BASE}/tx/${hash}`;

export const addressExplorerUrl = (address: string) =>
  `${ETHERSCAN_BASE}/address/${address}`;

// Live deployment (custom domain on Vercel)
export const SITE_URL = 'https://buy-me-a-coffee.networktoday.xyz';

// Creator / social links (shown in the footer so people know who they're tipping)
export const GITHUB_PROFILE = 'https://github.com/cnanay';
export const GITHUB_REPOS = {
  contracts: 'https://github.com/cnanay/buy-me-a-coffee-contracts',
  frontend: 'https://github.com/cnanay/buy-me-a-coffee-frontend',
};
