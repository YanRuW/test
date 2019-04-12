//JavaScript Document
let express = require("express");
let router = express.Router();

// 获取用户统计最新信息
router.post("/deviceUserStatistics/getUserStatistics", (request, response) => {
    response.send({
        "last30UserNum": Math.floor(Math.random() * (1000000 + 1)),
        "dt": "2018-11-21",
        "retInfo": "success",
        "retCode": "00000",
        "bindNumCount": Math.floor(Math.random() * (1000000 + 1)),
        "userNumCount": Math.floor(Math.random() * (100000000 - 99990000  + 1) + 99990000)
    });
});
// 获取用户统计最新信息列表
router.post("/deviceUserStatistics/getUserStatisticsList", (request, response) => {
    let array = new Array();
    let {startDate, endDate} = request.body;
    let length = (Date.parse(endDate) - Date.parse(startDate)) / (1000 * 60 * 60 * 24) + 1;
    for(let i = 0; i < length; i++) {
        let date = new Date(Date.parse(startDate) + 1000 * 60 * 60 * 24 * i),
        year = date.getFullYear(),
        month = (date.getMonth() + 1).toString().padStart(2, "0"),
        day = (date.getDate()).toString().padStart(2, "0");
        date =`${year}-${month}-${day}`
        array.push({
            "dt": date,
            "userNumCount": Math.floor(Math.random() * (100000000 - 99990000  + 1) + 99990000),
            "bindNumCount": Math.floor(Math.random() * (10000000 - 9000000 + 1) + 9000000),
            "last30UserNum": Math.floor(Math.random() * (1000000 - 900000 + 1) + 900000)
        });
    }
    response.send(array);
});

// 获取设备统计最新信息
router.post("/deviceUserStatistics/getDeviceStatistics", (request, response) => {
    response.send({
        "dt": "2018-11-21",
        "retCode": "00000",
        "devBind30Num": Math.floor(Math.random() * (1000000 + 1)),
        "devBindMonthNum": Math.floor(Math.random() * (1000000 + 1)),
        "retMsg": "success",
        "devBindAllNum": Math.floor(Math.random() * (1000000 + 1))
    });
});

// 获取设备统计信息列表
router.post("/deviceUserStatistics/getDeviceStatisticsList", (request, response) => {
    let array = new Array();
    let {startDate, endDate} = request.body;
    let length = (Date.parse(endDate) - Date.parse(startDate)) / (1000 * 60 * 60 * 24) + 1;
    for(let i = 0; i < length; i++) {
        let date = new Date(Date.parse(startDate) + 1000 * 60 * 60 * 24 * i),
        year = date.getFullYear(),
        month = (date.getMonth() + 1).toString().padStart(2, "0"),
        day = (date.getDate()).toString().padStart(2, "0");
        date =`${year}-${month}-${day}`
        array.push({
            "dt": date,
            "devBindAllNum": Math.floor(Math.random() * (1000000 + 1)),
            "devBind30Num": Math.floor(Math.random() * (1000000 + 1)),
            "devBindMonthNum": Math.floor(Math.random() * (1000000 + 1))
        });
    }
    response.send(array);
});

// 获取月新增绑定网器量
router.post("/deviceUserStatistics/getDeviceStatisticsListYear", (request, response) => {
    let array = new Array();
    let {endDate} = request.body;
    for(let i = 0; i < 12; i++) {
        let date = new Date("2018", i),
        year = date.getFullYear(),
        month = (date.getMonth() + 1).toString().padStart(2, "0"),
        day = (date.getDate()).toString().padStart(2, "0");
        date =`${year}-${month}-${day}`
        array.push({
            "dt": date,
            "devBindAllNum": Math.floor(Math.random() * (1000000 + 1)),
            "devBind30Num": Math.floor(Math.random() * (1000000 + 1)),
            "devBindMonthNum": Math.floor(Math.random() * (1000000 + 1))
        });
    }
    response.send(array);
});

module.exports = router;