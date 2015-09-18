var _, App, document, EventEmitter, fs, gui, Handlebars, ServersCollection, util;





_ = require( 'underscore' );
EventEmitter = require( 'events' ).EventEmitter;
fs = require( 'fs' );
Handlebars = require( 'handlebars' );
util = require( 'util' );
gui = window.require( 'nw.gui' );





ServersCollection = require( './collections/Servers' )





App = function ( irc, doc ) {

  document = doc;

  this.irc = irc;
  this.config = require( '../config.json' );
  this.currentChannel = null;
  this.currentNickname = null;
  this.currentServer = null;
  this.menu = null;
  this.servers = new ServersCollection;
  this.templates = {};
  this.ui = {};

  this.initialize();
}





util.inherits( App, EventEmitter );





App.prototype.addChannel = function addChannel ( serverName, channelName ) {

  var channelList;

  if ( ! this.currentChannel ) {
    this.currentChannel = channelName;
  }

  channelList = this.ui.serverList.querySelector( '[data-server="' + serverName + '"] .channel-list' );

  if ( channelList.querySelector( '[data-channel="' + channelName + '"]' ) ) {
    return;
  }

  channelList.appendChild( this.renderTemplate( 'channel-list-item', {
    serverName: serverName,
    safeName: channelName.substring( 1 ),
    name: channelName
  }));
}





App.prototype.addMessage = function addMessage ( nickname, message, serverName, channelName ) {

  var chat, hidden;

  chat = this.ui.chat;
  hidden = serverName !== this.currentServer.name || channelName !== this.currentChannel;

  chat.appendChild( this.renderTemplate( 'chat-message', {
    serverName: serverName,
    channelName: channelName,
    nickname: nickname,
    message: message,
    hidden: hidden
  }));

  this.scrollToBottom();
}





App.prototype.addServer = function addServer ( serverObject ) {

  var serverList;

  serverList = this.ui.serverList;

  this.servers.add( server );

  if ( ! serverList.querySelector( '[data-server="' + serverObject.name + '"]' ) ) {

    serverObject = this.irc.connectServer( serverObject );

    if ( ! this.currentServer ) {
      this.currentServer = serverObject;
      this.currentNickname = serverObject.user.nickname;
    }

    serverList.appendChild( this.renderTemplate( 'server-list-item', {
      name: serverObject.name
    }));

    this.servers[serverObject.name] = serverObject;
  }

  if ( ! this.currentServer ) {
    this.currentServer = serverObject;
  }
}





App.prototype.addSystemMessage = function addSystemMessage ( message, serverName, channelName ) {

  var chat, hidden;

  chat = this.ui.chat;
  hidden = serverName !== this.currentServer.name || channelName !== this.currentChannel;

  chat.appendChild( this.renderTemplate( 'chat-message', {
    serverName: serverName,
    channelName: channelName,
    message: message,
    hidden: hidden
  }));

  this.scrollToBottom();
}





App.prototype.addUser = function addUser ( nickname, serverName, channelName ) {

  var userList, hidden;

  userList = this.ui.userList;

  if ( ! userList.querySelector( '[data-nickname="' + nickname + '"][data-server="' + serverName + '"][data-channel="' + channelName + '"]' ) ) {
    hidden = serverName !== this.currentServer.name || channelName !== this.currentChannel;

    userList.appendChild( this.renderTemplate( 'user-list-item', {
      serverName: serverName,
      channelName: channelName,
      nickname: nickname,
      hidden: hidden
    }));
  }
}





