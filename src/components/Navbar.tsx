import React, { useEffect } from 'react';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import { usePrivy } from '@privy-io/react-auth';


const Navbar: React.FC = () => {
    const { name, address: suiAddress, connected } = useWallet();
    const { authenticated, user, login, logout } = usePrivy();

    useEffect(() => {
        if (!connected) return
        console.log('🔗 Connected Sui Wallet:', {
            name,
            address: suiAddress,
        })
    }, [connected]);

    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md z-50">
            <div className="text-xl font-bold">TrueValue</div>

            <div className="flex gap-4">
                <ConnectButton label='Connect SUI Wallet' className='bg-blue-600 rounded text-sm' />


                <button
                    onClick={() => !authenticated && login()}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-md font-bold"
                >
                    {authenticated
                        ? `EVM: ${user.wallet.address?.slice(0, 6)}...${user.wallet.address?.slice(-4)}`
                        : 'Connect EVM Wallet'}
                </button>
                {authenticated && <button onClick={logout} className='bg-red-500 text-white p-2 text-md  rounded-xl  font-bold'>Logout EVM wallet</button>}
            </div>
        </nav>
    );
};

export default Navbar;
