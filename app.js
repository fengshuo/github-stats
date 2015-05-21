/*
https://github.com/mikedeboer/node-github
https://developer.github.com/v3/oauth/
http://andreareginato.github.io/simple-oauth2/#coding-guidelines
http://expressjs.com/starter/generator.html
*/


var express = require('express');
var path = require('path');
var app = express();
var routes = require('./routes/index');
var GitHubApi = require("github");
var queryString = require('query-string');

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    timeout: 5000
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

var token;
// app.use('/', routes);

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
app.get('/auth', function (req, res) {
    res.redirect(authorization_uri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', function (req, res) {
  var code = req.query.code;
  console.log('/callback');
  oauth2.authCode.getToken({
    code: code,
    redirect_uri: 'http://localhost:3030/callback'
  }, saveToken);

  function saveToken(error, result) {
    if (error) { console.log('Access Token Error', error.message); }
    // token = oauth2.accessToken.create(result);
		console.log(result)

		token = queryString.parse(result).access_token;
		console.log(token)

		github.authenticate({
			type:"oauth",
			token: token
		})

		github.user.update({
			location: ""
		},function(err){
			console.log("done")
		})

	  // res.redirect('http://www.baidu.com')
  }
});

app.get('/', function (req, res) {
  res.send('Hello<br><a href="/auth">Log in with Github</a>');
});


app.listen(3030);

console.log('Express server started on port 3030');
