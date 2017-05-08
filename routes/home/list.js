var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/blogs';
/* GET home page. */
router.get('/', function(req, res, next) {
	let cats = req.query.cats;
	MongoClient.connect(url,(err,db) => {
		if (err) throw err;
		let post = db.collection('post');
		
		post.find({category:cats}).toArray((err,article)=>{
			console.info(article)
			if(err) throw err;
			res.render('home/list',{article});
		});
	})
  
});
module.exports = router;
