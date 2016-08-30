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
        api_base_url = 'http://localhost:8081/app/';
    }
    this.api_base_url = api_base_url;
    this.api_test_url = 'http://119.147.208.220:8080/test/app/'
    this.api_pro_url ="https://www.sanhaodai.com/app/";
    return this;
}

var urls ={
    'get_message_list':'get_message_list.mht',//获取消息公告列表
    'login':'login.mht',//登录
    'get_recharge_code':'get_recharge_code.mht'//获取短信验证码
    ,'recharge':'recharge.mht',//充值
    'get_user_info':'get_user_info.mht',//获取用户信息
    'get_investment_record':'get_investment_record.mht'//获取投资记录
    ,'get_user_friends':'get_user_friends.mht'//获取邀请好友列表
    ,'callcenterAnswer':'callcenterAnswer.mht'//常见问题列表
    ,'put_feedback':'put_feedback.mht'//添加意见反馈
    ,'new_pro_general':'new_pro_general.mht'//新手标
};

/**
 * 转换接口地址
 * @param METHOD_NAME
 * @returns {*}
 */
exports.getUrl = function (METHOD_NAME) {
    var url = urls[METHOD_NAME];
    return url;
};

exports.client_version = '12';


