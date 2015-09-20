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
  },

  onBeforeDestroy: function () {
    this.el.close();
  }
});





module.exports = Modal;
