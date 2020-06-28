// Your unique API key
const apiKey = "API_KEY";

// Custom method - Takes in as parameters:
//    path - Substring of URL for calling weather or forecast
//    object - Contains zipcode and lat/long coordinates
export const weatherApi = (path, { zipcode, coords }) => {
  let suffix = "";

  // If zipcode exists, add to suffix string
  if (zipcode) {
    suffix = `zip=${zipcode}`;
  } else if (coords) {
    // Else, if coordinates exist, add to suffix string
    suffix = `lat=${coords.latitude}&lon=${coords.longitude}`;
  }

  // console.log(suffix);
  // Make API call to weather api, passing the path, apikey and suffix to get desired info;
  // return the response as a JSON object
  return fetch(
    `https://api.openweathermap.org/data/2.5${path}?appid=${apiKey}&units=imperial&${suffix}`
  ).then(response => response.json());
};
