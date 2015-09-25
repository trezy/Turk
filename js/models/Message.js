var BaseModel, Message;





BaseModel = require( 'models/Base' );





Message = BaseModel.extend({
  defaults: {
    user: null,
    message: null
  }
});





module.exports = Message;
