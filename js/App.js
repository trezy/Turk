var _, App, ChatListView, document, fs, gui, Marionette, ServersCollection, ServerListView, util;





_ = require( 'underscore' );
fs = require( 'fs' );
util = require( 'util' );
gui = window.require( 'nw.gui' );
Marionette = require( 'backbone.marionette' );
require( 'shims/marionette.replaceElement' );

ServersCollection = require( 'collections/Servers' );

ChatInputView = require( 'views/ChatInput' );
ChatListView = require( 'views/ChatList' );
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
      var chatListView, chatView, currentChannel, serverListView, servers, userListView;

      currentChannel = self.data.get( 'currentChannel' );
      servers = self.data.get( 'servers' );

      chatView = new ChatView; //( currentChannel.get( 'messages' ) );
      //chatInputView = new ChatInputView; //( currentChannel.get( 'messages' ) );
      //chatListView = new ChatListView( { collection: currentChannel.get( 'messages' ) } );
      serverListView = new ServerListView( { collection: servers } );
      userListView = new UserListView( { collection: currentChannel.get( 'users' ) } );

      //self.chatInput.show( serverListView );
      self.main.show( chatView, { replaceElement: true } );
      self.servers.show( serverListView );
      self.users.show( userListView );
    })
  },

  initialize: function ( config, irc ) {
    for ( var i = 0; i < config.servers.length; i++ ) {
      var server;

      server = config.servers[i];

      this.data.get( 'servers' ).add( server, { parse: true } );
    }
  },

  onStart: function () {
    this.bindEvents();
    this.data.set( 'currentServer', this.data.get( 'servers' ).models[0] )
    this.data.set( 'currentChannel', this.data.get( 'currentServer' ).get( 'channels' ).models[0] )
  }
});





module.exports = App;
