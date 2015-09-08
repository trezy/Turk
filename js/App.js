var App, document, EventEmitter, util;





EventEmitter = require( 'events' ).EventEmitter;
util = require( 'util' )





App = function ( irc, doc ) {

  document = doc;

  this.irc = irc;
  this.currentChannel = null;
  this.currentNickname = null;
  this.currentServer = null;
  this.servers = this.irc.servers;
  this.ui = {};

  this.initialize();
}





util.inherits( App, EventEmitter );





App.prototype.addChannel = function addChannel ( serverName, channelName ) {

  var channelElement, channelListElement;

  channelListElement = this.ui.serverList.querySelector( '[data-server-name="' + serverName + '"] .channel-list' );

  if ( channelListElement.querySelector( '[data-channel-name="' + channelName + '"]' ) ) {
    return;
  }

  channelElement = document.createElement( 'li' );
  channelElement.setAttribute( 'data-channel-name', channelName );
  channelElement.innerHTML = channelName;

  channelListElement.appendChild( channelElement );
}





App.prototype.addMessage = function addMessage ( nickname, message, serverObject, channelName ) {

  var channel, container, message, messageElement, nickname, reason;

  container = document.createElement( 'li' );
  container.classList.add( 'chat-message', 'fade-in' );
  container.setAttribute( 'data-server', serverObject.name );
  container.setAttribute( 'data-channel', channelName );

  nicknameElement = document.createElement( 'div' );
  nicknameElement.classList.add( 'user' );
  nicknameElement.innerHTML = nickname;

  messageElement = document.createElement( 'p' );
  messageElement.classList.add( 'message' );
  messageElement.innerHTML = message;

  container.appendChild( nicknameElement );
  container.appendChild( messageElement );

  if ( serverObject.name !== this.currentServer.name || channelName !== this.currentChannel ) {
    container.classList.add( 'hidden' );
  }

  this.ui.chat.appendChild( container );
  this.scrollToBottom();
}





App.prototype.addServer = function addServer ( serverObject ) {

  var serverElement;

  if ( ! this.ui.userList.querySelector( '[data-server-name="' + serverObject.name + '"]' ) ) {

    serverElement = document.createElement( 'li' );
    serverElement.setAttribute( 'data-server-name', serverObject.name );

    checkboxElement = document.createElement( 'input' );
    checkboxElement.classList.add( 'hidden' );
    checkboxElement.setAttribute( 'type', 'checkbox' );
    checkboxElement.setAttribute( 'id', 'control::' + serverObject.name + '-channel-list' );

    labelElement = document.createElement( 'label' );
    labelElement.setAttribute( 'for', 'control::' + serverObject.name + '-channel-list' );
    labelElement.innerHTML = serverObject.name;

    channelListElement = document.createElement( 'ol' );
    channelListElement.classList.add( 'channel-list' );

    serverElement.appendChild( checkboxElement );
    serverElement.appendChild( labelElement );
    serverElement.appendChild( channelListElement );

    this.ui.serverList.appendChild( serverElement );
  }
}





App.prototype.addSystemMessage = function addSystemMessage ( message, serverObject, channelName ) {

  var channel, container, message, messageElement, nickname, reason;

  container = document.createElement( 'li' );
  container.classList.add( 'chat-message', 'system-message', 'fade-in' );
  container.setAttribute( 'data-server', serverObject.name );
  container.setAttribute( 'data-channel', channelName );

  container.innerHTML = message;

  if ( serverObject.name !== this.currentServer.name || channelName !== this.currentChannel ) {
    container.classList.add( 'hidden' );
  }

  this.ui.chat.appendChild( container );
  this.scrollToBottom();
}





App.prototype.addUser = function addUser ( nickname ) {

  var userElement;

  if ( this.ui.userList.querySelector( '[data-nickname="' + nickname + '"]' ) ) {
    return;
  }

  userElement = document.createElement( 'li' );
  userElement.setAttribute( 'data-nickname', nickname );
  userElement.innerHTML = nickname;

  this.ui.userList.appendChild( userElement );
}





