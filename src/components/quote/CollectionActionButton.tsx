import React, { memo } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "@/components/common/ThemedText";

interface CollectActionButtonProps {
  label: string;
  onPress: () => void;
}

function CollectActionButton({ label, onPress }: CollectActionButtonProps) {
  return (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.dottedBox}>
        <Ionicons name="add" size={20} color="white" />
      </View>

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

export default memo(CollectActionButton);

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
  },
  dottedBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
    borderStyle: "dotted",
    justifyContent: "center",
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
