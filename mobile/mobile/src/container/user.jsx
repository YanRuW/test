//JavaScript Document
import React, {Component, Fragment} from "react";

import Summary from "../component/summary";

import moment from 'moment';
import 'moment/locale/zh-cn';

import {DatePicker, Picker,List} from "antd-mobile";

import {axios, root} from "../api";

export default class User extends React.Component {
    constructor() {
        super();
        this.state = {
            updateTime: "",
            summary: [
                {
                    name: "用户总数",
                    value: 0
                },
                {
                    name: "绑定用户总数",
                    value: 0
                },
                {
                    name: "活跃用户数",
                    value: 0
                }
            ],
            days: 7,
            startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
            endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
            keyIndex: ["userNumCount"],
            chart: new Array()
        };
    }
    render() {
        return <Fragment>
            <header className="align-center">用户统计</header>
            <section>
                <Summary
                    title="用户概览"
                    updateTime={this.state.updateTime}
                    data={this.state.summary}
                ></Summary>
                <div className="container">
                    <div className="align-center" style={{padding: ".3rem 0"}}>
                        <a href="javascript:void(0);" className={`tab${this.handleActive(7)}`} onClick={this.handleClick.bind(this, 7)}>近7天</a>
                        <a href="javascript:void(0);" className={`tab${this.handleActive(30)}`} onClick={this.handleClick.bind(this, 30)}>近30天</a>
                    </div>
                    <div>
                        <ul className="clearfix">
                            <li className="float-left" style={{width: "45%"}}>
                                <DatePicker
                                    mode="date"
                                    minDate={new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)}
                                    maxDate={this.state.endDate}
                                    value={this.state.startDate}
                                    onChange={startDate => {
                                        this.setState((prevState, props) => ({days: "", startDate}));
                                        this.getUserStatisticsList({startDate});
                                    }}
                                >
                                    <List.Item arrow="down"></List.Item>
                                </DatePicker>
                            </li>
                            <li className="float-left" style={{width: "10%", lineHeight: "44px", fontSize: 16, color: "#bcbcbc"}}>
                                到
                            </li>
                            <li className="float-left" style={{width: "45%"}}>
                                <DatePicker
                                    mode="date"
                                    minDate={this.state.startDate}
                                    maxDate={new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)}
                                    value={this.state.endDate}
                                    onChange={endDate => {
                                        this.setState((prevState, props) => ({days: "", endDate}));
                                        this.getUserStatisticsList({endDate});
                                    }}
                                >
                                    <List.Item arrow="down"></List.Item>
                                </DatePicker>
                            </li>
                        </ul>
                    </div>
                    <div className="cutline"></div>
                    <div>
                        <Picker
                            cols={1}
                            data={[
                                {
                                    label: "用户总数",
                                    value: "userNumCount"
                                },
                                {
                                    label: "绑定用户总数",
                                    value: "bindNumCount"
                                },
                                {
                                    label: "活跃用户数",
                                    value: "last30UserNum"
                                }
                            ]}
                            value={this.state.keyIndex}
                            onChange={value => this.setState((prevState, props) => ({keyIndex: value}), () => this.loadChart())}
                        >
                            <List.Item arrow="down"></List.Item>
                        </Picker>
                    </div>
                    <div id="chart" style={{height: "4.7rem"}}></div>
                </div>
            </section>
        </Fragment>;
    }
    componentDidMount() {
        this.getUserStatistics();
        this.chart = echarts.init(document.getElementById("chart"), "macarons");
        window.addEventListener("resize", this.chart.resize, false);
        this.getUserStatisticsList(new Object());
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.chart.resize, false);
        this.chart.dispose();
    }
    handleActive = days => this.state.days == days ? " active" : "";
    handleClick = days => {
        let startDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * days);
        let endDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 1);
        this.setState((prevState, props) => ({days, startDate, endDate}));
        this.getUserStatisticsList({startDate, endDate});
    };
    getUserStatistics = async () => {//获取用户统计最新信息
        let {dt, userNumCount, bindNumCount, last30UserNum} = await axios({
            method: "POST",
            url: `${root}/deviceUserStatistics/getUserStatistics`
        });
        let summary = [
            {
                name: "用户总数",
                value: userNumCount
            },
            {
                name: "绑定用户总数",
                value: bindNumCount
            },
            {
                name: "活跃用户数",
                value: last30UserNum
            }
        ];
        this.setState((prevState, props) => ({updateTime: dt, summary}));
    };
    getUserStatisticsList = async ({
        startDate = this.state.startDate,
        endDate = this.state.endDate
    }) => {//获取用户统计最新信息列表
        this.chart.showLoading({
            text: "加载中……"
        });
        //moment日期处理插件
        startDate = moment(startDate).format("YYYY-MM-DD");
        endDate = moment(endDate).format("YYYY-MM-DD");
        let data = await axios({
            method: "POST",
            url: `${root}/deviceUserStatistics/getUserStatisticsList`,
            data: {
                startDate,
                endDate
            }
        });
        this.setState((prevState, props) => ({chart: data}));
        this.loadChart(data);
        this.chart.hideLoading();
    };
    loadChart = (data = this.state.chart) => {//加载图表
        let xArray = new Array();
        let yArray = new Array();
        data.forEach((item, index) => {
            xArray.push(item.dt);
            yArray.push(item[this.state.keyIndex[0]]);
        });
        let name = {
            userNumCount: "用户总数",
            bindNumCount: "绑定用户总数",
            last30UserNum: "活跃用户数"
        };
        let option = {
            title : {
                text: '',
                subtext: '',
                x: "center"
            },
            tooltip : {
                trigger: 'axis',
                formatter: "{b}<br />{a}: {c}&nbsp;"
            },
            /* legend: {
                //type: 'scroll',
                y: "bottom",
                data: [""]
            }, */
            grid: {
                left: '3%',
                right: '3%',
                bottom: '8%',
                containLabel: true
            },
            /* toolbox: {
                feature: {
                    saveAsImage: {
    
                    }
                },
                right: 30
            }, */
            calculable: true,
            xAxis : {
                type : 'category',
                boundaryGap: false,
                axisLabel: {
                    color: "#b8b8b8",
                    //interval: 0
                },
                axisLine: {
                    lineStyle: {
                        color: "#b8b8b8"
                    }
                },
                axisTick: {
                    show: false
                },
                /* splitLine: {
                    show: true
                }, */
                data: xArray
            },
            yAxis : {
                type: 'value',
                //name: "单位：",
                axisLabel : {
                    formatter: '{value}',
                    color: "#b8b8b8"
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: "#f9f9f9"
                    }
                },
                min: value => {
                    let min = Math.floor(value.min - (value.max - value.min));
                    return min < 0 ? Math.floor(value.min / 2) : min;
                }
            },
            series : [
                {
                    name: name[this.state.keyIndex[0]],
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: "#6bc255"
                        }
                    },
                    areaStyle: {

                    },
                    data: yArray
                }
            ]
        };
        this.chart.setOption(option);
    };
};