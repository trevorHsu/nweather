#!/usr/bin/env node

const request = require('request');
const Spinner = require('cli-spinner').Spinner;
const isChinese = require('is-chinese');
const urlencode = require('urlencode');
const parser = require('./parser');

const hint = '使用方式：nwd <中文城市名称>\nUsage: nwd <CITY_NAME_IN_CHINESE>';
let word = process.argv.slice(2).join('');

if(!word || !isChinese(word)){
    console.log(hint);
    process.exit();
}

const spinner = new Spinner('正在查询中..%s');
const api = 'https://www.sojson.com/open/api/weather/json.shtml?city=';
const options = {
    url: api + urlencode(word),
};

spinner.setSpinnerString('.-**-..');
spinner.start();

request(options, (err, res, body) => {
    if (err) {
        console.error(err);
    }

    spinner.stop(true);
    console.log(parser.parse(body));
});
