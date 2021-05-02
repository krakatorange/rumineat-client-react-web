import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import { Button, Header, Menu, RadioButtonGroup, RangeInput, Box, Stack } from 'grommet';
import { CaretDown } from 'grommet-icons';

const mapStyles = {
    width: '100%',
    height: '100%',
};

export class SessionCreate extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Box background="brand">
                <Button>Some Button Text</Button>
                <Menu label="account" items={[{label: 'logout'}]}/>
                <Map
                    google={this.props.google}
                    zoom={8}
                    style={mapStyles}
                    initialCenter={{lat: 47.444, lng: -122.176}}
                />
                
                <div className={"inner-focus-padding"}>Max Distance: <span
                        style={{"textAlign": "right"}}>{0} mi</span></div>

                <RangeInput
                    color='dark'
                    value={0}
                    max={8}
                    min={0}
                    //onChange={event => this.calcValue(event)}
                />

                <RadioButtonGroup
                    className={"menu-radio-group"}
                    label={"Price Range: "}
                    name="priceRange"
                    options={['$','$$','$$$']}
                    value={this.state.priceLevel}
                    //onChange={(event) => this.setPriceLevel(event.target.value)}
                />

                <br/>
                <div className="center" style={{"marginBottom": "4px"}}>
                    <Button
                        label={true ? 'Loading...' : "Start a group decision"}
                        disabled={false}
                        onClick={() => {
                            console.log("get location"); //this.getLocation()
                        }}
                        primary={true}
                    />
                </div>

                <br/>
                <br/>
                <div className={"center white-text"}>
                    <span>AI powered sentiment analysis for your group's next meal</span>
                </div>
                
            </Box>
            
            
            
            )}
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAod0cGZKbMQTFQ60ALXcSqp8aIeZofoy4'
})(SessionCreate);
