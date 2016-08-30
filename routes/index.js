var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'Express' });
});

router.get("/operative",function(req,res,next){
  res.render('operative/operative',{
    title:'运营报告',
    data:''
  })
});

router.get("/support_bank",function(req,res,next){
  res.redirect("views/support_bank.html")
});

router.get("/security",function(req,res,next){
  res.render('mobile/security/security',{
    title:'安全保障',
    data:''
  })

});


module.exports = router;
