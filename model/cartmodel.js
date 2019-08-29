var mongoose = require("mongoose");
var schema = mongoose.Schema; // instance created for schema

var cartschema = new schema(             //schema structure
    {
        cartid:{type:String,required:true},
        pname:{type:String,required:true},  
        image:{type:String,required:true},
        price:{type:Number,required:true},
        qty:{type:Number,required:true},
        total:{type:Number,required:true}
    }
)

var cartmodel = mongoose.model("cart", cartschema, "cart");
module.exports = cartmodel;