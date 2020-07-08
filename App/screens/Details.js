import React from "react";

const apikey = "b1e34ab4f469ae8afd7b4e653c1e16da";
class Details extends React.Component {
  componentDidMount() {
    // api.openweathermap.org/data/2.5/weather?zip=94040,us
    const zipCode = 94040;
    fetch(
      `api.openweathermap.org/data/2.5/weather?appid=${apikey}&zip=${zipCode}`
    )
      .then((res) => res.json())
      .then((res) => console.log("res", res))
      .catch((err) => console.log("err", err));
  }

  render() {
    return null;
  }
}

export default Details;
