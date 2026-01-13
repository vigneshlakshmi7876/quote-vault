import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "@/app/providers/ThemeProvider";

interface Props {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  loading?: boolean;
}

export const ThemedButton = ({ title, onPress, variant = "primary", loading }: Props) => {
  const { theme } = useTheme();
  
  const isPrimary = variant === "primary";
  const bg = isPrimary ? theme.primary : "transparent";
  const text = isPrimary ? "#FFF" : theme.primary;

  return (
    <TouchableOpacity 
      style={[styles.btn, { backgroundColor: bg, borderColor: theme.primary, borderWidth: isPrimary ? 0 : 1 }]} 
      onPress={onPress}
      disabled={loading}
    >
      {loading ? <ActivityIndicator color={text} /> : (
        <Text style={[styles.text, { color: text }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { height: 50, borderRadius: 8, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  text: { fontSize: 16, fontWeight: "600" },
});