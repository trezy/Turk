var BaseCollection, Channels, Channel;





BaseCollection = require( 'collections/Base' );
Channel = require( 'models/Channel' );





Channels = BaseCollection.extend({
  model: function ( attributes, options ) {
    return Channel.create( attributes, options );
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





module.exports = Channels;
