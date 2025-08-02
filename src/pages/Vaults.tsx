import { useState } from "react";
import { ArrowLeft, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MyTokensTab } from "@/components/vault/MyTokensTab";
import { RevenueVaultsTab } from "@/components/vault/RevenueVaultsTab";
import { ClaimableTab } from "@/components/vault/ClaimableTab";

export default function Vaults() {
  const [activeTab, setActiveTab] = useState("my-tokens");
  const [walletConnected, setWalletConnected] = useState(false);

  const connectWallet = () => {
    setWalletConnected(true);
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
            className={`glow-golden ${walletConnected ? 'bg-emerald-600' : ''}`}
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
          <TabsList className="grid w-full grid-cols-3 glass-panel">
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
        </Tabs>
      </div>
    </div>
  );
}




