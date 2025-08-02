import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mic, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import ReactWebcamCapture from "./Webcam";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"role" | "user" | "creator">("role");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [govtIdFile, setGovtIdFile] = useState<File | null>(null);
  const [livePhoto, setLivePhoto] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleRoleSelect = (role: "user" | "creator") => {
    setStep(role);
  };

  const handleGovIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setGovtIdFile(e.target.files[0]);
    }
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleCapture = (imageSrc: string | null) => {
    if (imageSrc) {
      const photoFile = dataURLtoFile(imageSrc, "livePhoto.jpg");
      setLivePhoto(photoFile);
      setShowCamera(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (step === "creator") {
      if (!govtIdFile || !livePhoto) {
        alert("Please upload your government ID and take a live photo.");
        return;
      }

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", "creator");
      formData.append("govtId", govtIdFile);
      formData.append("livePhoto", livePhoto);

      try {
        setSubmitting(true);
        await axios.post("https://music-backend-final.onrender.com/api/auth/signup", formData);
        alert("Signup successful!");
        navigate("/login");
      } catch (err: any) {
        alert("Signup failed.");
        console.error(err.response?.data || err.message);
      } finally {
        setSubmitting(false);
      }
    } else {
      try {
        setSubmitting(true);
        await axios.post("https://music-backend-final.onrender.com/api/auth/signup", {
          email,
          password,
          role: "user",
        });
        alert("Signup successful!");
        navigate("/login");
      } catch (err: any) {
        alert("Signup failed.");
        console.error(err.response?.data || err.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen watercolor-secondary-bg relative overflow-hidden flex items-center justify-center p-6">
      {/* Background effects */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-radial from-purple-400/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-radial from-yellow-400/25 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {step === "role" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Join the Platform</h1>
              <p className="text-gray-600">Choose your role to get started</p>
            </div>

            <div className="space-y-4">
              <Card
                className="glass-panel rounded-2xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 glow-golden liquid-glow group"
                onClick={() => handleRoleSelect("user")}
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto group-hover:pulse-golden">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">I'm a User</h3>
                    <p className="text-gray-600">Listen, invest, and collect music NFTs</p>
                  </div>
                </div>
              </Card>

              <Card
                className="glass-panel rounded-2xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 glow-golden liquid-glow group"
                onClick={() => handleRoleSelect("creator")}
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto group-hover:pulse-golden">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">I'm a Creator</h3>
                    <p className="text-gray-600">Upload, tokenize, and monetize your music</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {(step === "user" || step === "creator") && (
          <Card className="glass-panel rounded-3xl p-8 glow-golden slide-in-right">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {step === "creator" ? "Creator Signup" : "User Signup"}
              </h2>
              <p className="text-gray-600">Create your account to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email address"
                  className="rounded-xl"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  className="rounded-xl"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="rounded-xl"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {step === "creator" && (
                <div className="space-y-4 p-6 bg-white/20 rounded-xl">
                  <h3 className="font-semibold text-gray-800">KYC Verification</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-yellow-400 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Upload Government ID</p>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        hidden
                        onChange={handleGovIdChange}
                      />
                      {govtIdFile && (
                        <p className="text-xs mt-1 text-green-700">
                          ✅ {govtIdFile.name} selected
                        </p>
                      )}
                    </label>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-yellow-400 transition-colors"
                      onClick={() => setShowCamera(true)}
                    >
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Take Live Photo</p>
                    </div>
                    {livePhoto && !showCamera && (
  <p className="text-xs mt-1 text-green-700">
    ✅ Live photo captured
  </p>
)}

{showCamera && (
  <div className="mt-4">
    <ReactWebcamCapture
      setCapturedImage={handleCapture}
      renderFooter={
        <Button
          variant="destructive"
          onClick={() => setShowCamera(false)}
        >
          Cancel
        </Button>
      }
      
    />
  </div>
)}



                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full py-3 text-lg bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white glow-golden liquid-glow"
              >
                {submitting
                  ? "Submitting..."
                  : step === "creator"
                  ? "Create & Verify Account"
                  : "Create Account"}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  Login
                </button>
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Signup;






