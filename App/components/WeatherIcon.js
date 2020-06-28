// Importing functionality from external packages
import React from "react";
import { View, Image } from "react-native";

// Importing components from other files in this project
import { getWeatherIcon } from "../util/icons";

// ///////////////////////////////////////////////////////////////////
// This component is simply a weather image/icon that takes in as a single
// parameter:
//      icon - Icon key to pass into getWeatherIcon() method for icon source
// ///////////////////////////////////////////////////////////////////
export const WeatherIcon = ({ icon }) => (
  <View style={{ alignItems: "center" }}>
    <Image
      source={getWeatherIcon(icon)}
      style={{ width: 200, height: 200, tintColor: "#fff" }}
      resizeMode="contain"
    />
  </View>
);
