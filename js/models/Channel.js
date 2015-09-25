var Channel, BaseModel, MessagesCollection, UsersCollection;





BaseModel = require( 'models/Base' );
MessagesCollection = require( 'collections/Messages' );
UsersCollection = require( 'collections/Users' );





Channel = BaseModel.extend({
  defaults: {
    joined: false,
    messages: null,
    name: null,
    safeName: null,
    server: null,
    serverName: null,
    topic: null,
    users: null
  },

  initialize: function () {
    this.set( 'messages', new MessagesCollection );
    this.set( 'users', new UsersCollection );
    this.set( 'safeName', this.get( 'name' ).substring( 1 ) );
    this.set( 'server', this.collection.server );
    this.set( 'serverName', this.get( 'server' ).get( 'name' ) );
  },

  leave: function () {
    this.get( 'server' ).get( 'client' ).part( this.get( 'name' ) );
    this.set( 'joined', false );
  },

  join: function () {
    this.get( 'server' ).get( 'client' ).join( this.get( 'name' ) );
    this.set( 'joined', true );
  },

  sendMessage: function ( message ) {
    var channelName, client;

    channelName = this.get( 'name' );
    client = this.get( 'server' ).get( 'client' );

    client.say( channelName, message );
  }
});





module.exports = Channel;
