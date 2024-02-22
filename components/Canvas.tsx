import React, { useLayoutEffect, useState, useRef } from "react";
import { Svg, Path } from "react-native-svg";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import ColorPicker from "./ColorPicker";
import Button from "./Button";
import NewButton from "./NewButton";
import CanvasTools from "./CanvasTools";
import Avatar from "./Avatar";
import FlatButton from "./FlatButton";
import COLORS from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const Canvas = ({ onSubmitDraw, word }) => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const startPointRef = useRef({ x: 0, y: 0 });
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedStrokeSize, setSelectedStrokeSize] = useState(8);
  const [eraserActive, setEraserActive] = useState(false);
  const navigation = useNavigation();
  const viewShotRef = useRef<ViewShot>(null);
  const staticword = word;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const smoothPath = (path) => {
    if (path.length < 2) return path;

    return path.reduce((acc, point, i, arr) => {
      if (i === 0) {
        return [`M${point.x},${point.y}`];
      }

      const prevPoint = arr[i - 1];
      const midPoint = {
        x: (point.x + prevPoint.x) / 2,
        y: (point.y + prevPoint.y) / 2,
      };

      return [
        ...acc,
        `Q${prevPoint.x},${prevPoint.y} ${midPoint.x},${midPoint.y}`,
      ];
    }, []);
  };

  const handleGestureEvent = ({ nativeEvent }) => {
    const { x, y } = nativeEvent;

    setCurrentPath((prevPath) => [...prevPath, { x, y }]);
  };

  const handleGestureStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.BEGAN) {
      startPointRef.current = { x: nativeEvent.x, y: nativeEvent.y };
      setCurrentPath([{ x: nativeEvent.x, y: nativeEvent.y }]);
    } else if (nativeEvent.state === State.END) {
      setPaths((prevPaths) => [
        ...prevPaths,
        {
          path: smoothPath(currentPath),
          color: selectedColor ? selectedColor : "#000000",
          strokeSize: eraserActive ? 12 : selectedStrokeSize,
        },
      ]);
      setCurrentPath([]);
    }
  };

  const handleGestureEnd = () => {
    // null
  };

  const handleStrokeSizeChange = (stroke) => {
    if (!eraserActive) {
      setSelectedStrokeSize(stroke);
    }
  };

  const handleColorChange = (color) => {
    if (!eraserActive) {
      setSelectedColor(color);
    }
  };

  const handleClearCanvas = () => {
    setPaths([]);
  };

  const handleSaveDrawing = async () => {
    try {
      // Request permission to access the media library
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        // Permission denied, show an alert or handle accordingly
        console.error(
          "Permission Denied",
          "Please grant permission to access the media library."
        );
        //  return;
      }

      const uri = await viewShotRef.current.capture();
      const fileUri = `${FileSystem.documentDirectory}capturedImage.png`;

      // Save the image to a specific folder on the device
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      // Save the image to the media library
      await MediaLibrary.saveToLibraryAsync(fileUri);

      console.log("Image saved to media library:", fileUri);
    } catch (error) {
      console.error("Error capturing and saving image:", error);
    }
  };

  const handleEraser = () => {
    setSelectedColor("#fff");
  };

  const submitDrawing = () => {
    onSubmitDraw();
    console.log("made it here");
  };

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.secondary,
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
                You are drawing
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
                {staticword}
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
                for juberbacher
              </Text>
            </View>
            <FlatButton />
          </View>
        </View>
      </View>

      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 1 }}
        style={{
          flex: 1,
          height: "100%",
          padding: 20,
        }}>
        <View style={styles.container}>
          <GestureHandlerRootView style={{ flex: 1, width: "100%" }}>
            <PanGestureHandler
              onGestureEvent={handleGestureEvent}
              onHandlerStateChange={handleGestureStateChange}
              onEnded={handleGestureEnd}
              style={{ flex: 1, height: "100%" }}>
              <Svg style={styles.svgContainer}>
                {paths.map((pathObject, pathIndex) => (
                  <Path
                    key={pathObject + pathIndex}
                    d={pathObject.path.join(" ")}
                    stroke={eraserActive ? "#fff" : pathObject.color}
                    strokeWidth={pathObject.strokeSize}
                    strokeLinecap="round"
                    fill="none"
                  />
                ))}
                {currentPath.length > 1 && (
                  <Path
                    d={smoothPath(currentPath).join(" ")}
                    stroke={eraserActive ? "#fff" : selectedColor}
                    strokeWidth={eraserActive ? 12 : selectedStrokeSize}
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
              </Svg>
            </PanGestureHandler>
          </GestureHandlerRootView>
        </View>
      </ViewShot>

      <View
        style={{
          width: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "white",
          borderTopStartRadius: 40,
          borderTopEndRadius: 40,
          padding: 20,
          gap: 20,
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
            position: "absolute",
            left: 20,
            right: 20,
            top: -20,
            zIndex: 2,
            backgroundColor: "white",
            paddingVertical: 20,
            paddingHorizontal: 20,
            borderRadius: 30,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            shadowColor: "rgba(0, 0, 0, 0.5)",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,
            elevation: 10,
          }}>
          <ColorPicker onColorChange={handleColorChange} />
        </View>
        <CanvasTools
          onSaveDrawing={handleSaveDrawing}
          onEraser={handleEraser}
          onClearCanvas={handleClearCanvas}
          onStrokeSizeChange={handleStrokeSizeChange}
        />
        <View
          style={{
            height: "auto",
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "stretch",
            gap: 20,
          }}>
          <NewButton
            color="secondary"
            title="Continue"
            onPress={submitDrawing}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    flex: 1,
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
  },
  svgContainer: {
    height: "100%",
    width: "100%",
  },
});

export default Canvas;
