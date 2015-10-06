var _, AddChannelView, AddServerView, App, Backbone, BackboneIntercept, ChatView, defaultConfig, document, fs, Marionette, Menu, MenuItem, ServersCollection, ServerListView, UserListView, util;





_ = require( 'underscore' );
fs = require( 'fs' );
util = require( 'util' );
Backbone = require( 'backbone' );
Marionette = require( 'backbone.marionette' );
BackboneIntercept = require( 'backbone.intercept' );
require( 'backbone.stickit' );
require( 'shims/marionette.replaceElement' );

Menu = Remote.require( 'menu' );
MenuItem = Remote.require( 'menu-item' );

ServersCollection = require( 'collections/Servers' );
AddChannelView = require( 'views/AddChannel' );
AddServerView = require( 'views/AddServer' );
ChangeNicknameView = require( 'views/ChangeNickname' );
ChatView = require( 'views/Chat' );
ServerListView = require( 'views/ServerList' );
UserListView = require( 'views/UserList' );

defaultConfig = require( 'config' );





App = Marionette.Application.extend({
  data: new Backbone.Model({
    config: null,
    currentChannel: null,
    currentServer: null,
    servers: new ServersCollection
  }),

  bindEvents: function () {
    var self;

    self = this;

    this.listenTo( this.data, 'change:currentChannel', function ( model ) {
      self.main.show( new ChatView, { replaceElement: true } );
      self.users.show( new UserListView( { collection: self.data.get( 'currentChannel' ).get( 'users' ) } ) );
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
          label: 'Change Nickname',
          click: function () {
            self.dialog.show( new ChangeNicknameView( { serverName: serverName } ) );
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
              channel.join();
            }
          }));

          menu.append( new MenuItem( {
            label: 'Leave Channel',
            click: function () {
              channel.leave();
            }
          }));

          menu.append( new MenuItem( {
            label: 'Delete Channel',
            click: function () {
              channel.leave();
              channel.collection.remove( channel )
            }
          }));
        }

        // menu.append( new MenuItem( { type: 'separator' } ) );

        // menu.append( new MenuItem( {
        //   label: 'Server Properties',
        //   click: function () {
        //     self.dialog.show( new ServerPropertiesView( { serverName: serverName } ) );
        //   }
        // }));

        menu.popup( Remote.getCurrentWindow() );
      }
    });

    window.addEventListener( 'hashchange', function () {
      var hash;

      hash = location.hash.substring( 2 ).split( '/' );
      self.data.set( 'currentServer', self.data.get( 'servers' ).findWhere( { name: hash[0] } ) );

      if ( hash.length === 2 ) {
        self.changeChannel( '#' + hash[1] );
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
  },

  changeChannel: function ( channel ) {
    if ( typeof channel === 'string' ) {
      channel = this.data.get( 'currentServer' ).get( 'channels' ).findWhere( { name: channel } );
    }

    this.data.set( 'currentChannel', channel );

    channel.set( 'unread', 0 );
  },

  initialize: function ( config ) {
    this.loadPreferences();
  },

  loadPreferences: function () {
    var config;

    this.data.set( 'config', JSON.parse( localStorage.getItem( 'config' ) ) || defaultConfig );
  },

  onStart: function () {
    var chatListView, chatView, config, serverListView, servers, userListView;

    config = this.data.get( 'config' )
    servers = this.data.get( 'servers' )

    //this.buildMenu();

    for ( var i = 0; i < config.servers.length; i++ ) {
      var server;

      server = config.servers[i];

      servers.add( server, { parse: true } );
    }

    this.data.set( 'currentServer', servers.first() )
    this.data.set( 'currentChannel', this.data.get( 'currentServer' ).get( 'channels' ).first() )

    this.main.show( new ChatView, { replaceElement: true } );
    this.servers.show( new ServerListView( { collection: this.data.get( 'servers' ) } ) );
    this.users.show( new UserListView( { collection: this.data.get( 'currentChannel' ).get( 'users' ) } ) );

    this.bindEvents();

    Backbone.history.start( { pushState: true } );
    BackboneIntercept.start();
  },

  savePreferences: function () {
    var newConfig, servers;

    newConfig = {
      servers: []
    };

    servers = this.data.get( 'servers' );

    servers.each( function ( server, index, collection ) {
      var channels, serverConfig;

      channels = server.get( 'channels' );
      serverConfig = {
        address: server.get( 'address' ),
        autoconnect: server.get( 'autoconnect' ),
        channels: [],
        name: server.get( 'name' ),
        user: {
          nickname: server.get( 'user' ).get( 'nickname' )
        }
      };

      channels.each( function ( channel, index, collection ) {
        serverConfig.channels.push({
          name: channel.get( 'name' )
        });
      });

      newConfig.servers.push( serverConfig );
    });

    localStorage.setItem( 'config', JSON.stringify( newConfig ) );
  },

  sendMessage: function ( message ) {
    this.data.get( 'currentChannel' ).sendMessage( message );
  }
});





module.exports = App;
