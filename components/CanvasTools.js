import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

const CanvasTools = ({ onStrokeSizeChange }) => {
  const strokeArray = [8, 12, 16, 20, 24];

  const [selectedStrokeSize, setSelectedStrokeSize] = useState(strokeArray[0]);

  const handleStrokeSizeSelect = (stroke) => {
    setSelectedStrokeSize(stroke);
    onStrokeSizeChange(stroke);
  };

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "#F0F2F2",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        elevation: 5,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#babfc5",
      }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 0,
        }}>
        {strokeArray.map((stroke) => (
          <TouchableOpacity
            key={stroke}
            onPress={() => handleStrokeSizeSelect(stroke)}
            style={[
              styles.box,
              {
                height: stroke,
                width: stroke,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "white",
    width: 30,
    height: 30,
    elevation: 2,
    margin: 15,
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
