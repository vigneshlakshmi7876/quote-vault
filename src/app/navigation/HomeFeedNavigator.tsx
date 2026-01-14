import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from '@/screens/home/HomeScreen';
import DailyQuoteScreen from '@/screens/home/DailyQuoteScreen'; 
import { ROUTES } from '@/constants';

const TopTab = createMaterialTopTabNavigator();

export default function HomeFeedNavigator() {
  return (
    <TopTab.Navigator
      initialRouteName={ROUTES.DAILY_QUOTE} // The app will open on the Feed (Right side)
      screenOptions={{
        tabBarStyle: { display: 'none' }, // HIDE the header tabs completely
        swipeEnabled: true, // Allow user to swipe between screens
      }}
    >
      {/* 1. Left Screen: Daily Quote */}
      <TopTab.Screen name={ROUTES.DAILY_QUOTE} component={DailyQuoteScreen} />
      
      {/* 2. Right Screen: Main Feed */}
      <TopTab.Screen name={ROUTES.HOME} component={HomeScreen} />
    </TopTab.Navigator>
  );
}