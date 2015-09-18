var Backbone, Servers, Server;





Backbone = require( 'backbone' );
Server = require( 'models/Server' );





Servers = Backbone.Collection.extend({
  model: Server,

  initialize: function () {}
});





module.exports = Servers;
