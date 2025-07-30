# Buy Me a Coffee DApp ☕️

A full-stack Web3 decentralized application (DApp) that lets users fund a smart contract with ETH and view all contributors and their funded amounts. Built with TypeScript, Vite, and Viem for a modern, fast, and type-safe developer experience.

---

## 🚀 Features

- **Connect Wallet:** Seamless MetaMask (or any EIP-1193 wallet) integration.
- **Fund Contract:** Send ETH to the contract with a single click.
- **Withdraw:** Owner can withdraw all funds from the contract.
- **Get Balance:** View the contract’s ETH balance.
- **View Contributors:** List all addresses that have funded the contract and their respective amounts.
- **TypeScript & Vite:** Fast development, hot reload, and type safety.

---

## 🛠️ Tech Stack

- **Frontend:** TypeScript, Vite, Viem, HTML, CSS
- **Smart Contract:** Solidity (FundMe contract)
- **Wallet Support:** MetaMask (window.ethereum)
- **Bundler:** Vite

---

## 📦 Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/full-stack-web3-cu.git
   cd full-stack-web3-cu/html-ts-coffee-cu
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   pnpm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Deploy the smart contract:**
   - Deploy the FundMe contract to your local or testnet Ethereum node.
   - Update the contract address in `constants-ts.ts`.

---

## 📝 Usage

- **Connect:** Click "Connect" to link your wallet.
- **Fund:** Enter an ETH amount and click "Buy Coffee" to fund the contract.
- **Withdraw:** (Owner only) Withdraw all funds.
- **Get Balance:** View the contract’s ETH balance.
- **Get User Address:** List all funders and their contributions.

---

## 📂 Project Structure

```
html-ts-coffee-cu/
├── index.html
├── index-ts.ts
├── constants-ts.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── ...
```

---

## 🤝 Contributing

Pull requests and stars are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT

---

## 🙏 Acknowledgements

- [Viem](https://viem.sh/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
