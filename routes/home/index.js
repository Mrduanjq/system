var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/blogs';
var objectid = require('objectid');

/* GET home page. */
router.get('/', function(req, res, next) {
	//连接数据库
	MongoClient.connect(url,(err,db) =>{
		if(err) throw err;
		let category = db.collection('blog');
		let post = db.collection('post');
		//查找(类别部分)
		category.find().toArray((err,cats) => {
			if (err) throw err;
			//获取最新文章
			post.find().limit(8).sort({time:-1}).toArray((err,posts) => {
				if(err) throw err;
				res.render('home/index',{cats:cats,posts:posts});
			});
			
		});
	});
//res.render('home/index',{title:express});
});

router.get('/detail', function(req, res, next) {
	//得到id
	let id = req.query.id;
	//连接数据库
	MongoClient.connect(url,(err,db) => {
		if (err) throw err;
		let post = db.collection('post');
		//增加一个浏览次数属性
		post.update({_id:objectid(id)},{$inc:{count : 1}},(err,result)=>{
			if(err) throw err;
		})
		
		post.findOne({_id:objectid(id)},(err,posts) => {
			console.info(posts);
			if (err) throw err;
			res.render('home/detail',{posts:posts});
		})
	})
//res.render('home/detail',{title:express});
});
module.exports = router;
