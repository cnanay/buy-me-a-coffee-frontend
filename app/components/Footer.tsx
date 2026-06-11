import { CONTRACT_ADDRESS } from '@/lib/contract';
import { FACTORY_ADDRESS } from '@/lib/factory';
import {
  addressExplorerUrl,
  contractExplorerUrl,
  GITHUB_PROFILE,
  GITHUB_REPOS,
} from '@/lib/links';

const short = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;
const shortAddress = short(CONTRACT_ADDRESS);

export function Footer() {
  return (
    <footer className="mt-12 border-t border-amber-200/70 pt-8 pb-4 text-sm text-amber-900/70">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-semibold text-amber-900">Buy Me A Coffee</p>
          <p className="mt-1 max-w-xs text-amber-900/60">
            An on-chain tip jar built by{' '}
            <a
              href={GITHUB_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-700 underline-offset-2 hover:underline"
            >
              @cnanay
            </a>
            . Create your own jar and get tipped on-chain — running on the
            Sepolia testnet.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-900/50">
            Links
          </span>
          <a
            href={contractExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 underline-offset-2 hover:underline"
          >
            Contract on Etherscan ({shortAddress}) ↗
          </a>
          {FACTORY_ADDRESS && (
            <a
              href={addressExplorerUrl(FACTORY_ADDRESS)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 underline-offset-2 hover:underline"
            >
              Jar factory on Etherscan ({short(FACTORY_ADDRESS)}) ↗
            </a>
          )}
          <a
            href={GITHUB_REPOS.contracts}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 underline-offset-2 hover:underline"
          >
            GitHub · Smart contracts ↗
          </a>
          <a
            href={GITHUB_REPOS.frontend}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 underline-offset-2 hover:underline"
          >
            GitHub · Frontend ↗
          </a>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-amber-900/40">
        Tips are real on-chain transactions on Sepolia test ETH — no real money
        involved.
      </p>
    </footer>
  );
}
