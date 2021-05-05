import React, { Component, useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { Button, Header, Menu, RadioButtonGroup, RangeInput, Box, Stack } from 'grommet';
import { CaretDown } from 'grommet-icons';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAod0cGZKbMQTFQ60ALXcSqp8aIeZofoy4';
const GOOGLE_MAPS_BASE_URI = 'https://www.googleapis.com/geolocation/v1/geolocate?key=';

function SessionCreate() {
    const [range, setRange] = useState(3);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [rangeValue, setRangeValue] = useState(5);
    const [priceLevel, setPriceLevel] = useState('$$');

    useEffect(() => {
        console.log("useEffect items loaded");
    }, []);

    function success(position) {
        console.log('Geolocation received!');
        console.log(position);
        createUserAndSession(position.coords.latitude, position.coords.longitude);
    };
    function tryAPIGeolocation() {
        console.log("also here");
        fetch(GOOGLE_MAPS_BASE_URI + GOOGLE_MAPS_API_KEY, {
            method: "POST",
        }).then = (response) => {
            success({coords: {latitude: response.location.lat, longitude: response.location.lng}})
            console.log({coords: {latitude: response.location.lat, longitude: response.location.lng}});
        }
    };

    function error() {
        console.log('an error occurred - trying JS fallback tryAPIGeoLocation');
        tryAPIGeolocation();
    };

    async function getLocation() {
        setButtonDisabled(true);
        console.log('here!!');
        if (!navigator.geolocation) {
            console.log('Geolocation isnt supported on this device'); //#TODO: show some sort of toast
        } else {
            console.log('Geolocator get coords');
            navigator.geolocation.getCurrentPosition(success, error);
            console.log('After geolocator should have received coords');
        }
    };

    async function createUserAndSession(latitude, longitude) {
        console.log(latitude, longitude);
        let result = false;
        let errorMessage = 'Unknown error';
        await Api.createUserAndSession(latitude, longitude, rangeValue, priceLevel)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    return false
                }
            })
            .then(function (jsonResponse) {
                if (jsonResponse) {
                    console.log(JSON.stringify(jsonResponse));
                    const token = jsonResponse.token;
                    JwtUtil.setToken(token);
                    result = true;
                } else {
                    result = false;
                }
            })
            .catch(function (error) {
                result = false;
                errorMessage = 'Failed to create session';
            });

        if (result) {
            setButtonDisabled(false);
            this.props.history.push({
                pathname: "/sessionjoin"
            })
        } else {
            setButtonDisabled(false);
            toast.error(errorMessage, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    };

    const rangeMap = {
        0: 1,
        1: 2,
        2: 3,
        3: 5,
        4: 8,
        5: 13,
        6: 21,
        7: 34,
        8: 55
    };

    function calcValue(event) {
        let eventValue = event.target.value;
        let new_value = rangeMap[eventValue];
        console.log('target value: ' + event.target.value);
        console.log('displayed value: ' + new_value);
        setRange(eventValue);
        setRangeValue(new_value);
    };

    function ModelsMap(map, maps) {
        //instantiate array that will hold your Json Data
        let dataArray = [];

        let data = [];

        //push your Json Data in the array
        data.map((markerJson) => dataArray.push(markerJson));
    
        //Loop through the dataArray to create a marker per data using the coordinates in the json
        for (let i = 0; i < dataArray.length; i++) {
          let marker = new maps.Marker({
            position: { lat: dataArray[i].lat, lng: dataArray[i].lng },
            map,
            label: dataArray[i].id,
          });
        }
      };

    return (
        <Box>
            <span style={{"marginTop": "2%"}}/>
            <div className={"focus-content-box"}>
            <div style={{ height: "400px", width: "100%" }}>
            
            <GoogleMapReact
                bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
                defaultCenter={{ lat: 40.756795, lng: -73.954298 }}
                defaultZoom={10}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => ModelsMap(map, maps)}
            ></GoogleMapReact>
            </div>    

                <div className={"inner-focus-padding"}>Max Distance: <span
                    style={{"textAlign": "right"}}>{rangeValue} mi</span></div>

                <RangeInput
                    color='dark'
                    value={range}
                    max={8}
                    min={0}
                    onChange={event => calcValue(event)}
                />

                <RadioButtonGroup
                    className={"menu-radio-group"}
                    label={"Price Range: "}
                    name="priceRange"
                    options={['$','$$','$$$']}
                    value={priceLevel}
                    onChange={(event) => setPriceLevel(event.target.value)}
                />

                <br/>
                <div className="center" style={{"marginBottom": "4px"}}>
                    <Button
                        label={buttonDisabled ? 'Loading...' : "Start a group decision"}
                        disabled={buttonDisabled}
                        onClick={() => {
                            getLocation()
                        }}
                        primary={true}
                    />
                </div>
            </div>
            <br/>
            <br/>
            <div className={"center white-text"}>
                <span>AI powered sentiment analysis for your group's next meal</span>
            </div>
        </Box>
    );
};

export default SessionCreate;