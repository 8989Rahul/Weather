// Importing functionality from external packages
import React from "react";
import { View, TextInput, Image, TouchableOpacity, Text } from "react-native";

// ///////////////////////////////////////////////////////////////////
// This component is the Search Bar, is exported and takes in as parameters:
//    onSearch - A function to call when the "Get Weather" button is pressed
//    searchButtonEnabled - Boolean for if the search button is enabled
//    ...props - Syntactic sugar to get the "rest of the properties" which
//                were passed in (in our case placeholder & onChangeText) and
//                are conveniently passed to the <TextInput /> control to be
//                used as that controls properties
// ///////////////////////////////////////////////////////////////////
export const SearchBar = ({
  onSearch,
  searchButtonEnabled = false,
  ...props
}) => (
  <View
    // Sets style for general text box
    style={{
      flexDirection: "row",
      marginHorizontal: 10,
      marginVertical: 10,
      paddingHorizontal: 10,
      paddingVertical: 15,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#ddd",
      backgroundColor: "#eee",
      alignItems: "center"
    }}
  >
    {/* Magnifying glass icon */}
    <Image
      source={require("../assets/search.png")}
      resizeMode="contain"
      style={{
        width: 20,
        height: 20,
        marginRight: 10,
        tintColor: "rgba(0, 0, 0, 0.4)"
      }}
    />
    {/* Actual text input specifying number pad keyboard to be launched */}
    <TextInput
      style={{
        fontSize: 18,
        flex: 1
      }}
      keyboardType="number-pad"
      {...props}
    />
    {/* Actual "search button" */}
    <TouchableOpacity onPress={onSearch} disabled={!searchButtonEnabled}>
      <Text
        style={{
          color: searchButtonEnabled ? "#147efb" : "rgba(0, 0, 0, 0.5)"
        }}
      >
        Get Weather
      </Text>
    </TouchableOpacity>
  </View>
);
