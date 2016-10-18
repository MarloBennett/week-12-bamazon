//requuire mysql npm
var mysql = require("mysql");
//require prompt npm
var prompt = require("prompt");

//create connection to database
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "marlo",
	password: "marlosql",
	database: "Bamazon"
});

connection.connect(function(err) {
	if (err) {
		console.log(err);
		throw err;
	}

	//to check connection
	//console.log(connection.state, "Thread", connection.threadId);

	//intro text for user
	console.log("");
	console.log("Welcome to Bamazon Marketplace, for all your fire, LED, and dance prop needs! Please see a list of our products below.");
	console.log("");

	//query the database to get ID, product, and price
	connection.query("SELECT ItemID, ProductName, Price from Products", function(err, result) {

		if (err) {
			console.log(err);
			throw err;
		}

		//loop through results to display
		for (var i = 0; i < result.length; i++) {
			console.log("Item ID: " + result[i].ItemID);
			console.log("Product: " + result[i].ProductName);
			console.log("Price (US$): " + result[i].Price);
			console.log("-----------------");
		}
		//call transaction function
		transaction();

	//end of query function	
	})
//end of connection
})


var transaction = function() {

	//start prompt npm function
	prompt.start();

	prompt.get({
		properties: {
			orderID: {
				description: "Please enter the ID of the item you would like to order"
			},
			orderQuantity: {
				description: "Please enter the number of this item you would like to order"
			}
		}
	}, function (err, result) {

		if (err) {
			console.log(err);
			throw err;
		}

		//connect to database to query for stock number
		connection.query("SELECT StockQuantity, Price from Products where ItemID = ?", result.orderID, function(err, DbResult) {
			
			if (err) {
				console.log(err);
				throw err;
			}

			console.log("in stock: " + DbResult[0].StockQuantity);
			//compare order quantity to stock
			if (result.orderQuantity > DbResult[0].StockQuantity) {
				console.log("Sorry, there is an insufficient quantity of that item in stock.");
			}
			else {

				var adjustedStock = DbResult[0].StockQuantity - result.orderQuantity;
				
				var updateQuery = "UPDATE Products SET StockQuantity =" + adjustedStock + " WHERE ItemID =" + result.orderID;
				
				var total = result.orderQuantity * DbResult[0].Price;
				
				connection.query(updateQuery, function(err, DbResult) {

				console.log("adjusted stock: " + adjustedStock);
				console.log("Your total is: $" + total.toFixed(2));
				console.log(updateQuery);
				})
			}
			//console.log(DbResult);

		//end of connction		
		})
    
		console.log("Order ID " + result.orderID);
		console.log("Order quantity " + result.orderQuantity);
  });
}

