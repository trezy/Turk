module.exports = {
  options: {
    execOptions: {
      maxBuffer: Infinity
    }
  },

  installProductionModules: {
    command: 'cd app && npm i --production && cd ..'
  },

  packageWin: {
    command: 'cd app && npm i --production && cd .. && electron-packager ./app Turk --platform=win32 --arch=x64 --icon=turk.ico --out=packages --version=0.33.0'
  },

  packageOSX: {
    command: 'cd app && npm i --production && cd .. && electron-packager ./app Turk --platform=darwin --arch=x64 --icon=turk.icns --out=packages --version=0.33.0'
  },

  buildWin: {
    command: 'mkdir -p builds/win64 && electron-builder packages/Turk-win32-x64 --platform=win --out="builds/win64" --config=electron.json'
  },

  buildOSX: {
    command: 'mkdir -p builds/osx && electron-builder packages/Turk-darwin-x64 --platform=osx --out="builds/osx" --config=electron.json'
  }
}
