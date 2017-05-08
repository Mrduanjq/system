var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	//判断是否登录
	if(!req.session.isLogin){
		res.redirect('/user/login');
	}else{
		res.render('admin/index');
	}
		
});

////注册
//router.get('/login', function(req, res, next) {
//res.render('admin/login',{title:express});
//});
////显示文章列表
//router.get('/article_list',function(req,res){
//	res.render('admin/article_list');
//})
module.exports = router;
