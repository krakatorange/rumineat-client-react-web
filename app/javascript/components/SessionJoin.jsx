import {Component} from "react";
import * as React from "react";
import {Button, TextArea} from "grommet";
import {useLocation} from "react-router-dom";
import useAxios from 'axios-hooks'
import {API_PATH} from "./Env";
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export function SessionJoin(){
    const [value, setValue] = React.useState('');
    console.log(API_PATH)
    const [{ data, loading, error }, refetch] = useAxios({
            url: `${API_PATH}/join`,
            method: 'POST'
        },
        {
            manual: true
        }
    )

    let query = useQuery();
    const sessionUuid = query.get('uuid')

    return (
        <div>
            <TextArea
                fill={false}
                name="session_uuid"
                value={sessionUuid}
                disabled={true}
            />
            <Button onClick={() => {refetch({data: {access_code: sessionUuid}})}}>
                Join Session!
            </Button>
        </div>

    )
}