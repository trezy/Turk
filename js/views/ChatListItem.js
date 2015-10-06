var $, Marionette, ChatListItem;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );





ChatListItem = Marionette.LayoutView.extend({
  template: require( 'templates/chat-list-item.hbs' ),

  tagName: 'li',

  className: 'chat-list-item',

  bindings: {
    '.user': 'user'
  },

  initialize: function () {
    this.$el.addClass( this.model.get( 'type' ) );
  },

  onShow: function () {
    console.log( this.model.get( 'user' ) )
    this.addBinding( this.model.get( 'user' ), '.user', 'nickname' );
  }
});





module.exports = ChatListItem;
