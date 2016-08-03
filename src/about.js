var express = require('express');
var router = express.Router();


router.get('',function(req,res,next){
    res.render('mobile/about/about',{
        title:'关于我们'
    });
})


module.exports = router;