App.prototype.bindEvents = function bindEvents () {

  var self;

  self = this;

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

      if ( newValue && newValue.substring( newValue.length - 1 ) !== ' ' ) {
        newValue = newValue + ' ';
      }

      self.ui.chatMessageInput.value = newValue + nickname + ' ';
    }
  });

  window.addEventListener( 'contextmenu', function ( event ) {
    var channelName, menu, serverName;

    menu = new gui.Menu();

    if ( serverName = event.target.getAttribute( 'data-server' ) ) {
      menu.append( new gui.MenuItem( {
        label: 'Disconnect',
        click: function () {
          console.log('Disconnect');
          self.servers[serverName].server.disconnect();
          delete self.servers[serverName];
        }
      }));

      menu.append( new gui.MenuItem( {
        label: 'Add Channel',
        click: function () {
          console.log('Add Channel');
          // self.foobarbaz();
        }
      }));

      if ( channelName = event.target.getAttribute( 'data-channel' ) ) {
        menu.append( new gui.MenuItem( { type: 'separator' } ) );

        menu.append( new gui.MenuItem( {
          label: 'Leave Channel',
          click: function () {
            console.log('Leave Channel');
            // self.foobarbaz();
          }
        }));

        menu.append( new gui.MenuItem( {
          label: 'Delete Channel',
          click: function () {
            console.log('Delete Channel');
            // self.foobarbaz();
          }
        }));
      }

      menu.popup( event.x, event.y );
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
    self.addSystemMessage( '<span data-nickname="' + nickname + '">' + nickname + '</span> joined ' + channelName, serverObject.name, channelName );
  });

  this.irc.addListener( 'message', function ( serverObject, nickname, channelName, message ) {
    self.addMessage( nickname, message, serverObject.name, channelName );
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
    self.addSystemMessage( nickname + ' left ' + channelName, serverObject.name, channelName );
  });

  this.irc.addListener( 'selfMessage', function ( serverObject, channelName, message ) {
    self.addMessage( self.currentNickname, message, serverObject.name, channelName );
  });
}





App.prototype.bindUI = function bindUI () {
  this.ui = {
    chat: document.querySelector( '.chat' ),
    chatMessageInput: document.querySelector( '.chat-message-input' ),
    dialog: document.querySelector( 'dialog' ),
    serverList: document.querySelector( '.server-list' ),
    userList: document.querySelector( '.user-list' )
  }
}





App.prototype.buildMenu = function buildMenu () {
  var currentWindow, menus, self;

  self = this;
  menus = {};
  currentWindow = gui.Window.get();

  menus.menubar = new gui.Menu({ type: 'menubar' });

  try {
    menus.menubar.createMacBuiltin( 'APPPPPPPPPPP', {});
  } catch ( err ) {
    console.log( err.message );
  }

  currentWindow.menu = menus.menubar;

  menus.file = new gui.Menu();
  menus.menubar.insert( new gui.MenuItem( {
    label: 'File',
    submenu: menus.file
  }), 1);

  menus.file.append( new gui.MenuItem( { label: 'Preferences' } ) );

  //serverKeys = Object.keys( this.servers );

  //for ( var i = 0; i < serverKeys.length; i++ ) {
  //  var serverName, submenu;

  //  serverName = serverKeys[i];

  //  submenu = new gui.Menu();
  //  submenu.append( new gui.MenuItem( { label: 'Add Channel' }, function () {} ) );
  //  submenu.append( new gui.MenuItem( { type: 'separator' }, function () {} ) );
  //  submenu.append( new gui.MenuItem( { label: 'Disconnect' }, function () {} ) );
  //  submenu.append( new gui.MenuItem( { label: 'Delete' }, function () {} ) );

  //  menus.servers.append( new gui.MenuItem({
  //    label: serverName,
  //    submenu: submenu
  //  }));
  //}

  this.menus = menus;
}





App.prototype.initialize = function initialize () {

  this.loadTemplates()
  this.bindUI();
  this.bindEvents();
  this.buildMenu();

  for ( var i = 0; i < this.config.servers.length; i++ ) {
    var server;

    server = this.config.servers[i];

    this.addServer( server );
  }

  this.switchChannel();
}





App.prototype.loadTemplates = function loadTemplates () {
  var templates;

  templates = fs.readdirSync( './templates' );

  for ( var i = 0; i < templates.length; i++ ) {
    var templateName;

    templateName = templates[i].substring( 0, templates[i].length - 4 );

    this.templates[templateName] = require( '../templates/' + templates[i] );
  }
}





App.prototype.removeUser = function removeUser ( nickname ) {

  var userElement;

  userElement = this.ui.userList.querySelector( '[data-nickname="' + nickname + '"]' );

  if ( userElement ) {
    this.ui.userList.removeChild( userElement );
  }
}





App.prototype.renderTemplate = function renderTemplate ( templateName, data ) {
  var element;

  element = document.createElement( 'div' );
  element.innerHTML = this.templates[templateName]( data );
  element.children[0];

  return element.children[0];
}





App.prototype.scrollToBottom = function scrollToBottom () {
  this.ui.chat.scrollTop = this.ui.chat.scrollHeight;
}





App.prototype.showDialog = function showDialog ( template ) {
  var modal;

  modal = this.ui.dialog;

  console.log( modal );
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
