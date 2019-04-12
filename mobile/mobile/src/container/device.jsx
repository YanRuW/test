//JavaScript Document
import React, {Component, Fragment} from "react";

import Summary from "../component/summary";

import moment from 'moment';
import 'moment/locale/zh-cn';

import {DatePicker, Picker,List} from "antd-mobile";

import {axios, root} from "../api";

export default class Device extends React.Component {
    constructor() {
        super();
        this.state = {
            updateTime: "",
            summary: [
                {
                    name: "网器绑定量",
                    value: 0
                },
                {
                    name: "30日网器在线量",
                    value: 0
                },
                {
                    name: "月新增绑定网器量",
                    value: 0
                }
            ],
            days: 7,
            startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
            endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
            keyIndex: ["devBindAllNum"],
            chart: new Array()
        };
    }
    render() {
        return <Fragment>
            <header className="align-center">网器统计</header>
            <section>
                <Summary
                    title="网器概览"
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
                                    disabled={this.state.keyIndex[0] == "devBindMonthNum"}
                                    minDate={new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)}
                                    maxDate={this.state.endDate}
                                    value={this.state.startDate}
                                    onChange={startDate => {
                                        this.setState((prevState, props) => ({days: "", startDate}));
                                        this.getDeviceStatisticsList({startDate});
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
                                    disabled={this.state.keyIndex[0] == "devBindMonthNum"}
                                    minDate={this.state.startDate}
                                    maxDate={new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)}
                                    value={this.state.endDate}
                                    onChange={endDate => {
                                        this.setState((prevState, props) => ({days: "", endDate}));
                                        this.getDeviceStatisticsList({endDate});
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
                                    label: "网器绑定量",
                                    value: "devBindAllNum"
                                },
                                {
                                    label: "30日网器在线量",
                                    value: "devBind30Num"
                                },
                                {
                                    label: "月新增绑定网器量",
                                    value: "devBindMonthNum"
                                }
                            ]}
                            value={this.state.keyIndex}
                            onChange={value => this.setState((prevState, props) => ({keyIndex: value}), () => {
                                if(value == "devBindMonthNum") {
                                    this.setState((prevState, props) => ({days: ""}));
                                    this.getDeviceStatisticsList({
                                        keyIndex: value
                                    });
                                } else {
                                    this.loadChart();
                                }
                            })}
                        >
                            <List.Item arrow="down"></List.Item>
                        </Picker>
                    </div>
                    <div id="chart-device" style={{height: "4.7rem"}}></div>
                </div>
            </section>
        </Fragment>;
    }
    componentDidMount() {
        this.getDeviceStatistics();
        this.chart = echarts.init(document.getElementById("chart-device"), "macarons");
        window.addEventListener("resize", this.chart.resize, false);
        this.getDeviceStatisticsList(new Object());
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.chart.resize, false);
        this.chart.dispose();
    }
    handleActive = days => this.state.days == days ? " active" : "";
    handleClick = days => {
        if(this.state.keyIndex[0] != "devBindMonthNum") {
            let startDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * days);
            let endDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 1);
            this.setState((prevState, props) => ({days, startDate, endDate}));
            this.getDeviceStatisticsList({startDate, endDate});
        }
    };
    getDeviceStatistics = async () => {//获取设备统计最新信息
        let {dt, devBindAllNum, devBind30Num, devBindMonthNum} = await axios({
            method: "POST",
            url: `${root}/deviceUserStatistics/getDeviceStatistics`
        });
        let summary = [
            {
                name: "网器绑定量",
                value: devBindAllNum
            },
            {
                name: "30日网器在线量",
                value: devBind30Num
            },
            {
                name: "月新增绑定网器量",
                value: devBindMonthNum
            }
        ];
        this.setState((prevState, props) => ({updateTime: dt, summary}));
    };
    getDeviceStatisticsList = async ({
        startDate = this.state.startDate,
        endDate = this.state.endDate,
        keyIndex = this.state.keyIndex
    }) => {//获取设备统计信息列表
        this.chart.showLoading({
            text: "加载中……"
        });
        startDate = moment(startDate).format("YYYY-MM-DD");
        endDate = moment(endDate).format("YYYY-MM-DD");
        let data = await axios({
            method: "POST",
            url: `${root}/deviceUserStatistics/getDeviceStatisticsList${keyIndex[0] == "devBindMonthNum" ? "Year" : ""}`,
            data: {
                startDate,
                endDate
            }
        });
        if(keyIndex[0] != "devBindMonthNum") {
            this.setState((prevState, props) => ({chart: data}));
        }
        this.loadChart(data);
        this.chart.hideLoading();
    };
    loadChart = (data = this.state.chart) => {//加载图表
        let xArray = new Array();
        let yArray = new Array();
        let keyIndex = this.state.keyIndex;
        data.forEach((item, index) => {
            xArray.push(keyIndex[0] == "devBindMonthNum" ? item.dt.substring(0, 7) : item.dt);
            yArray.push(item[keyIndex[0]]);
        });
        let name = {
            devBindAllNum: "网器绑定量",
            devBind30Num: "30日网器在线量",
            devBindMonthNum: "月新增绑定网器量"
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
                boundaryGap: keyIndex[0] == "devBindMonthNum",
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
                    type: keyIndex[0] == "devBindMonthNum" ? "bar" : 'line',
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