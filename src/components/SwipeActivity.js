import React from "react";
import { Box, Heading } from "grommet";
import { withRouter } from "react-router-dom";
import JwtUtil from "./auth/JwtUtil";
import ReactSwing from "react-swing";
import $ from "jquery";
import { CircularProgressbar } from "react-circular-progressbar";

import Api from "./Api";
import Card from "./Card";
import RightArrow from "../assets/Right arrow white.svg";
import LeftArrow from "../assets/left arrow white.svg";

import "react-circular-progressbar/dist/styles.css";
import "./styles/card.css";

var percentage = 100;
var totalPlaces, length;
class SwipeActivity extends React.Component {
  stackEl = React.createRef();

  async createDecision(placeId, selected, duration_ms) {
    let headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    headers = JwtUtil.addHeader(headers);
    const api_call = await fetch(
      `${Api.URL()}/sessions/${this.state.sessionID}/decisions`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          duration_ms: duration_ms,
          place_id: placeId,
          selected: selected,
        }),
      }
    );
    return api_call;
  }

  componentDidMount() {
    Api.getPlaces()
      .then((res) => res.json())
      .then(
        (data) => {
          totalPlaces = data.places.length;
          length = totalPlaces;
          if (data.places != null) {
            this.places = data.places;
            this.setState({
              placeId: 1,
              endIndex: totalPlaces,
            });
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  componentWillMount() {
    this.setState({ firstTime: performance.now() });
  }

  throwCard(event, placeId) {
    let selected = event.throwDirection.toString().indexOf("RIGHT") !== -1;
    // ReactSwing Component Childrens
    const targetEl = this.stackEl.current.childElements[1];
    if (targetEl && targetEl.current) {
      const card = this.state.stack.getCard(targetEl.current);
      let secondTime = performance.now();
      let duration_ms = secondTime - this.state.firstTime;
      this.vote(placeId, selected, duration_ms);
      this.navigate();
      if (this.stackEl.current) {
        length =
          this.stackEl.current.childElements.length - this.state.decrement;
        this.setState({ decrement: this.state.decrement + 1 }, () => {
          let element = this.stackEl.current.childElements[length].current;
          let id = element.children[0].id;
          $(`#${id}`).addClass("hidden");
          let elementSecond =
            this.stackEl.current.childElements[length - 1].current;
          let idSecond = elementSecond.children[0].id;
          $(`#${idSecond}`).removeClass("second-card");
          $(`#${idSecond}`).addClass("first-card");
          if (length - 2 >= 0) {
            let elementThird =
              this.stackEl.current.childElements[length - 2].current;
            let idThird = elementThird.children[0].id;
            $(`#${idThird}`).removeClass("third-card");
            $(`#${idThird}`).addClass("second-card");
          }
          if (length - 3 >= 0) {
            let elementForth =
              this.stackEl.current.childElements[length - 3].current;
            let idForth = elementForth.children[0].id;
            $(`#${idForth}`).addClass("third-card");
          }
        });
      }
    }
  }

  navigate() {
    if (this.state.placeId > this.state.endIndex) {
      this.props.history.push({
        pathname: "/results",
      });
    }
  }

  constructor(props) {
    super(props);
    let data = JwtUtil.getData();
    let sessionID = data.session_id;
    this.places = [];
    this.state = {
      sessionID: sessionID,
      place: null,
      places: null,
      placeIndex: -1,
      placeId: null,
      endIndex: null,
      stack: null,
      firstTime: null,
      decrement: 1,
      swipeLeft: false,
      swipeRight: true,
    };
  }

  vote(placeId, selected, duration_ms) {
    this.createDecision(placeId, selected, duration_ms);
    let newPlaceId = this.state.placeId + 1;
    this.setState({ placeId: newPlaceId, firstTime: performance.now() });
  }

  buildPlaces() {
    let places = [];
    let i = 0;
    while (i < this.places.length) {
      const data = this.places[i];
      let place = (
        <div
          key={data.id * 2}
          ref={data.id}
          throwout={(e) => this.throwCard(e, data.id)}
        >
          <Card
            key={data.id}
            place={data}
            index={i}
            length={this.places.length}
          />
        </div>
      );
      places.push(place);
      i = i + 1;
    }
    return places;
  }

  render() {
    let places = [
      <div ref={-1} key={-1}>
        Loading
      </div>,
    ];
    if (this.places.length > 0) {
      places = this.buildPlaces();
    }
    const config = {
      throwOutConfidence: (xOffset, yOffset, element) => {
        const xConfidence = Math.min(
          Math.abs(xOffset) / (element.offsetWidth * 0.45),
          1
        );
        const yConfidence = Math.min(
          Math.abs(yOffset) / element.offsetHeight,
          1
        );
        return Math.max(xConfidence, yConfidence);
      },
      maxThrowOutDistance: 500,
      allowedDirections: [
        ReactSwing.DIRECTION.LEFT,
        ReactSwing.DIRECTION.RIGHT,
      ],
    };
    return (
      <div className="swiper-container swipe">
        {this.state.swipeRight && (
          <div className="swipper-overlay">
            <div className="content">
              <div>
                <span className="heading">Right Swipe For Yes</span>
                <br />
                <span className="description">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua. At vero eos et accusam et
                  justo duo dolores et ea rebum. Stet clita kasd gubergren, no
                  sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem
                  ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                  nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua. At vero eos et accusam et
                  justo duo dolores et ea rebum. Stet clita kasd gubergren
                </span>
                <div
                  className="button"
                  role="button"
                  onClick={() => {
                    this.setState({ swipeRight: false, swipeLeft: true });
                  }}
                >
                  Next
                </div>
              </div>
              <div>
                <img
                  src={RightArrow}
                  style={{
                    margin: "10px",
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {this.state.swipeLeft && (
          <div className="swipper-overlay">
            <div className="content left">
              <div>
                <img
                  src={LeftArrow}
                  style={{
                    margin: "10px",
                  }}
                />
              </div>
              <div>
                <span className="heading">Left Swipe For No</span>
                <br />
                <span className="description">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua. At vero eos et accusam et
                  justo duo dolores et ea rebum. Stet clita kasd gubergren, no
                  sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem
                  ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                  nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua. At vero eos et accusam et
                  justo duo dolores et ea rebum. Stet clita kasd gubergren
                </span>
                <div
                  className="button"
                  role="button"
                  onClick={() => {
                    this.setState({ swipeLeft: false });
                  }}
                >
                  Start Swiping
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={"swipe-wrapper"}>
          <div className={"progress-wrapper"}>
          <div style={{ display: "flex", flexDirection: "row",justifyContent:"space-between",width:"100%"}}>
            <div className="swipe-heading">
              <h1>Discover</h1>
              <span>Lorem Ipsum Dolar Sit Genere Lusio</span>
            </div>
            <div className={"swipe-heading"}>
              <div className={"swiper-progress"}>
                {" "}
                <CircularProgressbar
                  styles={{
                    path: {
                      // Path color
                      stroke: `rgba(130, 106, 237, ${percentage / 100})`,
                    },
                  }}
                  value={(length / totalPlaces) * 100}
                  text={`${length}/${totalPlaces}`}
                />
              </div>
            </div>
          </div>
          </div>
          <Box style={{ minHeight: 545 }}>
            {places.length > 1 && (
              <ReactSwing
                config={config}
                className="stack"
                setStack={(stack) => this.setState({ stack })}
                ref={this.stackEl}
              >
                {places}
              </ReactSwing>
            )}
          </Box>
          {/* <div className="swipe-footer">
                        <div className="swipe-actions">
                            <div className="dislike" role="button" style={{cursor: 'pointer'}}>
                                <img
                                    src={CrossIcon}
                                />
                            </div>
                            <div className="like" role="button" style={{cursor: 'pointer'}}>
                                <img
                                    src={HeartIcon}
                                />
                            </div>
                        </div>
                    </div> */}
        </div>
      </div>
    );
  }
}

export default withRouter(SwipeActivity);
