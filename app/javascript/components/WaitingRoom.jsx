import {Component, useState} from "react";
import * as React from "react";
import {Box, Button, Heading, Table, TableBody, TableCell, TableHeader, TableRow, TextArea} from "grommet";
import {useLocation} from "react-router-dom";
import useAxios from 'axios-hooks'
import {API_PATH} from "./Env";
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export function WaitingRoom(){
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [userCount, setUserCount] = useState(0)
    const [placeCount, setPlaceCount] = useState(0)
    const [users, setUsers] = useState([])
    const [{ data, loading, requestError, response}, sessionData] = useAxios({
            url: `${API_PATH}/session`,
            method: 'GET',
            withCredentials: true
        },
        {
            manual: false
        }
    )

    React.useEffect(() => {
        console.log('have response data', data)
        if (data && data['users']) {
            setUserCount(data['user_count'])
            setPlaceCount(data['place_count'])
            setUsers(data['users'])
        }
    }, [data]);

    function buildUsers() {
        if (users.length > 0) {
            let user_elements = users.map((object, i) => {
                    return (
                        <TableRow key={i}>
                            <TableCell align={"start"} scope="row">
                                <strong>{object}</strong>
                            </TableCell>
                        </TableRow>)
                })
            console.log('here')
            return (
                <Table style={{"width": "100%"}}>
                    <TableHeader>
                        <TableRow>
                            <TableCell size="auto" align={"start"} scope="col" border="bottom">
                                <Heading level={3} margin={"xsmall"}>Nickname</Heading>
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {user_elements}
                    </TableBody>
                </Table>
            )
        }
        return (null)
    }


    return (
        <Box style={{"width": "75%"}}>
            <div className={"focus-content-box"}>
                <Box
                    direction="row">
                    <Box background="light-1" align={"center"} basis={"1/2"} flex="grow" fill={true}>
                        <Heading level={2} margin={"xsmall"}>Users</Heading>
                        <Heading level={2} margin={"xsmall"}>
                            <div>{userCount}</div>
                        </Heading>
                    </Box>
                    <Box background="light-1" align={"center"} basis={"1/2"} flex="grow" fill={true}>
                        <Heading level={2} margin={"xsmall"}>Places</Heading>
                        <Heading level={2} margin={"xsmall"}>
                            <div>{placeCount}</div>
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
                    {buildUsers()}
                    <br/>
                    {
                        users.length === 0 &&
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