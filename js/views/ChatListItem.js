var $, Marionette, ChatListItem;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );





ChatListItem = Marionette.LayoutView.extend({
  template: require( 'templates/chat-list-item.hbs' ),

  tagName: 'li',

  className: 'chat-list-item',

  initialize: function () {
    this.$el.addClass( this.model.get( 'type' ) );
  },

  onShow: function () {
    this.addBinding( this.model.get( 'user' ), '.user', 'nickname' );
  }
});





module.exports = ChatListItem;
