var $, Marionette, ChannelListItem;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );





ChannelListItem = Marionette.LayoutView.extend({
  template: require( 'templates/channel-list-item.hbs' ),

  tagName: 'li',

  className: 'channel-list-item',

  bindings: {
    '#notification': {
      observe: 'unread',
      updateView : true,
      visible: true
    }
  },

  onShow: function () {
    this.stickit();
  }
});





module.exports = ChannelListItem;
