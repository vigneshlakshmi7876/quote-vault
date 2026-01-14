import { Alert, Platform, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, TouchableOpacity, View } from "react-native";
import { useState, useRef, useEffect } from "react";
import LottieView from "lottie-react-native"; // 1. Import Lottie
import { useAuth } from "@/app/providers/AuthProvider"; 
import { STRINGS, ROUTES } from "@/constants";
import { ThemedView } from "@/components/common/ThemedView";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedInput } from "@/components/common/ThemedInput";
import { ThemedButton } from "@/components/common/ThemedButton";
import { useTheme } from "@/app/providers/ThemeProvider";

export default function LoginScreen({ navigation }: any) {
  const { signIn } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    // Optional: Play animation on mount
    animationRef.current?.play();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await signIn({ email, password });
    setLoading(false);

    if (error) Alert.alert(STRINGS.errors.logonFailed, error);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={{ 
              flexGrow: 1, 
              padding: 24, 
              justifyContent: "center" 
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* 2. LOTTIE ANIMATION HEADER */}
            <View style={{ alignItems: 'center', marginBottom: 5 }}>
                <LottieView
                    ref={animationRef}
                    // REPLACE WITH YOUR ACTUAL PATH
                    source={require('@/../assets/animations/welcome.json')}
                    autoPlay
                    loop={true} // Set to false if you only want it to play once
                    style={{
                        width: 200,
                        height: 200,
                        // Optional: Tint the animation to match your theme if it's a simple icon
                        // tintColor: theme.primary 
                    }}
                />
            </View>

            <ThemedText variant="h1" style={{ marginBottom: 20, textAlign: 'center' }}>
                {STRINGS.auth.loginTitle}
            </ThemedText>

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

            {/* Forgot Password Link */}
            <View style={{ alignSelf: 'flex-end', marginBottom: 24, marginTop: 8 }}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <ThemedText 
                        variant="bodySmall" 
                        style={{ color: theme.primary, fontWeight: '600' }}
                    >
                        {STRINGS.auth.forgotPasswordButton}
                    </ThemedText>
                </TouchableOpacity>
            </View>

            {/* Login Button */}
            <ThemedButton 
              title={STRINGS.auth.loginButton} 
              onPress={handleLogin} 
              loading={loading} 
            />

            {/* Signup Button */}
            <ThemedButton 
              title={STRINGS.auth.signupButton} 
              variant="outline"
              
              onPress={() => navigation.navigate(ROUTES.SIGNUP)} 
            />

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}