const mysql = require('mysql');
//create conneciton to mysql 
const conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Cse1320c',
  database: 'Company'
});
conn.connect((err)=>{
    if(err){
        console.log("connection not successful");
    }else{
        console.log("connection successful to MySQL"); 
    }
});

module.exports = conn;