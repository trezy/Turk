var _, Backbone, IRC, Server, ChannelsCollection;





_ = require( 'underscore' );
Backbone = require( 'backbone' );
IRC = require( 'irc' );
UserModel = require( 'models/User' );
ChannelsCollection = require( 'collections/Channels' );





Server = Backbone.Model.extend({
  defaults: {
    address: null,
    channels: null,
    client: null,
    motd: null,
    name: null,
    registered: false,
    user: null
  },

  bindServerEvents: function () {
    var client, self;

    self = this;
    client = this.get( 'client' );

    client.addListener( 'join', function ( channelName, nickname ) {
      var channel, users;

      channel = self.get( 'channels' ).findWhere( { name: channelName } );
      users = channel.get( 'users' );

      if ( self.get( 'user' ).get( 'nickname' ) === nickname ) {
        channel.set( 'joined', true );

      } else {
        users.add( { nickname: nickname }, { merge: true } );
      }
    });

    client.addListener( 'kick', function ( channelName, nickname, reason ) {
      var channel, user, users;

      channel = self.get( 'channels' ).findWhere( { name: channelName } );
      users = channel.get( 'users' );
      user = users.findWhere( { nickname: nickname } );

      users.remove( user );
    });

    client.addListener( 'kill', function ( nickname, reason, channelNames ) {
      for ( var i = 0; i < channelNames.length; i++ ) {
        var channel, user, users;

        channel = self.get( 'channels' ).findWhere( { name: channelNames[i] } );

        if ( channel ) {
          users = channel.get( 'users' );
          user = users.findWhere( { nickname: nickname } );

          users.remove( user );
        }
      }
    });

    client.addListener( 'motd', function ( motd ) {
      self.set( 'motd', motd );
    });

    client.addListener( 'nick', function ( oldNickname, newNickname, channelNames ) {
      for ( var i = 0; i < channelNames.length; i++ ) {
        var channel, user, users;

        channel = self.get( 'channels' ).findWhere( { name: channelNames[i] } );

        if ( channel ) {
          users = channel.get( 'users' );
          user = users.findWhere( { nickname: oldNickname } );

          user.set( 'nickname', newNickname )
        }
      }
    });

    client.addListener( 'message', function ( nickname, channelName, message ) {
      var channel, user;

      channel = self.get( 'channels' ).findWhere( { name: channelName } );
      user = channel.get( 'users' ).findWhere( { nickname: nickname } );
      messages = channel.get( 'messages' );

      messages.add({
        user: user,
        message: message
      });
    });

    client.addListener( 'names', function ( channelName, nicknames ) {
      var channel, nicknamesArray, nicknameKeys;

      channel = self.get( 'channels' ).findWhere( { name: channelName } );
      nicknamesArray = [];
      nicknameKeys = Object.keys( nicknames );

      for ( var i = 0; i < nicknameKeys.length; i++ ) {
        var nickname;

        nickname = nicknameKeys[i];

        nicknamesArray.push({
          nickname: nickname,
          operator: nicknames[nickname] === '@'
        });
      }

      channel.get( 'users' ).reset( nicknamesArray );
    });

    client.addListener( 'part', function ( channelName, nickname, reason ) {
      var channel, user, users;

      channel = self.get( 'channels' ).findWhere( { name: channelName } );
      users = channel.get( 'users' );
      user = users.findWhere( { nickname: nickname } );

      users.remove( user );
    });

    client.addListener( 'quit', function ( nickname, reason, channelNames ) {
      for ( var i = 0; i < channelNames.length; i++ ) {
        var channel, user, users;

        channel = self.get( 'channels' ).findWhere( { name: channelNames[i] } );

        if ( channel ) {
          users = channel.get( 'users' );
          user = users.findWhere( { nickname: nickname } );

          users.remove( user );
        }
      }
    });

    client.once( 'registered', function () {
      self.set( 'registered', true );

      self.joinChannels();
    })

    client.addListener( 'selfMessage', function ( channelName, message ) {
      var channel, user;

      channel = self.get( 'channels' ).findWhere( { name: channelName } );
      user = self.get( 'user' );
      messages = channel.get( 'messages' );

      messages.add({
        user: user,
        message: message
      });
    });

    client.addListener( 'topic', function ( channelName, topic, nickname ) {
      var channel;

      channel = self.get( 'channels' ).findWhere( { name: channelName } );

      channel.set( 'topic', topic );
    });
  },

  initialize: function () {
    var channelData, userData;

    channelData = this.get( 'channels' );
    userData = this.get( 'user' );

    this.set( 'channels', new ChannelsCollection );
    this.get( 'channels' ).server = this;
    this.get( 'channels' ).add( channelData, { parse: true } );

    this.set( 'user', new UserModel( userData ) );
    this.set( 'client', new IRC.Client( this.get( 'address' ), this.get( 'user' ).get( 'nickname' ) ) );

    this.bindServerEvents();
  },

  joinChannel: function ( channel ) {
    if ( typeof channel === 'string' ) {
      channel = this.get( 'channels' ).add({
        name: channel,
        server: this
      });
    }

    channel.join();
  },

  joinChannels: function () {
    var self;

    self = this;

    this.get( 'channels' ).each( this.joinChannel, this )
  },

  leaveChannel: function ( channel ) {
    if ( typeof channel === 'string' ) {
      channel = this.get( 'channels' ).add({
        name: channel
      });
    }

    this.get( 'client' ).part( channel.get( 'name' ) );
  }
});





module.exports = Server;
