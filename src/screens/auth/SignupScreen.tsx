import { Alert } from "react-native";
import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { STRINGS } from "@/constants";
import { ThemedView } from "@/components/common/ThemedView";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedInput } from "@/components/common/ThemedInput";
import { ThemedButton } from "@/components/common/ThemedButton";

export default function SignupScreen({ navigation }: any) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    const { error } = await signUp({ email, password });
    setLoading(false);

    if (error) Alert.alert(STRINGS.errors.generalTitle, error);
    else Alert.alert(STRINGS.success.title, STRINGS.auth.signupSuccess);
  };

  return (
    <ThemedView style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <ThemedText variant="h1" style={{ marginBottom: 32 }}>{STRINGS.auth.signupTitle}</ThemedText>

      <ThemedInput placeholder={STRINGS.auth.emailPlaceholder} onChangeText={setEmail} autoCapitalize="none"/>
      <ThemedInput placeholder={STRINGS.auth.passwordPlaceholder} secureTextEntry onChangeText={setPassword} />

      <ThemedButton title={STRINGS.auth.createAccountButton} onPress={handleSignup} loading={loading} />
      <ThemedButton title={STRINGS.auth.backToLoginButton} variant="outline" onPress={() => navigation.goBack()} />
    </ThemedView>
  );
}