import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

export default function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return session ? <AppNavigator /> : <AuthNavigator />;
}
