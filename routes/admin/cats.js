var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/blogs';
var objectid = require('objectid');

//显示分类
router.get('/',function(req,res){
	//连接数据库
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		//获取集合
		let blog = db.collection('blog');
		//查找所有分类
		blog.find().toArray((err,result)=>{
			if(err) throw err;
			res.render('admin/category_list',{data : result});
		})
	})
	
});
//显示添加分类
router.get('/add',function(req,res){
	res.render('admin/category_add');
});
//添加成功
router.post('/insert',function(req,res){
	//获取input中的值
	let title = req.body.title;
	let sort = req.body.sort;
	//连接数据库
	MongoClient.connect(url,function(err,db){
		if (err) throw err;
		//获取blog集合
		let blog = db.collection('blog');
		//在数据库中写入数据
		blog.insert({title,sort},(err,result) => {
			if (err) throw '写入错误！';
			res.render("admin/seccess",{msg : "添加成功"});
		})
	})
	
})
//显示编辑分类
router.get('/edit',function(req,res){
	
	let id = req.query.id;
	//连接数据库
	MongoClient.connect(url,(err,db)=>{
		if (err) '编辑出错';
		//获取当前这一条数据 的值
		let blog = db.collection('blog');
		blog.findOne({_id:objectid(id)},(err,data)=>{
			if(err) throw err;
			res.render('admin/category_edit',{data});
		})
	})
})
//更新分类
router.post('/update',function(req,res){
	let id = req.body.id;
	let title = req.body.title.trim();
	let sort = req.body.sort.trim();
	console.info(sort)
	//验证title不能为空
	if (!title){
		res.render('admin/seccess',{msg : 'title不能为空'});
		return false;
	};
	if (!sort){
		res.render('admin/seccess',{msg : 'sort不能为空'});
		return false;
	}
	//验证sort必须是数字
	if( Number.isNaN(+sort)){
		 res.render('admin/seccess',{msg : '排序依据必须是数字'});
		return false;
	}
	//连接数据库
	MongoClient.connect(url,(err,db)=>{
		if (err) throw err;
		let blog = db.collection('blog');
		blog.update({_id : objectid(id)},{title,sort},(err,result)=>{
			if (err) {
				res.render('admin/seccess',{msg:'修改失败！'})
			}else{
				res.render('admin/seccess',{msg:'修改成功！'})
			}
		})
	})
})
//删除分类
router.get('/delete',function(req,res){
	//获取当前数据
	let id = req.query.id;
	
	//连接数据库
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		//获取集合
		let blog = db.collection('blog');
		//删除
		blog.remove({_id : objectid(id)},(err,result)=>{
			if (err) throw err;
			res.render('admin/seccess',{msg : "删除成功！"});
//			res.render("admin/seccess",{msg : "添加成功"});
		})
		
	})
})
module.exports = router;
