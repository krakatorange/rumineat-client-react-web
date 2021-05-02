import React from 'react';
import {Button, Header, Menu} from "grommet";

export default function SessionCreate(){
    return (
        <Header background="brand">
            <Button>Some Button Text</Button>
            <Menu label="account" items={[{ label: 'logout' }]} />
        </Header>)
}
