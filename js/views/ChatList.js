var $, Marionette, ChatList, ChatListItemView;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );
ChatListItemView = require( 'views/ChatListItem' );





ChatList = Marionette.CollectionView.extend({
  tagName: 'ol',

  className: 'chat-list',

  childView: ChatListItemView,

  onChildviewShow: function ( childView ) {
    childView.el.scrollIntoView( { behavior: 'smooth' } );
  },

  onShow: function () {
    // console.log( this.$el.prop( 'scrollHeight' ) );
    this.$el.scrollTop( this.$el.prop( 'scrollHeight' ) );
  }
});





module.exports = ChatList;
