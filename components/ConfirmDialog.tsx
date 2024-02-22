import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import NewButton from "../components/NewButton";
import React, { useState } from "react";
import Avatar from "../components/Avatar";
import COLORS from "../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ConfirmDialog = (props) => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading ? (
        <View
          style={{
            paddingVertical: 40,
            height: "100%",
            width: "100%",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
        </View>
      ) : (
        <>
          <View
            style={{
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
              }}>
              <View
                style={{
                  width: 80,
                }}>
                <Avatar />
              </View>
          <View style={{}}>
            <MaterialCommunityIcons
              name="transfer-right"
              size={30}
              color={COLORS.primary}
            />
          </View>
              <View
                style={{
                  width: 80,
                }}>
                <Avatar />
              </View>
            </View>
            <Text
              style={{
                width: "100%",
                height: "auto",
                fontSize: 18,
                fontFamily: "Kanit-Regular",
                color: COLORS.text,
                textAlign: "center",
                paddingHorizontal: 20,
                flexWrap: "wrap",
              }}>
              Your drawing was sent to juberbacher!
            </Text>
            <View
              style={{
                width: "100%",
                height: "auto",
                flexDirection: "row",
              }}>
              <NewButton
                color="primary"
                title="Continue"
                onPress={() => {
                  props.onClose();
                }}
              />
            </View>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(33, 33, 33, 0.9)",
    zIndex: 10,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayInner: {
    width: "100%",
    maxWidth: 400,
    marginHorizontal: "auto",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
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
  overlayTitle: {
    width: "100%",
    color: "white",
    fontSize: 24,
    fontFamily: "Kanit-SemiBold",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 2,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default ConfirmDialog;