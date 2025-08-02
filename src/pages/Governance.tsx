import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Wallet,
  Filter,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

export default function Governance() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [walletConnected, setWalletConnected] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [userRole, setUserRole] = useState("voter"); 

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await axios.get("https://music-backend-final.onrender.com/api/proposals");
        setProposals(res.data);
      } catch (err) {
        console.error("Failed to fetch proposals", err);
      }
    };
    fetchProposals();
  }, []);
  const connectWallet = () => {
    setWalletConnected(true);
    setUserRole("creator"); // Simulate creator wallet
  };
  
  const categories = [
    "all",
    "Revenue Distribution",
    "Yield Protocol", 
    "Vault Settings",
    "UI Upgrade",
    "Platform Features"
  ];

  const filteredProposals = selectedCategory === "all" 
    ? proposals 
    : proposals.filter(p => p.category === selectedCategory);

  const handleVote = (proposalId: number, vote: "for" | "against" | "abstain") => {
    console.log(`Voting ${vote} on proposal ${proposalId}`);
    // Implementation would handle voting logic
  };


  return (
    <div className="min-h-screen emerald-bg">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
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

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            DAO Governance
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Shape the future of the platform through community-driven proposals and voting
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-panel text-center p-6">
            <Users className="w-8 h-8 mx-auto mb-3 text-primary" />
            <div className="text-2xl font-bold">1,247</div>
            <div className="text-sm text-muted-foreground">Active Voters</div>
          </Card>
          <Card className="glass-panel text-center p-6">
            <TrendingUp className="w-8 h-8 mx-auto mb-3 text-emerald-600" />
            <div className="text-2xl font-bold">89.4%</div>
            <div className="text-sm text-muted-foreground">Participation Rate</div>
          </Card>
          <Card className="glass-panel text-center p-6">
            <CheckCircle className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <div className="text-2xl font-bold">23</div>
            <div className="text-sm text-muted-foreground">Proposals Passed</div>
          </Card>
        </div>

        <Tabs defaultValue="proposals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 glass-panel">
            <TabsTrigger value="proposals" className="data-[state=active]:glow-golden">
              Active Proposals
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:glow-golden">
              Voting History
            </TabsTrigger>
            {userRole === "creator" && (
              <TabsTrigger value="create" className="data-[state=active]:glow-golden">
                Create Proposal
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="proposals" className="space-y-6">
            {/* Filters */}
            <Card className="glass-panel p-4">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "glow-golden" : ""}
                    >
                      {category === "all" ? "All Categories" : category}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Proposals */}
            <div className="space-y-6">
              {filteredProposals.map((proposal) => (
                <Card key={proposal.id} className="glass-panel hover-scale">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">
                            {proposal.title}
                          </h3>
                          <Badge 
                            variant={proposal.status === "active" ? "default" : "secondary"}
                            className={proposal.status === "active" ? "bg-emerald-600" : ""}
                          >
                            {proposal.status}
                          </Badge>
                          <Badge variant="outline">
                            {proposal.category}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {proposal.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Proposed by {proposal.proposer}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {proposal.timeLeft}
                          </span>
                          <span>•</span>
                          <span>Impact: {proposal.impact}</span>
                        </div>
                      </div>
                    </div>

                    {/* Voting Stats */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-600">For: {proposal.votesFor.toLocaleString()}</span>
                        <span className="text-red-500">Against: {proposal.votesAgainst.toLocaleString()}</span>
                        <span className="text-gray-500">Abstain: {proposal.votesAbstain.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain)) * 100} 
                        className="h-2"
                      />
                    </div>

                    {/* Voting Buttons */}
                    {proposal.status === "active" && walletConnected && (
                      <div className="flex gap-3">
                        <Button
                          variant={proposal.userVoted === "for" ? "default" : "outline"}
                          onClick={() => handleVote(proposal.id, "for")}
                          className={proposal.userVoted !== "for" ? "glow-golden hover:bg-emerald-600" : ""}
                          disabled={proposal.userVoted !== null}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          For
                        </Button>
                        <Button
                          variant={proposal.userVoted === "against" ? "destructive" : "outline"}
                          onClick={() => handleVote(proposal.id, "against")}
                          disabled={proposal.userVoted !== null}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Against
                        </Button>
                        <Button
                          variant={proposal.userVoted === "abstain" ? "secondary" : "outline"}
                          onClick={() => handleVote(proposal.id, "abstain")}
                          disabled={proposal.userVoted !== null}
                        >
                          Abstain
                        </Button>
                      </div>
                    )}

                    {proposal.userVoted && (
                      <div className="mt-4 p-3 glass-accent rounded-lg">
                        <span className="text-sm text-muted-foreground">
                          You voted: <span className="font-medium capitalize">{proposal.userVoted}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="glass-panel p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Voting History</h3>
              <p className="text-muted-foreground">Your voting history will appear here</p>
            </Card>
          </TabsContent>

          {userRole === "creator" && (
            <TabsContent value="create">
              <Card className="glass-panel p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">Create New Proposal</h3>
                <p className="text-muted-foreground mb-6">
                  As a verified creator, you can propose platform improvements and features
                </p>
                <Button className="glow-golden">
                  Start New Proposal
                </Button>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}