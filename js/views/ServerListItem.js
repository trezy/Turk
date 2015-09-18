var $, ChannelListView, Marionette;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );
ChannelListView = require( 'views/ChannelListItem' );





ServerListItem = Marionette.CompositeView.extend({
  template: require( 'templates/server-list-item.hbs' ),

  tagName: 'li',

  className: 'server-list-item',

  childView: ChannelListView,

  childViewContainer: '.channel-list',

  initialize: function () {
    this.collection = this.model.get( 'channels' );
  }
});





module.exports = ServerListItem;
