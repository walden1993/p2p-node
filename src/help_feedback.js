/**
 * 帮助中心/问题反馈
 * 2016-08-19
 */

var config = require('../src/config/config');
var request = require('request-json');
var safeUtil = require('../src/safeutil');
var client = request.createClient(new config().api_base_url);
var express = require('express');
var response = require('../src/param/response');
var router = express.Router();

router.get('/',function(req,res,next){
    res.render('mobile/help_feedback/help',{title:'帮助与反馈'});
});

router.get('/add',function(req,res,next){
    res.render('mobile/help_feedback/feedback',{title:'意见反馈'})
});

router.post('/add',function(req,res,next){

});

router.get('/help_detail',function(req,res,next){
    var id = req.query.id;
    var title = req.query.title;
    let params = {
        mobile_system:'pc',
        client_version:config.client_version,
        id:id
    };
    var sign = safeUtil.paramsEncrypt(params);
    params['sign'] = sign;
    client.post(config.getUrl('callcenterAnswer'),params,function(error,response,body){
        if (error) return next(error);
        else{
            res.render('mobile/help_feedback/help_detail',{title:title,list:body.data.help_list});
        }
    })
});

module.exports = router;