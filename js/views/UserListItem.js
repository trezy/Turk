var $, Marionette, UserListItem;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );





UserListItem = Marionette.LayoutView.extend({
  template: require( 'templates/user-list-item.hbs' ),

  tagName: 'li',

  className: 'user-list-item'
});





module.exports = UserListItem;
