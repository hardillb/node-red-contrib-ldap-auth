var when = require("when");
var mustache = require("mustache");
var LDAP = require("LDAP");
 
var filterTemplate = '';

var searchOpts = {
		scope: '',
		attrs: ''
	};

var options = {
		uri: '',
		version: 3,
		starttls: true,
		reconnect: true
	};

module.exports = {
	setup: function(args) {
		searchOpts.base = args.base;
		filterTemplate = args.filterTemplate;
		options.uri = args.uri

		return this;
	},
    type: "credentials",
    users: function(username) {
        return when.promise(function(resolve) {
        	var ldap = new LDAP(options);
			ldap.open(function(err){
				 // check user in ldap

				if (err) {
					console.log("error in open");
					console.log(err);
				}

				var temp = {};
				temp.username = username;
				searchOpts.filter = mustache.render(filterTemplate, temp);
	            ldap.search(searchOpts, function(err,data){
	            	if (err) {
	            		console.log("err -" + err);
	            		resolve(null);
	            		ldap.close();
	            	} else if (data) {
	            		if (data.length == 1) {
	            			resolve({ username: username, permissions: "*" });
	            		} else {
	            			resolve(null);
	            		}
	            		ldap.close();
	            	}
	            });
	            
			});

           
        });
    },
    authenticate: function(username,password) {
        return when.promise(function(resolve) {
        	var ldap = new LDAP(options);
			ldap.open(function(err){
				// authenticate ldap
				var temp = {};
				temp.username = username;
				searchOpts.filter = mustache.render(filterTemplate, temp);
	            ldap.search(searchOpts, function(err,data){
	            	if (err) {
	            		console.log(err);
	            		resolve(null);
	            		ldap.close();
	            	} else if (data) {
	            		if (data.length == 1) {
	            			var bindOptions = {
								binddn: data[0].dn,
								password: password
							};
	            			ldap.simpleBind(bindOptions, function(err){
	            				if (err) {
	            					resolve(null);
	            				} else {
	            					resolve({ username: username, permissions: "*" });
	            				}
	            				ldap.close();
	            			});
	            		} else {
	            			resolve(null);
	            			ldap.close();
	            		}
	            	}
	            });
			});
        });
    },
    default: function() {
        return when.promise(function(resolve) {
            // Resolve with the user object for the default user.
            // If no default user exists, resolve with null.
            resolve(null);
        });
    }
}