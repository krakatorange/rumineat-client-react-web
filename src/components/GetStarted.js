import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import JwtUtil from "./auth/JwtUtil";
import Api from "./Api";
import { toast } from "react-toastify";
import { base } from "grommet-icons";
import dollar from "../assets/$.svg";
import Ellipse198 from "../assets/Ellipse198.svg";
import Iconmetromylocation from "../assets/Iconmetromylocation.svg";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import GoogleMapReact from "google-map-react";
import { Button, RangeInput, Stack } from "grommet";

import { deepMerge } from "grommet-icons/utils";
import styled, { css, ThemeProvider } from "styled-components";


const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const GOOGLE_MAPS_PLACE_URIS = "https://www.googleapis.com/geolocation/v1/geolocate?key=";

function GetStarted(props) {
  const [range, setRange] = useState(2);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [rangeValue, setRangeValue] = useState(3);
  const [rangeValueMap, setRangeValueMap] = useState(3);
  const [radiusChanged, setRadiusChanged] = useState(false);
  const [refreshingMap, setIsRefreshingMap] = useState(false);
  const [priceLevel, setPriceLevel] = useState(["$$"]);
  const [currentLocation, setCurrentLocation] = useState({});
  const [center, setCenter] = useState({});
  const [mapZoom, setMapZoom] = useState(12);
  const [active1, setActive1] = useState(false);
  const [active2, setActive2] = useState(true);
  const [active3, setActive3] = useState(false);
  const [isShown, SetIsShown] = useState(true);
  var pricelevel = ["$$"];
  //let history = useHistory();
  const userstyle = { fontSize: "17px/24px", fontWeight: "bold" };
  const caretTheme = deepMerge(base, {
    icon: {
      extend: css`
        fill: #7d4cdb;
        stroke: #7d4cdb;
        width: 48px;
        height: 48px;
      `,
    },
  });
  const handleShow = () => {
    {
      isShown == true ? SetIsShown(false) : SetIsShown(true);
    }
  };

  /*
  function MapSearch() {
    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      requestOptions: {
        location: { lat: () => 40.756795, lng: () => -73.954298 },
        radius: 100 * 1000,
      },
    });

    const handleInput = (e) => {
      setValue(e.target.value);
    };

    const handleSelect = async (address) => {
      setValue(address, false);
      clearSuggestions();
      try {
        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        // panTo({ lat, lng });
        let data = {
          lat: lat,
          lng: lng,
        };
        setCurrentLocation({ ...currentLocation, ...data });
        setCenter({ ...currentLocation, ...data });
        console.log(lat, lng);
      } catch (error) {
        console.log("😱 Error: ", error);
      }
    };
    return (
      <div className="search">
        <div className="search-icon">
        <div className={"my-loc-icon"}>
          <img
            src={Iconmetromylocation}
            style={{
              marginRight: 2,
            }}
          ></img>
        </div>
          <Combobox onSelect={handleSelect}>
            <ComboboxInput
              
              style={{
                borderRadius: 11,
                borderColor: "white",
                border: "2px solid white",
                boxShadow: "",
              }}
              value={value}
              onChange={handleInput}
              onFocus={() => {
                console.log("clicked");
              }}
              // disabled={!ready}
              placeholder="Map Search"
            />
            <ComboboxPopover>
              <ComboboxList>
                {status === "OK" &&
                  data.map(({ id, description }) => (
                    <ComboboxOption key={id} value={description} />
                  ))}
              </ComboboxList>
            </ComboboxPopover>
          </Combobox>
        </div>
      </div>
    );
  }
  */

  const activebutton = (index) => {
    switch (index) {
      case 1:
        {
          if (active1 == true && (active2 == true || active3 == true)) {
            setActive1(false);
            setPriceLevel(pricelevel => pricelevel.filter((item) => item !== "$"));
          } else {
            setActive1(true);
            if(!pricelevel.includes("$")) {
              setPriceLevel(pricelevel => [...priceLevel, "$"]);
            }
          }
        }
        break;
      case 2:
        {
          if (active2 == true && (active1 == true || active3 == true)) {

            setActive2(false);
            setPriceLevel(pricelevel => pricelevel.filter((item) => item !== "$$"));

          } else {
            setActive2(true);
            if (!pricelevel.includes("$$")) {
              setPriceLevel(pricelevel => [...priceLevel, "$$"]);
            }
          }
        }
        break;
      case 3:
        {
          if (active3 == true && (active1 == true || active2 == true)) {
            setActive3(false);
            setPriceLevel(pricelevel => pricelevel.filter((item) => item !== "$$$"));
          } else {
            setActive3(true);
            if (!pricelevel.includes("$$$")) {
              setPriceLevel(pricelevel => [...priceLevel, "$$$"]);
            }
          }
        }
        break;
    }
  };

  const mapOptions = {
    disableDefaultUI: true,
    fullscreenControl: false,
    zoomControl: false,
  };

  const CaretContainer = styled.div`
    > * {
      margin-top: -21px;
    }
  `;

  useEffect(() => {
    getLocation();
  }, []);
  function success(position) {
    let data = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setCurrentLocation({ ...currentLocation, ...data });
    setCenter({ ...currentLocation, ...data });
  }
  function error() {
    alert("This app requires you to allow access to your location.");
    tryAPIGeolocation();
  }
  function getLocation() {
    if (!navigator.geolocation) {
      //console.log('Geolocation isnt supported on this device'); //#TODO: show some sort of toast
    } else {
      //console.log('Geolocator get coords');
      navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
      });
    }
  }

  function tryAPIGeolocation() {
    fetch(GOOGLE_MAPS_PLACE_URIS + GOOGLE_MAPS_API_KEY, {
      method: "POST",
    }).then = (response) => {
      success({ lat: response.location.lat, lng: response.location.lng });
    };
  }

  const rangeMap = {
    0: 1,
    1: 2,
    2: 3,
    3: 5,
    4: 8,
    5: 13,
    6: 21,
    7: 34,
    8: 55,
  };

  function calcValue(event) {
    let eventValue = event.target.value;
    let new_value = rangeMap[eventValue];
    setRange(eventValue);
    setRangeValue(new_value);
    setRangeValueMap(new_value);
    setRadiusChanged(true);
    let data = {
      lat: center.lat,
      lng: center.lng,
    };
    setCurrentLocation({ ...currentLocation, ...data });
    if (rangeMap[eventValue] === 8) {
      setMapZoom(11);
    } else if (rangeMap[eventValue] === 13) {
      setMapZoom(10);
    } else if (rangeMap[eventValue] === 21) {
      setMapZoom(9);
    } else if (rangeMap[eventValue] === 34) {
      setMapZoom(8);
    } else if (rangeMap[eventValue] === 55) {
      setMapZoom(7);
    }
    refreshMap();
  }

  const InitMap = function (map, maps) {
    var radiusCircle;

    // Add the circle for this city to the map.
    radiusCircle = new maps.Circle({
      strokeColor: " #25275E",
      strokeOpacity: 0.12,
      strokeWeight: 2,
      fillColor: " #25275E",
      fillOpacity: 0.12,
      map,
      center: { lat: map.getCenter().lat(), lng: map.getCenter().lng() },
      //1 mile, 1609.34
      radius: rangeValueMap * 1609.34,
    });

    maps.event.addListener(map, "center_changed", function () {
      setCenter({ lat: map.getCenter().lat(), lng: map.getCenter().lng() });
      // Remove previous radius circle and add new radius cicle
      radiusCircle.setMap(null);
      radiusCircle = new maps.Circle({
        strokeColor: " #25275E",
        strokeOpacity: 0.14,
        strokeWeight: 2,
        fillColor: " #25275E",
        fillOpacity: 0.14,
        map,
        center: { lat: map.getCenter().lat(), lng: map.getCenter().lng() },
        radius: rangeValueMap * 1609.34,
      });
    });
  };

  const createUserAndSession = async function (obj) {
    let result = false;
    let errorMessage = "Unknown error";
    await Api.createUserAndSession(
      obj.data.latitude,
      obj.data.longitude,
      obj.data.range,
      obj.data.price_range
    )
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          return false;
        }
      })
      .then(function (jsonResponse) {
        if (jsonResponse) {
          const token = jsonResponse.token;
          JwtUtil.setToken(token);
          result = true;
        } else {
          result = false;
        }
      })
      .catch(function (error) {
        result = false;
        errorMessage = "Failed to create session";
      });

    if (result) {
      setButtonDisabled(false);
      props.history.push({
        pathname: "/session",
        state: { rangeValue },
      });
    } else {
      setButtonDisabled(false);
      toast.error(errorMessage, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const refreshMap = async () => {
    setIsRefreshingMap(true);
    setTimeout(() => {
      setIsRefreshingMap(false);
    }, 100);
  };
  return (
    <div>
      <div
        className={`top-map-container ${!isShown ? "top-map-full-height" : ""}`}
      >
        {/* <MapSearch /> */}
        <Stack anchor="center">
          <div style={{ height: '100vh', width: '100%' }}>
            {!refreshingMap && (
              <GoogleMapReact
                bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
                defaultCenter={{ lat: 40.756795, lng: -73.954298 }}
                center={{ lat: currentLocation.lat, lng: currentLocation.lng }}
                defaultZoom={mapZoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => InitMap(map, maps)}
                options={mapOptions}
              ></GoogleMapReact>
            )}
          </div>
          <ThemeProvider theme={caretTheme}>
            <CaretContainer>
              <div className={"loction-icon"}></div>
            </CaretContainer>
          </ThemeProvider>
        </Stack>
      </div>
      <div
        className={`bottom-map-container ${
          !isShown ? "bottom-map-hide-content" : ""
        }`}
      >
        <div className="Accordion-button" role="button" onClick={handleShow}>
          {!isShown ? <span>+</span> : <span>-</span>}
        </div>
        {isShown && (
          <div className={"bottom-map-container-content"}>
            <div className={"distance-div"}>
              <div className={"distance-div-discription"}>
                <span
                  style={{
                    color: "black",
                    fontSize: "18px/24px",
                    fontWeight: "bold",
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={Ellipse198}
                    style={{
                      opacity: 1,
                      width: 16,
                      height: 14,
                      marginRight: 4,
                    }}
                  />
                  Distance
                </span>
              </div>
              <div className={"distance-div-value"}>
                <span>{rangeValue} Miles</span>
              </div>
            </div>
            <div className={"range-input-section"}>
              <div className={"range-input-slider"}>
                <RangeInput
                  height="100px"
                  color="#FF1654"
                  value={range}
                  max={8}
                  min={0}
                  onChange={(event) => calcValue(event)}
                />
              </div>
              <div className={"range-input-value-container"}>
                <div className={"minimum-value"}>
                  <span>0</span>
                </div>
                <div>
                  <span>55</span>
                </div>
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "12px 0px 18px",
                }}
              >
                <img src={dollar} />
                <span
                  style={{
                    color: "black",
                    fontSize: "18px/24px",
                    fontWeight: "bold",
                    marginLeft: 1,
                  }}
                >
                  Price Range
                </span>
              </div>
              <div className={"radio-button-container"}>
                <div
                  className={`radio-button ${
                    active1 ? "active-radio-button" : " "
                  } `}
                  role="button"
                  onClick={() => {
                    activebutton(1);
                  }}
                >
                  <div style={{ textAlign: 'center', lineHeight: '40px' }}>
                    <img style={{ width: '40px', height: '40px' }}  src={require('../assets/small.png')} alt="$"></img>
                    <a href="https://www.vecteezy.com/free-vector/money"></a>
                  </div>
                </div>
                <div
                  className={`radio-button ${
                    active2 ? "active-radio-button" : " "
                  } `}
                  style={{
                    marginRight: 10,
                    marginLeft: 10,
                  }}
                  role="button"
                  onClick={() => {
                    activebutton(2);
                  }}
                >
                  <div style={{ textAlign: 'center', lineHeight: '40px' }}>
                    <img style={{ width: '40px', height: '40px' }}  src={require('../assets/medium.png')} alt="$$"></img>
                    <a href="https://www.vecteezy.com/free-vector/money"></a>
                  </div>
                </div>
                <div
                  className={`radio-button ${
                    active3 ? "active-radio-button" : " "
                  } `}
                  role="button"
                  onClick={() => {
                    activebutton(3);
                  }}
                >
                  <div style={{ textAlign: 'center', lineHeight: '40px' }}>
                    <img style={{ width: '40px', height: '40px' }}  src={require('../assets/big.png')} alt="$$$"></img>
                    <a href="https://www.vecteezy.com/free-vector/money"></a>
                  </div>
                </div>
              </div>
            </div>

            <br />
            <div className="center" style={{ marginBottom: "20px" }}>
              <Button
                style={{ width: "100%", height: "78px", color: "white" }}
                label={buttonDisabled ? "Loading..." : "Continue"}
                disabled={buttonDisabled}
                onClick={() => {
                  createUserAndSession({
                    data: {
                      latitude: center.lat,
                      longitude: center.lng,
                      price_range: priceLevel,
                      range: rangeValue,
                    },
                  });
                  setButtonDisabled(true);
                }}
                primary={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withRouter(GetStarted);
