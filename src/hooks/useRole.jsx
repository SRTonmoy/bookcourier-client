import { useAuth } from "./useAuth";

export default function useRole() {
  const { role, loading } = useAuth();

  return { role, loading };
}
