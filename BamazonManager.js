//requuire mysql npm
var mysql = require("mysql");
//require inquirer npm
var inquirer = require("inquirer");

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
	console.log("Welcome to Bamazon Manager View, which will allow you to view products for sale, view low inventory, add to inventory, and add new products.");
	console.log("");

	//give user options list
	inquirer.prompt({
		type: "checkbox",
		name: "managerAction",
		message: "What would you like to do today?",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
	}).then(function(task) {

		//console.log(task.managerAction);
		
		switch(task.managerAction[0]) {

			case "View Products for Sale": viewProducts();
				break;

			case "View Low Inventory": viewLowInv();
				break;

			case "Add to Inventory": addInventory();
				break;

			case "Add New Product": newProduct();
				break;
		}

		
		function viewProducts() {

			//query the database to get items to display
			connection.query("SELECT * from Products", function(err, result) {

				if (err) {
					console.log(err);
					throw err;
				}

				//loop through results to display
				for (var i = 0; i < result.length; i++) {
					console.log("Item ID: " + result[i].ItemID);
					console.log("Product: " + result[i].ProductName);
					console.log("Department Name: " + result[i].DepartmentName);
					console.log("Price (US$): " + result[i].Price);
					console.log("Stock Quantity: " + result[i].StockQuantity);
					console.log("-----------------");
				}
				
			//end of query function	
			});
		//end of viewProducts function
		}

		function viewLowInv() {

			//query the database to get items to display
			connection.query("SELECT * from Products where StockQuantity < 5", function(err, result) {

				if (err) {
					console.log(err);
					throw err;
				}

				//loop through results to display
				for (var i = 0; i < result.length; i++) {
					console.log("Item ID: " + result[i].ItemID);
					console.log("Product: " + result[i].ProductName);
					console.log("Department Name: " + result[i].DepartmentName);
					console.log("Price (US$): " + result[i].Price);
					console.log("Stock Quantity: " + result[i].StockQuantity);
					console.log("-----------------");
				}
				
			//end of query function	
			});
		//end of view low inventory function	
		}

		function addInventory() {

			inquirer.prompt([

				{
					type: "input",
					name: "addToId",
					message: "What product ID would you like to add inventory to?"
				},
				{
					type: "input",
					name: "addQuantity",
					message: "How many units would you like to add?"
				}
			]).then(function(selection) {

				//query the database to get stock of selected item
				connection.query("SELECT StockQuantity from Products where ItemID =?", selection.addToId, function(err, result) {

					if (err) {
						console.log(err);
						throw err;
					}

					//capture new total
					var updatedTotal = parseInt(result[0].StockQuantity) + parseInt(selection.addQuantity);

					var updateQuery = "UPDATE Products SET StockQuantity =" + updatedTotal + " WHERE ItemID =" + selection.addToId;

					//query to update stock in database
					connection.query(updateQuery, function(err, DbResult) {

						console.log("The stock of this item has been updated to " + updatedTotal);
					})

				//end of query function	
				});
			//end of inquirer function	
			})			
		//end of add inventory function	
		}

		function newProduct() {

			inquirer.prompt([

				{
					type: "input",
					name: "prodName",
					message: "Name of new product:"
				},
				{
					type: "input",
					name: "prodDept",
					message: "Department:"
				},
				{
					type: "input",
					name: "prodPrice",
					message: "Price:"
				},
				{
					type: "input",
					name: "prodStock",
					message: "Stock:"
				}
			]).then(function(newProd) {

				//query the database to add new item
				connection.query("INSERT INTO Products SET ?", {
					ProductName: newProd.prodName,
					DepartmentName: newProd.prodDept,
					Price: newProd.prodPrice,
					StockQuantity: newProd.prodStock
				}, function(err, result) {

					console.log("New product has been added.");

				//end of query function	
				});
			//end of inquirer function	
			})			
		//end of add new product function	
		}

	//end of inquirer function	
	})
//end of connection
})