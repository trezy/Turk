var BaseCollection, Messages, Message;





BaseCollection = require( 'collections/Base' );
Message = require( 'models/Message' );





Messages = BaseCollection.extend({
  model: function ( attributes, options ) {
    return Message.create( attributes, options );
  }
});





module.exports = Messages;
