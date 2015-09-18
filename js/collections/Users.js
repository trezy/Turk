var Backbone, Users, User;





Backbone = require( 'backbone' );
User = require( 'models/User' );





Users = Backbone.Collection.extend({
  model: User
});





module.exports = Users;
