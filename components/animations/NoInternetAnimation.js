import React from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";

export default function NoInternetAnimation({
  massage = "Opss...Tidak Ada Internet",
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8FCFE",
      }}
    >
      <LottieView
        style={{ width: 100, height: 100 }}
        source={require("../../assets/animations/no-internet.json")}
        autoPlay
        loop={false}
      />
      <Text>{massage}</Text>
    </View>
  );
}
