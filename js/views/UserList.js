var $, Marionette, UserList, UserListItemView;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );
UserListItemView = require( 'views/UserListItem' );





UserList = Marionette.CollectionView.extend({
  className: 'user-list',

  tagName: 'ol',

  childView: UserListItemView
});





module.exports = UserList;
