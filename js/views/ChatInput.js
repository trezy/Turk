var $, Marionette, chatInput;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );





chatInput = Marionette.LayoutView.extend({
  template: false,

  tagName: 'input',

  className: 'chat-input',

  attributes: {
    autofocus: true,
    placeholder: 'Enter your message...'
  },

  initialize: function () {
    this.el.addEventListener( 'keypress', function ( event ) {
      var target;

      target = event.target;

      if ( event.which === 13 ) {
        app.sendMessage( target.value );
        target.value = '';
      }
    });
  }
});





module.exports = chatInput;
