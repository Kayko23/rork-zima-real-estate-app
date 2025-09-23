import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Toujours commencer par le splash
    router.replace("/splash");
  }, [router]);

  return null;
}