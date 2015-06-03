var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var qs = require('query-string');

/*
 * Create a consent page URL
 */
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var bigquery = google.bigquery('v2');


var CLIENT_ID = '260878465288-3vdku6f83pvc5ndhs2edvf10h0vur2t0.apps.googleusercontent.com';
var CLIENT_SECRET = 'NhEqYRV_R9aMXH37apgc9jKj';
var REDIRECT_URL = 'http://localhost:3030/oauthcallback';

var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

// set auth as a global default
google.options({ auth: oauth2Client });

// generate a url that asks permissions for Google+ and Google Calendar scopes

var authorization_url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
  scope: 'https://www.googleapis.com/auth/bigquery' // If you only need one scope you can pass it as string
});

router.get('/', function (req, res) {
	res.render('index')
});

// Initial page redirecting
router.get('/auth', function (req, res) {
    res.redirect(authorization_url);
});

/*
 * Retrive authorization code
 * Retrive access token
 */
router.get('/oauthcallback', function(req, res){
  var code = req.query.code;
  console.log("code is "+code)

  oauth2Client.getToken(code, function(error, tokens) {
    if (error) {
        console.log('Error while trying to retrieve access token', err);
        return;
    }
    var accessToken = tokens.access_token
    oauth2Client.setCredentials({
      access_token: accessToken
    });
  });

});


router.get('/test', function(req,res){

  var request = bigquery.jobs.query({
    'projectId': 'vibrant-tiger-95306',
    'timeoutMs': '30000',
    'query': 'SELECT * FROM [publicdata:samples.github_timeline] LIMIT 2;'
  }, function(err, data){
    console.log(data)
  })



})


module.exports = router;
