import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
import { Music, Heart, Users, BarChart3, Copy, ArrowLeft, Wallet } from "lucide-react";

const ListenerProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); 
  
  const [activeTab, setActiveTab] = useState("my-nfts");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListenerData = async () => {
      try {
        const res = await fetch(`https://music-backend-final.onrender.com/profile/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setUserData(data || {}); // fallback to empty object
        setIsWalletConnected(data?.profile?.isWalletConnected || false);
      } catch (err) {
        console.error("Error fetching listener data:", err);
        setUserData({});
      } finally {
        setLoading(false);
      }
    };
    
    fetchListenerData();
  }, [userId]);

  const handleConnectWallet = () => {
    setIsWalletConnected(!isWalletConnected);
  };

  const tabs = [
    { id: "my-nfts", label: "My NFTs", icon: Music },
    { id: "liked-songs", label: "Liked Songs", icon: Heart },
    { id: "following", label: "Following", icon: Users },
    { id: "vault-stats", label: "Vault Stats", icon: BarChart3 },
  ];

  if (loading) return <p className="p-8 text-center text-emerald-600">Loading profile...</p>;

  const profile = userData?.profile || {};
  const nfts = userData?.nfts || [];
  const vaults = userData?.vaultStats || [];
  const likedSongs = userData?.likedSongs?.songs || [];
  const followings = userData?.following?.followings || [];

  return (
    <div className="min-h-screen emerald-bg relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Back + Wallet Button */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-2 text-emerald-700 hover:text-golden-glow hover:bg-golden-glow/10 rounded-xl p-3 glow-golden"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Button>

            <Button
              onClick={handleConnectWallet}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                isWalletConnected
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                  : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white"
              } glow-golden`}
            >
              <Wallet className="w-5 h-5" />
              <span>{isWalletConnected ? "Connected" : "Connect Wallet"}</span>
            </Button>
          </div>

          {/* Profile Card */}
          <Card className="glass-panel rounded-3xl p-8 mb-8 glow-golden float">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <img 
                src={profile.avatar || "/fallback-avatar.png"} 
                alt={profile.name || "New User"} 
                className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-xl" 
              />
              <div className="flex-1 text-center md:text-left space-y-4">
                <h1 className="text-3xl font-bold text-emerald-800 mb-2">
                  {profile.name || "New User"}
                </h1>
                <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-300 mb-3">
                  {userData?.user?.role || "Music Lover"}
                </Badge>
                <div className="flex items-center justify-center md:justify-start space-x-2 text-emerald-600">
                  <span className="font-mono text-sm">{profile.walletAddress || "No Wallet"}</span>
                  <Button variant="ghost" size="sm" className="hover:text-golden-glow glow-golden">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex justify-center md:justify-start space-x-6">
                  <div>
                    <p className="text-2xl font-bold text-emerald-800">{profile.followers || 0}</p>
                    <p className="text-sm text-emerald-600">Followers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-800">{profile.followingCount || 0}</p>
                    <p className="text-sm text-emerald-600">Following</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white glow-golden"
                    : "text-emerald-600 hover:text-golden-glow hover:bg-golden-glow/10"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "my-nfts" && (
              nfts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nfts.map((nft, idx) => (
                    <Card key={nft._id || idx} className="glass-panel rounded-2xl p-6 float">
                      <img src={nft.cover || "/fallback.png"} alt={nft.title || "NFT"} className="w-full aspect-square rounded-xl object-cover" />
                      <h3 className="font-semibold text-emerald-800 mt-4">{nft.title}</h3>
                      <p className="text-sm text-emerald-600">{nft.artist}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-emerald-600">No NFTs yet</p>
              )
            )}

            {activeTab === "vault-stats" && (
              vaults.length > 0 ? (
                vaults.map((vault, idx) => (
                  <Card key={vault._id || idx} className="glass-panel rounded-2xl p-6 float">
                    <h3 className="font-semibold">{vault.title}</h3>
                    <p>Invested: {vault.invested}</p>
                  </Card>
                ))
              ) : (
                <p className="text-center text-emerald-600">No Vault Stats yet</p>
              )
            )}

            {activeTab === "liked-songs" && (
              likedSongs.length > 0 ? (
                <p className="text-center text-emerald-600">You liked {likedSongs.length} songs</p>
              ) : (
                <p className="text-center text-emerald-600">No liked songs yet</p>
              )
            )}

            {activeTab === "following" && (
              followings.length > 0 ? (
                <p className="text-center text-emerald-600">Following {followings.length} users</p>
              ) : (
                <p className="text-center text-emerald-600">Not following anyone yet</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListenerProfile;





// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// // import axios from "axios";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import { 
//   User, 
//   Music, 
//   Heart, 
//   Users, 
//   BarChart3, 
//   Copy, 
//   ArrowLeft,
//   Wallet
// } from "lucide-react";

// const ListenerProfile = () => {
//   const navigate = useNavigate();
//   const { userId } = useParams(); 
//   const [activeTab, setActiveTab] = useState("my-nfts");
//   const [isWalletConnected, setIsWalletConnected] = useState(false);

//   const [userData, setUserData] = useState<any>(null);
//   const [nfts, setNfts] = useState<any[]>([]);
//   const [vaults, setVaults] = useState<any[]>([]);
//   const [liked, setLiked] = useState<string[]>([]);
//   const [followed, setFollowed] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchListenerData = async () => {
//       try {
//         const [profileRes, nftRes, vaultRes, likedRes, followRes] = await Promise.all([
//           fetch(`http://localhost:3000/api/listener/${userId}`),
//           fetch(`http://localhost:3000/api/listener/${userId}/nfts`),
//           fetch(`http://localhost:3000/api/listener/${userId}/vaults`),
//           fetch(`http://localhost:3000/api/listener/${userId}/liked-songs`),
//           fetch(`http://localhost:3000/api/listener/${userId}/following`),
//         ]);
    
//         if (!profileRes.ok || !nftRes.ok || !vaultRes.ok || !likedRes.ok || !followRes.ok) {
//           throw new Error("One or more requests failed");
//         }
    
//         const profile = await profileRes.json();
//         const nfts = await nftRes.json();
//         const vaults = await vaultRes.json();
//         const liked = await likedRes.json();
//         const followed = await followRes.json();
    
//         setUserData(profile);
//         setIsWalletConnected(profile?.isWalletConnected || false);
    
//         const nftArray = Array.isArray(nfts) ? nfts : [];

//         setNfts(Array.isArray(nftArray) ? nftArray : []);
    
//         setVaults(Array.isArray(vaults) ? vaults : []);
//         setLiked(Array.isArray(liked) ? liked : []);
//         setFollowed(Array.isArray(followed) ? followed : []);
//       } catch (err) {
//         console.error("Error fetching listener data:", err);
//       }
//     };
    
//     fetchListenerData();
//   }, [userId]);

//   const handleConnectWallet = () => {
//     setIsWalletConnected(!isWalletConnected);
//   };

//   const tabs = [
//     { id: "my-nfts", label: "My NFTs", icon: Music },
//     { id: "liked-songs", label: "Liked Songs", icon: Heart },
//     { id: "following", label: "Following", icon: Users },
//     { id: "vault-stats", label: "Vault Stats", icon: BarChart3 },
//   ];

//   if (!userData) return <p className="p-8 text-center text-emerald-600">Loading profile...</p>;

//   return (
//     <div className="min-h-screen emerald-bg relative overflow-hidden">
//       {/* Ambient Background */}
//       <div className="fixed inset-0 opacity-20">
//         <div className="absolute top-20 right-32 w-96 h-96 bg-gradient-radial from-yellow-400/25 to-transparent rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-radial from-emerald-400/30 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
//       </div>

//       <div className="relative z-10 min-h-screen p-6">
//         <div className="max-w-6xl mx-auto">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-8">
//             <Button
//               variant="ghost"
//               onClick={() => navigate("/dashboard")}
//               className="flex items-center space-x-2 text-emerald-700 hover:text-golden-glow hover:bg-golden-glow/10 rounded-xl p-3 glow-golden"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span>Back to Dashboard</span>
//             </Button>

//             <Button
//               onClick={handleConnectWallet}
//               className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
//                 isWalletConnected
//                   ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
//                   : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white"
//               } glow-golden`}
//             >
//               <Wallet className="w-5 h-5" />
//               <span>{isWalletConnected ? "Connected" : "Connect Wallet"}</span>
//             </Button>
//           </div>

//           {/* Profile */}
//           <Card className="glass-panel rounded-3xl p-8 mb-8 glow-golden float">
//             <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
//               <img 
//                 src={userData.avatar} 
//                 alt={userData.name} 
//                 className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-xl" 
//               />
//               <div className="flex-1 text-center md:text-left space-y-4">
//                 <h1 className="text-3xl font-bold text-emerald-800 mb-2">{userData.name}</h1>
//                 <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-300 mb-3">Music Lover</Badge>
//                 <div className="flex items-center justify-center md:justify-start space-x-2 text-emerald-600">
//                   <span className="font-mono text-sm">{userData.walletAddress}</span>
//                   <Button variant="ghost" size="sm" className="hover:text-golden-glow glow-golden">
//                     <Copy className="w-4 h-4" />
//                   </Button>
//                 </div>
//                 <div className="flex justify-center md:justify-start space-x-6">
//                   <div>
//                     <p className="text-2xl font-bold text-emerald-800">{userData.followers}</p>
//                     <p className="text-sm text-emerald-600">Followers</p>
//                   </div>
//                   <div>
//                     <p className="text-2xl font-bold text-emerald-800">{userData.followingCount}</p>
//                     <p className="text-sm text-emerald-600">Following</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Card>

//           {/* Tabs */}
//           <div className="mb-8 flex flex-wrap gap-2 justify-center">
//             {tabs.map((tab) => (
//               <Button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 variant={activeTab === tab.id ? "default" : "ghost"}
//                 className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
//                   activeTab === tab.id
//                     ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white glow-golden"
//                     : "text-emerald-600 hover:text-golden-glow hover:bg-golden-glow/10"
//                 }`}
//               >
//                 <tab.icon className="w-4 h-4" />
//                 <span>{tab.label}</span>
//               </Button>
//             ))}
//           </div>

//           {/* Tab Content */}
//           <div className="space-y-6">
//             {activeTab === "my-nfts" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {nfts.map((nft: any, idx: number) => (
//                   <Card key={`nft-${idx}`} className="glass-panel rounded-2xl p-6 float" style={{ animationDelay: `${idx * 0.1}s` }}>
//                     <img
//                       src={nft.cover || "/fallback.png"}

//                       alt={nft.title || "NFT"}
//                       className="w-full aspect-square rounded-xl object-cover"
//                     />
//                     <h3 className="font-semibold text-emerald-800 mt-4">{nft.title || "Untitled NFT"}</h3>
//                     <p className="text-sm text-emerald-600">{nft.artist || "Unknown Artist"}</p>
//                     <div className="flex justify-between items-center mt-2">
//                       <div>
//                         <p className="text-sm text-emerald-600">Owned</p>
//                         <p className="font-semibold">{nft.owned || 1}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-emerald-600">Earnings</p>
//                         <p className="font-semibold text-green-600">{nft.earnings || "0.00"}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-2 mt-2">
//                       <Switch checked={nft.daoVoting || false} />
//                       <span className="text-sm text-emerald-600">DAO Voting</span>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             )}

//             {activeTab === "vault-stats" && (
//               <div className="space-y-6">
//                 {vaults.map((vault, idx) => (
//                   <Card key={vault.title} className="glass-panel rounded-2xl p-6 float" style={{ animationDelay: `${idx * 0.1}s` }}>
//                     <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
//                       <h3 className="font-semibold text-emerald-800">{vault.title}</h3>
//                       <div className="text-center">
//                         <p className="text-sm text-emerald-600">Invested</p>
//                         <p className="font-semibold text-blue-600">{vault.invested}</p>
//                       </div>
//                       <div className="text-center">
//                         <p className="text-sm text-emerald-600">TVL</p>
//                         <p className="font-semibold">{vault.tvl}</p>
//                       </div>
//                       <div className="text-center">
//                         <p className="text-sm text-emerald-600">APR</p>
//                         <p className="font-semibold text-green-600">{vault.apr}</p>
//                       </div>
//                       <Button className="bg-yellow-500 text-white glow-golden">Withdraw {vault.withdrawable}</Button>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             )}

//             {activeTab === "liked-songs" && (
//               <Card className="glass-panel rounded-2xl p-8 text-center">
//                 <Heart className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-emerald-800 mb-2">Liked Songs</h3>
//                 <p className="text-emerald-600">
//                   You liked {liked.length} songs: {liked.join(", ")}
//                 </p>
//               </Card>
//             )}

//             {activeTab === "following" && (
//               <Card className="glass-panel rounded-2xl p-8 text-center">
//                 <Users className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-emerald-800 mb-2">Following</h3>
//                 <p className="text-emerald-600">
//                   You are following {followed.length} artist(s): {followed.join(", ")}
//                 </p>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ListenerProfile;






// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import { 
//   User, 
//   Music, 
//   Heart, 
//   Users, 
//   BarChart3, 
//   Copy, 
//   ArrowLeft,
//   Wallet
// } from "lucide-react";
// import userAvatar from "@/assets/user-avatar.jpg";
// import album1 from "@/assets/album-1.jpg";
// import album2 from "@/assets/album-2.jpg";
// import album3 from "@/assets/album-3.jpg";

// const ListenerProfile = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("my-nfts");
//   const [isWalletConnected, setIsWalletConnected] = useState(false);

//   const userData = {
//     name: "Alex Chen",
//     walletAddress: "0x1234...5678",
//     avatar: userAvatar,
//     followers: "1.2K",
//     following: "834",
//   };

//   const tabs = [
//     { id: "my-nfts", label: "My NFTs", icon: Music },
//     { id: "liked-songs", label: "Liked Songs", icon: Heart },
//     { id: "following", label: "Following", icon: Users },
//     { id: "vault-stats", label: "Vault Stats", icon: BarChart3 },
//   ];

//   const mockNFTs = [
//     { id: "1", title: "Liquid Dreams", artist: "Aurora Synth", cover: album1, owned: "5 tokens", earnings: "0.25 SUI" },
//     { id: "2", title: "Digital Flow", artist: "Neon Pulse", cover: album2, owned: "3 tokens", earnings: "0.18 SUI" },
//     { id: "3", title: "Ethereal Mist", artist: "Cloud Walker", cover: album3, owned: "8 tokens", earnings: "0.42 SUI" },
//   ];

//   const mockVaults = [
//     { title: "Liquid Dreams", invested: "2.5 SUI", tvl: "125.8 SUI", apr: "18.2%", withdrawable: "0.31 SUI" },
//     { title: "Digital Flow", invested: "1.8 SUI", tvl: "89.3 SUI", apr: "22.1%", withdrawable: "0.24 SUI" },
//   ];

//   const handleConnectWallet = () => {
//     // Mock wallet connection
//     setIsWalletConnected(!isWalletConnected);
//   };

//   return (
//     <div className="min-h-screen emerald-bg relative overflow-hidden">
//       {/* Ambient background effects */}
//       <div className="fixed inset-0 opacity-20">
//         <div className="absolute top-20 right-32 w-96 h-96 bg-gradient-radial from-yellow-400/25 to-transparent rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-radial from-emerald-400/30 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
//       </div>

//       <div className="relative z-10 min-h-screen p-6">
//         <div className="max-w-6xl mx-auto">
//           {/* Header with Back Button and Wallet Connect */}
//           <div className="flex items-center justify-between mb-8">
//             <Button
//               variant="ghost"
//               onClick={() => navigate("/dashboard")}
//               className="flex items-center space-x-2 text-emerald-700 hover:text-golden-glow hover:bg-golden-glow/10 rounded-xl p-3 glow-golden"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span>Back to Dashboard</span>
//             </Button>

//             <Button
//               onClick={handleConnectWallet}
//               className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
//                 isWalletConnected
//                   ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
//                   : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white"
//               } glow-golden`}
//             >
//               <Wallet className="w-5 h-5" />
//               <span>{isWalletConnected ? "Connected" : "Connect Wallet"}</span>
//             </Button>
//           </div>

//           {/* Profile Header */}
//           <Card className="glass-panel rounded-3xl p-8 mb-8 glow-golden float">
//             <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
//               {/* Avatar */}
//               <div className="relative">
//                 <img 
//                   src={userData.avatar} 
//                   alt={userData.name}
//                   className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-xl"
//                 />
//                 <div className="absolute inset-0 rounded-full bg-gradient-to-t from-emerald-400/20 to-transparent"></div>
//               </div>

//               {/* Profile Info */}
//               <div className="flex-1 text-center md:text-left space-y-4">
//                 <div>
//                   <h1 className="text-3xl font-bold text-emerald-800 mb-2">{userData.name}</h1>
//                   <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-300 mb-3">
//                     Music Lover
//                   </Badge>
//                   <div className="flex items-center justify-center md:justify-start space-x-2 text-emerald-600">
//                     <span className="font-mono text-sm">{userData.walletAddress}</span>
//                     <Button variant="ghost" size="sm" className="hover:text-golden-glow glow-golden">
//                       <Copy className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-center md:justify-start space-x-6">
//                   <div className="text-center">
//                     <p className="text-2xl font-bold text-emerald-800">{userData.followers}</p>
//                     <p className="text-sm text-emerald-600">Followers</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-2xl font-bold text-emerald-800">{userData.following}</p>
//                     <p className="text-sm text-emerald-600">Following</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Card>

//           {/* Tab Navigation */}
//           <div className="mb-8">
//             <div className="flex flex-wrap gap-2 justify-center">
//               {tabs.map((tab) => (
//                 <Button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   variant={activeTab === tab.id ? "default" : "ghost"}
//                   className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
//                     activeTab === tab.id
//                       ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white glow-golden"
//                       : "text-emerald-600 hover:text-golden-glow hover:bg-golden-glow/10"
//                   }`}
//                 >
//                   <tab.icon className="w-4 h-4" />
//                   <span>{tab.label}</span>
//                 </Button>
//               ))}
//             </div>
//           </div>

//           {/* Tab Content */}
//           <div className="space-y-6">
//             {activeTab === "my-nfts" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {mockNFTs.map((nft, index) => (
//                   <Card key={nft.id} className="glass-panel rounded-2xl p-6 float" style={{ animationDelay: `${index * 0.1}s` }}>
//                     <div className="space-y-4">
//                       <img src={nft.cover} alt={nft.title} className="w-full aspect-square rounded-xl object-cover" />
//                       <div>
//                         <h3 className="font-semibold text-emerald-800">{nft.title}</h3>
//                         <p className="text-sm text-emerald-600">{nft.artist}</p>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <p className="text-sm text-emerald-600">Owned</p>
//                           <p className="font-semibold">{nft.owned}</p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-emerald-600">Earnings</p>
//                           <p className="font-semibold text-green-600">{nft.earnings}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Switch defaultChecked />
//                         <span className="text-sm text-emerald-600">DAO Voting</span>
//                       </div>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             )}

//             {activeTab === "vault-stats" && (
//               <div className="space-y-6">
//                 {mockVaults.map((vault, index) => (
//                   <Card key={vault.title} className="glass-panel rounded-2xl p-6 float" style={{ animationDelay: `${index * 0.1}s` }}>
//                     <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
//                       <div>
//                         <h3 className="font-semibold text-emerald-800">{vault.title}</h3>
//                       </div>
//                       <div className="text-center">
//                         <p className="text-sm text-emerald-600">Invested</p>
//                         <p className="font-semibold text-blue-600">{vault.invested}</p>
//                       </div>
//                       <div className="text-center">
//                         <p className="text-sm text-emerald-600">TVL</p>
//                         <p className="font-semibold text-emerald-600">{vault.tvl}</p>
//                       </div>
//                       <div className="text-center">
//                         <p className="text-sm text-emerald-600">APR</p>
//                         <p className="font-semibold text-green-600">{vault.apr}</p>
//                       </div>
//                       <div className="text-center">
//                         <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white glow-golden">
//                           Withdraw {vault.withdrawable}
//                         </Button>
//                       </div>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             )}

//             {/* Placeholder content for other tabs */}
//             {activeTab === "liked-songs" && (
//               <Card className="glass-panel rounded-2xl p-8 text-center">
//                 <Heart className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-emerald-800 mb-2">Liked Songs</h3>
//                 <p className="text-emerald-600">Your favorite tracks will appear here</p>
//               </Card>
//             )}

//             {activeTab === "following" && (
//               <Card className="glass-panel rounded-2xl p-8 text-center">
//                 <Users className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-emerald-800 mb-2">Following</h3>
//                 <p className="text-emerald-600">Artists and creators you follow will appear here</p>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ListenerProfile;