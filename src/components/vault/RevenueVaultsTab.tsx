import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Coins, Users } from "lucide-react";

interface RevenueVault {
  id: string;
  songTitle: string;
  artist: string;
  totalInvested: string;
  vaultBalance: string;
  apy: string;
  investors: number;
  utilization: number;
  protocol: string;
  image: string;
}

export function RevenueVaultsTab() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [vaults, setVaults] = useState<RevenueVault[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRevenueVaults = async () => {
      try {
        if (!userId) {
          throw new Error("User ID not found in URL params");
        }
        const response = await fetch(`http://localhost:3000/api/vaults/${userId}/revenue`);
        if (!response.ok) {
          throw new Error("Failed to fetch revenue vaults");
        }
        const data = await response.json();
        setVaults(data);
        setError(null);
      } catch (error: any) {
        console.error("Failed to fetch revenue vaults:", error);
        setError("Failed to load revenue vaults. Please try again later.");
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueVaults();
  }, [userId]);

  return (
    <div className="space-y-6">
      {loading ? (
        <p className="text-gray-500 text-center">Loading revenue vaults...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : vaults.length === 0 ? (
        <Card className="glass-panel p-6 text-center">
          <p className="text-gray-500">No revenue vaults found.</p>
          <Button
            variant="outline"
            className="mt-4 glow-golden"
            onClick={() => navigate("/dashboard")}
          >
            Explore Investment Opportunities
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {vaults.map((vault) => (
            <Card key={vault.id} className="glass-panel hover-scale">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={vault.image || "https://via.placeholder.com/80?text=No+Image"}
                      alt={vault.songTitle}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-xl text-foreground">
                        {vault.songTitle}
                      </h3>
                      <p className="text-muted-foreground text-lg">{vault.artist}</p>
                      <Badge variant="outline" className="mt-2">
                        {vault.protocol}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">
                      {vault.apy}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current APY
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Invested</span>
                      <Coins className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-semibold">{vault.totalInvested}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Vault Balance</span>
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-semibold">{vault.vaultBalance}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Investors</span>
                      <Users className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-semibold">{vault.investors}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Vault Utilization</span>
                    <span className="text-sm font-medium">{vault.utilization}%</span>
                  </div>
                  <Progress value={vault.utilization} className="h-2" />
                </div>
                <div className="flex gap-3 mt-6">
                  <Button className="flex-1 glow-golden">
                    Invest More
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/vaults/${userId}/analytics/${vault.id}`)}
                  >
                    View Analytics
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}




// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { TrendingUp, Coins, Users } from "lucide-react";

// const mockVaults = [
//   {
//     id: 1,
//     songTitle: "Midnight Symphony",
//     artist: "Aurora Collective",
//     totalInvested: "$5,200",
//     vaultBalance: "$6,840",
//     apy: "15.2%",
//     investors: 142,
//     utilization: 78,
//     protocol: "Cetus Finance",
//     image: "/src/assets/album-1.jpg"
//   },
//   {
//     id: 2,
//     songTitle: "Ocean Depths",
//     artist: "Tidal Force",
//     totalInvested: "$3,800",
//     vaultBalance: "$4,560",
//     apy: "12.8%",
//     investors: 89,
//     utilization: 65,
//     protocol: "Sui Lend",
//     image: "/src/assets/album-2.jpg"
//   },
//   {
//     id: 3,
//     songTitle: "Stellar Journey",
//     artist: "Cosmic Drift",
//     totalInvested: "$7,100",
//     vaultBalance: "$8,920",
//     apy: "18.5%",
//     investors: 203,
//     utilization: 84,
//     protocol: "Scallop",
//     image: "/src/assets/album-3.jpg"
//   }
// ];

// export function RevenueVaultsTab() {
//   return (
//     <div className="space-y-6">
//       <div className="grid gap-6">
//         {mockVaults.map((vault) => (
//           <Card key={vault.id} className="glass-panel hover-scale">
//             <div className="p-6">
//               <div className="flex items-start justify-between mb-6">
//                 <div className="flex items-center space-x-4">
//                   <img
//                     src={vault.image}
//                     alt={vault.songTitle}
//                     className="w-20 h-20 rounded-xl object-cover"
//                   />
//                   <div>
//                     <h3 className="font-semibold text-xl text-foreground">
//                       {vault.songTitle}
//                     </h3>
//                     <p className="text-muted-foreground text-lg">{vault.artist}</p>
//                     <Badge variant="outline" className="mt-2">
//                       {vault.protocol}
//                     </Badge>
//                   </div>
//                 </div>
                
//                 <div className="text-right">
//                   <div className="text-3xl font-bold text-emerald-600 mb-1">
//                     {vault.apy}
//                   </div>
//                   <div className="text-sm text-muted-foreground">
//                     Current APY
//                   </div>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-muted-foreground">Total Invested</span>
//                     <Coins className="w-4 h-4 text-muted-foreground" />
//                   </div>
//                   <div className="text-2xl font-semibold">{vault.totalInvested}</div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-muted-foreground">Vault Balance</span>
//                     <TrendingUp className="w-4 h-4 text-emerald-600" />
//                   </div>
//                   <div className="text-2xl font-semibold">{vault.vaultBalance}</div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-muted-foreground">Investors</span>
//                     <Users className="w-4 h-4 text-muted-foreground" />
//                   </div>
//                   <div className="text-2xl font-semibold">{vault.investors}</div>
//                 </div>
//               </div>
              
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-muted-foreground">Vault Utilization</span>
//                   <span className="text-sm font-medium">{vault.utilization}%</span>
//                 </div>
//                 <Progress value={vault.utilization} className="h-2" />
//               </div>
              
//               <div className="flex gap-3 mt-6">
//                 <Button className="flex-1 glow-golden">
//                   Invest More
//                 </Button>
//                 <Button variant="outline" className="flex-1">
//                   View Analytics
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }