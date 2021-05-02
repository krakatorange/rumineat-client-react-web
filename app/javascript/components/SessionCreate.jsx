import React from 'react';
import {Button, Header, Menu} from "grommet";
import { Map, GoogleApiWrapper } from 'google-maps-react';
import {Component} from "react/cjs/react.production.min";

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
            <Header background="brand">
                <Button>Some Button Text</Button>
                <Menu label="account" items={[{label: 'logout'}]}/>
                <Map
                    google={this.props.google}
                    zoom={8}
                    style={mapStyles}
                    initialCenter={{lat: 47.444, lng: -122.176}}
                />
                );
            </Header>)
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAod0cGZKbMQTFQ60ALXcSqp8aIeZofoy4'
})(SessionCreate);
