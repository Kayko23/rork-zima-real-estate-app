import { View, Text, Pressable, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { colors } from "@/theme/tokens";

export default function SectionHeader({ title, onSeeAll }:{ title:string; onSeeAll?:()=>void }) {
  return (
    <View style={s.row} testID="section-header">
      <Text style={s.title}>{title}</Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll} style={({pressed})=>[s.see, pressed && { opacity:.7 }]} accessibilityRole="button">
          <Text style={s.seeTxt}>Voir tout</Text>
          <ChevronRight size={16} color={colors.primary} />
        </Pressable>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  row:{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingHorizontal:12, marginTop:26, marginBottom:12 },
  title:{ fontSize:26, fontWeight:"800", color:"#0b1720" },
  see:{ flexDirection:"row", alignItems:"center", gap:6, padding:6, borderRadius:10 },
  seeTxt:{ color: colors.primary, fontWeight:"700" },
});
