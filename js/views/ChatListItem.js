var $, Marionette, ChatListItem;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );





ChatListItem = Marionette.LayoutView.extend({
  template: require( 'templates/chat-list-item.hbs' ),

  tagName: 'li',

  className: 'chat-list-item'
});





module.exports = ChatListItem;
