// parsing response data from http request
const chalk = require('chalk');

let parser = {};
let parseWeatherData = function (data) {
    const SPAN = '  |  ';
    const LINE_FEED = '\n';
    const BLANK_LINE ='\n\n';
    const TEXT_STYLE = {
        title: chalk.cyan.bgWhite,
        main: chalk.bgCyan,
    };
    const TODAY_INFO_KEYS = [
        {name: '当前气温', key: 'wendu', endWith: '℃' + SPAN},
        {name: '空气质量', key: 'quality', endWith: SPAN},
        {name: '湿度', key: 'shidu', endWith: LINE_FEED},
        {name: 'PM 2.5', key: 'pm25', endWith: SPAN},
        {name: 'PM 10', key: 'pm10', endWith: ''},
    ];
    const FORECAST_INFO_KEYS = [
        {name: '', key: 'date', endWith: LINE_FEED},
        {name: '天气', key: 'type', endWith: SPAN},
        {name: '', key: 'high', endWith: SPAN},
        {name: '', key: 'low', endWith: LINE_FEED},
        {name: '风向', key: 'fx', endWith: SPAN},
        {name: '风力', key: 'fl', endWith: LINE_FEED},
        {name: '提示', key: 'notice', endWith: ''},
    ];

    let detail = data.data;
    let title = '';
    let todayDetailInfo = '';
    let forecastInfo = '';
    let result = '';
    
    // title
    title = `${data.city} ${data.date}`;
    title = TEXT_STYLE.title(title) + LINE_FEED;

    // today detail info
    TODAY_INFO_KEYS.forEach((tItem) => {
        detail[tItem.key] != undefined 
            && (todayDetailInfo += `${tItem.name && (tItem.name + '：')}${detail[tItem.key] + tItem.endWith}`);
    });
    todayDetailInfo = TEXT_STYLE.main(todayDetailInfo) + BLANK_LINE;

    // forecast info
    if(detail.forecast instanceof Array && detail.forecast.length){
        let forecastTitle = TEXT_STYLE.title('预报') + LINE_FEED;
        forecastInfo += forecastTitle;

        detail.forecast.forEach((rawItem) => {
            let forecast = '';
    
            FORECAST_INFO_KEYS.forEach((fItem) => {
                rawItem[fItem.key] != undefined 
                    && (forecast += `${fItem.name && (fItem.name + '：')}${rawItem[fItem.key] + fItem.endWith}`);
            });
            forecastInfo += TEXT_STYLE.main(forecast) + BLANK_LINE;
        });
    }

    result = title + todayDetailInfo + forecastInfo;
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
