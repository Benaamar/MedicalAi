import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  const query = useQuery<{ id: number; name: string; username: string; role: string } | null>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      console.log("useCurrentUser - Token présent:", !!token);
      
      if (!token) {
        console.log("useCurrentUser - Pas de token, retour null");
        return null;
      }
      
      try {
        console.log("useCurrentUser - Appel API /api/auth/me");
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        console.log("useCurrentUser - Statut réponse:", res.status);
        
        if (res.status === 401) {
          console.log("useCurrentUser - Token invalide, suppression");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          return null;
        }
        
        if (!res.ok) {
          throw new Error("Erreur fetch user");
        }
        
        const userData = await res.json();
        console.log("useCurrentUser - Données utilisateur reçues:", userData);
        return userData;
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        return null;
      }
    },
    staleTime: 0, // Pas de cache - toujours frais
    cacheTime: 0, // Pas de cache en mémoire
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: false,
  });

  return query;
} 