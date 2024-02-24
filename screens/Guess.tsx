import {
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import LetterBoard from "../components/LetterBoard";
import FlatButton from "../components/FlatButton";
import Avatar from "../components/Avatar";
import COLORS from "../constants/colors";
import NewButton from "../components/NewButton";
import Modal from "../components/Modal";
import RewardDialog from "../components/RewardDialog";
import Loading from "../components/Loading";
import { supabase } from "../lib/supabase";

const Guess = ({ route, navigation }) => {
  const [isRewardDialogVisible, setIsRewardDialogVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const { game, user } = route.params;

  useEffect(() => {
    if (game.word) {
      setLoading(false);
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  async function updateGameTurn() {
    try {
      setLoading(true);

      const turn = game.user1 === user ? game.user2 : game.user1;

      const { data, error } = await supabase
        .from("games")
        .update({ word: null, turn: turn, action: "draw" })
        .eq("id", game.id)
        .select();

      if (error) {
        throw new Error("Error updating game turn");
      }
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  async function updateUserStats() {
    try {
      setLoading(true);

      const reward = game.difficulty === "easy" ? 1 : game.difficulty === "medium" ? 2 : 3;
      console.log(reward)
      const { data, error } = await supabase
        .from("profiles")
        .update({ coins: reward })
        .increment('coins')
        .match({ id: game.user1 });

      const { data2, error2 } = await supabase
        .from("profiles")
        .update({ coins: reward })
        .increment('coins')
        .match({ id: game.user2 });

      if (error || error2) {
        throw new Error("Error updating game turn");
      }
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  const responses = [
    "You really know how to sketch out the correct answer!",
    "That's the right sketch of things!",
    "You've drawn the correct conclusion!",
    "Your intuition has quite the artistic flair, drawing in the correct response!",
    "You've sketched the right idea on the canvas of this question!",
    "Your accuracy is drawing applause!",
    "You've drawn the bullseye on this one!",
    "Your guesswork is quite the masterpiece, drawing in correctness!",
    "That's the sketch of it – you're absolutely right!",
    "Your mental sketchpad is filled with the right answers!",
  ];

  const handleGuessCorrect = async () => {
    updateGameTurn();
    setIsRewardDialogVisible(true);
  };

  const onRewardDialog = () => {
    setIsRewardDialogVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <>
      {loading && <Loading />}
      {isRewardDialogVisible && (
        <Modal
          props=""
          title={responses[Math.floor(Math.random() * responses.length)]}>
          <RewardDialog
            onClose={() => onRewardDialog()}
            difficulty={game.difficulty}
          />
        </Modal>
      )}
      <View
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          backgroundColor: COLORS.secondary,
          gap: 20,
        }}>
        <View
          style={{
            width: "100%",
            height: "auto",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 20,
            gap: 20,
          }}>
          <View
            style={{
              width: "100%",
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 20,
            }}>
            <View
              style={{
                paddingLeft: 20,
                backgroundColor: COLORS.secondary,
                width: 100,
              }}>
              <Avatar />
            </View>
            <View
              style={{
                flex: 1,
                paddingLeft: 30,
                paddingRight: 20,
                paddingVertical: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopStartRadius: 40,
                borderBottomStartRadius: 40,
                backgroundColor: COLORS.primary,
                shadowColor: "rgba(0, 0, 0, 0.5)",
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.34,
                shadowRadius: 6.27,
                elevation: 10,
              }}>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: 0,
                }}>
                <Text
                  selectable={false}
                  style={{
                    fontSize: 14,
                    fontFamily: "Kanit-Regular",
                    color: "white",
                    opacity: 0.75,
                    lineHeight: 18,
                    textShadowColor: "rgba(0, 0, 0, 0.25)",
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  }}>
                  You are guessing
                </Text>
                <Text
                  selectable={false}
                  style={{
                    textTransform: "uppercase",
                    fontSize: 30,
                    fontFamily: "Kanit-SemiBold",
                    color: "white",
                    lineHeight: 36,
                    textShadowColor: "rgba(0, 0, 0, 0.25)",
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  }}>
                  {game.word}
                </Text>
                <Text
                  selectable={false}
                  style={{
                    fontSize: 14,
                    fontFamily: "Kanit-Regular",
                    color: "white",
                    opacity: 0.75,
                    lineHeight: 14,
                    textShadowColor: "rgba(0, 0, 0, 0.25)",
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  }}>
                  drawing!
                </Text>
              </View>
              <FlatButton />
            </View>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start",
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              shadowColor: "rgba(0, 0, 0, 0.5)",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,
              elevation: 10,
            }}></View>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "white",
            borderTopStartRadius: 40,
            borderTopEndRadius: 40,
            padding: 20,
            shadowColor: "rgba(0, 0, 0, 0.5)",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,
            elevation: 10,
          }}>
          <LetterBoard
            word={game.word}
            difficulty={game.difficulty}
            onGuessCorrect={handleGuessCorrect}
          />
          <View
            style={{
              width: "100%",
              flexDirection: "row",
            }}>
            <NewButton
              title="Help"
              onPress={() => {
                //
              }}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default Guess;
