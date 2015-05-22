var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

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
		console.log(result)
		token = queryString.parse(result).access_token;

		// authentication
		github.authenticate({
			type:"oauth",
			token: token
		})

		console.log(token)

		// get username and redirect to user page
		github.user.get({},function(err, data){
			console.log(data.name)
			res.redirect('/user/'+ data.name)
		})

  }
});

router.get('/', function (req, res) {
	res.render('index')
});

router.get('/user/:username', function(req,res){
	// console.log(req.params.username)
	res.render('user')
})

router.get('/repos', function(req, res){
	github.repos.getAll({
		type:'owner'
	},function(err,data){
    res.json(data)
	})
})

module.exports = router;
