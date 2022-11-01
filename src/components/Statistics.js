import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import JwtUtil from "./auth/JwtUtil";
import { isIOS, isAndroid, isDesktop } from "react-device-detect";
import { Button } from "grommet";

import "./styles/stats.css";
function Statistics(props) {
  const data = props.location.state.result.place;
  const handleClick = (e) => {
    e.preventDefault();
    let url_Android = `https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}&destination_place_id=${data.google_places_id}`;
    let url_IOS = `http://maps.apple.com/?daddr=${data.latitude},${data.longitude}`;
    {
      isIOS
        ? (window.location.href = `${url_IOS}`)
        : (window.location.href = `${url_Android}`);
    }
  };

  const totalPlaces = [
    {
      name: "QToba",
      count: "5",
    },
    {
      name: "TOSObell",
      count: "4",
    },
    {
      name: "Firehouse",
      count: "3",
    },
    {
      name: "Subway",
      count: "2",
    },
  ];

  return (
    <div>
      <div className={"stats-heading"} style={{ margin: "20px" }}>
        Statistics
      </div>
      <div className="stats-table">
        <div className="table-row">
          <div className="table-heading">Places</div>
          <div className="table-heading">Frequancy</div>
        </div>
        {totalPlaces.length > 0 ? (
          totalPlaces.map((i, index) => (
            <div
              className={`table-row ${
                index % 2 == 0 ? "table-row-background" : ""
              }`}
              key={index}
            >
              <div className={"table-heading name"}>{i.name}</div>
              <div className={"table-heading frequancy"}>{i.count}</div>
            </div>
          ))
        ) : (
          <div>No places </div>
        )}
      </div>
      <div className={""} style={{ margin: "20px" }}>
        <div className={"back-to-home-button"}>
          <Button
            onClick={() => {
              props.history.push({
                pathname: "/results",
              });
            }}
            label={"Back to Results"}
            style={{
              width: "100%",
              height: "73px",
              textAlign: "center",
              color: "white",
              backgroundColor: "#826AED",
              fontSize: "16px/24px",
              borderWidth: "1px",
              borderRadius: "12px",
            }}
          ></Button>
        </div>
        <div className={"back-to-home-button"} style={{ marginTop: "8px" }}>
          <Button
            onClick={handleClick}
            label={"Go Now!"}
            style={{
              width: "100%",
              height: "73px",
              textAlign: "center",
              color: "#25275E",
              backgroundColor: "white",
              borderColor: "#25275E",
              fontWeight: "bold",
              fontSize: "16px/24px",
              borderWidth: "1px",
              borderRadius: "12px",
            }}
          ></Button>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Statistics);
