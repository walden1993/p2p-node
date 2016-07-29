/**
 * Created by Administrator on 2016/7/20.
 */
module.exports = exports = config;

var api_base_url = 'http://localhost/sp2p_web/app/';

 function config () {
    var env = process.env.NODE_ENV || 'DEV';
    if (env=='DEV'){//开发
        api_base_url = 'http://localhost/sp2p_web/app/';
    }else {//生产
        api_base_url = 'http://localhost:8080/sp2p_web/app/';
    }
    this.api_base_url = api_base_url;
    return this;
}

var urls ={
    'get_message_list':'get_message_list.mht',//获取消息公告列表
    'login':'login'//登录
};

/**
 * 转换接口地址
 * @param METHOD_NAME
 * @returns {*}
 */
exports.getUrl = function (METHOD_NAME) {
    var url = urls[METHOD_NAME];
    return api_base_url.concat(url);
};

exports.client_version = '12';


