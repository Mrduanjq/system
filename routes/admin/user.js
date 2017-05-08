var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/user';

//显示登录页面
router.get('/login',(req,res)=>{
	if(req.session.isLogin){
		res.redirect('/admin')
	}else{
		res.render('admin/login');
	}
});

//
router.post('/signin',(req,res)=>{
	//获取输入的密码和用户名
	let username = req.body.username;
	let password = req.body.password;
	
	//连接数据库找出用户名和密码进行比对
	MongoClient.connect(url,(err,db)=>{
		if (err) throw err;
		let user = db.collection('user');
		user.findOne({username},(err,result) => {
			if(err) throw '查找错误';
			console.info(result)
			if(result){
				console.info(username,password);
				req.session.isLogin = true;
				res.redirect('/admin');
			}else{
				console.info('cuowu'+username,password);
				res.redirect('/user/login');
			}
		})
		
	})
	
});

//注销登录
router.get('/destroy',(req,res)=>{
	req.session.destroy();
	res.redirect('/user/login');
})

module.exports = router;
