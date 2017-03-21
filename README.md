Node-red-contrib-ldap-auth
--------------------------

This is a Node-RED authentication plugin that uses LDAP as the backend user store.

It can be installed with:

    npm install -g node-red-contrib-ldap-auth

And then to enable it add the following to your settings.js file:

    adminAuth: require('node-red-contrib-ldap-auth').setup({
      uri:'ldap://url.to.server',
      base: 'ou=group,o=company.com',
      filterTemplate: 'mail={{username}}'
    }),

If your LDAP server requires authentication before it can search, you can use the 'bind_dn' and 'bind_pw' parameters:

    adminAuth: require('node-red-contrib-ldap-auth').setup({
      uri:'ldap://url.to.server',
      base: 'ou=group,o=company.com',
      filterTemplate: 'mail={{username}}',
      bind_dn: 'cn=authuser,o=company.com',
      bind_pw: 'yourlittlesecret',
    }),

If your LDAP server is not using a verifiable SSL certificate, you can set the 'no_verify_ssl' parameter to 'true' (boolean) and it will not validate the connection.
