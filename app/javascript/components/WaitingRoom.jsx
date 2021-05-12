import {Component, useState} from "react";
import * as React from "react";
import {Box, Button, Heading, TextArea} from "grommet";
import {useLocation} from "react-router-dom";
import useAxios from 'axios-hooks'
import {API_PATH} from "./Env";
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export function WaitingRoom(){
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [{ data, loading, requestError, response}, sessionData] = useAxios({
            url: `${API_PATH}/session`,
            method: 'GET',
            withCredentials: true
        },
        {
            manual: false
        }
    )

    return (
        <Box style={{"width": "75%"}}>
            <div className={"focus-content-box"}>
                <Box
                    direction="row">
                    <Box background="light-1" align={"center"} basis={"1/2"} flex="grow" fill={true}>
                        <Heading level={2} margin={"xsmall"}>Users</Heading>
                        <Heading level={2} margin={"xsmall"}>
                            <div>{"# pull from API"}</div>
                        </Heading>
                    </Box>
                    <Box background="light-1" align={"center"} basis={"1/2"} flex="grow" fill={true}>
                        <Heading level={2} margin={"xsmall"}>Places</Heading>
                        <Heading level={2} margin={"xsmall"}>
                            <div>{"# pull from API"}</div>
                        </Heading>
                    </Box>
                </Box>
            </div>
            <div className={"focus-content-box"}>
                <Box
                    background="light-3"
                    direction="column"
                    align={"center"}
                    justify={"stretch"}>
                    {"user count"}
                    <br/>
                    {
                        // this.state.places == null &&
                        ("Loading...")
                    }
                </Box>
            </div>
            <Box
                direction="row"
                style={{"position": "fixed", "bottom": "0", "marginTop": "auto", "width": "100%", "left": "0"}}>
                <Box background="light-1" pad={"xsmall"} align={"center"} basis={"1/2"} flex="grow" fill={true}>
                    {"start session button"}
                </Box>
                <Box background="light-1" pad={"xsmall"} align={"center"} basis={"1/2"} flex="grow" fill={true}>
                    {"share component"}
                </Box>
            </Box>
        </Box>
    )
}