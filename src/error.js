/**
 * 404
 * @param req
 * @param res
 */
exports.notFound = function (req,res) {
    res.status(404).format({
        html: function () {
            res.render('404');
        },
        json: function () {
            res.send({message:'Resource not found'});
        },
        xml: function () {
            res.write('<error>\n');
            res.write('<message>Resource not found</message>\n');
            res.end('</error>\n')
        },
        text:function(){
            res.send('Resource not found');
        }
    })
};

/**
 * 5xx错误
 * @param err
 * @param req
 * @param res
 * @param next
 */
exports.error = function (err,req,res,next) {
    console.log(err.stack);//打印错误日志
    var　msg;
    switch (err.type){
        case 'database':
            msg ='Server Unavailable';
            res.statusCode = 503;
            break;
        default:
            msg = 'Internal Server Error';
            res.statusCode = 500;
            break;
    }
    res.format({
        html:function(){
          res.render('5xx',{msg:msg,status:res.statusCode})
        },
        json:function(){
            res.send({error:msg});
        },
        xml: function () {
            res.write('<error>\n');
            res.write('<msg>'+msg+'</msg><errorCode>'+res.statusCode+'</errorCode>\n')
            res.end('</error>\n')
        },
        text:function(){
            res.send(msg+"\n");
        }
    })
};