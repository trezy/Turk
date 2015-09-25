var $, ChangeNickname, Marionette, Modal;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );
Modal = require( 'views/Modal' );





ChangeNickname = Modal.extend({
  template: require( 'templates/change-nickname.hbs' ),

  ui: {
    nickname: '[name=nickname]'
  },

  events: {
    'click [data-modal-dismiss]': 'dismiss',
    'submit form': 'onSubmit'
  },

  onSubmit: function ( event ) {
    app.data.get( 'servers' ).findWhere( { name: this.getOption( 'serverName' ) } ).changeNickname( this.ui.nickname.val() );

    this.dismiss();
  }
});





module.exports = ChangeNickname;
