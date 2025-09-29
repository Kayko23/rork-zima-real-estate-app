import { useEffect } from "react";
import { router } from "expo-router";

export default function FavoritesBridge() {
  useEffect(() => { 
    router.replace("/(tabs)/favorites"); 
  }, []);
  return null;
}