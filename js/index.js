var App, app, config, initializeMenu, RootView;





require( 'shims/smoothscroll' );

config = require( '../config.json' );
App = require( './App.js' );
RootView = require( 'views/Root.js' );





window.app = app = new App( config );

// Attach all of our views to the application object
app.rootView = new RootView( window );

// Start the application
app.start();
