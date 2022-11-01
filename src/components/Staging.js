import React from "react";
import {
  Box,
  Button,
  Grid,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "grommet";
import { withRouter } from "react-router-dom";
import JwtUtil from "./auth/JwtUtil";
import Api from "./Api";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { FaUser, FaRegUser, FaMapMarkerAlt } from "react-icons/fa";
import { FiShare } from "react-icons/fi";
import feather_share from "../assets/feather_share.svg";
import feather_user from "../assets/feather_user.svg";
import feather_location from "../assets/feather_location.svg";
import material_place from "../assets/material_place.svg";
import FirstUserImage from "../assets/user_image_1";
import SecondUserImage from "../assets/user_image_2";
import ThirdUserImage from "../assets/user_image_3";
import generateAvatar from "github-like-avatar-generator";

import "./styles/staging.css";
import RandomAvatar from "./RandomAvatar";

const userstyle = { fontSize: "14px", fontWeight: "bold", lineHeight: "20px" };
const fontStyles = { color: "#826AED", fontSize: "18px" };
const Headingfont = { fontSize: "24px", fontWeight: "bold" };
const discriptionfont = {
  fontSize: "13px",
  fontWeight: "normal",
  color: "#25275E",
  opacity: 0.7,
};
let total_user = [];


class Staging extends React.Component {
  intervalId = null;
 
  
  genrater =()=> {
    let avatar = generateAvatar({
      blocks: 6, // must be multiple of two
      width: 100
    });
    return avatar.base64

  }
  shareNavigator = () => {
    if (navigator.share) {
      console.log("Navigator available");
      navigator
        .share({
          title: "Rumineat",
          text: "Join this decision",
          url: `${this.state.host_url}/join?session_id=${this.state.access_code}`,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      console.log("No navigator");
    }
  };

  pollSessionData = async () => {
    const api_call = await fetch(
      `${Api.URL()}/sessions/${this.state.sessionID}`,
      {
        method: "GET",
      }
    );
    const content = await api_call.json();
    if (content) {
      this.setState({
        users: content.users,
        access_code: content.access_code,
        sessionId: content.id,
        places: content.places,
        createdById: content.created_by_id,
        started: content.started,
      });
      // debugger
      if (this.state.currentUser && this.state.currentUser.id === undefined) {
        if (content.users) {
          this.setState({ currentUser: content.users.at(-1) });
        }
      }
    }
    return content;
  };

  componentDidMount() {
    if (this.state.sessionID) {
      this.intervalId = setInterval(this.pollSessionData, 1500);
    }
    window.addEventListener("beforeunload", async (e) => {
      e.preventDefault();
      // e.returnValue = undefined;
      delete e["returnValue"];
      // alert("Session in process");
      let headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      headers = JwtUtil.addHeader(headers);
      const api_call = await fetch(
        `${process.env.REACT_APP_API_URL}/sessions/remove_user`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            session_id: this.state.sessionId,
            removed_user: this.state.currentUser,
          }),
        }
      );
      const content = await api_call.json();
    });
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  constructor(props) {
    super(props);
    const imgsrc=this.genrater();
    const host_url = window.location.origin;
    const data = JwtUtil.getData();
    const sessionID = data.session_id;
    this.state = {
      host_url: host_url,
      source:imgsrc,
      sessionID: sessionID,
      rangeValue: props.history.location.state ? props.history.location.state.rangeValue : '...',
      access_code: null,
      users: null,
      places: null,
      createdById: null,
      started: false,
      disableSessionStart: false,
      removedUser: {},
      currentUser: {},
    };
  }

  buildUsers() {
    if (this.state.users != null) {
      let userId = JwtUtil.getData().id;
      let adminId = this.state.createdById;
      let user_elements = this.state.users.map(function (object, i) {
        let isUser = object.id === userId;
        let isAdmin = object.id === adminId;
        return (
          <TableRow key={object.id}>
            <TableCell align={"start"} scope="row">
              <strong>
                {object.username}
                {isUser && <span> 👋</span>} {isAdmin && <span> 👑</span>}
              </strong>
            </TableCell>
          </TableRow>
        );
      });
      return (
        <Table style={{ width: "100%" }}>
          <TableHeader>
            <TableRow>
              <TableCell
                size="auto"
                align={"start"}
                scope="col"
                border="bottom"
              >
                <Heading level={3} margin={"xsmall"}>
                  Nickname
                </Heading>
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>{user_elements}</TableBody>
        </Table>
      );
    }
    return null;
  }

  buildAccessCode() {
    if (this.state.access_code != null) {
      return this.state.access_code;
    }
  }

  async startSession() {
    let headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    headers = JwtUtil.addHeader(headers);
    const api_call = await fetch(
      `${Api.URL()}/sessions/${this.state.sessionID}`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
          start: true,
        }),
      }
    );
    const content = await api_call.json();
    /*TODO: ERROR HANDLING! - add some sort of indicator that session is starting*/
    return content;
  }

  render() {
    //const { access_code } = this.state;

    let users = null;
    let user_count = 0;

    if (this.state.users != null) {
      users = this.buildUsers();
      total_user = this.state.users;
      user_count = this.state.users.length;
    }
    let place_count = "...";
    if (this.state.places != null) {
      place_count = this.state.places.length;
    }
    if (this.state.started) {
      this.props.history.push({
        pathname: "/swipe",
      });
    }
    let startSessionButton = null;
    if (this.state.createdById != null) {
      if (this.state.createdById === JwtUtil.getData().id) {
        startSessionButton = (
          
          <div className={"user-footer-button-container"}>
            <Button
              className="user-footer-button-title"
              label={this.state.disableSessionStart ? "Loading..." : "Start Session"}
              style={{
                width: "100%",
                height: "100%",
                textAlign: "center",
                color: "white"
              }}
              disabled={this.state.disableSessionStart || this.state.places.length <= 0 || this.state.users.length <=0}
              onClick={() => {
                this.startSession();
                this.setState({disableSessionStart: true})
              }}
            >
            </Button>
          </div>
        );
      } else {
        startSessionButton = (
          <div className={"user-footer-button-container"}>
            <h3>Waiting on leader to start the session!</h3>
          </div>
        );
      }
    }

    let shareComponent = null;
    if (this.state.access_code != null) {
      if (navigator.share) {
        shareComponent = (
          <div className={"Top-Icon"}>
            <div
              className={"share-icon"}
              role="button"
              onClick={() => {
                this.shareNavigator();
              }}
            >
              <img
                src={feather_share}
                style={{
                  opacity: 1,
                  height: "50%",
                  alignSelf: "center",
                }}
              ></img>
            </div>
          </div>
        );
      } else {
        shareComponent = (
          
          <CopyToClipboard
            text={`${this.state.host_url}/join?session_id=${this.state.access_code}`}
            onCopy={() => {
              toast.success("Copied to clipboard!", {
                position: toast.POSITION.TOP_CENTER,
              });
            }}
          >
            <div className={"Top-Icon"}>
              <div
                className={"share-icon"}
                role="button"
                onClick={() => {
                  this.shareNavigator();
                }}
              >
                <img
                  src={feather_share}
                  style={{
                    opacity: 1,
                    height: "50%",
                    alignSelf: "center",
                  }}
                ></img>
              </div>
            </div>
          </CopyToClipboard>
        );
      }
    }

    return (
      <div>
        <div className={"main-user-container"}>
          <div className={"Top-header"}>
            <div className={"Top-Text"}>
              <span style={Headingfont}>Join The Journey</span>
            </div>
            {shareComponent}
          </div>
          {/* User Details */}
          <div className={"user-details-box"}>
            <div className={"user-details-complete"}>
              <div className={"singlebox"}>
              <span
                  style={{
                    color: "black",
                    fontSize: "18px/24px",
                    fontWeight: "bold",
                  }}
                >
                  <img
                  src={feather_user}
                  style={{
                    marginRight: 2,
                  }}
                ></img>
                  {user_count.toLocaleString('en-US', {
                      minimumIntegerDigits: 2,
                      useGrouping: false
                    })
                  }
                </span>

                <span style={discriptionfont}>Users</span>
              </div>
              <div className={"singlebox"}>
              <span
                  style={{
                    color: "black",
                    fontSize: "18px/24px",
                    fontWeight: "bold",
                  }}
                >
                  <img
                  src={material_place}
                  style={{
                    height: 14,
                    marginRight: 2,
                  }}
                ></img>
                  
                  {place_count.toLocaleString('en-US', {
                      minimumIntegerDigits: 2,
                      useGrouping: false
                    })
                  }
                </span>
                <span style={discriptionfont}>Places</span>
              </div>
              <div className={"singlebox"}>
                <span
                  style={{
                    color: "black",
                    fontSize: "18px/24px",
                    fontWeight: "bold",
                  }}
                >
                  <img
                  src={feather_location}
                  style={{
                    marginRight: 2,
                  }}
                ></img>
                  {this.state.rangeValue} mil
                </span>
                <span style={discriptionfont}>Max Distance</span>
              </div>
            </div>
          </div>
          <div>
            <span style={Headingfont}> Users({user_count})</span>
          </div>
          <div className={"user-list-contianer"}>
            {user_count > 0 ? (
              total_user.map((i, index) => (
                <div key={index} className={"inner-userlist"}>
                   <div className={`user-list ${index%2!=0 ? "user-circule" : ""}`}>
                   <div style={{width:"81px",height:"82px",borderRadius:"50px", overflow: "hidden"}} 
                   dangerouslySetInnerHTML={{__html: i.avator_svg}} />
                 </div>
                  <div className={"list-username"}>
                    <span style={userstyle}>{i.username}</span>
                  </div>
                </div>
              ))
            ) : (
              <div></div>
            )}
          </div>
        </div>
        {startSessionButton}
      </div>
    );
  }
}

export default withRouter(Staging);
