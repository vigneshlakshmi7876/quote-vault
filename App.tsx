import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "./src/app/providers/ThemeProvider";
import { AuthProvider } from "./src/app/providers/AuthProvider";
import RootNavigator from "./src/app/navigation/RootNavigator";
import * as Linking from 'expo-linking';
import * as QuickActions from 'expo-quick-actions'; // Import for Widget
import { useEffect } from "react";
import { Platform } from "react-native";
import ThemedStatusBar from "@/components/common/ThemedStatusBar";

const linkingConfig: any = {
  prefixes: [
    Linking.createURL('/'), // For Expo Go (exp://)
    'quotevault://',        // <--- THIS for the Widget/Native Build
  ],
  config: {
    screens: {
      Home: { // Matches ROUTES.HOME in AppNavigator
        screens: {
          DailyQuote: 'daily-quote', // Matches TopTab screen name
        },
      },
      ProfileTab: 'profile',
    },
  },
};

export default function App() {

  // --- WIDGET / SHORTCUT SETUP ---
  useEffect(() => {
    QuickActions.setItems([
      {
        type: 'daily_quote',
        title: 'Quote of the Day',
        subtitle: 'See today\'s inspiration',
        icon: Platform.select({ ios: 'symbol:sparkles', android: 'shortcut_star' }),
        id: '0',
        params: { href: 'daily-quote' },
      },
    ]);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer
          linking={linkingConfig}
          // Handle Widget Click
          onReady={() => {
            const action = QuickActions.initial;
            if (action?.params?.href) {
              // Use the linking URL to jump
              Linking.openURL(Linking.createURL(action.params.href as string));
            }
          }}
        >
          <ThemedStatusBar />
          <RootNavigator />
        </NavigationContainer>

      </AuthProvider>
    </ThemeProvider>
  );
}