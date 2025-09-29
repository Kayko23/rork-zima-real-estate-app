import { useEffect } from "react";
import { router } from "expo-router";

export default function MessagesBridge() {
  useEffect(() => { 
    router.replace("/(tabs)/messages"); 
  }, []);
  return null;
}