var $, Marionette, Chat;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );
ChatListView = require( 'views/ChatList' );





Chat = Marionette.LayoutView.extend({
  template: require( 'templates/chat.hbs' ),

  className: 'chat panel',

  regions: {
    list: '.chat-list',
    input: '.chat-input'
  },

  initialize: function () {
    //this.list.show( new ChatListView)//( { collection: messagesCollection } ) )
  }
});





module.exports = Chat;
