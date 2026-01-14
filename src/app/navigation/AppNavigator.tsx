import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import ProfileScreen from "../../screens/profile/ProfileScreen";
import SettingsScreen from "../../screens/profile/SettingsScreen"; 
import { ROUTES, STRINGS } from "@/constants";
import { useTheme } from "@/app/providers/ThemeProvider";
import CollectionDetailsScreen from "@/screens/profile/CollectionDetailsScreen";
import HomeFeedNavigator from "./HomeFeedNavigator";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Profile Stack (Now uses Theme!)
function ProfileStackNavigator() {
  // Access the theme here
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        // Dynamic Background Color (Dark in Dark Mode, White in Light Mode)
        headerStyle: { 
            backgroundColor: theme.card 
        },
        // Dynamic Text/Icon Color (White in Dark Mode, Black in Light Mode)
        headerTintColor: theme.text,
        headerShadowVisible: false, 
      }}
    >
      <Stack.Screen 
        name={ROUTES.PROFILE} 
        component={ProfileScreen} 
        options={{ headerShown: false }} 
      />
      
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
        headerShown: false, 
        tabBarStyle: {
            backgroundColor: theme.card,
            borderTopColor: theme.text + '10',
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
            let iconName: any;
            if (route.name === ROUTES.HOME) iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name={ROUTES.HOME} component={HomeFeedNavigator} />
      
      <Tab.Screen 
        name={ROUTES.PROFILE_TAB} 
        component={ProfileStackNavigator} 
        options={{ tabBarLabel: STRINGS.profile.title }} 
      />
    </Tab.Navigator>
  );
}