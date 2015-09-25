var _, BaseModel, User;





_ = require( 'underscore' );
BaseModel = require( 'models/Base' );





User = BaseModel.extend({
  defaults: {
    nickname: null,
    operator: false
  }
});





module.exports = User;
