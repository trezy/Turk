var App, app, IRC, irc;





App = require( './js/App.js' );
IRC = require( './js/IRC.js' );





irc = new IRC();
app = new App( irc, document );
