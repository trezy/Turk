var $, Marionette, Root;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );





Root = Marionette.LayoutView.extend({
  el: $( 'body' ),

  template: require( 'templates/root.hbs' ),

  regions: {
    chatInput: '.chat-input',
    dialog: '.dialog',
    main: 'main',
    servers: '.servers',
    users: '.users'
  },

  onRender: function () {
    // Attach our regions to the main application object for use across the
    // application.
    app.chatInput = this.chatInput;
    app.dialog = this.dialog;
    app.main = this.main;
    app.servers = this.servers;
    app.users = this.users;
  },

  initialize: function ( window ) {
    // Render the base elements that will become the Application's regions
    this.render();
  }
});





module.exports = Root;
