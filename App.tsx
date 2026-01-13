import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "./src/app/providers/ThemeProvider";
import { AuthProvider } from "./src/app/providers/AuthProvider";
import RootNavigator from "./src/app/navigation/RootNavigator";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}
