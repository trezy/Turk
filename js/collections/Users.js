var BaseCollection, Users, User;





BaseCollection = require( 'collections/Base' );
User = require( 'models/User' );





Users = BaseCollection.extend({
  model: function ( attributes, options ) {
    return User.create( attributes, options );
  }
});





module.exports = Users;
