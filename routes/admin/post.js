var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/blogs";
//能够解析ID
var objectid = require('objectid');
//引入解析图片的中间件
var multiparty = require('multiparty');

//显示文章列表
router.get('/',function(req,res){
	//连接数据库
	MongoClient.connect(url,(err,db)=>{
		if (err) throw err;
		let post = db.collection('post');
		post.find().toArray((err,result)=>{
			if (err) throw err;
			res.render('admin/article_list',{data : result});

		})
		
	})
});
//显示文章添加
router.get('/add',function(req,res){
	//连接数据库
	MongoClient.connect(url,(err,db)=>{
		if (err) throw err;
		let blog = db.collection('blog');
		blog.find().toArray((err,result)=>{
			if (err) throw err;
			res.render('admin/article_add',{data : result});
		})
	})
});

//发布文章成功
router.post('/insert',function(req,res){
	//设置临时目录
	let tmp = path.join(__dirname,"../../public/tmp");
	//实例化一个form对象
	const form = new multiparty.Form({uploadDir:tmp});
	
	form.parse(req,(err,fields,files)=>{
		
		let category = fields.category_id[0]; // 类别
        let title = fields.subject[0];
        let digest = fields.summary[0];
        let content = fields.content[0];
        let time = new Date();
        let count = 10;
        //验证
        if (!title.trim()) {
            res.render('admin/seccess',{msg : '标题不能为空'});
            return ;
        }

		if(files.cover[0].size == 0 ){ // 说明没有上传图片，直接保存数据库
			//连接数据库
			MongoClient.connect(url,(err,db)=>{
				if (err) throw err;
				let post = db.collection('post');
				post.insert({category,title,count,digest,content,time},(err,result)=>{
					if(err) throw err
					res.render('admin/seccess',{msg : "发表文章成功！"})
				})
			})
		}else{
			let oldPath = files.cover[0].path;
			let filename = files.cover[0].originalFilename;
			let newPath = path.join(__dirname,'../../public/uploads',filename);
			console.info(newPath);
			fs.rename(oldPath,newPath,(err) => {
				if(err) throw err;
				//说明上传成功，将路径保存到数据库
				let cover = path.join('uploads',filename);
				//连接数据库
				MongoClient.connect(url,(err,db)=>{
					if (err) throw err;
					let post = db.collection('post');
					post.insert({category,title,cover,digest,content,time},(err,result)=>{
						if(err) throw err;
						res.render('admin/seccess',{msg : "发表文章成功！"})
					})
				})
			});
		}
		
		
	})
});

//显示编辑文章
router.get('/edit',(req,res)=>{
	//获取id
	let id = req.query.id;
	//连接数据库
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		let post = db.collection('post');
		post.findOne({_id:objectid(id)},(err,data)=>{
			if (err) throw err;
			console.info(data)
			res.render('admin/article_edit',{data});
		})
	})
//	res.send('admin/article_edit');
});
//显示编辑文章成功
router.post('/update',(req,res)=>{
	
	res.send(' <strong>修改文章成功！点击<a href="/admin/post">返回</a></strong>')
})

module.exports = router;
