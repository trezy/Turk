var Channel, Backbone, MessagesCollection, UsersCollection;





Backbone = require( 'backbone' );
MessagesCollection = require( 'collections/Messages' );
UsersCollection = require( 'collections/Users' );





Channel = Backbone.Model.extend({
  defaults: {
    joined: false,
    messages: null,
    name: null,
    topic: null,
    users: null
  },

  initialize: function () {
    this.set( 'messages', new MessagesCollection );
    this.set( 'users', new UsersCollection );
  }
});





module.exports = Channel;
