module.exports = {
  installProductionModules: {
    command: 'cd app && npm i --production && cd ..'
  },

  packageWin: {
    command: 'cd app && npm i --production && cd .. && electron-packager ./app Turk --platform=win32 --arch=x64 --icon=turk.ico --out=builds --version=0.33.0'
  },

  packageOSX: {
    command: 'cd app && npm i --production && cd .. && electron-packager ./app Turk --platform=darwin --arch=x64 --icon=turk.icns --out=builds --version=0.33.0'
  },

  buildWin: {
    command: 'mkdir builds/win64 && electron-builder builds/Turk-win32-x64 --platform=win --out="builds/win64" --config=electron.json'
  },

  buildOSX: {
    command: 'mkdir builds/osx && electron-builder builds/Turk-darwin-x64 --platform=osx --out="builds/osx" --config=electron.json'
  }
}
