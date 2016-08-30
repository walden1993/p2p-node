/**
 * Created by Administrator on 2016/7/28.
 */
var config = require('../src/config/config');
var request = require('request-json');
var safeUtil = require('../src/safeutil');
var client = request.createClient(new config().api_pro_url);
var express = require('express');
var response = require('../src/param/response');
var assert = require('assert');
var extend = require('extend');

function pay(token){
    var params = {
        client_version:config.client_version,
        mobile_tel:'13192466906',
        token:token,
        recharge_amount:'0.1',
        card_id:'299',
        md5_code:'dd4b21e9ef71e1291183a46b913ae6f2',
        order_id:'201608051628_2036_108',
        business_pwd:'6543211',
        identify_code:'215665'
    };
    var sign = safeUtil.paramsEncrypt(params);
    params['sign'] = sign;//get_recharge_code
    client.post(config.getUrl('get_recharge_code'),params,function (error, response, body) {
        if(error) return error;
        if(body.data){
            console.log(body.data);
            /*params.order_id = body.data.order_id;
            params.md5_code = body.data.md5_code;
            sign = safeUtil.paramsEncrypt(params);
            params.sign = sign;
            client.post(config.getUrl('recharge'),params,function(error,response,body){
                if(error) return error;
                if(body.data){
                    console.log(body.data);
                }
            });*/
        }else {
            console.log(body);
        }
    });
}

function login(fn) {
    let params = {
        mobile_system:'pc',
        client_version:config.client_version,
        mobile_tel:'13000000013',
        login_pwd:'123456'
    };

    var sign = safeUtil.paramsEncrypt(params);
    params['sign'] = sign;
    client.post(config.getUrl('login'),params,function (error, response, body) {
        if(error) return assert.fail();
        console.log(body.data)
        if(body.data){
            if (typeof fn === "function"){
                fn(body.data.token);
            }else{
                console.log(body.data);
            }
        }else{
            console.log(body);
        }
    })
}


function get_user_info(){
    login(function(token){
        let params = {
            mobile_system:'pc',
            client_version:config.client_version,
            mobile_tel:'13192466906',
            token:token
        };
        var sign = safeUtil.paramsEncrypt(params);
        params['sign'] = sign;
        client.post(config.getUrl('get_user_info'),params,function (error, response, body) {
            if(error) return assert.fail();
            if(body.data){
                console.log(body);
            }else{
                console.log(body.data);
            }
        })
    })
}

function get_investment_record(){
    login(function(token){
        let params = {
            mobile_system:'pc',
            client_version:config.client_version,
            mobile_tel:'13192466906',
            token:token
        };
        var sign = safeUtil.paramsEncrypt(params);
        params['sign'] = sign;
        client.post(config.getUrl('get_investment_record'),params,function (error, response, body) {
            if(error) return assert.fail(error);
            if(body.data){
                body.data.accum_invest_list.map(function(v){
                    console.log(v);
                })
            }else{
                console.log(body.data);
            }
        })
    })
}

function get_user_friends(){
    login(function(token){
        let params = {
            mobile_system:'pc',
            client_version:config.client_version,
            mobile_tel:'13192466906',
            token:token
        };
        var sign = safeUtil.paramsEncrypt(params);
        params['sign'] = sign;
        client.post(config.getUrl('get_user_friends'),params,function (error, response, body) {
            if(error) return assert.fail(error);
            if(body.data){
                console.log(body.data);
                body.data.friends_list.map(function(v){
                    console.log(v);
                })
            }else{
                console.log(body.data);
            }
        })
    })
}

function callcenterAnswer(){
    let params = {
        mobile_system:'pc',
        client_version:config.client_version,
        id:"3"
    };
    var sign = safeUtil.paramsEncrypt(params);
    params['sign'] = sign;
    client.post(config.getUrl('callcenterAnswer'),params,function(error,response,body){
        console.log(body.data);
    })
}

function new_pro_general(){
    let params = {
        mobile_system:'pc',
        client_version:config.client_version,
    };
    var sign = safeUtil.paramsEncrypt(params);
    params['sign'] = sign;
    client.post(config.getUrl('new_pro_general'),params,function(error,response,body){
        console.log(body);
    })
}

new_pro_general()

let fs = require('fs');
let path = require('path');

function query_support_bank(){

    fs.readFile(path.join('../public/data/support_bank.json'),function(error,data){
        if(error) throw error;

    })
}

