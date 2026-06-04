# ☕ Buy Me A Coffee — on-chain tip jar

A web3 "buy me a coffee" tip jar. Anyone can send a small tip along with a name
and a message; the tip and message are stored **permanently on-chain**, and only
the contract owner can withdraw the collected funds.

🔗 **Live demo:** https://buy-me-a-coffee.networktoday.xyz
⛓️ **Network:** Ethereum **Sepolia** testnet (test ETH — no real money)
📄 **Contract:** [`0xf17bf8F6E1Eec4Fdd7EfB9406eA8d7B1Fa8959D4`](https://sepolia.etherscan.io/address/0xf17bf8F6E1Eec4Fdd7EfB9406eA8d7B1Fa8959D4)
🛠️ **Smart contracts repo:** https://github.com/cnanay/buy-me-a-coffee-contracts

This is the **frontend**. The Solidity contract, tests and deploy script live in
the [contracts repo](https://github.com/cnanay/buy-me-a-coffee-contracts).

---

## Features

- **Connect any wallet** via RainbowKit + WalletConnect (Sepolia only)
- **Send a tip** with your name, a message, and an amount
  - Quick-pick amounts (☕ 0.001 / ☕☕ 0.005 / ☕☕☕ 0.01 ETH) or a custom value
- **Live stats** — current jar balance and total supporter count, read on-chain
- **Supporter wall** — every memo with the tipper's address, timestamp, the
  **ETH amount** of each tip, and a link to the transaction, with pagination
- **Transaction status toast** (pending → confirming → success/error) with an
  Etherscan link, plus a confetti burst on a successful tip
- **Owner controls** — the contract owner sees a "Withdraw all tips" button
- Fully **responsive**, uses the **Inter** font via `next/font`

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [wagmi](https://wagmi.sh) + [viem](https://viem.sh) for contract reads/writes
- [RainbowKit](https://www.rainbowkit.com) for wallet connection
- [TanStack Query](https://tanstack.com/query) for data fetching/caching
- [Etherscan API](https://docs.etherscan.io) for per-tip amounts (see below)

## How it works

The contract's `getMemos()` returns each tip's `name`, `message`, `from` and
`timestamp` — but **not** the ETH amount (the `Memo` struct doesn't store it).
To show the amount per tip, a small server-side route handler at
[`app/api/tips`](app/api/tips/route.ts) queries the Etherscan API for the
contract's transactions and recovers each tip's value. Running it server-side
keeps the Etherscan API key out of the browser.

## Getting started

### Prerequisites

- Node.js 18.18+
- A [WalletConnect Cloud](https://cloud.walletconnect.com) project ID
- An [Etherscan API key](https://etherscan.io/myapikey) (free)

### Setup

```bash
git clone https://github.com/cnanay/buy-me-a-coffee-frontend.git
cd buy-me-a-coffee-frontend
npm install
```

Create a `.env.local` in the project root:

```bash
# Wallet connection (https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Deployed BuyMeACoffee contract on Sepolia
NEXT_PUBLIC_CONTRACT_ADDRESS=0xf17bf8F6E1Eec4Fdd7EfB9406eA8d7B1Fa8959D4

# Server-side only — used by /api/tips to read tip amounts (NOT NEXT_PUBLIC_)
ETHERSCAN_API_KEY=your_etherscan_api_key
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To send a tip you'll need a
wallet on Sepolia with some test ETH from a [faucet](https://sepoliafaucet.com).

## Environment variables

| Variable                               | Required | Exposed to browser | Purpose                                       |
| -------------------------------------- | :------: | :----------------: | --------------------------------------------- |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` |    ✅    |        Yes         | WalletConnect / RainbowKit wallet connection  |
| `NEXT_PUBLIC_CONTRACT_ADDRESS`         |    ✅    |        Yes         | Address of the deployed BuyMeACoffee contract |
| `ETHERSCAN_API_KEY`                    |    ✅    |      **No**        | Server-side lookup of per-tip ETH amounts     |

> Without `ETHERSCAN_API_KEY` the app still works — the amount badges simply
> don't appear (graceful fallback).

## Deployment

Deployed on [Vercel](https://vercel.com). Push to `main` to trigger a deploy, and
add the three environment variables above in **Project → Settings → Environment
Variables** (`ETHERSCAN_API_KEY` must **not** be prefixed with `NEXT_PUBLIC_`).

## Scripts

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run ESLint
```

## Author

Built by **Chamira Lakmal** ([@cnanay](https://github.com/cnanay)).
