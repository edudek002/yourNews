var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/*var Promise = require("bluebird");
Promise.promisifyAll(mongoose);*/

var NoteSchema = new Schema({
  
  title: String,
 
  body: String
});

var Note = mongoose.model("Note", NoteSchema);
// Export the Note model
module.exports = Note;
