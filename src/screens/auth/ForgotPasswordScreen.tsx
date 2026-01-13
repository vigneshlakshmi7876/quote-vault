import { Alert } from "react-native";
import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { STRINGS } from "@/constants";
import { ThemedView } from "@/components/common/ThemedView";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedInput } from "@/components/common/ThemedInput";
import { ThemedButton } from "@/components/common/ThemedButton";

export default function ForgotPasswordScreen({ navigation }: any) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) Alert.alert(STRINGS.errors.generalTitle, error);
    else {
      Alert.alert(STRINGS.success.title, STRINGS.auth.resetEmailSent);
      navigation.goBack();
    }
  };

  return (
    <ThemedView style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <ThemedText variant="h2" style={{ marginBottom: 20 }}>{STRINGS.auth.forgotPasswordTitle}</ThemedText>

      <ThemedInput placeholder={STRINGS.auth.emailPlaceholder} onChangeText={setEmail} autoCapitalize="none" />

      <ThemedButton title={STRINGS.auth.sendResetEmailButton} onPress={handleReset} loading={loading} />
      <ThemedButton title={STRINGS.auth.cancelButton} variant="outline" onPress={() => navigation.goBack()} />
    </ThemedView>
  );
}