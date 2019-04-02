	var express = require('express'); 
    var app = express(); 
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var xlstojson = require("xls-to-json-lc");
    var xlsxtojson = require("xlsx-to-json-lc");
	var alert = require("alert-node");
    

    app.use(bodyParser.json());  

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });

    var upload = multer({ //multer settings
                    storage: storage,
                    fileFilter : function(req, file, callback) { //file filter
                        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                            return callback(new Error('Wrong extension type'));
                        }
                        callback(null, true);
                    }
                }).single('file');

    /** API path that will upload the files */
    app.post('/upload', function(req, res) {
		const oracledb = require('oracledb');
        var exceltojson;
		var global;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            console.log(req.file.path);
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    } 			
					run(result)
					var response = {
						status  : 200,
						success : 'Updated Successfully'
					}

					res.end(JSON.stringify(response));
                    //res.json({error_code:0,err_desc:null, data: result});
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })
		
		async function run(req) {
			let connection;
			try {
				connection = await oracledb.getConnection(
					{user: 'NODE', password: 'NODE', connectString: 'localhost/node'});
					
					await connection.execute(
					  'DELETE FROM products', []
					);
					
					sql = "INSERT INTO products VALUES (:seq, :serial_no, :product_name, :qty, :price)";
					data = req;
					/*data = [ { seq: 1, serial_no: 1, product_name: "my apple fruit", qty: 20, price: 3000 }, 
							 { seq: 2, serial_no: 2, product_name: "my mango fruit", qty: 30, price: 5000 } ];*/
					options = { autoCommit: true,
					bindDefs: {
						seq: { type: oracledb.STRING, maxSize: 4000 },
						serial_no: { type: oracledb.STRING, maxSize: 4000 }, 
						product_name: { type: oracledb.STRING, maxSize: 4000 },
						qty: { type: oracledb.STRING, maxSize: 4000 },
						price: { type: oracledb.STRING, maxSize: 4000 } } };
					result = await connection.executeMany(sql, data, options);
					global = result;
					/*console.log(result);*/

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
       
    });
	
	app.get('/',function(req,res){
		res.sendFile(__dirname + "/index.html");
	});

    app.listen('3000', function(){
        console.log('running on 3000...');
    });