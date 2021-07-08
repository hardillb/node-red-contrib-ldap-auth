# Node-red-contrib-ldap-auth

This is a Node-RED authentication plugin that uses LDAP as the backend user store.

It can be installed with:

    npm install -g node-red-contrib-ldap-auth

And then to enable it add the following to your settings.js file:

    adminAuth: require('node-red-contrib-ldap-auth').setup({
      uri:'ldap://url.to.server',
      base: 'ou=group,o=company.com',
      filterTemplate: 'mail={{username}}'
    }),

## Bind Authentication

If your LDAP server requires authentication before it can search, you can use the ``bind_dn`` and ``bind_pw`` parameters:

    adminAuth: require('node-red-contrib-ldap-auth').setup({
      uri:'ldap://url.to.server',
      base: 'ou=group,o=company.com',
      filterTemplate: 'mail={{username}}',
      bind_dn: 'cn=authuser,o=company.com',
      bind_pw: 'yourlittlesecret',
    }),

## Security Group Filtering

If your LDAP login needs to be restricted to a specifc group, you can use an advanced ``filterTemplate`` to filter users to a specific group.

```js
filterTemplate: '(&(sAMAccountName={{username}})(memberOf=CN=ExampleGroup,OU=Security Groups,OU=Groups,OU=Corp,DC=example,DC=com))',
````

You can also combine multiple filters, see https://ldap.com/ldap-filters/.
 * AND Filters `(&(<first>)(<second>)(<third>))`
 * OR Filters `(|(<first>)(<second>)(<third>))`
 * Combined Filters `(&(<first>)(|(<first_or>)(<second_or>)))` (e.g. filter for multiple groups that should have access)

## Certificate Verification
If your LDAP server is not using a verifiable SSL certificate, you can set the ``no_verify_ssl`` parameter to ``true`` (boolean) and it will not validate the connection.

## Anonymous Access
To allow anonymous read access to the NodeRed Admin UI, you can set the ``anon_read`` parameter to ``true``.
