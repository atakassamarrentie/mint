'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var https = require('https');
var http = require('http');
var sslConfig = require('./ssl-config');
var httpsRedirect = require('./middleware/https-redirect');
var path = require('path');
var app = module.exports = loopback();
var options = {
  key: sslConfig.privateKey,
  cert: sslConfig.certificate,
  ca: sslConfig.cafile
};


app.use(loopback.token({ model: app.models.accessToken }));
app.start = function () {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  // start the web server
  var host = app.get('host')
  var port = app.get('port')
  var server = https.createServer(options, app);
  var baseUrl = `https://${host}:${port}`;
  let httpsPort = app.get('https-port');
  let redirectPort = app.get('redirect-port');
  http.createServer(app).listen(redirectPort, function () {
    console.log('Http for redirect listening on port ', redirectPort);
  });
  app.use(httpsRedirect({
    httpsPort: httpsPort
  }));

  server.listen(port, function () {
    app.emit('started', baseUrl);
    console.log('warn', `LoopBack server listening @ ${baseUrl}/`);
    if (app.get('loopback-component-explorer')) {
      let explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('warn', `Browse your REST API @ ${baseUrl}${explorerPath}/`);
    }
  });
  return server;
};
  /*var j = schedule.scheduleJob('* * * * * *', function () {
    console.log('The answer to life, the universe, and everything!');
  });*/


// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
