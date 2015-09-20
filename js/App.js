var _, AddChannelView, AddServerView, App, BackboneIntercept, ChatView, document, fs, Marionette, Menu, MenuItem, ServersCollection, ServerListView, UserListView, util;





_ = require( 'underscore' );
fs = require( 'fs' );
util = require( 'util' );
Marionette = require( 'backbone.marionette' );
BackboneIntercept = require( 'backbone.intercept' );
require( 'shims/marionette.replaceElement' );

Menu = Remote.require( 'menu' );
MenuItem = Remote.require( 'menu-item' );

ServersCollection = require( 'collections/Servers' );
AddChannelView = require( 'views/AddChannel' );
AddServerView = require( 'views/AddServer' );
ChatView = require( 'views/Chat' );
ServerListView = require( 'views/ServerList' );
UserListView = require( 'views/UserList' );





App = Marionette.Application.extend({
  data: new Backbone.Model({
    currentChannel: null,
    currentServer: null,
    servers: new ServersCollection
  }),

  bindEvents: function () {
    var self;

    self = this;

    this.listenTo( this.data, 'change:currentChannel', function ( model ) {
      var chatListView, chatView, serverListView, userListView;

      chatView = new ChatView;
      serverListView = new ServerListView( { collection: self.data.get( 'servers' ) } );
      userListView = new UserListView( { collection: self.data.get( 'currentChannel' ).get( 'users' ) } );

      self.main.show( chatView, { replaceElement: true } );
      self.servers.show( serverListView );
      self.users.show( userListView );
    });

    window.addEventListener( 'contextmenu', function ( event ) {
      var channel, channelName, menu, server, serverName;

      menu = new Menu();

      if ( serverName = event.target.getAttribute( 'data-server' ) ) {
        server = self.data.get( 'servers' ).findWhere( { name: serverName } );

        menu.append( new MenuItem( {
          label: 'Disconnect',
          click: function () {
            server.disconnect();
          }
        }));

        menu.append( new MenuItem( {
          label: 'Add Channel',
          click: function () {
            self.dialog.show( new AddChannelView( { serverName: serverName } ) );
          }
        }));

        if ( channelName = event.target.getAttribute( 'data-channel' ) ) {
          channel = server.get( 'channels' ).findWhere( { name: channelName } );

          menu.append( new MenuItem( { type: 'separator' } ) );

          menu.append( new MenuItem( {
            label: 'Join Channel',
            click: function () {
              console.log( channel );
              channel.join();
              console.log( channel );
            }
          }));

          menu.append( new MenuItem( {
            label: 'Leave Channel',
            click: function () {
              // self.foobarbaz();
            }
          }));

          menu.append( new MenuItem( {
            label: 'Delete Channel',
            click: function () {
              // self.foobarbaz();
            }
          }));
        }

        menu.popup( Remote.getCurrentWindow() );
      }
    });

    window.addEventListener( 'hashchange', function () {
      var channel, hash, server;

      hash = location.hash.substring( 2 ).split( '/' );
      self.data.set( 'currentServer', self.data.get( 'servers' ).findWhere( { name: hash[0] } ) );

      server = self.data.get( 'currentServer' );

      if ( hash.length === 2 ) {
        self.data.set( 'currentChannel', server.get( 'channels' ).findWhere( { name: '#' + hash[1] } ) );
      }
    });
  },

  buildMenu: function () {
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
  },

  initialize: function ( config ) {
    for ( var i = 0; i < config.servers.length; i++ ) {
      var server;

      server = config.servers[i];

      this.data.get( 'servers' ).add( server, { parse: true } );
    }
  },

  onStart: function () {
    this.bindEvents();
    //this.buildMenu();

    this.data.set( 'currentServer', this.data.get( 'servers' ).models[0] )
    this.data.set( 'currentChannel', this.data.get( 'currentServer' ).get( 'channels' ).models[0] )

    Backbone.history.start( { pushState: true } );
    BackboneIntercept.start();
  },

  sendMessage: function ( message ) {
    this.data.get( 'currentChannel' ).sendMessage( message );
  }
});





module.exports = App;