App.prototype.bindEvents = function bindEvents () {

  var self;

  self = this;

  this.ui.chatMessageInput.addEventListener( 'keyup', function ( event ) {
    var channel, message, server;

    if ( event.keyCode === 13 ) {
      message = self.ui.chatMessageInput.value;
      channel = self.currentChannel;
      server = self.currentServer.server;

      server.say( channel, message );
      self.ui.chatMessageInput.value = '';
    }
  });

  this.irc.addListener( 'registered', function ( serverObject, message ) {});

  this.irc.addListener( 'join', function ( serverObject, channelName, nickname ) {
    self.addUser( nickname );
    self.addSystemMessage( nickname + ' joined ' + channelName, serverObject, channelName );
  });

  this.irc.addListener( 'message', function ( serverObject, nickname, channelName, message ) {
    self.addMessage( nickname, message, serverObject, channelName );
  });

  this.irc.addListener( 'names', function ( serverObject, channelName, nicknames ) {
    var keys;

    keys = Object.keys( nicknames );

    for ( var i = 0; i < keys.length; i++ ) {
      self.addUser( keys[i] );
    }
  });

  this.irc.addListener( 'part', function ( serverObject, channelName, nickname, reason ) {
    self.removeUser( nickname );
    self.addSystemMessage( nickname + ' left ' + channelName, serverObject, channelName );
  });

  this.irc.addListener( 'selfMessage', function ( serverObject, channelName, message ) {
    self.addMessage( self.currentNickname, message, serverObject, channelName );
  });
}





App.prototype.bindUI = function bindUI () {
  this.ui = {
    chat: document.querySelector( '.chat' ),
    chatMessageInput: document.querySelector( '.chat-message-input' ),
    serverList: document.querySelector( '.server-list' ),
    userList: document.querySelector( '.user-list' )
  }
}





App.prototype.initialize = function initialize () {

  var serverKeys;

  this.bindUI();
  this.bindEvents();

  serverKeys = Object.keys( this.servers );

  for ( var i = 0; i < serverKeys.length; i++ ) {
    var serverObject;

    serverObject = this.servers[serverKeys[i]];

    this.addServer( serverObject );

    if ( ! this.currentNickname ) {
      this.currentNickname = serverObject.user.nickname;
    }

    if ( ! this.currentServer ) {
      this.currentServer = serverObject;
    }

    for ( var i = 0; i < serverObject.channels.length; i++ ) {
      var channelName = serverObject.channels[i];

      this.addChannel( serverObject.name, channelName );

      if ( ! this.currentChannel ) {
        this.currentChannel = channelName;
      }
    }
  }

  this.switchChannel();
}





App.prototype.removeUser = function removeUser ( nickname ) {

  var userElement;

  userElement = this.ui.userList.querySelector( '[data-nickname="' + nickname + '"]' );

  if ( userElement ) {
    this.ui.userList.removeChild( userElement );
  }
}





App.prototype.scrollToBottom = function scrollToBottom () {
  this.ui.chat.scrollTop = this.ui.chat.scrollHeight;
}





App.prototype.switchChannel = function switchChannel ( serverObject, channelName ) {
  var chatMessages;

  this.currentServer = serverObject || this.currentServer;
  this.currentChannel = channelName || this.currentChannel;

  chatMessages = this.ui.chat.querySelectorAll( '.chat-message' );

  for ( var i = 0; i < chatMessages.length; i++ ) {
    var chatMessage, server, channel;

    chatMessage = chatMessages[i];
    messageServer = chatMessage.getAttribute( 'data-server' );
    messageChannel = chatMessage.getAttribute( 'data-channel' );

    if ( messageServer === this.currentServer.name && messageChannel === this.currentChannel ) {
      console.log( 'Match!', chatMessage )
      chatMessage.classList.remove( 'hidden' );
    } else {
      console.log( 'No Match!', chatMessage )
      chatMessage.classList.add( 'hidden' );
    }
  }

  this.scrollToBottom();
}





module.exports = App;
