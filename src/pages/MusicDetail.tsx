import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Heart, Share2, ExternalLink,
  Play, Pause, SkipBack, SkipForward
} from "lucide-react";

import { useMusicPlayer } from "@/contexts/MusicContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const MusicDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    setCurrentSong,
    togglePlayPause,
    playNext,
    playPrevious,
    setPlaylist,
    seek,
  } = useMusicPlayer();

  const [songData, setSongData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const tokenPrice = parseFloat(songData?.stats?.tokenPrice || "0");
  const totalPrice = (tokenPrice * quantity).toFixed(2);

  useEffect(() => {
    const fetchSong = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`https://music-backend-final.onrender.com/api/songs/${id}`);
        if (!res.ok) throw new Error("Song not found");
        const data = await res.json();
        setSongData(data);
      } catch (err) {
        console.error("Error fetching song:", err);
        setSongData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  const handleBuyToken = () => {
    setQuantity(1);
    setShowBuyModal(true);
  };
  

  const isThisSongActive = currentSong?.id === songData?.id;

  const handlePlayPauseClick = () => {
    if (isThisSongActive) {
      togglePlayPause();
    } else if (songData) {
      setCurrentSong(songData);
    }
  };
  

  const currentTime = isThisSongActive ? progress : 0;
  const totalDuration = isThisSongActive ? duration : 0;
  const progressPercent = (currentTime / totalDuration) * 100;

  if (loading) return <div className="p-10 text-center text-gray-600">Loading song...</div>;
  if (!songData) return <div className="p-10 text-center text-red-600">Song not found</div>;

  return (
    <div className="min-h-screen emerald-bg relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-40 left-40 w-96 h-96 bg-gradient-radial from-yellow-400/30 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-radial from-emerald-400/25 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 min-h-screen p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 text-emerald-700 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-xl p-3 glow-golden"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Button>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className={`w-10 h-10 rounded-full ${isLiked ? "text-red-500 bg-red-500/10" : "text-gray-600 hover:text-red-500 hover:bg-red-500/10"} liquid-glow`}
            >
              <Heart className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => alert("Share feature coming soon!")}
              className="w-10 h-10 rounded-full text-gray-600 hover:text-blue-500 hover:bg-blue-500/10 liquid-glow"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Song Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="glass-panel rounded-3xl p-8 mb-8 glow-golden float">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
              <img
                src={songData.cover}
                alt={songData.title}
                className="w-80 h-80 rounded-2xl object-cover shadow-2xl"
              />

              {/* Info + Controls */}
              <div className="flex-1 flex flex-col justify-center space-y-6 text-center lg:text-left">
                <div className="space-y-3">
                  <h1 className="text-4xl font-bold text-gray-800">{songData.title}</h1>
                  <div className="flex items-center justify-center lg:justify-start space-x-3">
                    <p className="text-xl text-gray-600">{songData.artist}</p>
                    {songData.verified && (
                      <Badge className="bg-blue-500/20 text-blue-700 border-blue-300">
                        Verified Creator
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-6">
                    <Button variant="ghost" size="icon" onClick={playPrevious} className="w-12 h-12 rounded-full hover:bg-yellow-500/10 hover:text-yellow-500 liquid-glow">
                      <SkipBack className="w-6 h-6" />
                    </Button>
                    <Button onClick={handlePlayPauseClick} className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg glow-golden">
                      {isThisSongActive && isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={playNext} className="w-12 h-12 rounded-full hover:bg-yellow-500/10 hover:text-yellow-500 liquid-glow">
                      <SkipForward className="w-6 h-6" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div
                      className="relative w-full h-2 bg-gray-200/50 rounded-full overflow-hidden cursor-pointer"
                      onClick={(e) => {
                        if (!isThisSongActive) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const clickedTime = (clickX / rect.width) * duration;
                        seek(clickedTime);
                      }}
                    >
                      <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                        style={{ width: `${progressPercent || 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(totalDuration)}</span>
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                <div className="flex items-center justify-center lg:justify-start space-x-4 pt-4">
                  <Button
                    size="lg"
                    onClick={handleBuyToken}
                    className="flex-grow lg:flex-grow-0 px-8 py-3 text-base bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl glow-emerald liquid-glow"
                  >
                    ✨ Buy Token
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 border-gray-300 hover:border-yellow-500 hover:text-yellow-500 liquid-glow"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View on Sui</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats */}
          {songData?.stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Token Price", value: songData.stats.tokenPrice },
                { label: "Vault Yield", value: songData.stats.vaultYield },
                { label: "Holders", value: songData.stats.holders },
                { label: "creator Revenue", value: songData.stats.creatorRevenue, highlight: true }
              ].map((stat, i) => (
                <Card key={i} className="glass-panel rounded-xl p-4 text-center">
                  <p className={`text-2xl font-bold ${stat.highlight ? "text-yellow-600" : "text-gray-800"}`}>{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="glass-panel rounded-3xl p-8 max-w-md w-full glow-golden slide-in-right">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold text-gray-800">Buy Music Token</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Token Price:</span>
                  <span className="font-semibold text-yellow-600">{songData.stats.tokenPrice}</span>
                </div>
                
                <div className="flex justify-between items-center">
  <span className="text-gray-600">Quantity:</span>
  <div className="flex items-center space-x-3">
    <Button
      variant="outline"
      size="sm"
      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
    >
      -
    </Button>
    <span className="w-8 text-center">{quantity}</span>
    <Button
      variant="outline"
      size="sm"
      onClick={() => setQuantity((q) => q + 1)}
    >
      +
    </Button>
  </div>
</div>

                
<div className="flex justify-between items-center text-lg font-semibold">
  <span>Total:</span>
  <span className="text-yellow-600">{totalPrice}</span>
</div>

              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowBuyModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowBuyModal(false);
                    // Handle purchase logic here
                  }}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white glow-golden"
                >
                  Confirm Purchase
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MusicDetail;



