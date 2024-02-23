import React, { useState, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  StyleSheet,
  LogBox,
} from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Home from "./screens/Home";
import Draw from "./screens/Draw";
import Guess from "./screens/Guess";
import Landing from "./screens/Landing";
import Leaderboard from "./screens/Leaderboard";
import COLORS from "./constants/colors";
import AudioPlayer from "./util/AudioPlayer";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";

const App = () => {
  const [audioFilesLoaded, setAudioFilesLoaded] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [fontsLoaded] = useFonts({
    "Kanit-Black": require(/* webpackPreload: true */ "./assets/fonts/Kanit-Black.ttf"),
    "Kanit-Bold": require(/* webpackPreload: true */ "./assets/fonts/Kanit-Bold.ttf"),
    "Kanit-ExtraBold": require(/* webpackPreload: true */ "./assets/fonts/Kanit-ExtraBold.ttf"),
    "Kanit-Light": require(/* webpackPreload: true */ "./assets/fonts/Kanit-Light.ttf"),
    "Kanit-Medium": require(/* webpackPreload: true */ "./assets/fonts/Kanit-Medium.ttf"),
    "Kanit-Regular": require(/* webpackPreload: true */ "./assets/fonts/Kanit-Regular.ttf"),
    "Kanit-SemiBold": require(/* webpackPreload: true */ "./assets/fonts/Kanit-SemiBold.ttf"),
    "Kanit-Thin": require(/* webpackPreload: true */ "./assets/fonts/Kanit-Thin.ttf"),
  });

  if (Platform.OS === "android") {
    StatusBar.setBackgroundColor(COLORS.secondary);
  }

  if (Platform.OS === "ios") {
    StatusBar.setBarStyle("light-content");
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const Stack = createNativeStackNavigator();
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && audioFilesLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, audioFilesLoaded]);

  useEffect(() => {
    const hideSplash = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
    };

    hideSplash();
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchSession();
  }, []);

  if (!fontsLoaded || !audioFilesLoaded) {
    return null;
  }

  return (
    <NavigationContainer style={styles.container}>
      <SafeAreaView style={styles.safeArea} onLayout={onLayoutRootView}>
        <AudioPlayer
          source={require(/* webpackPreload: true */ "./assets/music/Catwalk.wav")}
        />
        <View style={styles.mainContainer}>
          <View style={styles.innerContainer}>
            { session && session.user ? <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                  headerBackVisible: false,
                  animation: "slide_from_right",
                }}>
                <Stack.Screen
                  name="Home"
                  component={Home}
                  initialParams={{
                    key: session.user.id,
                    session: session,
                  }}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Leaderboard"
                  component={Leaderboard}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Draw"
                  component={Draw}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Guess"
                  component={Guess}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Landing"
                  component={Landing}
                  options={{ headerShown: false }}
                />
              </Stack.Navigator> : <Landing /> }
          </View>
        </View>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flex: 1,
    flexDirection: "column",
    backgroundColor: COLORS.secondary,
  },
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  mainContainer: {
    backgroundColor: COLORS.secondary,
    flex: 1,
    position: "relative",
    width: "100%",
    maxWidth: 600,
    marginHorizontal: "auto",
  },
  innerContainer: {
    height: "auto",
    flex: 1,
    position: "relative",
    width: "100%",
    backgroundColor: "white",
  },
});

export default App;
