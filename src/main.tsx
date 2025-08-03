import { createRoot } from 'react-dom/client'
import './index.css'
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import App from './App';
import Navbar from './components/Navbar';
import { PrivyProvider } from '@privy-io/react-auth';

createRoot(document.getElementById("root")!).render(
    <WalletProvider>
        <PrivyProvider
            appId={`cmd4fig7x03wrjw0muoiceh5u`}
            config={{
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                    requireUserPasswordOnCreate: true,
                    showWalletUIs: true
                },
                loginMethods: ['wallet'],
                appearance: { walletChainType: 'ethereum-only',walletList:["detected_ethereum_wallets","wallet_connect"] }
            }}
        >
            <Navbar />
            <App />
        </PrivyProvider>
    </WalletProvider>

);
