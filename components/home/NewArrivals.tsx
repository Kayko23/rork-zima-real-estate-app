import React from "react";
import { View } from "react-native";
import SectionHeader from "@/components/home/SectionHeader";
import PropertyCard, { type Property } from "@/components/property/PropertyCard";
import PropertySkeletonCard from "@/components/property/PropertySkeletonCard";
import { useRouter } from "expo-router";

export default function NewArrivals({ data, loading }: { data: Property[]; loading?: boolean; }) {
  const router = useRouter();
  return (
    <View testID="home-new-arrivals">
      <SectionHeader title="Nouveautés" onSeeAll={()=>router.push("/property?sort=new" as any)} />
      <View style={{ paddingHorizontal:12 }}>
        {loading && [0,1].map(k => <View key={k} style={{ marginBottom:16 }}><PropertySkeletonCard/></View>)}
        {!loading && data.map(p => (
          <View key={p.id} style={{ marginBottom:16 }}>
            <PropertyCard item={p}/>
          </View>
        ))}
      </View>
    </View>
  );
}
