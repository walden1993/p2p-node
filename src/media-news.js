/**
 * Created by Administrator on 2016/7/20.
 */
var config = require('../src/config/config');
var request = require('request-json');
var safeUtil = require('../src/safeutil');
var app = require('../app');
var client = request.createClient(new config().api_base_url);
var express = require('express');
var response = require('../src/param/response');
var router = express.Router();

router.post("/",function(req,res,next){
    var page_size  = req.body.page_size || '5';
    var page_num = req.body.page_num || '1';
    var params = {
        client_version:config.client_version,
        mobile_tel:'',
        token:'',
        starting_page:page_num,
        page_number:page_size
    };
    var sign = safeUtil.paramsEncrypt(params);
    params['sign'] = sign;
    client.post(config.getUrl('get_message_list'),params,function (error, response, body) {
        if(error) return next(error);
        if(body.data.message_list){
            res.render('mobile/message_notice_list',{
                messages:body.data.message_list
            });
        }else{
            res.render('mobile/message_notice_list',{
                messages:{}
            });
        }

    })
});

router.get("/",function(req,res,next){
    res.render('mobile/message_notice',{
        title:'消息列表'
    });
});




module.exports = router;
