import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowUpRight } from "lucide-react";

interface Token {
  id: string;
  image: string;
  songTitle: string;
  artist: string;
  tokensOwned: number;
  currentValue: string;
  change: string;
}

export function MyTokensTab() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        if (!userId) {
          throw new Error("User ID not found in URL params");
        }
        const response = await fetch(`http://localhost:3000/api/vaults/${userId}/nfts`);
        if (!response.ok) {
          throw new Error("Failed to fetch tokens");
        }
        const data = await response.json();
        const formattedTokens = (data[userId] || []).map((item: any) => ({
          id: item.id,
          image: item.cover || "https://via.placeholder.com/64?text=No+Image",
          songTitle: item.title,
          artist: item.artist,
          tokensOwned: item.owned,
          currentValue: item.earnings,
          change: item.change || "0%", // Fallback if not provided
        }));
        setTokens(formattedTokens);
        setError(null);
      } catch (error: any) {
        console.error("Failed to fetch vaults:", error);
        setError("Failed to load tokens. Please try again later.");
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [userId]);

  return (
    <div className="space-y-6">
      {loading ? (
        <p className="text-gray-500 text-center">Loading tokens...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : tokens.length === 0 ? (
        <Card className="glass-panel p-6 text-center">
          <p className="text-gray-500">No tokens owned yet.</p>
          <Button
            variant="outline"
            className="mt-4 glow-golden"
            onClick={() => navigate("/dashboard")}
          >
            Explore Music to Buy Tokens
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tokens.map((token) => (
            <Card key={token.id} className="glass-panel hover-scale group cursor-pointer">
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={token.image}
                    alt={token.songTitle}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-foreground truncate">
                      {token.songTitle}
                    </h3>
                    <p className="text-muted-foreground">{token.artist}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tokens Owned</span>
                    <Badge variant="secondary" className="font-medium">
                      {token.tokensOwned}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Value</span>
                    <span className="font-semibold text-lg">{token.currentValue}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">24h Change</span>
                    <div className="flex items-center space-x-1 text-emerald-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">{token.change}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full glow-golden"
                    onClick={() => navigate(`/music/${token.id}`)}
                  >
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    View Details
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




// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { TrendingUp, ArrowUpRight } from "lucide-react";

// export function MyTokensTab() {
//   const { userId } = useParams(); 
//   const [tokens, setTokens] = useState([]);

//   useEffect(() => {
//     const fetchTokens = async () => {
//       try {
//         const response = await fetch(`http://localhost:3000/api/vaults/${userId}/nfts`);
//         const data = await response.json();

//         if (!userId) {
//           console.warn("User ID not found in URL params");
//           return;
//         }

//         const formattedTokens = (data[userId] || []).map((item) => ({
//           id: item.id,
//           image: item.cover,
//           songTitle: item.title,
//           artist: item.artist,
//           tokensOwned: item.owned,
//           currentValue: item.earnings,
//           change: "5.2%", // Replace with dynamic value if needed
//         }));

//         setTokens(formattedTokens);
//       } catch (error) {
//         console.error("Failed to fetch vaults:", error);
//       }
//     };

//     fetchTokens();
//   }, [userId]);

//   return (
//     <div className="space-y-6">
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {tokens.map((token) => (
//           <Card key={token.id} className="glass-panel hover-scale group cursor-pointer">
//             <div className="p-6 space-y-4">
//               <div className="flex items-center space-x-4">
//                 <img
//                   src={token.image}
//                   alt={token.songTitle}
//                   className="w-16 h-16 rounded-xl object-cover"
//                 />
//                 <div className="flex-1 min-w-0">
//                   <h3 className="font-semibold text-lg text-foreground truncate">
//                     {token.songTitle}
//                   </h3>
//                   <p className="text-muted-foreground">{token.artist}</p>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-muted-foreground">Tokens Owned</span>
//                   <Badge variant="secondary" className="font-medium">
//                     {token.tokensOwned}
//                   </Badge>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-muted-foreground">Current Value</span>
//                   <span className="font-semibold text-lg">{token.currentValue}</span>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-muted-foreground">24h Change</span>
//                   <div className="flex items-center space-x-1 text-emerald-600">
//                     <TrendingUp className="w-4 h-4" />
//                     <span className="font-medium">{token.change}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="pt-2 border-t border-border">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="w-full glow-golden"
//                 >
//                   <ArrowUpRight className="w-4 h-4 mr-2" />
//                   View Details
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }
