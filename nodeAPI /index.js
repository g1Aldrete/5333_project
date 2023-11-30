const conn = require('./connection');
const express = require('express');
const upload = require('express-fileupload');
//let MW = require('./middleware');
const app = express();
//const route = express.Router();

app.use(express.json());
app.use(upload());

//select all the information from the Employee table
app.get('/employees',(req,res)=>{ 
    let sql = "SELECT * FROM EMPLOYEE";
    conn.query(sql, (err,result)=>{
        if(err){
            throw err;
        }else{
            res.send(result);
        }
    });
});
//select all the information from the Project table
app.get('/projects',(req,res)=>{ 
    let sql = "SELECT * FROM PROJECT";
    conn.query(sql, (err,result)=>{
        if(err){
            throw err;
        }else{
            res.send(result);
        }
    });
});
//retrieve the information of an employee given ID
app.get('/profile/:Ssn', (req, res) => {
    // Receive employeeID in the request parameters
    let employeeID = req.params.Ssn;
    // Check if employeeID is provided
    if (!employeeID) {
        res.status(400).send('Employee ID is required');
        return;
    }
    let sql = `SELECT * FROM EMPLOYEE WHERE Ssn = '${employeeID}'`;
    console.log(sql);
    conn.query(sql, (err, result) => {  
        if (err) {
            throw err;
        } else {
            res.send(result);
        }
    });
});
//retrieve the PROJECTs information given an employee ID
app.get('/projects/:Ssn', (req, res) => {
    // Receive employerID in the request parameters
    let employeeID = req.params.Ssn;
    // Check if employeeID is provided
    if (!employeeID) {
        res.status(400).send(' employeeID is required');
        return;
    }
    let sql = "SELECT Pname AS ProjectName, Hours AS hrsPerwk "+ 
    "FROM PROJECT AS P, EMPLOYEE AS E, WORKS_ON AS W " +
    `WHERE E.Ssn= W.Essn AND W.Pno = P.Pnumber AND E.Ssn = '${employeeID}'`;
    conn.query(sql, (err, result) => {  
        if (err) {
            throw err;
        } else {
            res.send(result);
        }
    });
});

//Put new employee in the data base
app.post('/newEmployee', (req,res)=>{
    const data = req.body;
    let sql = "INSERT INTO EMPLOYEE SET ?" 
    conn.query(sql, data, (err,result)=>{
        if(err){
            throw err;
        }else{
            res.send(result);
        }
    });  
});
//Put new project in the data base
app.post('/newProject', (req,res)=>{
    const data = req.body;
    let sql = "INSERT INTO PROJECT SET ?" 
    conn.query(sql, data, (err,result)=>{
        if(err){
            throw err;
        }else{
            res.send(result);
        }
    });  
});
//Get project number given project name
//note: if info enter as url then req.params.xx
app.post('/newProject/:Pname', (req,res)=>{
    let projName= req.params.Pname;
    if (!projName) {
        res.status(400).send(' project name is required');
        return;
    }
    let sql = `SELECT Pnumber FROM PROJECT WHERE Pname = '${projName}'`;
    console.log(sql);
    conn.query(sql, (err, result)=>{
        if(err){
            throw err;
        }else{
            res.send(result);
            //takes project number from json object
            let pNum = result[0].Pnumber;
            console.log(pNum);
        } 
    });
});
//Get Employee ID given first and last name 
//note: if info enter as json object then req.body.xxx   
app.post('/newProjectUser/', (req,res)=>{   
    let UserFn = req.body.Fname;
    let UserLn = req.body.Lname;
    let sql = `SELECT Ssn FROM EMPLOYEE WHERE Fname = '${UserFn}' AND Lname = '${UserLn}'`;
    console.log(sql);
    conn.query(sql, (err,result)=>{
        if(err){
            throw err;
        }else{
            res.send(result);
            let employeeID = result[0].Ssn;
            console.log(employeeID);
        }
    }); 
});

//update Employee Table Informantion based on employee id
app.put('/profile/:Ssn',(req,res)=>{
    //console.log(req.params.Ssn);
    let employeeID = req.params.Ssn
    if (!employeeID) {
        res.status(400).send('Employee ID is required');
        return;
    }    
    const data = [req.body.Address, req.body.email, req.body.Cphone, req.params.Ssn];
    let sql = `UPDATE EMPLOYEE SET Address =?, email =?, Cphone =? WHERE Ssn = '${employeeID}'`;
    conn.query(sql, data, (err,result)=>{
        if(err){
            throw err;
        }else{
            res.send(result);
        }
    });  
});

app.delete('/profile/:Ssn',(req,res)=>{
    //delete the information of an employee from employee table
    let employeeID = req.params.Ssn
    console.log(employeeID)
    if (!employeeID) {
        res.status(400).send('Employee ID is required');
        return;
    }
    let sql = `DELETE from EMPLOYEE WHERE Ssn = '${employeeID}'`;
    conn.query(sql, (err,result)=>{
        if(err){
            res.send('You have the following error')
            throw err;
        }else{
            res.send(result);
        }
    });  
});

app.get('/file_upload',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
 });

app.post('/file_upload',(req,res)=>{
    if(req.files){
        let file = req.files.file;
        let filename = file.name;
        //console.log(filename);
        file.mv('./uploads/' + filename, (err)=>{
            if(err){
                throw err;
            }else{
                res.send("File Uploaded");
            }
        });
    };
 });
app.listen(4000);