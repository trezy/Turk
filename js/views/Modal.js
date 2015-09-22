var $, Marionette, Modal;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );





Modal = Marionette.LayoutView.extend({
  tagName: 'dialog',

  className: 'panel',

  dismiss: function () {
    this.el.close();
  },

  onShow: function () {
    this.el.showModal();
  }
});





module.exports = Modal;
