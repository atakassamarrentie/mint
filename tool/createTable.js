
var server = require(__dirname + '/../server/server');
var ds = server.dataSources.mysql;
var lbTables = process.argv.slice(2);
ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  console.log('Loopback tables [' + lbTables + '] created in ', ds.adapter.name);
  ds.disconnect();
});