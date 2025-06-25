import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { useAuth } from "./hooks/use-auth";
import Dashboard from "./pages/dashboard";
import Patients from "./pages/patients";
import Consultations from "./pages/consultations";
import Appointments from "./pages/appointments";
import AiAssistant from "./pages/ai-assistant";
import Login from "./pages/login";
import Signup from "./pages/signup";
import NotFound from "./pages/not-found";
import Certificates from "./pages/certificates";
import Prescriptions from "./pages/prescriptions";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading, isAuthenticated } = useAuth();
  
  console.log("ProtectedRoute - user:", user, "loading:", loading, "isAuthenticated:", isAuthenticated);
  
  if (loading) {
    console.log("ProtectedRoute - Chargement en cours...");
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    console.log("ProtectedRoute - Non authentifié, redirection vers /login");
    return <Redirect to="/login" />;
  }
  
  console.log("ProtectedRoute - Utilisateur authentifié, rendu du composant");
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/patients" component={() => <ProtectedRoute component={Patients} />} />
      <Route path="/consultations" component={() => <ProtectedRoute component={Consultations} />} />
      <Route path="/appointments" component={() => <ProtectedRoute component={Appointments} />} />
      <Route path="/certificates" component={() => <ProtectedRoute component={Certificates} />} />
      <Route path="/prescriptions" component={() => <ProtectedRoute component={Prescriptions} />} />
      <Route path="/assistant-ia" component={() => <ProtectedRoute component={AiAssistant} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
