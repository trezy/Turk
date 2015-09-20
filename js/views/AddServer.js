var $, AddServer, Marionette, Modal;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );
Modal = require( 'views/Modal' );





AddServer = Modal.extend({
  template: require( 'templates/add-server.hbs' ),

  ui: {
    address: '[name=address]',
    name: '[name=name]'
  },

  events: {
    'click [data-modal-dismiss]': 'dismiss',
    'submit form': 'onSubmit'
  },

  onSubmit: function ( event ) {
    app.data.get( 'servers' ).add({
      address: this.ui.address.val(),
      name: this.ui.name.val()
    })
    this.dismiss();
  }
});





module.exports = AddServer;
