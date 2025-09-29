import { useState } from 'react';

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('0');

  // Placeholder connect function - instruct user to use local wallet (e.g., Hardhat/MetaMask)
  const connect = async () => {
    if ((window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
        setConnected(true);
      } catch (e) {
        console.error(e);
      }
    } else {
      alert('Install MetaMask or use an injected wallet for local testing.');
    }
  };

  const deposit = async () => {
    alert('This frontend is a local placeholder. Use scripts/deploy and interact via Hardhat console or extend this UI.');
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'Inter, Arial' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Epoch Vault — Local Dashboard</h1>
        {connected ? <div>Connected: {address.substring(0,6)}...{address.slice(-4)}</div> : <button onClick={connect}>Connect Wallet</button>}
      </header>

      <section style={{ marginTop: 24 }}>
        <h2>Deposit</h2>
        <p>Approve token in local Hardhat network then deposit via scripts or extend this UI.</p>
        <input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount (MCK)" />
        <button onClick={deposit} style={{ marginLeft: 8 }}>Deposit</button>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Notes</h2>
        <ul>
          <li>This dashboard is intentionally minimal and works locally.</li>
          <li>Use Hardhat scripts for deploy & interactions: <code>cd contracts && npx hardhat run scripts/deploy.js --network hardhat</code></li>
          <li>Extend the frontend to interact directly with deployed contracts via ethers.js.</li>
        </ul>
      </section>
    </div>
  )
}
