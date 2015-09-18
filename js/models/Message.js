var Backbone, Message;





Backbone = require( 'backbone' );





Message = Backbone.Model.extend({
  defaults: {
    user: null,
    message: null
  }
});





module.exports = Message;
