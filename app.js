
//npmモジュールのロード
//var MONGODB_URI = process.env.MONGOLAB_URI;

var express = require('express');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var session = require('express-session');
var path = require('path');
var app = express();
app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: '/auth/twitter/callback'
    },
    function(token, tokenSecret, profile, done) {
        return done(null, profile);
    }
));

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/');
    });

app.get("/api/user", function(req, res){
    if (req.user) {
        res.json({
            login: true,
            username: req.user.username
        })
    }else{
        res.json({
            login: false
        })
    }
    
})

app.get("/", function(req, res, next){
    if (!req.user) {
        console.log("Not login");
        res.redirect("/login/");
    }else{
        next();
    }
})

app.get('/logout', function (req, res){
  req.logOut();
  res.redirect('/')
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);

});