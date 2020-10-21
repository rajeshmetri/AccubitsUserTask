const mongoose = require('mongoose');

const CustomerUserSchema = mongoose.Schema({
   
    customerUserPassword:   { type: String, required: true },
    customerUserName:       String,
    customerUserEmail:      { type: mongoose.SchemaTypes.Email, allowBlank: true },
    

}); 

module.exports = mongoose.model('customeruser', CustomerUserSchema);

