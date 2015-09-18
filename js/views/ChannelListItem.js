var $, Marionette, ChannelListItem;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );





ChannelListItem = Marionette.LayoutView.extend({
  template: require( 'templates/channel-list-item.hbs' ),

  tagName: 'li',

  className: 'channel-list-item fade-in'
});





module.exports = ChannelListItem;
