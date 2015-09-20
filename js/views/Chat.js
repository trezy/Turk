var $, Marionette, Chat;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );
ChatInputView = require( 'views/ChatInput' );
ChatListView = require( 'views/ChatList' );





Chat = Marionette.LayoutView.extend({
  template: require( 'templates/chat.hbs' ),

  templateHelpers: function () {
    return {
      channelName: app.data.get( 'currentChannel' ).get( 'name' )
    };
  },

  className: 'chat panel',

  regions: {
    input: '.chat-input',
    list: '.chat-list'
  },

  onRender: function () {
    var chatInputView, chatListView;

    chatInputView = new ChatInputView;
    chatListView = new ChatListView( { collection: app.data.get( 'currentChannel' ).get( 'messages' ) } );

    this.input.show( chatInputView, { replaceElement: true } );
    this.list.show( chatListView, { replaceElement: true } );
  }
});





module.exports = Chat;
