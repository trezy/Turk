var Backbone, User;





Backbone = require( 'backbone' );





User = Backbone.Model.extend({
  defaults: {
    nickname: null,
    operator: false
  }
});





module.exports = User;
