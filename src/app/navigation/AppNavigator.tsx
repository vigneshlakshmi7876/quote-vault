import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons"; // Optional: for icons

import HomeScreen from "../../screens/home/HomeScreen";
import ProfileScreen from "../../screens/profile/ProfileScreen";
import SettingsScreen from "../../screens/profile/SettingsScreen"; // Import your new screen
import { ROUTES, STRINGS } from "@/constants";
import { useTheme } from "@/app/providers/ThemeProvider";
import CollectionDetailsScreen from "@/screens/profile/CollectionDetailsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Create a specific Stack for the Profile flow
function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      {/* The main Profile Screen (Header hidden because you built a custom one) */}
      <Stack.Screen 
        name={ROUTES.PROFILE} 
        component={ProfileScreen} 
        options={{ headerShown: false }} 
      />
      
      {/* The Settings Screen (Default Header shown so you get a 'Back' button) */}
      <Stack.Screen 
        name={ROUTES.SETTINGS} 
        component={SettingsScreen} 
        options={{ title: STRINGS.settings.title }}
      />

      <Stack.Screen 
        name={ROUTES.COLLECTION_DETAILS}
        component={CollectionDetailsScreen}
        options={{ headerBackTitle: 'Back' }} 
      />

    </Stack.Navigator>
  );
}

// 2. Main App Navigator
export default function AppNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // We handle headers inside the screens/stacks
        tabBarStyle: {
            backgroundColor: theme.card,
            borderTopColor: theme.text + '10',
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: 'gray',
        // Simple Icon Logic (Optional but looks professional)
        tabBarIcon: ({ focused, color, size }) => {
            let iconName: any;
            if (route.name === ROUTES.HOME) iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name={ROUTES.HOME} component={HomeScreen} />
      
      {/* Point the Profile Tab to your new Stack, NOT directly to the screen */}
      <Tab.Screen 
        name="ProfileTab" // Internal name for navigation
        component={ProfileStackNavigator} 
        options={{ tabBarLabel: STRINGS.profile.title }} // Label shown to user
      />
    </Tab.Navigator>
  );
}