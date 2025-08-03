import { useState, useEffect, useCallback, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Headphones,
  Search,
  Grid3X3,
  User,
  Brain,
  Settings,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMusicPlayer } from "@/contexts/MusicContext";

interface Song {
  _id: string;
  title: string;
  artist: string;
  cover: string;
  price?: string;
  audio?: string;
}

interface DecodedToken {
  userId: string;
  role: string;
  exp: number;
}

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const Dashboard = () => {
  const [discoverSongs, setDiscoverSongs] = useState<Song[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserId(decoded.userId);
        setUserRole(decoded.role);
      } catch (e) {
        console.error("Invalid token", e);
        localStorage.removeItem("token");
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      }
    }
  }, [navigate]);

  const fetchSongs = async () => {
    try {
      const response = await fetch("https://music-backend-final.onrender.com/api/songs");
      if (!response.ok) throw new Error("Failed to fetch songs");
      const data = await response.json();
      setDiscoverSongs(data);
      setPlaylist(data);
      setError(null);
    } catch (err: any) {
      setError("Failed to load songs. Please try again later.");
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("https://music-backend-final.onrender.com/api/allnotifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (err: any) {
      console.error("Failed to load notifications", err);
      toast.error("Failed to load notifications.");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`https://music-backend-final.onrender.com/api/notifications/read/${id}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to mark notification as read");
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err: any) {
      console.error("Failed to mark notification as read", err);
      toast.error("Failed to mark notification as read.");
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch(`https://music-backend-final.onrender.com/api/allnotifications/read-all`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to mark all notifications as read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err: any) {
      console.error("Failed to mark all as read", err);
      toast.error("Failed to mark all notifications as read.");
    }
  };

  const handlePlayClick = useCallback(
    (e: React.MouseEvent, song: Song) => {
      e.stopPropagation();
      setCurrentSong(song);
    },
    [setCurrentSong]
  );

  const handleBuyTokenClick = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    navigate(`/music/${song.id}`);
  };

  const handleCurrentSongClick = () => {
    if (currentSong?.id) {
      navigate(`/music/${currentSong.id}`);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!progressBarRef.current || duration === 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    seek(newTime);
  };

  const sidebarItems = [
    { icon: Headphones, label: "Dashboard", path: "/dashboard" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Grid3X3, label: "Vaults", path: userId ? `/vaults/${userId}` : "/login" },
    {
      icon: User,
      label: "Profile",
      path: userId
        ? userRole === "creator"
          ? `/creatorprofile/${userId}`
          : `/listenerprofile/${userId}`
        : "/login",
    },
    { icon: Brain, label: "Governance", path: userId ? `/governance/${userId}` : "/login" },
    { icon: Settings, label: "Preferences", path: userId ? `/settings/${userId}` : "/login" },
  ];

  const handleNavigation = (path: string) => {
    if (path === "/login" && !userId) {
      toast.error("Please log in to view this page.");
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <div className="min-h-screen watercolor-bg overflow-hidden">

      <div className="relative z-10 flex min-h-screen">
        <div className="w-20 glass-panel m-4 rounded-2xl p-4 flex flex-col items-center space-y-6">
          {sidebarItems.map((item) => (
            <div key={item.label} className="relative group">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleNavigation(item.path)}
                className="w-12 h-12 rounded-xl text-gray-600 hover:text-yellow-500 hover:bg-yellow-500/10 liquid-glow"
              >
                <item.icon className="w-6 h-6" />
              </Button>
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <div className="relative">
              <div className="relative z-[9999] overflow-visible">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-xl text-gray-600 hover:text-yellow-500 hover:bg-yellow-500/10 liquid-glow relative overflow-visible"
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  <Bell className="w-6 h-6" />
                </Button>
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-lg z-[10000]">
                    {unreadCount}
                  </span>
                )}
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 z-[9999]">
                  <div className="flex justify-between items-center p-3 border-b border-gray-200">
                    <span className="font-semibold text-gray-800">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        className="text-sm text-yellow-600 hover:underline"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-gray-500 text-center">No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${
                            n.read ? "bg-gray-50" : "bg-yellow-50 hover:bg-yellow-100"
                          }`}
                          onClick={() => markAsRead(n.id)}
                        >
                          <p className="text-sm text-gray-800">{n.message}</p>
                          <span className="text-xs text-gray-500">
                            {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Card
            className="glass-panel rounded-3xl p-8 glow-golden cursor-pointer"
            onClick={handleCurrentSongClick}
          >
            <div className="flex items-center space-x-8">
              <img
                src={currentSong?.cover || "https://via.placeholder.com/128?text=No+Song"}
                alt={currentSong?.title || "Current Song"}
                className="w-32 h-32 rounded-2xl object-cover shadow-lg"
              />
              <div className="flex-1 space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {currentSong?.title || "No Song Playing"}
                  </h2>
                  <p className="text-gray-600">{currentSong?.artist || "Unknown Artist"}</p>
                </div>
                <div className="flex items-center justify-center space-x-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      playPrevious();
                    }}
                    className="w-12 h-12 rounded-full hover:bg-yellow-500/10 hover:text-yellow-500 liquid-glow"
                  >
                    <SkipBack className="w-6 h-6" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayPause();
                    }}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg glow-golden"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      playNext();
                    }}
                    className="w-12 h-12 rounded-full hover:bg-yellow-500/10 hover:text-yellow-500 liquid-glow"
                  >
                    <SkipForward className="w-6 h-6" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div
                    ref={progressBarRef}
                    onClick={handleProgressBarClick}
                    className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
                  >
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-300"
                      style={{ width: `${(progress / duration) * 100 || 0}%` }}
                    />
                    <div
                      className="absolute w-4 h-4 bg-yellow-500 rounded-full shadow-lg pulse-golden transform -translate-y-1/2 top-1/2"
                      style={{ left: `calc(${(progress / duration) * 100 || 0}% - 8px)` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="overflow-y-auto max-h-[calc(100vh-300px)] pr-1 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Discover New Music</h2>
            {loading ? (
              <p className="text-gray-500">Loading songs...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : discoverSongs.length === 0 ? (
              <p className="text-gray-500">No songs available at the moment.</p>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {discoverSongs.map((song) => (
                  <Card
                    key={song._id || song.id}
                    className="glass-panel rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(`/music/${song.id}`)}
                  >
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={song.cover || "https://via.placeholder.com/300x300?text=No+Image"}
                          alt={song.title}
                          className="w-full aspect-square rounded-xl object-cover"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            size="sm"
                            onClick={(e) => handlePlayClick(e, song)}
                            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                          >
                            <Play className="w-4 h-4 mr-2" /> Play Now
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-800 truncate" title={song.title}>
                          {song.title}
                        </h3>
                        <p className="text-sm text-gray-600 truncate" title={song.artist}>
                          {song.artist}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-yellow-600">{song.price || "N/A"}</span>
                          <Button
                            size="sm"
                            onClick={(e) => handleBuyTokenClick(e, song)}
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white glow-golden liquid-glow"
                          >
                            Buy Token
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;




