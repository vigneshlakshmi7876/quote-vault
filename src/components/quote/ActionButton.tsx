import React, { memo } from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "@/components/common/ThemedText";

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
  size?: number;
  style?: ViewStyle;
}

function ActionButton({
  icon,
  label,
  onPress,
  color = "white",
  size = 32,
  style,
}: ActionButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.actionButton, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name={icon} size={size} color={color} />
      <ThemedText
        variant="caption"
        color="white"
        style={styles.label}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

export default memo(ActionButton);

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowRadius: 4,
  },
});
