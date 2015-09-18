var $, Marionette, ChannelList, ChannelListItemView;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );
ChannelListItemView = require( 'views/ChannelListItem' );





ChannelList = Marionette.CollectionView.extend({
  childView: ChannelListItemView
});





module.exports = ChannelList;
