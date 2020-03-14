# Signalk 403 testcase

#### Background
Signal K authentication flows are intended to work as described below. These flows have been implemented in `@signalk/client`, yet it fails with a 403 Forbidden when one tries to PUT some data. This behaviour may be incorrect altogehter, as the way it's used here is not how PUT requests are intended. Having said that, the 403 is still strange. 

```
1. A client logs in using one of two mechanisms: HTTP (html forms and REST API) OR authentication over WebSockets.
  1.1 When logging in using HTTP, a cookie is set and an authentication token is returned.
  1.2 When logging in using request/response over WebSocket, only an authentication token is returned. A server associates the authentication with the open WS connection.

2. Subsequent WS messages over the open connection are authenticated (using the cookie OR as a result of WS-based login) from this point onward without the need to ever explicitly send the token along.

3. Subsequent REST API requests are authenticated using one of two methods: (A) using the cookie, IF the XHR call supports credentials (same-domain?) or (B) using an Authorization header in each subsequent request. If the client logged in using WS, A is not available.

4. The access rights flowing from the authorization, regardless of the method, type of request (WS or REST)  etc, are in accordance with the access rights associated with the logged-in user.
```

The user (xmiles@decipher.industries) used in this repo has admin rights. 


#### How to run
```
$ npm install
$ DEBUG=signalk* node .
```
