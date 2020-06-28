// Importing functionality from external packages
import { AsyncStorage } from "react-native";

// The KEY here is used as a "key" in the phone's local storage.
// If you save something at this key/location, you can retreive
// it using the same key/location
const KEY = "@WeatherApp/searchHistory";

// Custom exported method - Simply reads the phone's storage/memory
// at the searchHistory key, converts the string to JSON and returns
// it (if it found anything); otherwise, returns an empty array
export const getRecentSearch = () =>
  AsyncStorage.getItem(KEY).then(str => {
    if (str) {
      return JSON.parse(str);
    }
    return [];
  });

// Custom exported method - Takes in a new search "item" as a parameter
// and updates the recent history.
export const addRecentSearch = item =>
  // First gets the current "history" and filters out any result that matches
  // the current item's id
  getRecentSearch().then(history => {
    const oldHistory = history.filter(
      existingItem => existingItem.id !== item.id
    );

    // Creates a new history where the newly searched item is in the front (top) and
    // "spreads" the old history onto the back (bottom) of the history object
    const newHistory = [item, ...oldHistory];

    // Converts the new history object to a string and writes to the storage system
    // at the specified key/location
    return AsyncStorage.setItem(KEY, JSON.stringify(newHistory));
  });

// console.log("item", item);
// console.log("history", history);
// console.log("newHistory", newHistory);
