const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartSchema = new Schema({
   user_id: String,
   course_id: String
},{ timestamps: true }); 

CartSchema.index( { user_id : 1 } )
CartSchema.index( { course_id : 1 } )
 
module.exports =  mongoose.model('cart', CartSchema);