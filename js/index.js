var App, app, gui, initializeMenu, IRC, irc;





App = require( './js/App.js' );
IRC = require( './js/IRC.js' );
gui = require( 'nw.gui' );





irc = new IRC();
app = new App( irc, document );

app.buildMenu( gui );
