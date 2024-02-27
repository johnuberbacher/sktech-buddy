import { ScrollView, View } from "react-native";
import React, { useEffect, useState } from "react";
import Canvas from "../components/Canvas";
import { useLayoutEffect } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import { supabase } from "../lib/supabase";
import COLORS from "../constants/colors";

const Draw = ({ route, navigation }) => {
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const { game, user } = route.params;

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

      const turn = game.user1 === user ? game.user2 : game.user1;

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
          <ConfirmDialog onClose={() => onConfirmDialog()} />
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
            <Canvas
              onSubmitDraw={(paths) =>
                handleSubmitDrawing(paths)
              }
              word={game.word}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Draw;
