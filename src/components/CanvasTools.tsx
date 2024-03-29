import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

const CanvasTools = ({
  onStrokeSizeChange,
  onColorChange,
  onEraser,
  onSaveDrawing,
  onClearCanvas,
  isToolbarVisible,
  onToolbarVisibilityChange,
}) => {
  const strokeArray = [2, 4, 8, 16, 24];
  const colorArray = [
    {
      dark: "#000000",
      base: "#CCCCCC",
      light: "#FFFFFF",
    },
    {
      dark: "#CC0000",
      base: "#FF0000",
      light: "#FF6666",
    },
    {
      dark: "#CC6600",
      base: "#FF7F00",
      light: "#FFB366",
    },
    {
      dark: "#CCCC00",
      base: "#FFFF00",
      light: "#FFFF99",
    },
    {
      dark: "#00CC00",
      base: "#00FF00",
      light: "#66FF66",
    },
    {
      dark: "#0000CC",
      base: "#0000FF",
      light: "#6666FF",
    },
    {
      dark: "#32004B",
      base: "#4B0082",
      light: "#8A4B82",
    },
  ];
  const [localToolbarVisible, setLocalToolbarVisible] =
    useState(isToolbarVisible);
  const [currentTool, setCurrentTool] = useState("stroke");
  const [selectedStrokeSize, setSelectedStrokeSize] = useState(16);
  const [selectedColor, setSelectedColor] = useState(colorArray[0]);
 

  const selectStrokeColor = (color) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  const selectStrokeSize = (stroke: number) => {
    setSelectedStrokeSize(stroke);
    onStrokeSizeChange(stroke);
  };

  const onStrokeTool = () => {
    setCurrentTool("stroke");
    setLocalToolbarVisible(!localToolbarVisible);
  };

  const onColorPickerTool = () => {
    setCurrentTool("color");
    setLocalToolbarVisible(!localToolbarVisible);
  };

  const onEraserTool = () => {
    setLocalToolbarVisible(false);
    onEraser();
  };

  const onSaveTool = () => {
    setLocalToolbarVisible(false);
    onSaveDrawing();
  };

  const onTrashTool = () => {
    setLocalToolbarVisible(false);
    onClearCanvas();
  };
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 20,
        }}>
        {localToolbarVisible ? (
          <>
            <View
              style={{
                flex: 1,
                marginBottom: 10,
                position: "absolute",
                left: 20,
                right: 20,
                bottom: "100%",
                zIndex: 2,
                backgroundColor: "rgba(255,255,255,0.95)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,1.0)",
                borderStyle: "solid",
                borderRadius: 40,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 10,
              }}>
              <View
                style={{
                  width: "100%",
                  flex: 1,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-around",
                  alignItems: "center",
                  padding: 10,
                  gap: 5,
                }}>
                {currentTool === "stroke" ? (
                  <>
                    {strokeArray.map((stroke) => (
                      <TouchableOpacity
                        key={stroke}
                        onPress={() => selectStrokeSize(stroke)}
                        style={[
                          styles.strokeBox,
                          {
                            borderColor:
                              selectedStrokeSize === stroke
                                ? COLORS.secondary
                                : "transparent",
                          },
                        ]}>
                        <View
                          style={[
                            styles.stroke,
                            {
                              height: stroke,
                              width: stroke,
                            },
                          ]}></View>
                      </TouchableOpacity>
                    ))}
                  </>
                ) : null}
                {currentTool === "color" ? (
                  <>
                    {colorArray.map((color, index) => (
                      <>
                        {/* Dark Color */}
                        <TouchableOpacity
                          key={color.dark}
                          onPress={() => selectStrokeColor(color.dark)}
                          style={[
                            styles.box,
                            {
                              backgroundColor: color.dark,
                              opacity: selectedColor === color.dark ? 1 : 0.5,
                              borderColor:
                                selectedColor === color.dark
                                  ? COLORS.secondary
                                  : "#FFFFFF",
                            },
                          ]}
                        />
                        {/* Base Color */}
                        <TouchableOpacity
                          key={color.base}
                          onPress={() => selectStrokeColor(color.base)}
                          style={[
                            styles.box,
                            {
                              backgroundColor: color.base,
                              opacity: selectedColor === color.base ? 1 : 0.5,
                              borderColor:
                                selectedColor === color.base
                                  ? COLORS.secondary
                                  : "#FFFFFF",
                            },
                          ]}
                        />
                        {/* Light Color */}
                        <TouchableOpacity
                          key={color.light}
                          onPress={() => selectStrokeColor(color.light)}
                          style={[
                            styles.box,
                            {
                              backgroundColor: color.light,
                              opacity: selectedColor === color.light ? 1 : 0.5,
                              borderColor:
                                selectedColor === color.light
                                  ? COLORS.secondary
                                  : "#FFFFFF",
                            },
                          ]}
                        />
                      </>
                    ))}
                  </>
                ) : null}
              </View>
            </View>
          </>
        ) : null}
        <TouchableOpacity
          onPress={() => onColorPickerTool()}
          style={styles.tool}>
          <View style={{}}>
            <MaterialCommunityIcons
              name="palette-swatch-outline"
              size={30}
              color="white"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onStrokeTool()} style={styles.tool}>
          <View style={{}}>
            <MaterialCommunityIcons
              name="lead-pencil"
              size={30}
              color="white"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onEraserTool()} style={styles.tool}>
          <View style={{}}>
            <MaterialCommunityIcons name="eraser" size={30} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSaveTool()} style={styles.tool}>
          <View style={{}}>
            <MaterialCommunityIcons
              name="content-save-outline"
              size={30}
              color="white"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onTrashTool()} style={styles.tool}>
          <View style={{}}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color="white"
            />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tool: {
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    elevation: 2,
  },
  box: {
    backgroundColor: "black",
    borderRadius: 100,
    borderWidth: 6,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  strokeBox: {
    backgroundColor: "transparent",
    borderRadius: 100,
    borderWidth: 6,
    borderColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  stroke: {
    borderRadius: 100,
    backgroundColor: "black",
  },
  buttonBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default CanvasTools;
