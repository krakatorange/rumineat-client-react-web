import React from "react";
import { Button } from "grommet";
import { Box } from "grommet";
import { withRouter } from "react-router-dom";
import JwtUtil from "./auth/JwtUtil";
import Api from "./Api";
import Card from "./Card";
import { isIOS, isAndroid } from "react-device-detect";
import { data } from "jquery";
import { background } from "ui-box";
import SideAd from "./SideAd";

class Results extends React.Component {
  google_maps_url = "https://www.google.com/maps/place/"; //?q=place_id:ChIJp4JiUCNP0xQR1JaSjpW_Hms

  intervalId = null;
  state = { range: 5, result: null, message: null };

  pollResultData = async () => {
    let headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    JwtUtil.addHeader(headers);

    const api_call = await fetch(
      `${Api.URL()}/sessions/${this.state.sessionID}/result`,
      {
        method: "GET",
        headers: headers,
      }
    );
    const content = await api_call.json();
    if (content) {
      this.setState({
        result: content.result,
        message: content.message,
      });
    }
    return content;
  };

  componentDidMount() {
    if (this.state.sessionID) {
      this.intervalId = setInterval(this.pollResultData, 1500);
    }
  }

  stopPolling() {
    console.log("Cancelling polling interval - result retrieved");
    clearInterval(this.intervalId);
  }

  constructor(props) {
    super(props);
    const data = JwtUtil.getData();
    const sessionID = data.session_id;
    this.state = { sessionID: sessionID, result: null, props ,};
  }

  render() {
    let goButton = null;
    let card = null;
    let statsbutton = null;
    if (this.state.result != null && this.state.result.place != null) {
      this.stopPolling();
      let data = this.state.result;
      card = (
        <div className={"result-card"}>
          <Card place={this.state.result.place} index={0} length={1} />
        </div>
      );
      let url_Android = `https://www.google.com/maps/dir/?api=1&destination=${data.place.latitude},${data.place.longitude}&destination_place_id=${data.place.google_places_id}`;
      let url_IOS = `http://maps.apple.com/?daddr=${data.place.latitude},${data.place.longitude}`;
      statsbutton = (
        <div
          role="button"
          onClick={() => {
            this.state.props.history.push({
              pathname: "/stats",
              state: { result: this.state.result },
            });
          }}
        >
          <a>
            <div
              className="go-button"
              style={{
                backgroundColor: "#826AED",
                color: "white",
                fontSize: "16px/24px",
                borderWidth: "1px",
                borderRadius: "10px",
                borderColor: "#826AED",
                marginBottom: "10px",
              }}
            >
              Statistics?
            </div>
          </a>
        </div>
      );
      if (isAndroid) {
        console.log("Using android");
        goButton = (
          <div>
            <a target="_blank" href={url_Android}>
              <div className="go-button">Go Now!</div>
            </a>
          </div>
        );
      }
      if (isIOS) {
        console.log("Using Apple Maps");
        goButton = (
          <div>
            <a target="_blank" href={url_IOS}>
              <div className="go-button">Go Now!</div>
            </a>
          </div>
        );
      } else {
        console.log("Defaulting to google maps");
        goButton = (
          <div>
            <a target="_blank" href={url_Android}>
              <div className="go-button">Go Now!</div>
            </a>
          </div>
        );
      }
    }
    return (
      <div className="swiper-container">
        <div className="swipe-wrapper">
          <div className="swipe-heading">
            <h2>Your Pick</h2>
          </div>
          <Box style={{ minHeight: 510 }}>
            <div className="stack result">{card}</div>
          </Box>
          {this.state.result && (
            <div
              className={""}
              style={{
                marginRight: "40px",
                marginLeft: "40px",
                marginBottom: "10px",
              }}
            ></div>
          )}
          {statsbutton}
          {goButton}
        </div>
        {!this.state.result &&
          <div className={'google_adds'}>
            <div className="Ads-title">
                    <span>Advertisement</span>
                <SideAd/>
            </div>
           </div>
      }
      </div>
    );
  }
}

export default withRouter(Results);
