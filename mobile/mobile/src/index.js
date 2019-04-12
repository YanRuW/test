//JavaScript Document
import "@babel/polyfill";
import React, {Component, Fragment} from "react";
import ReactDOM, {render} from "react-dom";
import {HashRouter as Router, Switch, Route, Redirect} from "react-router-dom";

import App from "./container/app";

import Loadable from "react-loadable";
let User = Loadable({
    loader: () => import("./container/user"),
    loading: () => null
});
let Device = Loadable({
    loader: () => import("./container/device"),
    loading: () => null
});
let Login = Loadable({
    loader: () => import("./container/login"),
    loading: () => null
});
ReactDOM.render(<Router>
    <App>
        <Switch>
            <Route exact path="/" component={User} />
            <Route path="/user" component={User} />
            <Route path="/login" component={Login} />
            <Route path="/device" component={Device} />
            <Redirect to="/" />
        </Switch>
    </App>
</Router>, document.getElementById("root"));