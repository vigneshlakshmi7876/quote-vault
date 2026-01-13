import { Alert, View } from "react-native";
import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider"; // Use Hook
import { STRINGS, ROUTES } from "@/constants";
import { ThemedView } from "@/components/common/ThemedView";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedInput } from "@/components/common/ThemedInput";
import { ThemedButton } from "@/components/common/ThemedButton";

export default function LoginScreen({ navigation }: any) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await signIn({ email, password });
    setLoading(false);

    if (error) Alert.alert(STRINGS.errors.logonFailed, error);
  };

  return (
    <ThemedView style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <ThemedText variant="h1" style={{ marginBottom: 32 }}>{STRINGS.auth.loginTitle}</ThemedText>

      <ThemedInput 
        placeholder={STRINGS.auth.emailPlaceholder} 
        onChangeText={setEmail} 
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <ThemedInput 
        placeholder={STRINGS.auth.passwordPlaceholder} 
        secureTextEntry 
        onChangeText={setPassword} 
      />

      <ThemedButton 
        title={STRINGS.auth.loginButton} 
        onPress={handleLogin} 
        loading={loading} 
      />

      <ThemedButton 
        title={STRINGS.auth.signupButton} 
        variant="outline"
        onPress={() => navigation.navigate(ROUTES.SIGNUP)} 
      />

      <ThemedButton 
        title={STRINGS.auth.forgotPasswordButton} 
        variant="outline"
        onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)} 
      />
    </ThemedView>
  );
}