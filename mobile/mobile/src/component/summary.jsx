//JavaScript Document
import React, {Component, Fragment} from "react";

export default class Summary extends React.Component {
    render() {
        return <div className="container item">
            <div className="clearfix">
                <h5 className="float-left">{this.props.title}</h5>
                <p className="float-right">更新时间：{this.props.updateTime}</p>
            </div>
            <div>
                <ul className="panel align-center">
                    {
                        this.props.data.map((item, index) => <li key={index}>
                            <div>{this.toThousand(item.value)}</div>
                            <p>{item.name}</p>
                        </li>)
                    }
                </ul>
            </div>
        </div>
    }
    toThousand = value => (value || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
};