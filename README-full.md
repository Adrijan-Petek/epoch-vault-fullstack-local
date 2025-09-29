# Epoch Vault — Fullstack (Local Frontend)

This repository contains a self-contained fullstack developer project for **Epoch Vault**.
The frontend is intentionally local-only (no Vercel deployment in workflows). CI workflows build locally and run tests.

## Quickstart

1. Install root deps (use npm or yarn workspace-aware CLI):
```bash
# from repo root
npm ci
cd contracts
npm ci
cd ../frontend
npm ci
```

2. Compile & test contracts
```bash
cd contracts
npx hardhat compile
npx hardhat test
```

3. Run frontend locally
```bash
cd frontend
npm run dev
# open http://localhost:3000
```

## Notes
- Frontend is minimal and uses injected wallet (MetaMask) for local testing.
- Use Hardhat scripts to deploy contracts on local network and interact.
- CI workflows included: contracts CI runs compile & tests; frontend build ensures no build errors locally.

