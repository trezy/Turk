# Turk

[![Join the chat at https://gitter.im/trezy/Turk](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/trezy/Turk?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Turk is an IRC client built with node-irc and Electron.

# Development

Run `grunt` to compile everything and watch for changes, then `npm start` to load up the app.

# Packaging

The `grunt dist` task will:

* Make sure all of our files are compiled and minified;
* Create binaries from the compiled files and gather the necessary drivers to be packaged;
* Build installers or the binaries.

Woot, you're done! :-)
