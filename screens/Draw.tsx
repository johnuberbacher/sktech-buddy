import { Text, ScrollView, View } from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import Canvas from "../components/Canvas";
import ConfirmDialog from "../components/modals/ConfirmDialog";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import { supabase } from "../lib/supabase";
import COLORS from "../constants/colors";
import Avatar from "../components/Avatar";
import { fetchGameData } from "../util/DatabaseManager";

const Draw = ({ route, navigation }) => {
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const { game, user, opponent } = route.params;

  useEffect(() => {
    if (game.word) {
      setLoading(false);
    }
  }, []);

  useLayoutEffect(() => {
    game;
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSubmitDrawing = async (paths) => {
    try {
      setLoading(true);

      const turn = game.user1 === user.id ? game.user2 : game.user1;

      const { data, error } = await supabase
        .from("games")
        .update({
          word: game.word,
          turn: turn,
          action: "guess",
          svg: paths,
        })
        .eq("id", game.id);

      if (error) {
        throw new Error("Error updating game turn");
      }
      setLoading(false);
      setIsConfirmDialogVisible(true);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const onConfirmDialog = () => {
    setIsConfirmDialogVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <>
      {loading && <Loading />}
      {isConfirmDialogVisible && (
        <Modal props="" title="Drawing sent!">
          <ConfirmDialog
            user={user}
            opponent={opponent}
            onClose={() => onConfirmDialog()}
          />
        </Modal>
      )}
      <ScrollView
        style={{ backgroundColor: "transparent" }}
        contentContainerStyle={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100%",
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            height: "100%",
            width: "100%",
            maxWidth: 500,
            marginHorizontal: "auto",
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
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
                    marginLeft: 20,
                    backgroundColor: COLORS.secondary,
                    width: 60,
                    height: 60,
                  }}>
                  <Avatar user={opponent} />
                </View>
                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    height: 60,
                    width: "100%",
                    paddingLeft: 25,
                    paddingRight: 20,
                    paddingTop: 4,
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
                  <Text
                    selectable={false}
                    style={{
                      fontSize: 19,
                      lineHeight: 22,
                      alignSelf: "flex-start",
                      fontFamily: "Kanit-Medium",
                      color: "white",
                      textShadowColor: "rgba(0, 0, 0, 0.25)",
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 2,
                    }}>
                    Drawing{" "}
                    <Text
                      selectable={false}
                      style={{ fontFamily: "Kanit-Bold", textTransform: "uppercase" }}>
                      {game.word}
                    </Text>{" "}
                    for{" "}
                    <Text
                      selectable={false}
                      style={{ fontFamily: "Kanit-Medium" }}>
                      {opponent.username}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            <Canvas
              onSubmitDraw={(paths) => handleSubmitDrawing(paths)}
              word={game.word}
              user={user}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Draw;
