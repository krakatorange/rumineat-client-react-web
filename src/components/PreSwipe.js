import React from "react";
import {Button, Heading, Text} from 'grommet';
import {Box} from "grommet";
import {withRouter} from "react-router-dom";
import JwtUtil from "./auth/JwtUtil";

class PreSwipe extends React.Component {

    constructor(props) {
        super(props);
        const data = JwtUtil.getData();
        const sessionID = data.session_id;
        this.state = {sessionID: sessionID};
    }

    start() {
        /*TODO: Create progress*/
        this.props.history.push({
            pathname: '/swipe'
        });
    }

    render() {
        return (
            <Box direction="column"
                 align="center"
                 justify="center"
                 className={"focus-content-box"}>
                <Heading level={1}>Tutorial</Heading>
                <Text margin={"small"}>You'll be presented a series of restaurants</Text>
                <Text margin={"small"}>Swipe right if you like the suggested place</Text>
                <Text margin={"small"}>Swipe left if you don't</Text>

                <Button
                    label="Got it!"
                    primary={true}
                    onClick={() => {
                        this.start();
                    }}
                />
            </Box>
        );
    }
}

export default withRouter(PreSwipe);