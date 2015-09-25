var BaseCollection, Servers, Server;





BaseCollection = require( 'collections/Base' );
Server = require( 'models/Server' );





Servers = BaseCollection.extend({
  model: function ( attributes, options ) {
    return Server.create( attributes, options );
  }
});





module.exports = Servers;
