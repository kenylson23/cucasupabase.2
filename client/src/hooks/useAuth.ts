import { useQuery } from "@tanstack/react-query";

interface AuthUser {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<AuthUser>({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };
}