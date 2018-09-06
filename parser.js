// parsing response data from http request
const chalk = require('chalk');
let parser = {};
let parseWeatherData = function (data) {
    const SPAN = '  |  ';
    const LINE_FEED = '\n';
    const BLANK_LINE ='\n\n';
    let result = '';
    let title = '';
    let forecastTitle = chalk.bold.greenBright('预报') + LINE_FEED;
    let todayDetailInfo = '';
    let detail = data.data;
    let todayDetailKey = [
        {name: '当前气温', key: 'wendu', endWith: '℃' + SPAN},
        {name: '空气质量', key: 'quality', endWith: SPAN},
        {name: '湿度', key: 'shidu', endWith: LINE_FEED},
        {name: 'PM 2.5', key: 'pm25', endWith: SPAN},
        {name: 'PM 10', key: 'pm10', endWith: ''},
    ];
    let forecastKey = [
        {name: '', key: 'date', endWith: LINE_FEED},
        {name: '天气', key: 'type', endWith: SPAN},
        {name: '', key: 'high', endWith: SPAN},
        {name: '', key: 'low', endWith: ' ' + LINE_FEED},
        {name: '风向', key: 'fx', endWith: SPAN},
        {name: '风力', key: 'fl', endWith: LINE_FEED},
        {name: '提示', key: 'notice', endWith: ''},
    ];
    
    // title
    title = `${data.city} ${data.date}`;
    result += chalk.bold.greenBright(title) + LINE_FEED;

    // today detail info
    todayDetailKey.forEach((tItem) => {
        detail[tItem.key] != undefined 
            && (todayDetailInfo += `${tItem.name && (tItem.name + '：')}${detail[tItem.key] + tItem.endWith}`);
    });
    result += chalk.bgBlackBright(todayDetailInfo) + BLANK_LINE;

    // forecast info
    if(detail.forecast instanceof Array && detail.forecast.length){
        result += forecastTitle;

        detail.forecast.forEach((rawItem) => {
            let forecast = '';
    
            forecastKey.forEach((cItem) => {
                rawItem[cItem.key] != undefined 
                    && (forecast += `${cItem.name && (cItem.name + '：')}${rawItem[cItem.key] + cItem.endWith}`);
            });
            result += chalk.bgBlackBright(forecast) + BLANK_LINE;
        });
    }

    return result;
};

parser.parse = function (body) {
    let result = '';
    let data = JSON.parse(body);

    if(data.status === 200){
        result = chalk.bgGreen(' Success \n\n');
        result += parseWeatherData(data);
    } else {
        result = chalk.bgRed(' Fail \n\n');
        data.status != undefined && (result += chalk.red(`status: ${data.status}\n`));
        result += chalk.red(data.message);
    }

    return result;
}

module.exports = parser;
