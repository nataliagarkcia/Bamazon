//npm packages that will be use during this app
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

//this will stablish the parameters to get the conection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "urfusrufus1989", //Your password
    database: "bamazon"
})

//this will make the conection to the server
connection.connect(function(err) {
    if (err) throw err;
    console.log("\n")
    console.log("WELCOME TO BAMAZON, your best online choice");
    //it will call the function to start the app
    start();
});



var start = function() {
    //This will call the products from my sql
    connection.query('SELECT * FROM products', function(err, res){
        console.log("\n")
        console.log('-------------------------------------------');
        console.log('Available products /// New collections');
        console.log('-------------------------------------------');
        console.log("\n")
         
         //this npm will convert the information in a table
         var table = new Table({
            head: ['ItemID', 'ProductName', 'DepartmentName', 'Price', 'StockQuantity'],
            colWidths: [10, 20, 30, 10, 30]
            });

            //amd it wil create a for loop with and array as a result to be able to push all the information into the tabe;
            for (var i=0; i < res.length; i++) {
            var productArray = [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].Price, res[i].StockQuantity];
            table.push(productArray);    
            }
            
            console.log(table.toString());
            console.log("\n")
            buyItem();
            });
}


//this function will allow the user to buy an item
var buyItem = function (){
    //we call an inquirer to allow the user to input information correspondent to the product
    inquirer.prompt([{
        name: "ItemID",
        type: "input",
        message: "Please enter the ID number of the item that you would like to buy",
        //this will validate the user's input, making sure that is a valid value 
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            } else {
                console.log("please enter a valid ID Item")
                return false;

            }
        }
        },{
        name: "units",
        type: "input",
        message: "how many units of the product they would like to buy",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            } else {
                console.log("please enter a valid number of items that you would like to buy")
                return false;

            }
        }    
        }
        //this will return an answer from the prompts
        ]).then(function (answer) {
            //console.log("IM HERE!!!!!!!")
             //console.log(answer); answer is an object with two properties 

        //console.log(answer.total);

        //console.log("HERE TOO")

        //this query will select the products from mysql table depending the user's input
        connection.query('SELECT * FROM products WHERE ?', [{ItemID: answer.ItemID}], function(err, res){

            if (err) throw err;
           // console.log("HERE")
            console.log( res[0].StockQuantity );

            //if the user's input is greater than he stock quantity, it will return a console.log and will call the start function to start again
            if (answer.units > res[0].StockQuantity ) {

                console.log("Insufficient quantity!")
                start();
            }  else {
                //this will set a new quantity for the item 
                var newQuantity = res[0].StockQuantity - answer.units;
                //this calculate the new total price
                var totalPrice = res[0].Price * answer.units;

                //this will update the info from the database
                connection.query('UPDATE products SET StockQuantity = ? WHERE ItemID = ?', [newQuantity, answer.ItemID], function(err, results) {
                        if (err) throw err;

                        else {
                            //and will give the costumer the total price of their purchase
                            console.log("\n");
                            console.log("Congrats on your purchase! Your total cost is $"+ totalPrice);
                            nextpurchase();
                                }

                            })
                }
            })
        });
    }       
//this function will allow the costumer to have the option of make another purchase or get out of the app
var nextpurchase = function (){
    inquirer.prompt([{
        name: "newpurchase",
        type: "confirm",
        message: "Would you like to purchase another item",
    }]).then(function (answer) {

        if (true) {
            start();
                }           
        else  {
        connection.end(function(err){
            console.log("\n");
            console.log('Thank you for your purchase and come back soon')
                })

            }
        })
};
