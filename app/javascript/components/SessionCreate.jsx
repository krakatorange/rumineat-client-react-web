import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { Button, RadioButtonGroup, RangeInput, Box, Stack } from 'grommet';
import { base, CaretDown } from 'grommet-icons';
import { deepMerge } from "grommet-icons/utils";
import styled, { css, ThemeProvider } from "styled-components";
import useAxios from "axios-hooks";
import {API_PATH} from "./Env";
import {useHistory} from "react-router";

const GOOGLE_MAPS_API_KEY = 'AIzaSyAod0cGZKbMQTFQ60ALXcSqp8aIeZofoy4';
const GOOGLE_MAPS_BASE_URI = 'https://www.googleapis.com/geolocation/v1/geolocate?key=';

function SessionCreate() {
    const [range, setRange] = useState(3);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [rangeValue, setRangeValue] = useState(3);
    const [priceLevel, setPriceLevel] = useState('$$');
    const [currentLocation, setCurrentLocation] = useState({});
    const [center, setCenter] = useState({});
    let history = useHistory();

    const caretTheme = deepMerge(base, {
        icon: {
            extend: css`
                fill: #7D4CDB;
                stroke: #7D4CDB;
                width: 48px;
                height: 48px
            `
        }
    });

    const CaretContainer = styled.div`
        > * { margin-top: -21px; }
    `;

    useEffect(() => {
        console.log("useEffect items loaded");
        getLocation();
    }, [currentLocation, center]);

    useEffect(() => {
        if (data && data['success'] === true) {
            history.push('/room')
        }
    }, [data]);

    const [{ data, loading, requestError, response}, createSessionRequest] = useAxios({
            url: `${API_PATH}/create`,
            method: 'POST'
        },
        {
            manual: true
        }
    )

    function success(position) {
        console.log('Geolocation received!');

        let data = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }

        setCurrentLocation({...currentLocation, ...data});
        setCenter({...currentLocation, ...data});
    };

    function error() {
        console.log('an error occurred - trying JS fallback tryAPIGeoLocation');
        tryAPIGeolocation();
    };

    function getLocation() {
        if (!navigator.geolocation) {
            console.log('Geolocation isnt supported on this device'); //#TODO: show some sort of toast
        } else {
            console.log('Geolocator get coords');
            navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true });
        }
    };

    function tryAPIGeolocation() {
        console.log("Starting API GEO");
        fetch(GOOGLE_MAPS_BASE_URI + GOOGLE_MAPS_API_KEY, {
            method: "POST",
        }).then = (response) => {
            console.log("hello");
            success({ lat: response.location.lat, lng: response.location.lng });
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

    function InitMap(map, maps) {
        var radiusCircle;

        // Add the circle for this city to the map.
        radiusCircle = new maps.Circle({
            strokeColor: "#7D4CDB",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#7D4CDB",
            fillOpacity: 0.35,
            map,
            center: { lat: map.getCenter().lat(), lng: map.getCenter().lng() },
            radius: rangeValue * 1609.34,
        });

        maps.event.addListener(map,'center_changed', function() {
            setCenter({ lat: map.getCenter().lat(), lng: map.getCenter().lng() });
            //console.log(center);
            
            // Remove previous radius circle and add new radius cicle
            radiusCircle.setMap(null);
            radiusCircle = new maps.Circle({
                strokeColor: "#7D4CDB",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#7D4CDB",
                fillOpacity: 0.35,
                map,
                center: { lat: map.getCenter().lat(), lng: map.getCenter().lng() },
                radius: rangeValue * 1609.34,
            });
        });
    };

    return (
        <Box>
            <span style={{"marginTop": "2%"}}/>
            <div className={"focus-content-box"}>

            <Stack anchor="center">         
                <div style={{ height: "400px", width: "100%" }}>    
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
                        defaultCenter={{ lat: 40.756795, lng: -73.954298 }}
                        center={{lat: currentLocation.lat, lng: currentLocation.lng}}
                        defaultZoom={13}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map, maps }) => InitMap(map, maps)}
                    >
                    </GoogleMapReact>    
                </div>
                <ThemeProvider theme={caretTheme}>
                    <CaretContainer>
                        <CaretDown />
                    </CaretContainer>
                </ThemeProvider>
            </Stack>


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
                        createSessionRequest({
                            data: {
                                latitude: center.lat,
                                longitude: center.lng,
                                price_range: priceLevel,
                                range: rangeValue
                            }
                        });
                        setButtonDisabled(true);
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
