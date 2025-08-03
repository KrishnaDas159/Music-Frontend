import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Music,
  Heart,
  Users,
  BarChart3,
  Upload,
  Copy,
  TrendingUp,
  ArrowLeft,
  Wallet,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid"; // For generating trackIdHex

const CreatorProfile = () => {
  const navigate = useNavigate();
  const { creatorId } = useParams();

  const [activeTab, setActiveTab] = useState("my-nfts");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [tokenizingSongId, setTokenizingSongId] = useState(null);
  const [tokenizeError, setTokenizeError] = useState(null);

  // Upload form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [musicFile, setMusicFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [tokenizeEnabled, setTokenizeEnabled] = useState(false);
  const [tokenPercentage, setTokenPercentage] = useState([30]);
  const [pricePerToken, setPricePerToken] = useState("");
  const [numberOfTokens, setNumberOfTokens] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        const res = await fetch(`https://music-backend-final.onrender.com/api/profile/${creatorId}`);
        if (!res.ok) throw new Error("Failed to fetch creator profile");

        const data = await res.json();
        setUserData(data || {});
        setIsWalletConnected(data?.profile?.isWalletConnected || false);
      } catch (err) {
        console.error("Error fetching creator data:", err);
        setUserData({});
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [creatorId]);

  const handleConnectWallet = async () => {
    // Placeholder for actual wallet connection (e.g., Sui Wallet)
    setIsWalletConnected(!isWalletConnected);
  };

  const handleTokenizeSong = async (songId) => {
    if (!isWalletConnected) {
      alert("Please connect your wallet first.");
      return;
    }

    setTokenizingSongId(songId);
    setTokenizeError(null);

    try {
      const song = userData?.nfts?.find((nft) => nft.id === songId);
      if (!song) throw new Error("Song not found");

      const trackIdHex = uuidv4(); // Generate unique trackIdHex
      const response = await fetch("https://music-backend-final.onrender.com/api/tokenise-song", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toAddress: userData.profile.walletAddress, // Artist's wallet
          amount: 1000, // Default token amount; adjust as needed
          creatorAddress: userData.profile.walletAddress,
          trackIdHex,
        }),
      });

      if (!response.ok) throw new Error("Failed to tokenize song");

      const result = await response.json();
      if (result.success) {
        // Update local state to reflect tokenization
        setUserData((prev) => ({
          ...prev,
          nfts: prev.nfts.map((nft) =>
              nft.id === songId
                  ? { ...nft, tokenized: true, tokenPrice: pricePerToken || "0.01", tokensAvailable: numberOfTokens || 1000 }
                  : nft
          ),
        }));
        alert(`Song tokenized successfully! Vault created: ${result.vaultTransaction}`);
      } else {
        throw new Error(result.error || "Tokenization failed");
      }
    } catch (err) {
      console.error("Error tokenizing song:", err);
      setTokenizeError(err.message);
      alert(`Failed to tokenize song: ${err.message}`);
    } finally {
      setTokenizingSongId(null);
    }
  };

  const handleUpload = async () => {
    if (!musicFile || !thumbnail || !title || !genre || !description) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!isWalletConnected) {
      alert("Please connect your wallet first.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("genre", genre);
    formData.append("musicFile", musicFile);
    formData.append("thumbnailFile", thumbnail);
    formData.append("tokenized", tokenizeEnabled.toString());
    formData.append("pricePerToken", pricePerToken);
    formData.append("tokenSupply", numberOfTokens);
    formData.append(
        "revenueSplit",
        JSON.stringify({
          artist: 100 - tokenPercentage[0],
          platform: tokenPercentage[0],
        })
    );

    try {
      const res = await fetch("https://music-backend-final.onrender.com/api/music/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const result = await res.json();
        if (tokenizeEnabled) {
          // Trigger tokenization if enabled
          const trackIdHex = uuidv4();
          const tokenizeRes = await fetch("https://music-backend-final.onrender.com/api/tokenise-song", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              toAddress: userData.profile.walletAddress,
              amount: numberOfTokens || 1000,
              creatorAddress: userData.profile.walletAddress,
              trackIdHex,
            }),
          });
          if (!tokenizeRes.ok) throw new Error("Failed to tokenize uploaded song");
          const tokenizeResult = await tokenizeRes.json();
          alert(`Upload and tokenization successful! Vault created: ${tokenizeResult.vaultTransaction}`);
        } else {
          alert("Upload successful");
        }
        // Reset form
        setTitle("");
        setDescription("");
        setGenre("");
        setMusicFile(null);
        setThumbnail(null);
        setTokenizeEnabled(false);
        setTokenPercentage([30]);
        setPricePerToken("");
        setNumberOfTokens("");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error("Error during upload:", err);
      alert("Error during upload");
    }
  };

  if (loading)
    return <p className="p-8 text-center text-emerald-600">Loading profile...</p>;

  const profile = userData?.profile || {};
  const nfts = userData?.nfts || [];
  const likedSongs = userData?.likedSongs?.songs || [];
  const followings = userData?.following?.creators || [];
  const vaultStats = userData?.vaultStats || [];
  const revenue = userData?.revenue || [];

  // Safe defaults
  const safeNfts = Array.isArray(nfts) ? nfts : [];
  const safeLiked = Array.isArray(likedSongs) ? likedSongs : [];
  const safeFollowingList = Array.isArray(followings) ? followings : [];
  const safeVaultStats = Array.isArray(vaultStats) ? vaultStats : [];
  const safeRevenue = Array.isArray(revenue) ? revenue : [];

  const tabs = [
    { id: "my-nfts", label: "My NFTs", icon: Music },
    { id: "liked-songs", label: "Liked Songs", icon: Heart },
    { id: "following", label: "Following", icon: Users },
    { id: "vault-stats", label: "Vault Stats", icon: BarChart3 },
    ...(userData?.user?.role === "creator"
        ? [{ id: "revenue", label: "Revenue", icon: TrendingUp }]
        : []),
    { id: "upload", label: "Upload Track", icon: Upload },
  ];

  return (
      <div className="min-h-screen emerald-bg relative overflow-hidden">
        <div className="relative z-10 min-h-screen p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center space-x-2 text-emerald-700 hover:text-golden-glow"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Button>
              <Button
                  onClick={handleConnectWallet}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl ${
                      isWalletConnected
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                          : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                  }`}
              >
                <Wallet className="w-5 h-5" />
                <span>{isWalletConnected ? "Connected" : "Connect Wallet"}</span>
              </Button>
            </div>

            {/* Profile Card */}
            <Card className="glass-panel rounded-3xl p-8 mb-8 glow-golden">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-x-8">
                <img
                    src={profile.avatar || "/fallback-avatar.png"}
                    alt={profile.name || "New Creator"}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-xl"
                />
                <div className="flex-1 text-center md:text-left space-y-4">
                  <h1 className="text-3xl font-bold text-emerald-800">
                    {profile.name || "New Creator"}
                  </h1>
                  <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-300">
                    {userData?.user?.role || "Creator"}
                  </Badge>
                  <div className="flex items-center justify-center md:justify-start space-x-2 text-emerald-600">
                  <span className="font-mono text-sm">
                    {profile.walletAddress || "No Wallet"}
                  </span>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex space-x-6 justify-center md:justify-start">
                    <div>
                      <p className="text-2xl font-bold">{profile.followers || 0}</p>
                      <p className="text-sm">Followers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{profile.followingCount || 0}</p>
                      <p className="text-sm">Following</p>
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
                      className={
                        activeTab === tab.id
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                            : "text-emerald-600"
                      }
                  >
                    <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
                  </Button>
              ))}
            </div>

            {/* My NFTs */}
            {activeTab === "my-nfts" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {safeNfts.length === 0 ? (
                      <Card className="glass-panel rounded-2xl p-8 text-center">
                        <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                          No NFTs Yet
                        </h3>
                        <p className="text-emerald-600">
                          Start by uploading your first track!
                        </p>
                      </Card>
                  ) : (
                      safeNfts.map((nft, index) => (
                          <Card key={nft.id || index} className="glass-panel rounded-2xl p-6">
                            <div className="space-y-4">
                              <img
                                  src={nft.cover || "/fallback-cover.png"}
                                  alt={nft.title || "Untitled"}
                                  className="w-full aspect-square rounded-xl object-cover"
                              />
                              <div>
                                <h3 className="font-semibold text-emerald-800">
                                  {nft.title || "Untitled"}
                                </h3>
                                <p className="text-sm text-emerald-600">
                                  {nft.artist || "Unknown Artist"}
                                </p>
                              </div>
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm text-emerald-600">Status</p>
                                  <p className="font-semibold">{nft.tokenized ? "Tokenized" : "Not Tokenized"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-emerald-600">Earnings</p>
                                  <p className="font-semibold text-green-600">
                                    {nft.earnings || "0"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                {nft.tokenized ? (
                                    <Button
                                        onClick={() => navigate(`/music/${nft.id}`)}
                                        className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white"
                                    >
                                      Buy Tokens
                                    </Button>
                                ) : userData?.user?.role === "creator" ? (
                                    <Button
                                        onClick={() => handleTokenizeSong(nft.id)}
                                        disabled={tokenizingSongId === nft.id}
                                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                                    >
                                      {tokenizingSongId === nft.id ? "Tokenizing..." : "Tokenize"}
                                    </Button>
                                ) : null}
                              </div>
                            </div>
                          </Card>
                      ))
                  )}
                </div>
            )}

            {/* Liked Songs */}
            {activeTab === "liked-songs" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {safeLiked.length === 0 ? (
                      <Card className="glass-panel rounded-2xl p-8 text-center">
                        <Heart className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                          No Liked Songs Yet
                        </h3>
                        <p className="text-emerald-600">
                          Your favorite tracks will appear here.
                        </p>
                      </Card>
                  ) : (
                      safeLiked.map((song, index) => (
                          <Card key={song.id || index} className="glass-panel rounded-2xl p-6">
                            <div className="space-y-4">
                              <img
                                  src={song.cover || "/fallback-cover.png"}
                                  alt={song.title || "Untitled"}
                                  className="w-full aspect-square rounded-xl object-cover"
                              />
                              <div>
                                <h3 className="font-semibold text-emerald-800">
                                  {song.title || "Untitled"}
                                </h3>
                                <p className="text-sm text-emerald-600">
                                  {song.artist || "Unknown Artist"}
                                </p>
                              </div>
                            </div>
                          </Card>
                      ))
                  )}
                </div>
            )}

            {/* Following */}
            {activeTab === "following" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {safeFollowingList.length === 0 ? (
                      <Card className="glass-panel rounded-2xl p-8 text-center">
                        <Users className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                          No Followings Yet
                        </h3>
                        <p className="text-emerald-600">
                          Creators you follow will be listed here.
                        </p>
                      </Card>
                  ) : (
                      safeFollowingList.map((creator, index) => (
                          <Card key={creator.id || index} className="glass-panel rounded-2xl p-6">
                            <div className="flex items-center space-x-4">
                              <img
                                  src={creator.avatar || "/fallback-avatar.png"}
                                  alt={creator.name || "Unnamed Creator"}
                                  className="w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow"
                              />
                              <div>
                                <h3 className="font-semibold text-emerald-800">
                                  {creator.name || "Unnamed Creator"}
                                </h3>
                                <p className="text-sm text-emerald-600">
                                  {creator.genre || "Music Creator"}
                                </p>
                              </div>
                            </div>
                          </Card>
                      ))
                  )}
                </div>
            )}

            {/* Vault Stats */}
            {activeTab === "vault-stats" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {safeVaultStats.length === 0 ? (
                      <Card className="glass-panel rounded-2xl p-8 text-center">
                        <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                          No Vault Stats
                        </h3>
                        <p className="text-emerald-600">
                          Your vault stats will appear here.
                        </p>
                      </Card>
                  ) : (
                      safeVaultStats.map((vault, index) => (
                          <Card key={vault.title || index} className="glass-panel rounded-2xl p-6">
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-emerald-800">
                                {vault.title || "Untitled Vault"}
                              </h3>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm text-emerald-600">
                                  <span>Vault Revenue</span>
                                  <span className="font-medium text-blue-600">
                            {vault.vaultRevenue || "0"}
                          </span>
                                </div>
                                <div className="flex justify-between text-sm text-emerald-600">
                                  <span>Yield Earned</span>
                                  <span className="font-medium text-green-600">
                            {vault.yieldEarned || "0"}
                          </span>
                                </div>
                                <div className="flex justify-between text-sm text-emerald-600">
                                  <span>DAO Support</span>
                                  <span className="font-medium text-purple-600">
                            {vault.daoSupport || "0"}
                          </span>
                                </div>
                                <div className="flex justify-between text-sm text-emerald-600">
                                  <span>Protocol</span>
                                  <span className="font-medium text-emerald-700">
                            {vault.protocol || "N/A"}
                          </span>
                                </div>
                              </div>
                            </div>
                          </Card>
                      ))
                  )}
                </div>
            )}

            {/* Revenue */}
            {activeTab === "revenue" && (
                <div className="space-y-6">
                  {safeRevenue.length === 0 ? (
                      <Card className="glass-panel rounded-2xl p-8 text-center">
                        <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                          No Revenue Data
                        </h3>
                        <p className="text-emerald-600">
                          Revenue details will appear here.
                        </p>
                      </Card>
                  ) : (
                      safeRevenue.map((item, index) => (
                          <Card key={item.title || index} className="glass-panel rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                              <div className="md:col-span-1">
                                <h3 className="font-semibold text-emerald-800">
                                  {item.title || "Untitled"}
                                </h3>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-emerald-600">Vault Revenue</p>
                                <p className="font-semibold text-blue-600">
                                  {item.vaultRevenue || "0"}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-emerald-600">Yield Earned</p>
                                <p className="font-semibold text-green-600">
                                  {item.yieldEarned || "0"}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-emerald-600">DAO Support</p>
                                <p className="font-semibold text-purple-600">
                                  {item.daoSupport || "0"}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-emerald-600">Protocol</p>
                                <p className="font-semibold text-emerald-600">
                                  {item.protocol || "N/A"}
                                </p>
                              </div>
                              <div className="text-center">
                                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl px-4">
                                  Withdraw
                                </Button>
                              </div>
                            </div>
                          </Card>
                      ))
                  )}
                </div>
            )}

            {/* Upload Track */}
            {activeTab === "upload" && (
                <Card className="glass-panel rounded-3xl p-8 glow-golden float">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-emerald-800 mb-2">Upload New Music</h2>
                      <p className="text-emerald-600">Create and tokenize your latest track</p>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-emerald-700 mb-2">Music File</label>
                          <div className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center hover:border-golden-glow transition-colors glow-golden">
                            <Upload className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                            <p className="text-emerald-600">Drag & drop MP3/WAV file</p>
                            <input
                                type="file"
                                accept=".mp3,.wav"
                                onChange={(e) => setMusicFile(e.target.files?.[0] || null)}
                                className="mt-4"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-emerald-700 mb-2">Thumbnail</label>
                          <div className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center hover:border-golden-glow transition-colors glow-golden">
                            <Upload className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                            <p className="text-emerald-600">Upload cover art</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                                className="mt-4"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-emerald-700 mb-2">Song Title</label>
                          <Input
                              placeholder="Enter song title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="rounded-xl border-emerald-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-emerald-700 mb-2">Genre</label>
                          <Input
                              placeholder="Enter genre"
                              value={genre}
                              onChange={(e) => setGenre(e.target.value)}
                              className="rounded-xl border-emerald-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">Description</label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your music..."
                            className="rounded-xl border-emerald-300"
                            rows={3}
                        />
                      </div>

                      <div className="space-y-4 p-6 bg-white/20 rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-emerald-800">Tokenize this music</span>
                          <Switch checked={tokenizeEnabled} onCheckedChange={setTokenizeEnabled} />
                        </div>

                        {tokenizeEnabled && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-emerald-700 mb-2">
                                  Tokenization Percentage: {tokenPercentage[0]}%
                                </label>
                                <Slider
                                    value={tokenPercentage}
                                    onValueChange={setTokenPercentage}
                                    max={100}
                                    step={5}
                                    className="w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-emerald-700 mb-2">Price per Token</label>
                                <Input
                                    placeholder="Enter price per token"
                                    value={pricePerToken}
                                    onChange={(e) => setPricePerToken(e.target.value)}
                                    className="rounded-xl border-emerald-300"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-emerald-700 mb-2">Number of Tokens to Mint</label>
                                <Input
                                    placeholder="Enter no. of token"
                                    value={numberOfTokens}
                                    onChange={(e) => setNumberOfTokens(e.target.value)}
                                    className="rounded-xl border-emerald-300"
                                />
                              </div>
                            </div>
                        )}
                      </div>

                      <Button
                          onClick={() => {
                            handleUpload();
                            setShowUploadModal(true);
                          }}
                          className="w-full py-4 text-lg bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white glow-golden"
                      >
                        Create and Tokenize
                      </Button>
                    </div>
                  </div>
                </Card>
            )}

            {/* Upload Success Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <Card className="glass-panel rounded-3xl p-8 max-w-md w-full glow-golden slide-in-right">
                    <div className="text-center space-y-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto pulse-golden">
                        <Upload className="w-8 h-8 text-white" />
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-emerald-800 mb-2">
                          Upload Successful!
                        </h3>
                        <p className="text-emerald-600">
                          Your music has been uploaded and tokenized successfully.
                        </p>
                      </div>

                      <div className="space-y-3 text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-600">Status:</span>
                          <span className="font-semibold text-green-600">Processing</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-600">Tokens Created:</span>
                          <span className="font-semibold text-yellow-600">{numberOfTokens}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-600">Your Share:</span>
                          <span className="font-semibold text-purple-600">
                        {100 - tokenPercentage[0]}%
                      </span>
                        </div>
                      </div>

                      <Button
                          onClick={() => setShowUploadModal(false)}
                          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white glow-golden"
                      >
                        Continue
                      </Button>
                    </div>
                  </Card>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default CreatorProfile;