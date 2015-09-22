var BuildMenu, Menu, MenuItem;





Menu = Remote.require( 'menu' );
MenuItem = Remote.require( 'menu-item' );





window.addEventListener( 'contextmenu', function ( event ) {
  var channel, channelName, menu, server, serverName;

  event.preventDefault();

  menu = new Menu();

  if ( serverName = event.target.getAttribute( 'data-server' ) ) {
    server = self.data.get( 'servers' ).findWhere( { name: serverName } );

    menu.append( new MenuItem( {
      label: 'Disconnect',
      click: function () {
        server.disconnect();
      }
    }));

    menu.append( new MenuItem( {
      label: 'Add Channel',
      click: function () {
        self.dialog.show( new AddChannelView( { serverName: serverName } ) );
      }
    }));

    if ( channelName = event.target.getAttribute( 'data-channel' ) ) {
      channel = server.get( 'channels' ).findWhere( { name: channelName } );

      menu.append( new MenuItem( { type: 'separator' } ) );

      menu.append( new MenuItem( {
        label: 'Join Channel',
        click: function () {
          console.log( channel );
          channel.join();
        }
      }));

      menu.append( new MenuItem( {
        label: 'Leave Channel',
        click: function () {
          console.log( channel );
          channel.leave();
        }
      }));

      menu.append( new MenuItem( {
        label: 'Delete Channel',
        click: function () {
          channel.leave();
          channel.collection.remove( channel )
        }
      }));
    }

    menu.append( new MenuItem( { type: 'separator' } ) );

    menu.append( new MenuItem( {
      label: 'Server Properties',
      click: function () {
        self.dialog.show( new AddChannelView( { serverName: serverName } ) );
      }
    }));

    menu.popup( event.x, event.y );
  }
});





BuildMenu = function () {
  var currentWindow, menus, self;

  self = this;
  menus = {};
  currentWindow = gui.Window.get();

  menus.menubar = new gui.Menu({ type: 'menubar' });

  try {
    menus.menubar.createMacBuiltin( 'APPPPPPPPPPP', {});
  } catch ( err ) {
    console.log( err.message );
  }

  currentWindow.menu = menus.menubar;

  menus.file = new gui.Menu();
  menus.menubar.insert( new gui.MenuItem( {
    label: 'File',
    submenu: menus.file
  }), 1);

  menus.file.append( new gui.MenuItem( { label: 'Preferences' } ) );

  //serverKeys = Object.keys( this.servers );

  //for ( var i = 0; i < serverKeys.length; i++ ) {
  //  var serverName, submenu;

  //  serverName = serverKeys[i];

  //  submenu = new gui.Menu();
  //  submenu.append( new gui.MenuItem( { label: 'Add Channel' }, function () {} ) );
  //  submenu.append( new gui.MenuItem( { type: 'separator' }, function () {} ) );
  //  submenu.append( new gui.MenuItem( { label: 'Disconnect' }, function () {} ) );
  //  submenu.append( new gui.MenuItem( { label: 'Delete' }, function () {} ) );

  //  menus.servers.append( new gui.MenuItem({
  //    label: serverName,
  //    submenu: submenu
  //  }));
  //}
}
