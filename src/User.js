/**
 * Created by Administrator on 2016/7/28.
 */
var config = require('../src/config/config');
var request = require('request-json');
var safeUtil = require('../src/safeutil');
var app = require('../app');
var client = request.createClient(new config().api_base_url);
var express = require('express');
var response = require('../src/param/response')
var router = express.Router();

router.post('login',function(req,res,next){
    let params = {};
    client.post('','',function (err,response,data){
       if(err) return next(err);
        console.log(data);
    });
});

router.get('login',function(req,res,next){
    res.render('/')
});


module.exports = router;