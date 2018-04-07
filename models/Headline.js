var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/*var Promise = require("bluebird");
Promise.promisifyAll(mongoose);*/

var HeadlineSchema = new Schema({

  headline: {
    type: String,
    required: true
  },

  URL: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    default: "Summary not available."
  },

  image: {
    type: String,
    default: "../assets/img/harry-meghan.jpg" 
  },

  position: {
    type: String,
    default: "Save Article"
  },

  issaved: {
    type: Boolean,
    default: false
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

HeadlineSchema.index({headline: "text"});

// This creates our model from the above schema, using mongoose's model method
var Headline = mongoose.model("Headline", HeadlineSchema);

module.exports = Headline;
