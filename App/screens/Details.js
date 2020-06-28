// Importing functionality from external packages
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  View,
  Alert
} from "react-native";
import { format } from "date-fns";

// Importing components from other files in this project
import { weatherApi } from "../util/weatherApi";
import { Container } from "../components/Container";
import { WeatherIcon } from "../components/WeatherIcon";
import { BasicRow } from "../components/List";
import { H1, H2, P } from "../components/Text";
import { addRecentSearch } from "../util/recentSearch";

const groupForecastByDay = list => {
  // console.log(list);
  const data = {};

  list.forEach(item => {
    const [day] = item.dt_txt.split(" ");

    if (data[day]) {
      if (item.main.temp_min < data[day].temp_min) {
        data[day].temp_min = item.main.temp_min;
      }
      if (item.main.temp_max > data[day].temp_max) {
        data[day].temp_max = item.main.temp_max;
      }
    } else {
      data[day] = {
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max
      };
    }
  });

  // console.log(data);
  const formattedList = Object.keys(data).map(key => ({
    day: key,
    ...data[key]
  }));

  // console.log(formattedList);
  return formattedList;
};

// ///////////////////////////////////////////////////////////////////
// React class is created because we need access to state and will
// have dynamic data.
// ///////////////////////////////////////////////////////////////////
export default class Details extends React.Component {
  // State (a React thing) - essentially the "instance variables" of this class
  state = {
    currentWeather: {},
    loadingCurrentWeather: true,
    forecast: [],
    loadingForecast: true
  };

  // React lifecycle method (override) for when screen is being mounted or updated
  // This method is primarily getting the GPS coordinates and passing them into
  // methods that make API calls to obtain the current weather and forecast
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      // console.log("position", position);
      this.getCurrentWeather({ coords: position.coords });
      this.getForecast({ coords: position.coords });
    });

    // We can also call these methods by passing in a zipcode
    // const zipcode = 90210;
    // this.getCurrentWeather({ zipcode });
    // this.getForecast({ zipcode });
  }

  // React lifecycle method (override) for when screen is being updated
  componentDidUpdate(prevProps) {
    // Get previous and current zip/position
    const oldLat = prevProps.navigation.getParam("lat");
    const lat = this.props.navigation.getParam("lat");

    const oldLon = prevProps.navigation.getParam("lon");
    const lon = this.props.navigation.getParam("lon");

    const oldZipcode = prevProps.navigation.getParam("zipcode");
    const zipcode = this.props.navigation.getParam("zipcode");

    // If the lat/lon exist and were changed, then call methods to update
    // weather/forecast from GPS position; otherwise, if zipcode exists and
    // was changed, call methods to update weather/forecast from zipcode
    if (lat && oldLat !== lat && lon && oldLon !== lon) {
      this.getCurrentWeather({ coords: { latitude: lat, longitude: lon } });
      this.getForecast({ coords: { latitude: lat, longitude: lon } });
    } else if (zipcode && oldZipcode !== zipcode) {
      this.getCurrentWeather({ zipcode });
      this.getForecast({ zipcode });
    }
  }

  // Custom method - Takes in no parameters and simply pops up an error; when
  // pressing "Okay" on error popup, navigates to search page
  handleError = () => {
    Alert.alert("No location data found!", "Please try again", [
      {
        text: "Okay",
        onPress: () => this.props.navigation.navigate("Search")
      }
    ]);
  };

  // Custom method - Takes in an object with zipcode and coordinates and makes
  // a call to the weather API to obtain the current weather
  getCurrentWeather = ({ zipcode, coords }) => {
    // Call the weather API for the current weather, when it returns, the "then"
    // code will execute, which receives the JSON response
    weatherApi("/weather", { zipcode, coords })
      .then(response => {
        // console.log("current weather response", response);

        // If the response is a "404", then something went wrong; otherwise, set the title
        // on the top bar to the city "name" and pass the response to this.state.currentWeather
        // for safe keeping. Also, set this.state.loadingCurrentWeather to false and add response/city
        // to search history
        if (response.cod === "404") {
          this.handleError();
        } else {
          this.props.navigation.setParams({ title: response.name });
          this.setState({
            currentWeather: response,
            loadingCurrentWeather: false
          });
          addRecentSearch({
            id: response.id,
            name: response.name,
            lat: response.coord.lat,
            lon: response.coord.lon
          });
        }
      })
      .catch(err => {
        // If there is an exception when making the API call, log it to the console and alert the
        // user that there was an error.
        console.log("current weather error", err);
        this.handleError();
      });
  };

  // Custom method - Takes in an object with zipcode and coordinates and makes
  // a call to the weather API to obtain the forecast
  getForecast = ({ zipcode, coords }) => {
    // Call the weather API for the forecast, when it returns, the "then"
    // code will execute, which receives the JSON response
    weatherApi("/forecast", { zipcode, coords })
      .then(response => {
        // console.log("forecast response", response);

        // If the response is a NOT a "404" not found, pass the response to this.state.forecast
        // for safe keeping. Also, set this.state.loadingForecast to false
        if (response.cod !== "404") {
          this.setState({
            loadingForecast: false,
            forecast: groupForecastByDay(response.list)
          });
        }
      })
      .catch(err => {
        // If there is an exception when making the API call, log it to the console and alert the
        // user that there was an error.
        console.log("forecast error", err);
        this.handleError();
      });
  };

  // React lifecycle method (override) for when screen is being mounted or updated
  render() {
    // If we are loading the weather or forecast from the internet, then just display
    // an Activity Indicator (spinning wheel)
    if (this.state.loadingCurrentWeather || this.state.loadingForecast) {
      return (
        <Container>
          <ActivityIndicator color="#FFF" size="large" />
        </Container>
      );
    }

    // Pull current weather details from the react state
    const { weather, main } = this.state.currentWeather;

    // The actual JSX to return/display
    return (
      <Container>
        <ScrollView>
          <SafeAreaView>
            {/* Pull the icon from the response */}
            <WeatherIcon icon={weather[0].icon} />

            {/* Display the current temperature (line 1), Hi/Low temps (line 2) and humidity (line 3) */}
            <H1>{`${Math.round(main.temp)}°F`}</H1>
            <BasicRow>
              <H2>{`Low: ${Math.round(main.temp_min)}°F`}</H2>
              <H2>{`High: ${Math.round(main.temp_max)}°F`}</H2>
            </BasicRow>
            <BasicRow>
              <H2>{`Humidity: ${main.humidity}%`}</H2>
            </BasicRow>

            {/* Display the 6 day forecast */}
            <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
              {/* Gets the forecast array [] from the forecast response object and maps each item in the
                  daily forecast array (we call each answer: "day") basic row.  */}
              {this.state.forecast.map(day => (
                <BasicRow
                  key={day.day}
                  style={{ justifyContent: "space-between" }}
                >
                  <P>{format(new Date(day.day), "dddd, MMM D")}</P>
                  <View style={{ flexDirection: "row" }}>
                    <P>{`${Math.round(day.temp_min)}°F`}</P>
                    <P style={{ fontWeight: "700", marginLeft: 10 }}>
                      {`${Math.round(day.temp_max)}°F`}
                    </P>
                  </View>
                </BasicRow>
              ))}
            </View>
          </SafeAreaView>
        </ScrollView>
      </Container>
    );
  }
}
