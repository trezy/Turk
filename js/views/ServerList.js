var $, Marionette, ServerList, ServerListItemView;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );
ServerListItemView = require( 'views/ServerListItem' );





ServerList = Marionette.CollectionView.extend({
  className: 'server-list',

  tagName: 'ol',

  childView: ServerListItemView
});





module.exports = ServerList;
