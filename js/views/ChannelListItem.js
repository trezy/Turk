var $, Marionette, ChannelListItem;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );





ChannelListItem = Marionette.LayoutView.extend({
  template: require( 'templates/channel-list-item.hbs' ),

  tagName: 'li',

  className: 'channel-list-item',

  bindings: {
    '#notification': 'unread'
  },

  bindEvents: function () {},

  initialize: function () {
    this.bindEvents();
  },

  onShow: function () {
    this.stickit();
  }
});





module.exports = ChannelListItem;
