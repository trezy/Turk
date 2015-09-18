var Backbone, Messages, Message;





Backbone = require( 'backbone' );
Message = require( 'models/Message' );





Messages = Backbone.Collection.extend({
  model: Message
});





module.exports = Messages;
