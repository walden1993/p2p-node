/**
 * Created by Administrator on 2016/7/29.
 */

var CODE_ERROR ='01',CODE_SUCCESS='00',CODE_LOGIN='02';

/**
 * Created by Administrator on 2016/7/21.
 */
exports.success = function(data,code){
    this.data = data || {};
    this.code = code || CODE_SUCCESS;
    return this;
};


exports.error = function(data,code){
    this.data = data || {};
    this.code = code || CODE_ERROR;
    return this;
}