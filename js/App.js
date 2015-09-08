var _, App, document, EventEmitter, util;





_ = require( 'lodash' );
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

  channelListElement = this.ui.serverList.querySelector( '[data-server="' + serverName + '"] .channel-list' );

  if ( channelListElement.querySelector( '[data-channel="' + channelName + '"]' ) ) {
    return;
  }

  channelElement = document.createElement( 'li' );
  channelElement.setAttribute( 'data-channel', channelName );

  anchorElement = document.createElement( 'a' );
  anchorElement.setAttribute( 'href', '#/' + serverName + '/' + channelName.substring( 1 ) );
  anchorElement.innerHTML = channelName;

  channelElement.appendChild( anchorElement );
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
  nicknameElement.setAttribute( 'data-nickname', nickname );
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

  if ( ! this.ui.userList.querySelector( '[data-server="' + serverObject.name + '"]' ) ) {

    serverElement = document.createElement( 'li' );
    serverElement.setAttribute( 'data-server', serverObject.name );

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





App.prototype.addUser = function addUser ( nickname, serverName, channelName ) {

  var userElement;

  if ( this.ui.userList.querySelector( '[data-nickname="' + nickname + '"][data-server="' + serverName + '"][data-channel="' + channelName + '"]' ) ) {
    return;
  }

  userElement = document.createElement( 'li' );
  userElement.classList.add( 'user' );
  userElement.setAttribute( 'data-nickname', nickname );
  userElement.setAttribute( 'data-server', serverName );
  userElement.setAttribute( 'data-channel', channelName );
  userElement.innerHTML = nickname;

  if ( serverName !== this.currentServer.name || channelName !== this.currentChannel ) {
    userElement.classList.add( 'hidden' );
  }

  this.ui.userList.appendChild( userElement );
}





App.prototype.bindEvents = function bindEvents () {

  var self;

  self = this;

  window.addEventListener( 'popstate', function ( event ) {
    console.log( 'event', event );
    console.log( 'window.location', window.location );
  });

  window.addEventListener( 'click', function ( event ) {

    var channel, nickname, server, target, temporaryArray;

    target = event.target;

    if ( target.localName === 'a' ) {
      event.preventDefault();

      temporaryArray = target.hash.substring( 2 ).split( '/' );

      serverName = temporaryArray[0];
      channelName = '#' + temporaryArray[1];

      self.switchChannel( self.servers[serverName], channelName );

    } else if ( nickname = target.getAttribute( 'data-nickname' ) ) {
      newValue = self.ui.chatMessageInput.value;

      if ( newValue.substring( newValue.length - 1 ) !== ' ' ) {
        newValue = newValue + ' ';
      }

      self.ui.chatMessageInput.value = newValue + nickname + ' ';
    }
  });

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
    self.addUser( nickname, serverObject.name, channelName );
    self.addSystemMessage( nickname + ' joined ' + channelName, serverObject, channelName );
  });

  this.irc.addListener( 'message', function ( serverObject, nickname, channelName, message ) {
    self.addMessage( nickname, message, serverObject, channelName );
  });

  this.irc.addListener( 'names', function ( serverObject, channelName, nicknames ) {

    var keys;

    keys = Object.keys( nicknames );

    for ( var i = 0; i < keys.length; i++ ) {
      var nickname;

      nickname = keys[i];

      self.addUser( nickname, serverObject.name, channelName );
    }
  });

  this.irc.addListener( 'part', function ( serverObject, channelName, nickname, reason ) {
    self.removeUser( nickname, serverObject.name, channelName );
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
  var chatMessages, userList;

  this.currentServer = serverObject || this.currentServer;
  this.currentChannel = channelName || this.currentChannel;

  chatMessages = this.ui.chat.querySelectorAll( '.chat-message' );
  users = this.ui.userList.querySelectorAll( '.user' );

  for ( var i = 0; i < chatMessages.length; i++ ) {
    var chatMessage, server, channel;

    chatMessage = chatMessages[i];
    messageServer = chatMessage.getAttribute( 'data-server' );
    messageChannel = chatMessage.getAttribute( 'data-channel' );

    if ( messageServer === this.currentServer.name && messageChannel === this.currentChannel ) {
      chatMessage.classList.remove( 'hidden' );
    } else {
      chatMessage.classList.add( 'hidden' );
    }
  }

  for ( var i = 0; i < users.length; i++ ) {
    var user, server, channel;

    user = users[i];
    userServer = user.getAttribute( 'data-server' );
    userChannel = user.getAttribute( 'data-channel' );

    if ( userServer === this.currentServer.name && userChannel === this.currentChannel ) {
      user.classList.remove( 'hidden' );
    } else {
      user.classList.add( 'hidden' );
    }
  }

  this.scrollToBottom();
}





module.exports = App;
