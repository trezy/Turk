var $, Marionette, ChannelListItem;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );





ChannelListItem = Marionette.LayoutView.extend({
  template: require( 'templates/channel-list-item.hbs' ),

  tagName: 'li',

  className: 'channel-list-item',

  bindEvents: function () {
    this.listenTo( this.model, 'change:unread', function ( model, value ) {
      if ( value ) {
        this.$el.addClass( 'unread' );
      } else {
        this.$el.removeClass( 'unread' );
      }
    });
  },

  initialize: function () {
    this.bindEvents();
  }
});





module.exports = ChannelListItem;
