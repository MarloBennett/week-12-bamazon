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
	//end of query function	
	})
//end of connection
})

var transaction = function() {
	
}