//JavaScript Document
import React, {Component, Fragment} from "react";
import {NavLink, withRouter} from "react-router-dom";

import "../assets/css/ant-design-mobile.css";
import "../assets/css/common.css";
import "../assets/css/index.css";

import {LocaleProvider} from "antd-mobile"

import {root} from "../api";

class App extends React.Component {
    render() {
        return <LocaleProvider>
            <div className= "wrapper">
                {
                    this.props.children
                }
                <footer>
                    <NavLink to={{pathname: "/user"}} isActive={this.handleActive}>
                        <img src={`${root}/assets/images/user_${(this.props.location.pathname == "/" || this.props.location.pathname == "/user") ? "active": "origin"}.png`} alt="" width="24" />
                        用户
                    </NavLink>
                    <NavLink to={{pathname: "/device"}}>
                    <img src={`${root}/assets/images/net_${this.props.location.pathname == "/device" ? "active": "origin"}.png`} alt="" width="24" />
                        网器
                    </NavLink>
                </footer>
            </div>
        </LocaleProvider>;
    }
    handleActive = (match, {pathname}) =>  /user/i.test(pathname) || pathname == "/";
}
export default withRouter(App);