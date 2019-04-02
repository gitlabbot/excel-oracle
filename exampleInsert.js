const oracledb = require('oracledb');

async function run() {
	let connection;
	try {
		connection = await oracledb.getConnection(
			{user: 'NODE', password: 'NODE', connectString: 'localhost/node'});
			
			sql = "INSERT INTO products VALUES (:seq, :serial_no, :product_name, :qty, :price)";
			data = [ { seq: 1, serial_no: 1, product_name: "my apple fruit", qty: 20, price: 3000 }, 
			         { seq: 2, serial_no: 2, product_name: "my mango fruit", qty: 30, price: 5000 } ];
			options = { autoCommit: true,
			bindDefs: {
				seq: { type: oracledb.NUMBER },
				serial_no: { type: oracledb.NUMBER }, 
				product_name: { type: oracledb.STRING, maxSize: 25 },
				qty: { type: oracledb.NUMBER },
				price: { type: oracledb.NUMBER } } };
			result = await connection.executeMany(sql, data, options);
			console.log(result);

			} catch (err) {
			console.error(err);
			} finally {
			if (connection) {
			try {
			await connection.close();
			} catch (err) {
			console.error(rr);
		}
		}
	}
}

run();