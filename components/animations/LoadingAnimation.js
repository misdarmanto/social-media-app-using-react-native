import React from "react";
import LottieView from "lottie-react-native";
import { View } from "react-native";

function LoadingAnimation() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
      }}
    >
      <LottieView
        style={{ width: 200, height: 200 }}
        source={require("../../assets/animations/loading.json")}
        autoPlay
        loop={true}
      />
    </View>
  );
}

export default LoadingAnimation;
