var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var url = require('url');
var qs = require('query-string');

// dependencies
var GitHubApi = require("github");
var queryString = require('query-string');

// more info here:
// https://github.com/mikedeboer/node-github

var github = new GitHubApi({
    version: "3.0.0", // required
    debug: true, // optional
    protocol: "https",
    host: "api.github.com",
    timeout: 5000
});


/* oauth process
* http://andreareginato.github.io/simple-oauth2/#coding-guidelines
*/
var oauth2 = require('simple-oauth2')({
  clientID: '6431287130e627dd6e06',
  clientSecret: '645a37b74e34c2651e08ef8fa454c2d160c8d861',
  site: 'https://github.com/login',
  tokenPath: '/oauth/access_token'
});

// Authorization uri definition
var authorization_uri = oauth2.authCode.authorizeURL({
  redirect_uri: 'http://localhost:3030/callback',
  scope: 'notifications,user,public_repo',
  state: '3(#0/!~'
});

// Initial page redirecting to Github
router.get('/auth', function (req, res) {
    res.redirect(authorization_uri);
});

// Callback service parsing the authorization token and asking for the access token
router.get('/callback', function (req, res) {
  var code = req.query.code;
  oauth2.authCode.getToken({
    code: code,
    redirect_uri: 'http://localhost:3030/callback'
  }, saveToken);

  function saveToken(error, result) {
    if (error) { console.log('Access Token Error', error.message); }
    // token = oauth2.accessToken.create(result);

		token = queryString.parse(result).access_token;

		// authentication
		github.authenticate({
			type:"oauth",
			token: token
		});

		// get username and redirect to user page
		github.user.get({},function(err, data){
			res.redirect('/user/'+ data.name)
		})

  }
});


/**
 * Route and Api
 */

router.get('/', function (req, res) {
	res.render('index')
});

router.get('/user/:username/', function(req,res){
	// console.log(req.params.username)
	res.render('user')
});

/**
 * Get Repos of this User (owned by this user)
 */
router.get('/getrepos', function(req, res){
	github.repos.getFromUser({
		type:'owner',
    per_page: 100,
    user: 'mbostock'
	},function(err,data){
		if(err){res.send(err)};
		res.json(data)
	})
});

/**
 * Chart Page Entry Point
 */
router.get('/user/:username/:repo/', function(req, res){
	res.render("entry-page")
})


/**
 * PunchCard
 */
router.get('/user/:username/:repo/punchcard-page', function(req,res){
	res.render('punchcard')
})

router.get('/punchcard', function(req, res){
	github.repos.getStatsPunchCard({
		user: req.query.username,
		repo: req.query.repo
	},function(err,data){
		if(err){
			res.send(err)
		}
		res.json(data)
	})
});


/**
 * Code Frequency
 */
router.get('/user/:username/:repo/codefrequency-page', function(req,res){
	res.render('codefrequency')
})

router.get('/codefrequency', function(req, res){
	github.repos.getStatsCodeFrequency({
		user: req.query.username,
		repo: req.query.repo
	},function(err,data){
		if(err){
			res.send(err)
		}
		res.json(data)
	})
});



/**
 * Commit Activity
 */
router.get('/user/:username/:repo/commit-page', function(req,res){
	res.render('commit')
})

router.get('/commit', function(req, res){
	github.repos.getStatsCommitActivity({
		user: req.query.username,
		repo: req.query.repo
	},function(err,data){
		if(err){
			res.send(err)
		}
		res.json(data)
	})
});


// repo popularity
router.get('/user/:username/repos/popularity', function(req,res){
  res.render('repo-popularity')
})








module.exports = router;
