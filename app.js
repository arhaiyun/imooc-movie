/**
 * arhaiyun's first node.js+mongoDB project
 * app.js is the entrance
 */

var express = require('express')
var port = process.env.PORT || 3000
var path = require('path')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var Movie = require('./models/movie')
var _ = require('underscore')

mongoose.connect('mongodb://localhost/imooc')

app.set('views', './views/pages')
app.set('view engine', 'jade')
app.set('port', port)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))

app.locals.moment = require('moment')
app.listen(port)

console.log('JKMushi website starts on port:' + port)


//index: home page
app.get('/index', function(req, res) {
	Movie.fetch(function(err, movies) {
		if(err) {
			console.log(err)
		}

		res.render('index', {
			title: 'JK牧视·电影分享首页',
			movies: movies
		})
	})
})



// admin page
app.get('/admin/movie', function(req, res) {
	res.render('admin', {
		title:'JK牧视·电影管理页',
		movie: {
			title: '',
			director: '',
			country: '',
			language: '',
			year: '',
			poster: '',
			flash: '',
			summary: ''
		}
	})
})



// POST to create a new movie
app.post('/admin/movie/new', function(req, res) {
	console.log("--log.viewer--")
	console.log("req.body:" + JSON.stringify(req.body))
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if(id != 'undefined') {
		console.log("update exist movie information")
		Movie.findById(id, function(err, movie) {
			if(err) {
				console.log(err)
			}

			_movie = _.extend(movie, movieObj)
			_movie.save(function(err, movie) {
				if(err) {
					console.log(err)
				}

				res.redirect(movie._id)
			})
		})
	}
	else {
		console.log("create a new movie")
		_movie = new Movie({
			director: movieObj.director,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash,
		})
		_movie.save(function(err, movie) {
			if(err) {
					console.log(err)
				}

				res.redirect(movie._id)
		})
	}
})


// detail page
app.get('/admin/movie/:id', function(req, res) {
	console.log("now in detail page")
	var id = req.params.id

	Movie.findById(id, function(err, movie) {
		if(err) {
			console.log(err)
		}

		res.render('detail', {
			title: 'JK牧视·电影详情页',
			movie: movie
		})
	})
})



// admin update movie
app.get('/admin/update/:id', function(req, res) {
	var id = req.params.id
	if(id) {
		Movie.findById(id, function(err, movie) {
			res.render('admin', {
				title: 'imooc后台更新页',
				movie: movie
			})
		})
	}
})



// list page
app.get('/admin/list', function(req, res) {
	Movie.fetch(function(err, movies) {
		if(err) {
			console.log(err)
		}

		res.render('list', {
			title: 'imooc列表页',
			movies: movies
		})
	})
})



// list delete movie
app.delete('/admin/list', function(req, res) {
	console.log("---log: now deleting a movie")
	var id = req.query.id
	console.log("req.query.id:" + id)

	if(id) {
		Movie.remove({_id: id}, function(err, movie) {
			if(err) {
				console.log(err)
			}
			else {
				res.json({success: 1})
			}
		})
	}
})












