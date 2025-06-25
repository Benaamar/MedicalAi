import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth";
import { Fingerprint, Lock, User } from "lucide-react";

export default function Login() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    
    try {
      const result = await login(username, password);
      
      if (result.success) {
        toast({ title: "Connecté", description: "Bienvenue " + result.user.name });
        setLocation("/");
      } else {
        toast({ title: "Erreur", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur de connexion", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-indigo-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md mx-auto">
        {/* Glass morphism card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8">
          {/* Header with fingerprint icon */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-3 sm:mb-4 shadow-lg">
              <Fingerprint className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Connexion Sécurisée
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Accédez à votre espace médical</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Username field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base bg-white/50 border-gray-200/50 focus:bg-white/80 focus:border-blue-300 transition-all duration-200"
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base bg-white/50 border-gray-200/50 focus:bg-white/80 focus:border-blue-300 transition-all duration-200"
              />
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Connexion...</span>
                </div>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          {/* Sign up link */}
          <div className="text-center mt-4 sm:mt-6">
            <p className="text-sm sm:text-base text-gray-600">
              Pas encore de compte ?{" "}
              <a
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              >
                Créer un compte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 