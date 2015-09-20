var $, AddChannel, Marionette, Modal;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );
Modal = require( 'views/Modal' );





AddChannel = Modal.extend({
  template: require( 'templates/add-channel.hbs' ),

  ui: {
    name: '[name=name]'
  },

  events: {
    'click [data-modal-dismiss]': 'dismiss',
    'submit form': 'onSubmit'
  },

  onSubmit: function ( event ) {
    app.data.get( 'servers' ).findWhere( { name: this.getOption( 'serverName' ) } ).get( 'channels' ).add({
      name: this.ui.name.val()
    })

    this.dismiss();
  }
});





module.exports = AddChannel;
