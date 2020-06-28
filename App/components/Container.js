// Importing functionality from external packages
import React from "react";
import { View } from "react-native";

// ///////////////////////////////////////////////////////////////////
// This component is exported and simply takes in as a parameter
// all the children passed to it (within the <Row>CHILDREN</Row> tags).
// All it really does is dictate that items should take up as much
// room as possible and sets the background color
// ///////////////////////////////////////////////////////////////////
export const Container = ({ children }) => (
  <View style={{ flex: 1, backgroundColor: "#3145b7" }}>{children}</View>
);
