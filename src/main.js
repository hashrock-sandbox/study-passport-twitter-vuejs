var Vue = require("vue");


new Vue({
	el: ".container",
	data:{
		username: "loading...",
		login: false
	},
	ready: function(){
		var self = this;
		var request = require("superagent");
		request
			.get("/api/user/")
			.end(function(err, res){
				self.username = res.body.username;
				self.login = res.body.login;
			})
	}
})