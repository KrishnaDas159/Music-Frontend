import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Clock, CheckCircle } from "lucide-react";

interface ClaimableReward {
  id: string;
  songTitle: string;
  artist: string;
  claimableAmount: string;
  yieldType: string;
  daysAccrued: number;
  status: "ready" | "pending";
  image: string;
}

export function ClaimableTab() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [claimable, setClaimable] = useState<ClaimableReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClaimableRewards = async () => {
      try {
        if (!userId) {
          throw new Error("User ID not found in URL params");
        }
        const response = await fetch(`http://localhost:3000/api/vaults/${userId}/claimable`);
        if (!response.ok) {
          throw new Error("Failed to fetch claimable rewards");
        }
        const data = await response.json();
        setClaimable(data);
        setError(null);
      } catch (error: any) {
        console.error("Failed to fetch claimable rewards:", error);
        setError("Failed to load claimable rewards. Please try again later.");
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClaimableRewards();
  }, [userId]);

  const totalClaimable = claimable
    .filter((item) => item.status === "ready")
    .reduce((sum, item) => sum + parseFloat(item.claimableAmount.replace("$", "").replace(",", "")), 0);

  return (
    <div className="space-y-6">
      {loading ? (
        <p className="text-gray-500 text-center">Loading claimable rewards...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : claimable.length === 0 ? (
        <Card className="glass-panel p-6 text-center">
          <p className="text-gray-500">No claimable rewards available.</p>
          <Button
            variant="outline"
            className="mt-4 glow-golden"
            onClick={() => navigate("/dashboard")}
          >
            Explore Investment Opportunities
          </Button>
        </Card>
      ) : (
        <>
          <Card className="glass-accent">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Total Claimable Rewards
                  </h3>
                  <div className="text-3xl font-bold text-emerald-600">
                    ${totalClaimable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="text-right">
                  <Button size="lg" className="glow-golden pulse-golden" disabled={totalClaimable === 0}>
                    <Gift className="w-5 h-5 mr-2" />
                    Claim All
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          <div className="grid gap-4">
            {claimable.map((item) => (
              <Card key={item.id} className="glass-panel hover-scale">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image || "https://via.placeholder.com/64?text=No+Image"}
                        alt={item.songTitle}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-lg text-foreground">
                          {item.songTitle}
                        </h4>
                        <p className="text-muted-foreground">{item.artist}</p>
                        <Badge variant="outline" className="mt-2">
                          {item.yieldType}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right space-y-3">
                      <div>
                        <div className="text-2xl font-bold text-emerald-600">
                          {item.claimableAmount}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {item.daysAccrued} days accrued
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.status === "ready" ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-600">Ready to claim</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-600">Processing</span>
                          </>
                        )}
                      </div>
                      <Button
                        variant={item.status === "ready" ? "default" : "outline"}
                        size="sm"
                        disabled={item.status !== "ready"}
                        className={item.status === "ready" ? "glow-golden" : ""}
                      >
                        {item.status === "ready" ? "Claim" : "Pending"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}



// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Gift, Clock, CheckCircle } from "lucide-react";

// const mockClaimable = [
//   {
//     id: 1,
//     songTitle: "Quantum Waves",
//     artist: "Digital Horizon",
//     claimableAmount: "$485.20",
//     yieldType: "Lending Rewards",
//     daysAccrued: 7,
//     status: "ready",
//     image: "/src/assets/album-1.jpg"
//   },
//   {
//     id: 2,
//     songTitle: "Solar Flares",
//     artist: "Cosmic Echo",
//     claimableAmount: "$289.75",
//     yieldType: "Staking Rewards",
//     daysAccrued: 5,
//     status: "ready",
//     image: "/src/assets/album-2.jpg"
//   },
//   {
//     id: 3,
//     songTitle: "Nebula Dreams",
//     artist: "Stellar Wave",
//     claimableAmount: "$156.40",
//     yieldType: "LP Rewards",
//     daysAccrued: 3,
//     status: "pending",
//     image: "/src/assets/album-3.jpg"
//   }
// ];

// export function ClaimableTab() {
//   const totalClaimable = mockClaimable
//     .filter(item => item.status === "ready")
//     .reduce((sum, item) => sum + parseFloat(item.claimableAmount.replace("$", "").replace(",", "")), 0);

//   return (
//     <div className="space-y-6">
//       {/* Summary Card */}
//       <Card className="glass-accent">
//         <div className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-foreground mb-2">
//                 Total Claimable Rewards
//               </h3>
//               <div className="text-3xl font-bold text-emerald-600">
//                 ${totalClaimable.toLocaleString()}
//               </div>
//             </div>
//             <div className="text-right">
//               <Button size="lg" className="glow-golden pulse-golden">
//                 <Gift className="w-5 h-5 mr-2" />
//                 Claim All
//               </Button>
//             </div>
//           </div>
//         </div>
//       </Card>

//       {/* Individual Claimable Items */}
//       <div className="grid gap-4">
//         {mockClaimable.map((item) => (
//           <Card key={item.id} className="glass-panel hover-scale">
//             <div className="p-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <img
//                     src={item.image}
//                     alt={item.songTitle}
//                     className="w-16 h-16 rounded-xl object-cover"
//                   />
//                   <div>
//                     <h4 className="font-semibold text-lg text-foreground">
//                       {item.songTitle}
//                     </h4>
//                     <p className="text-muted-foreground">{item.artist}</p>
//                     <Badge 
//                       variant="outline" 
//                       className="mt-2"
//                     >
//                       {item.yieldType}
//                     </Badge>
//                   </div>
//                 </div>
                
//                 <div className="text-right space-y-3">
//                   <div>
//                     <div className="text-2xl font-bold text-emerald-600">
//                       {item.claimableAmount}
//                     </div>
//                     <div className="flex items-center text-sm text-muted-foreground">
//                       <Clock className="w-4 h-4 mr-1" />
//                       {item.daysAccrued} days accrued
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center space-x-2">
//                     {item.status === "ready" ? (
//                       <>
//                         <CheckCircle className="w-4 h-4 text-emerald-600" />
//                         <span className="text-sm font-medium text-emerald-600">Ready to claim</span>
//                       </>
//                     ) : (
//                       <>
//                         <Clock className="w-4 h-4 text-amber-600" />
//                         <span className="text-sm font-medium text-amber-600">Processing</span>
//                       </>
//                     )}
//                   </div>
                  
//                   <Button 
//                     variant={item.status === "ready" ? "default" : "outline"}
//                     size="sm"
//                     disabled={item.status !== "ready"}
//                     className={item.status === "ready" ? "glow-golden" : ""}
//                   >
//                     {item.status === "ready" ? "Claim" : "Pending"}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }