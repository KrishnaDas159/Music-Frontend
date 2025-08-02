

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MusicProvider } from "./contexts/MusicContext";
import Dashboard from "./pages/Dashboard";
import MusicDetail from "./pages/MusicDetail";
import Search from "./pages/Search";
import Vaults from "./pages/Vaults";
import ListenerProfile from "./pages/profile/ListenerProfile";
import CreatorProfile from "./pages/profile/CreatorProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Governance from "./pages/Governance";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MusicProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/music/:id" element={<MusicDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/vaults/:userId" element={<Vaults />} />
            <Route path="/listenerprofile/:userId" element={<ListenerProfile />} />

            <Route path="/creatorprofile/:creatorId" element={<CreatorProfile />} />
            <Route path="/governance/:userId" element={<Governance />} />
            <Route path="/settings/:userId" element={<Settings />} />
            
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MusicProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;



