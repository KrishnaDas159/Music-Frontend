import { useState, useEffect } from "react";
import { ArrowLeft, Wallet } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MyTokensTab } from "@/components/vault/MyTokensTab";
import { RevenueVaultsTab } from "@/components/vault/RevenueVaultsTab";
import { ClaimableTab } from "@/components/vault/ClaimableTab";

export default function Vaults() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("my-tokens");
  const [walletConnected, setWalletConnected] = useState(false);
  const [yieldData, setYieldData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    setWalletConnected(true);
    localStorage.setItem("walletConnected", "true");
    localStorage.setItem("walletAddress", "0x742d...8a1b");
  };

  useEffect(() => {
    setWalletConnected(!!localStorage.getItem("walletConnected"));

    const fetchYieldData = async () => {
      if (!userId || !walletConnected) return;
      setLoading(true);
      try {
        const res = await fetch(`https://music-backend-final.onrender.com/api/yield-protocol/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch yield protocol data");
        const data = await res.json();
        setYieldData(data || []);
      } catch (err) {
        console.error("Error fetching yield data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchYieldData();
  }, [userId, walletConnected]);

  const handleStakeVault = async (vaultId) => {
    if (!walletConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    try {
      const res = await fetch("https://music-backend-final.onrender.com/api/yield-protocol/stake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, vaultId, walletAddress: localStorage.getItem("walletAddress") }),
      });
      if (!res.ok) throw new Error("Failed to stake vault");
      const result = await res.json();
      alert(`Vault ${vaultId} staked successfully! Transaction: ${result.transactionId}`);
      const updatedRes = await fetch(`https://music-backend-final.onrender.com/api/yield-protocol/${userId}`);
      const updatedData = await updatedRes.json();
      setYieldData(updatedData || []);
    } catch (err) {
      console.error("Error staking vault:", err);
      alert(`Failed to stake vault: ${err.message}`);
    }
  };

  const handleUnstakeVault = async (vaultId) => {
    if (!walletConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    try {
      const res = await fetch("https://music-backend-final.onrender.com/api/yield-protocol/unstake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, vaultId, walletAddress: localStorage.getItem("walletAddress") }),
      });
      if (!res.ok) throw new Error("Failed to unstake vault");
      const result = await res.json();
      alert(`Vault ${vaultId} unstaked successfully! Transaction: ${result.transactionId}`);
      const updatedRes = await fetch(`https://music-backend-final.onrender.com/api/yield-protocol/${userId}`);
      const updatedData = await updatedRes.json();
      setYieldData(updatedData || []);
    } catch (err) {
      console.error("Error unstaking vault:", err);
      alert(`Failed to unstake vault: ${err.message}`);
    }
  };

  return (
      <div className="min-h-screen emerald-bg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-emerald-700 hover:text-golden-glow hover:bg-golden-glow/10 rounded-xl p-3 glow-golden transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <Button
                onClick={connectWallet}
                className={`glow-golden ${walletConnected ? "bg-emerald-600" : "bg-gradient-to-r from-yellow-400 to-yellow-500"} text-white`}
            >
              <Wallet className="w-5 h-5 mr-2" />
              {walletConnected ? "0x742d...8a1b" : "Connect Wallet"}
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Your Vaults
            </h1>
            <p className="text-lg text-muted-foreground">
              Monitor your investments and harvest your yields with serene ease
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 glass-panel">
              <TabsTrigger
                  value="my-tokens"
                  className="data-[state=active]:glow-golden transition-all duration-500"
              >
                My Tokens
              </TabsTrigger>
              <TabsTrigger
                  value="revenue-vaults"
                  className="data-[state=active]:glow-golden transition-all duration-500"
              >
                Revenue Vaults
              </TabsTrigger>
              <TabsTrigger
                  value="claimable"
                  className="data-[state=active]:glow-golden transition-all duration-500"
              >
                Claimable
              </TabsTrigger>
              <TabsTrigger
                  value="yield-protocol"
                  className="data-[state=active]:glow-golden transition-all duration-500"
              >
                Yield Protocol
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-tokens" className="fade-in">
              <MyTokensTab />
            </TabsContent>

            <TabsContent value="revenue-vaults" className="fade-in">
              <RevenueVaultsTab />
            </TabsContent>

            <TabsContent value="claimable" className="fade-in">
              <ClaimableTab />
            </TabsContent>

            <TabsContent value="yield-protocol" className="fade-in">
              {loading ? (
                  <p className="text-center text-emerald-600">Loading yield protocol data...</p>
              ) : error ? (
                  <p className="text-center text-red-600">Error: {error}</p>
              ) : yieldData.length === 0 ? (
                  <Card className="glass-panel rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                      No Staked Vaults
                    </h3>
                    <p className="text-emerald-600">
                      Stake your vaults to start earning yields!
                    </p>
                  </Card>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {yieldData.map((vault) => (
                        <Card key={vault.id} className="glass-panel rounded-2xl p-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-emerald-800">
                              {vault.title}
                            </h3>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm text-emerald-600">
                                <span>Yield Earned</span>
                                <span className="font-medium text-green-600">
                            {vault.yieldEarned} SUI
                          </span>
                              </div>
                              <div className="flex justify-between text-sm text-emerald-600">
                                <span>Stake Amount</span>
                                <span className="font-medium text-blue-600">
                            {vault.stakeAmount} SUI
                          </span>
                              </div>
                              <div className="flex justify-between text-sm text-emerald-600">
                                <span>Token Price</span>
                                <span className="font-medium text-yellow-600">
                            {vault.tokenPrice} SUI
                          </span>
                              </div>
                              <div className="flex justify-between text-sm text-emerald-600">
                                <span>Status</span>
                                <span className="font-medium text-purple-600">
                            {vault.isStaked ? "Staked" : "Unstaked"}
                          </span>
                              </div>
                              <div className="flex justify-between text-sm text-emerald-600">
                                <span>Protocol</span>
                                <span className="font-medium text-emerald-700">
                            {vault.protocol}
                          </span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <Button
                                  onClick={() => (vault.isStaked ? handleUnstakeVault(vault.id) : handleStakeVault(vault.id))}
                                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                                  disabled={loading}
                              >
                                {vault.isStaked ? "Unstake" : "Stake"}
                              </Button>
                            </div>
                          </div>
                        </Card>
                    ))}
                  </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
}