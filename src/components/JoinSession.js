import React from "react";
import {Box} from "grommet";
import {withRouter} from "react-router-dom";
import JwtUtil from "./auth/JwtUtil";
import Api from './Api';
import {toast} from "react-toastify";

class JoinSession extends React.Component {
    state = {access_code: ''};

    constructor(props) {
        super(props);
        let location = null;
        if (this.props.location && this.props.location.search) {
            let search = this.props.location.search;
            const session_data = JSON.parse('{"' + decodeURI(search).replace("?", "").replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') 
            if (session_data) {
                this.state.access_code = session_data;
            } else {
                //ERROR CASE - NO UUID FOR SESSION
            }
        }
    }

    createUserJoinSession = async () => {
        let result = null;
        let errorMessage = null;
        await Api.createUserJoinSession(this.state.access_code)
            .then(function (response) {
                if(!response.ok){
                    result = false;
                    return response.json();
                } else {
                    console.log(response);
                    return response.json();
                }
            })
            .then(function (jsonResponse) {
                if(jsonResponse && jsonResponse.token){
                    JwtUtil.setToken(jsonResponse.token);
                    result = true;
                } else {
                    errorMessage = jsonResponse.message;
                }
            })
            .catch(function (error) {
                result = false;
                errorMessage = error;
                console.log('Error: ' + error);
            });
        if (result) {
            toast.success("Joined session", {
                position: toast.POSITION.TOP_CENTER
            });
            this.props.history.push({
                pathname: "/session"
            })
        } else {
            toast.error(errorMessage, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    };

    componentDidMount() {
        if(this.state.access_code != null) {
            this.createUserJoinSession();
        } else {
            toast.error("Hmm, we couldn't find that session");
        }
    }

    render() {
        return (
            <div>
                <Box gridArea="main" background="neutral-2">
                </Box>
            </div>
        );
    }
}

export default withRouter(JoinSession);