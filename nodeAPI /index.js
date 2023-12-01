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
//#1 Get user info(input: userid=ssn)
//output: user firstname last name and email
app.get('/profile/:Ssn', (req, res) => {
    // Receive employeeID in the request parameters
    let employeeID = req.params.Ssn;
    // Check if employeeID is provided
    if (!employeeID) {
        res.status(400).send('Employee ID is required');
        return;
    }
    let sql = `SELECT Fname, Lname, email FROM EMPLOYEE WHERE Ssn = '${employeeID}'`;
    console.log(sql);
    conn.query(sql, (err, result) => {  
        if (err) {
            throw err;
        } else {
            res.send(result);
        }
    });
});
//#9 Get list of task from a project (input: projectID=Pno)
//output: list of tasks, their name, number, status and deadline
app.get('/tasklist/:Pno', (req, res) => {
    // Receive projectID in the request parameters
    let projectID = req.params.Pno;
    // Check if projectID is provided
    if (!projectID) {
        res.status(400).send('Project ID is required');
        return;
    }
    let sql = `SELECT Tnumber, Tname, Deadline, Tstatus FROM TASK WHERE Pno = ${projectID}`;
    console.log(sql);
    conn.query(sql, (err, result) => {  
        if (err) {
            throw err;
        } else {
            res.send(result);
        }
    });
});
//#2 Retrieve the PROJECTs information given(input:userid:ssn)
//output: list of projects, and hrs worked
app.get('/projects/:Ssn', (req, res) => {
    // Receive employerID in the request parameters
    let employeeID = req.params.Ssn;
    // Check if employeeID is provided
    if (!employeeID) {
        res.status(400).send(' employeeID is required');
        return;
    }
    let sql = "SELECT Fname AS OwnerName, Lname AS LastName, Pnumber AS ProjectID, Pname AS ProjectName, Hours AS hrsPerwk "+ 
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
//#6 retrieve the emails of all users working on a project information given(input:projectID:Pnumber)
//output: the name of the individuals and their email number
app.get('/Users/:Pnumber', (req, res) => {
    // Receive projectID in the request parameters
    let projectID = req.params.Pnumber;
    // Check if employeeID is provided
    if (!projectID) {
        res.status(400).send(' projectID is required');
        return;
    }
    let sql = "SELECT Fname AS Name, Lname AS LastName, email AS emailOfUser "+ 
    "FROM PROJECT AS P, EMPLOYEE AS E, WORKS_ON AS W " +
    `WHERE E.Ssn= W.Essn AND W.Pno = P.Pnumber AND P.Pnumber = '${projectID}'`;
    conn.query(sql, (err, result) => {  
        if (err) {
            throw err;
        } else {
            res.send(result);
        }
    });
});
//#3 Put new employee in the data base
//output: success
app.post('/newEmployee', (req,res)=>{
    const data = req.body;
    let sql = "INSERT INTO EMPLOYEE SET ?"
    conn.query(sql, data, (err,result)=>{
        if(err){
            throw err;
        }else{
            //res.send(result);
            res.send("new employee successully added")
        }
    });  
});
//#4 Put new project in the data base
//output: success
app.post('/newProject', (req,res)=>{
    const data = req.body;
    let sql = "INSERT INTO PROJECT SET ?" 
    conn.query(sql, data, (err,result)=>{
        if(err){
            throw err;
        }else{
            //res.send(result);
            res.send("new project successully added")
        }
    });  
});
//#10 Put new task in the data base
app.post('/newTask', (req,res)=>{
    const data = req.body;
    let sql = "INSERT INTO TASK SET ?" 
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
app.post('/employeeID/', (req,res)=>{   
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

//#7 Add user to project (input: project id, user email)
//output: success
// NEEDS TO BE DONE
//#8 Remove user from project (input: project id, 
//user email; output: confirmation message
//NEEDS TO BE DONE

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
//#12 Set status on a task given a project number
//input: task number and status
//output: success
app.put('/taskstatus/:Pno',(req,res)=>{
    //console.log(req.params.Ssn);
    //let  taskID= req.body.Tnumber;
    let projectID = req.params.Pno;
    //let status = req.body.Tstatus;
    if (!projectID) {
        res.status(400).send('project for task to delete is required');
        return;
    }    
    const data = [req.body.Tstatus, req.body.Tnumber, req.params.Pno];
    let sql = `UPDATE TASK SET Tstatus = ? WHERE Tnumber = ? AND Pno = ${projectID}`;
    conn.query(sql, data, (err,result)=>{
        if(err){
            throw err;
        }else{
            res.send("Status successfully changed");
        }
    });  
});
//delete an employee input:ssn
//output: success 
app.delete('/profile/:Ssn',(req,res)=>{
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
//#5 Delete a project input:project id
//output:confirmation of deletion
app.delete('/project/:Pnumber',(req,res)=>{
    let projectID = req.params.Pnumber
    console.log(projectID)
    if (!projectID) {
        res.status(400).send('Project number/Id is required');
        return;
    }
    let sql = `DELETE from PROJECT WHERE Pnumber = '${projectID}'`;
    conn.query(sql, (err,result)=>{
        if(err){
            res.send('You have the following error')
            throw err;
        }else{
            //res.send(result);
            res.send(`project has been deleted`);
        }
    });  
});
//#11 Delete a task (input:project id and task id)
//output:confirmation of deletion
app.delete('/deletetask/',(req,res)=>{
    //let taskID = req.params.Tnumber
    let  taskID= req.body.Tnumber;
    let projectID = req.body.Pno;
    console.log(projectID)
    if (!projectID || !taskID) {
        res.status(400).send('Project and task number/Id is required');
        return;
    }
    let sql = `DELETE from TASK WHERE Pno= '${projectID}' AND Tnumber ='${taskID}'`;
    conn.query(sql, (err,result)=>{
        if(err){
            res.send('You have the following error')
            throw err;
        }else{
            //res.send(result);
            res.send(`the task has been deleted`);
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