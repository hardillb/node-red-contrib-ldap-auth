var when = require("when");
var LDAP = require("LDAP");
 
var options = {
	uri: 'ldap://bluepages.ibm.com',
	version: 3,
	starttls: true,
	reconnect: true
};



module.exports = {
    type: "credentials",
    users: function(username) {
        return when.promise(function(resolve) {

        	var ldap = new LDAP(options);
			ldap.open(function(err){
				 // check user in ldap
	            var searchOpts = {
	            	base: 'ou=bluepages,o=ibm.com',
	            	filter: 'mail=' + username,
	            	scope: '',
	            	attrs:''

	            };
	            ldap.search(searchOpts, function(err,data){
	            	if (err) {
	            		console.log(err);
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
				var searchOpts = {
	            	base: 'ou=bluepages,o=ibm.com',
	            	filter: 'mail=' + username,
	            	scope: '',
	            	attrs:''

	            };
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