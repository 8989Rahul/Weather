// Importing functionality from external packages
import React from "react";
import { FlatList, Text, View } from "react-native";

// Importing components from other files in this project
import { SearchBar } from "../components/SearchBar";
import { SearchItem } from "../components/List";
import { getRecentSearch } from "../util/recentSearch";

// ///////////////////////////////////////////////////////////////////
// React class is created because we need access to state and will
// have dynamic data.
// ///////////////////////////////////////////////////////////////////
class Search extends React.Component {
  // State (a React thing) - essentially the "instance variables" of this class
  state = {
    query: "",
    recentSearch: []
  };

  // React lifecycle method (override) for when screen is being mounted or updated
  // This method is calling the getRecentSearch() method to load recent search items
  // (from the phone's storage) into this screen's state
  componentDidMount() {
    getRecentSearch().then(recentSearch => {
      this.setState({ recentSearch });
    });
  }

  // React lifecycle method (override) for when screen is being mounted or updated
  render() {
    // The actual JSX to return/display
    return (
      // "item" refers to each item in this.state.recentSearch array []
      <FlatList
        data={this.state.recentSearch}
        renderItem={({ item }) => (
          <SearchItem
            name={item.name}
            onPress={() =>
              this.props.navigation.navigate("Details", {
                lat: item.lat,
                lon: item.lon
              })
            }
          />
        )}
        keyExtractor={item => item.id.toString()}
        // The header of each component is composed of the search bar and
        // the word "Recents"....THEN follows each item below
        ListHeaderComponent={(
<View>
            <SearchBar
              onSearch={() => {
                this.props.navigation.navigate("Details", {
                  zipcode: this.state.query
                });
              }}
              searchButtonEnabled={this.state.query.length >= 5}
              placeholder="Zipcode"
              onChangeText={query => this.setState({ query })}
            />
            <Text
              style={{
                marginHorizontal: 10,
                fontSize: 16,
                color: "#AAA",
                marginTop: 10,
                marginBottom: 5
              }}
            >
              Recents
            </Text>
          </View>
)}
      />
    );
  }
}

export default Search;
