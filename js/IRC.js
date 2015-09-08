var IRC, irc, EventEmitter, util;





EventEmitter = require( 'events' ).EventEmitter;
irc = require( 'irc' );
util = require( 'util' )





IRC = function () {
  this.config = require( '../config.json' );

  this.servers = {};

  this.initialize();
}





util.inherits( IRC, EventEmitter );





IRC.prototype.bindEvents = function bindEvents () {}





IRC.prototype.bindServerEvents = function bindServerEvents ( serverObject ) {

  var self;

  self = this;

  serverObject.server.addListener( 'join', function ( channel, nickname ) {
    self.emit( 'join', serverObject, channel, nickname );
  });

  serverObject.server.addListener( 'motd', function ( motd ) {
    self.emit( 'motd', serverObject, motd );
  });

  serverObject.server.addListener( 'message', function ( nickname, channel, message ) {
    self.emit( 'message', serverObject, nickname, channel, message );
  });

  serverObject.server.addListener( 'names', function ( channel, nicknames ) {
    self.emit( 'names', serverObject, channel, nicknames );
  });

  serverObject.server.addListener( 'part', function ( channel, nickname, reason ) {
    self.emit( 'part', serverObject, channel, nickname, reason );
  });

  serverObject.server.addListener( 'registered', function ( message ) {
    self.emit( 'registered', serverObject, message );
  });

  serverObject.server.addListener( 'selfMessage', function ( channel, message ) {
    self.emit( 'selfMessage', serverObject, channel, message );
  });

  serverObject.server.addListener( 'topic', function ( channel, topic, nick ) {
    self.emit( 'topic', serverObject, channel, topic, nick );
  });
}





IRC.prototype.connectServer = function connectServer ( serverObject ) {

  var address, channels, nickname;

  address = serverObject.address;
  channels = serverObject.channels || [];
  nickname = serverObject.user.nickname;

  // Connect to the new server
  serverObject.server = new irc.Client( address, nickname, {
    channels: channels
  });

  this.bindServerEvents( serverObject );

  this.servers[serverObject.name] = serverObject;
}





IRC.prototype.connectChannel = function connectChannel ( server, channel ) {}





IRC.prototype.disconnectServer = function connectServer ( serverObject ) {

  var message;

  message = serverObject.disconnectMessage || '';

  serverObject.server.disconnect( message );

  this.bindServerEvents( serverObject );

  delete this.servers[serverObject.name];
}





IRC.prototype.initialize = function initialize () {

  // Connect to default servers
  for ( var i = 0; i < this.config.defaultServers.length; i++ ) {
    var server;

    server = this.config.defaultServers[i];

    this.connectServer( server );
  }
}





IRC.prototype.unbindServerEvents = function unbindServerEvents ( serverObject ) {
  serverObject.server.removeAllListeners();
}





module.exports = IRC;
