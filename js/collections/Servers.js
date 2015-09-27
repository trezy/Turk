var BaseCollection, Servers, Server;





BaseCollection = require( 'collections/Base' );
Server = require( 'models/Server' );





Servers = BaseCollection.extend({
  model: function ( attributes, options ) {
    return Server.create( attributes, options );
  },

  bindEvents: function () {
    this.listenTo( this, 'update', function () {
      app.savePreferences();
    });
  },

  initialize: function () {
    this.bindEvents();
  }
});





module.exports = Servers;
