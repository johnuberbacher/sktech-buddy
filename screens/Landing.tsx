import {
  TouchableOpacity,
  Alert,
  View,
  ImageBackground,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import NewButton from "../components/NewButton";
import { useLayoutEffect, useState, useEffect } from "react";
import COLORS from "../constants/colors";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Landing = () => {
  const navigation = useNavigation();
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    console.log({ email, password });
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: { data: { username: username, rank: 1, coins: 0 } },
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          width: "100%",
          gap: 20,
          padding: 20,
        }}>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}>
        <ImageBackground
          style={{
            aspectRatio: 2 / 1,
            width: 350,
            height: "auto",
          }}
          source={require("../assets/logo.png")}
          resizeMode={"contain"}></ImageBackground>
      </View>

      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}>
        <ImageBackground
          style={{
            width: 200,
            height: 170,
            marginHorizontal: "auto",
            marginBottom: -20,
          }}
          source={require("../assets/fox.png")}
          resizeMode={"cover"}></ImageBackground>
        <ImageBackground
          style={{
            flexDirection: "row",
          }}
          blurRadius={5}
          resizeMode="cover">
          <View style={styles.overlayInner}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
              }}>
              <TextInput
                style={{
                  width: "100%",
                  color: COLORS.text,
                  fontSize: 20,
                  fontFamily: "Kanit-SemiBold",
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingVertical: 15,
                  gap: 40,
                  backgroundColor: "rgba(255,255,255,0.5)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,1.0)",
                  borderStyle: "solid",
                  borderRadius: 40,
                  elevation: 0,
                }}
                onChangeText={(text) => setUsername(text)}
                value={username}
                placeholder="Username"
                autoCapitalize={"none"}
              />
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
              }}>
              <TextInput
                style={{
                  width: "100%",
                  color: COLORS.text,
                  fontSize: 20,
                  fontFamily: "Kanit-SemiBold",
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingVertical: 15,
                  gap: 40,
                  backgroundColor: "rgba(255,255,255,0.5)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,1.0)",
                  borderStyle: "solid",
                  borderRadius: 40,
                  elevation: 0,
                }}
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="Email address"
                autoCapitalize={"none"}
              />
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
              }}>
              <TextInput
                style={{
                  color: COLORS.text,
                  fontSize: 20,
                  fontFamily: "Kanit-SemiBold",
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingVertical: 15,
                  gap: 40,
                  width: "100%",
                  backgroundColor: "rgba(255,255,255,0.5)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,1.0)",
                  borderStyle: "solid",
                  borderRadius: 40,
                  elevation: 0,
                }}
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
                placeholder="Password"
                autoCapitalize={"none"}
              />
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                gap: 10,
              }}>
              <NewButton title="Sign Up" onPress={() => signUpWithEmail()} />
              <NewButton
                title="Login"
                color="primary"
                onPress={() => signInWithEmail()}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
      
      <View
        style={{
          width: "100%",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Text>By tapping Sign In, you agree to our </Text>
        <TouchableOpacity>
          <Text
            style={{
              textDecorationStyle: "solid",
              textDecorationLine: "underline",
            }}
            onpress={() => Linking.openURL("https://www.google.com")}>
            Terms of Service
          </Text>
        </TouchableOpacity>
        <Text> and </Text>
        <TouchableOpacity>
          <Text
            style={{
              textDecorationStyle: "solid",
              textDecorationLine: "underline",
            }}
            onpress={() => Linking.openURL("https://www.google.com")}>
            Privacy Policy.
          </Text>
        </TouchableOpacity>
      </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center", 
    backgroundColor: COLORS.secondary,
  },
  overlayInner: {
    maxWidth: 500,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    borderStyle: "solid",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 0,
  },
});

export default Landing;
