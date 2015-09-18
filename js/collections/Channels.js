var Backbone, Channels, Channel;





Backbone = require( 'backbone' );
Channel = require( 'models/Channel' );





Channels = Backbone.Collection.extend({
  model: Channel
});





module.exports = Channels;
