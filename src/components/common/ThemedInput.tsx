import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { useTheme } from "@/app/providers/ThemeProvider";
import { spacing } from "@/theme/spacing";

export const ThemedInput = (props: TextInputProps) => {
  const { theme } = useTheme();
  return (
    <TextInput
      placeholderTextColor={theme.text + "80"} // 50% opacity
      style={[
        styles.input,
        { 
          color: theme.text, 
          borderColor: theme.text + "20",
          backgroundColor: theme.card 
        },
        props.style
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.m,
    marginBottom: spacing.m,
    fontSize: 16,
  },
});