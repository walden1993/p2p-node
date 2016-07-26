/**
 * Created by Administrator on 2016/7/20.
 */
var md5 = require('md5');
var key = 'wDwdKd27d0Qj1wdEa536yiuPE96Ofds3L';

module.exports = exports = safeUtil;

function safeUtil(){

};

function sortObject(obj) {
    var sign = '';
    Object.keys(obj).sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase())
    }).forEach(function (key) {
        sign = sign.concat(obj[key]).concat('&');
    })
    return md5(sign.concat(key));
}

exports.paramsEncrypt = function(params){
    return sortObject(params);
}




