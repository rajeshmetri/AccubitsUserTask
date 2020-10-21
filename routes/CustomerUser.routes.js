module.exports = function (app) {

    const CustomerUsers = require('../controller/CustomerUser.controller');

    // Create a new Customer
    app.post('/api/CustomerUser', CustomerUsers.create);

    // Retrieve all Customer
    app.get('/api/CustomerUser', CustomerUsers.findAll);


    // Update a Customer with Id
    app.put('/api/CustomerUser', CustomerUsers.update);

    // Delete a Customer with Id
    app.delete('/api/CustomerUser/:CustomerUserId', CustomerUsers.delete);


    // Customer User login 
    app.post('/CustomerUser/login', CustomerUsers.login);


    //Finding current logged in customer user
    app.get('/CustomerUser/getCustomerUserOfCustomerId/:customerId', CustomerUsers.findCurrentLogedInCustomerUser);

    
    // Checking the password
    app.post('/CustomerUser/checkPassword', CustomerUsers.checkPassword);
    
    

}