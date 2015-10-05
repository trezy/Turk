var $, Marionette, chatInput;





$ = require( 'jquery' );
Marionette = require( 'backbone.marionette' );





chatInput = Marionette.LayoutView.extend({
  template: false,

  tagName: 'input',

  className: 'chat-input',

  events: {
    'keypress': 'parseInput'
  },

  attributes: {
    autofocus: true,
    placeholder: 'Enter your message...'
  },

  executeCommand: function ( input ) {
    // Trim the leading slash. We don't need it anymore.
    input = input.substring( 1 );

    command = input.split( ' ' );

    switch ( command[0] ) {
      case 'me':
        break;

      case 'nick':
        app.data.get( 'currentServer' ).changeNickname( command[1] );
        break;

      case 'join':
        app.data.get( 'currentServer' ).joinChannel( command[1] );
        break;

      case 'leave':
      case 'part':
        var currentServer = app.data.get( 'currentServer' );

        if ( command[1] ) {
          console.log( command[1] );
          currentServer.leaveChannel( command[1] );
        } else {
          currentServer.leaveChannel( app.data.get( 'currentChannel' ) );
        }
        break;
    }
  },

  parseInput: function ( event ) {
    var target;

    keycode = event.which;
    input = event.target.value;

    if ( keycode === 13 ) {
      if ( input.substring( 0, 1 ) === '/' ) {
        this.executeCommand( input );
      } else {
        app.sendMessage( input );
      }
      event.target.value = '';
    }
  }
});





module.exports = chatInput;
