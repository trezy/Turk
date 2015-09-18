var $, Marionette, chatInput;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );





chatInput = Marionette.LayoutView.extend({
  tagName: 'input',

  initialize: function () {
    console.log( this )
  }
});





module.exports = chatInput;
