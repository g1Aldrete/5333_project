const conn = require('./connection');
const express = require('express');
const upload = require('express-fileupload');
//let MW = require('./middleware');
const app = express();
//const route = express.Router();

app.use(express.json());
app.use(upload());

//A. Select all the information from the Employee table
app.get('/employees',(req, res, next) => { 
    let sql = "SELECT * FROM EMPLOYEE";
    conn.query(sql, (err,result)=>{
        if(err){
            return next(err);
        }else{
            res.send(result);
        }
    });
});


//B. Select all the information from the Project table
app.get('/projects',(req, res, next) => { 
    let sql = "SELECT * FROM PROJECT";
    conn.query(sql, (err,result)=>{
        if(err){
            return next(err);
        }else{
            res.send(result);
        }
    });
});

//C. Get project number given project name
//note: if info enter as url then req.params.xx
app.post('/newProject/:Pname', (req, res, next) => {
    let projName= req.params.Pname;
    if (!projName) {
        res.status(400).send('Project name is required');
        return;
    }
 //   let sql = "SELECT Pnumber FROM PROJECT WHERE Pname = '${projName}'`;  - less secure
	let sql = "SELECT Pnumber FROM PROJECT WHERE Pname = ?";
    console.log(sql);
	conn.query(sql, [projName], (err, result) => {
 //   conn.query(sql, (err, result)=>{   - less secure
        if(err){
            return next(err);
        }else{
            res.send(result);
            //takes project number from json object
            let pNum = result[0].Pnumber;
            console.log(pNum);
        } 
    });
});

//D. Get Employee ID given first and last name 
//note: if info enter as json object then req.body.xxx   
app.post('/newProjectUser/', (req, res, next) => {   
    let UserFn = req.body.Fname;
    let UserLn = req.body.Lname;
//    let sql = `SELECT Ssn FROM EMPLOYEE WHERE Fname = '${UserFn}' AND Lname = '${UserLn}'`; - less secure
    let sql = "SELECT Ssn FROM EMPLOYEE WHERE Fname = ? AND Lname = ?";
	console.log(sql);
//    conn.query(sql, (err,result)=>{  - less secure	
	conn.query(sql, [UserFn , UserLn](err,result)=>{
        if(err){
            return next(err);
        }else{
            res.send(result);
            let employeeID = result[0].Ssn;
            console.log(employeeID);
        }
    }); 
});

//E. update Employee Table Informantion based on employee id
app.put('/profile/:Ssn',(req, res, next) => {
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
            return next(err);
        }else{
            res.send(result);
        }
    });  
});

//F. 

//Clay's Requested Routes

//1. Retrieve the information of an employee given ID
app.get('/profile/:Ssn', (req, res, next) => {
    // Receive employeeID in the request parameters
    let employeeID = req.params.Ssn;
    // Check if employeeID is provided
    if (!employeeID) {
        res.status(400).send('Employee ID is required');
        return;
    }
    //let sql = `SELECT Fname, Lname, email FROM EMPLOYEE WHERE Ssn = '${employeeID}'`;   - apparently less secure
    let sql = "SELECT Fname, Lname, email FROM EMPLOYEE WHERE Ssn = ?";
	console.log(sql);
	conn.query(sql, [userSsn], (err, result) => {
    //conn.query(sql, (err, result) => {  - apparently less secure
        if (err) {
            return next(err);
        } else {
            res.send(result);
        }
    });
});

//2. Retrieve the PROJECTs information given an employee ID

/* ORIGINAL CODE SEGMENT:

app.get('/projects/:Ssn', (req, res, next) => {
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
            return next(err);
        } else {
            res.send(result);
        }
    });
});
*/

//suggested change: app.get('/user/projects/:Ssn', (req, res, next) => {
app.get('/projects/:Ssn', (req, res, next) => {
    let employeeID = req.params.Ssn;
    if (!employeeID) {
        res.status(400).send('User SSN is required');
        return;
    }

    let sql = "SELECT P.Pnumber, P.Pname, E.Fname AS CreatorFirstName, E.Lname AS CreatorLastName, P.Plocation " +
              "FROM PROJECT AS P " +
              "JOIN EMPLOYEE AS E ON P.Dnum = E.Dno " +
              "WHERE E.Ssn = ?";
    conn.query(sql, [employeeID], (err, result) => {
        if (err) {
            return next(err);
        } else {
            res.send(result);
        }
    });
});

// 3. Add new user (input: user id, user first name, user last name, user email; output: confirmation message)
/* ORIGINAL CODE SEGMENT:

//Put new employee in the data base
app.post('/newEmployee', (req, res, next) => {
    const data = req.body;
    let sql = "INSERT INTO EMPLOYEE SET ?" 
    conn.query(sql, data, (err,result)=>{
        if(err){
            return next(err);
        }else{
            res.send(result);
        }
    });  
});
*/

app.post('/newEmployee', (req, res, next) => {
    const { Ssn, Fname, Minit, Lname, Bdate, Address, email, Cphone, Sex, Super_ssn, Dno } = req.body;
    if (!Ssn || !Fname || !Lname || !email || !Dno) {
        res.status(400).send('User ID, first name, last name, email, and department number are required');
        return;
    }

    let sql = "INSERT INTO EMPLOYEE (Ssn, Fname, Minit, Lname, Bdate, Address, email, Cphone, Sex, Super_ssn, Dno) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    conn.query(sql, [Ssn, Fname, Minit, Lname, Bdate, Address, email, Cphone, Sex, Super_ssn, Dno], (err, result) => {
        if (err) {
            return next(err);
        } else {
            res.send('New user added successfully.');
        }
    });
});

// 4. Add new project (input: project name, project creator first name, project creator last name, project description; output: confirmation message)
/* ORIGINAL:
*/
//Put new project in the data base
app.post('/newProject', (req, res, next) => {
    const data = req.body;
    let sql = "INSERT INTO PROJECT SET ?" 
    conn.query(sql, data, (err,result)=>{
        if(err){
            return next(err);
        }else{
            res.send(result);
        }
    });  
});
/* ISSUE WITH REQUESTED DATA AND THE SCHEMA - RESOLVE WITH TEAM

PLACEHOLDER FOR CODE
*/

// 5. Delete project (input: project id; output: confirmation message)
app.delete('/project/:Pnumber', (req, res, next) => {
    let projectID = req.params.Pnumber;
    if (!projectID) {
        res.status(400).send('Project ID is required');
        return;
    }

    let sql = "DELETE FROM PROJECT WHERE Pnumber = ?";
    conn.query(sql, [projectID], (err, result) => {
        if (err) {
            return next(err);
        } else {
            res.send('Project deleted successfully.');
        }
    });
});

// 6. Get users working on project (input: project id; output: emails of all users on that project)
app.get('/project/employees/:Pnumber', (req, res, next) => {
    let projectID = req.params.Pnumber;
    if (!projectID) {
        res.status(400).send('Project ID is required');
        return;
    }
    let sql = "SELECT E.email FROM EMPLOYEE AS E, WORKS_ON AS W " +
              "WHERE E.Ssn = W.Essn AND W.Pno = ?";
    conn.query(sql, [projectID], (err, result) => {
        if (err) {
            return next(err);
        } else {
            res.send(result);
        }
    });
});

// 7. Add user to project (input: project id, user email; output: confirmation message)
app.post('/project/addEmployee', (req, res, next) => {
    const { Pnumber, empEmail } = req.body;
    if (!Pnumber || !empEmail) {
        res.status(400).send('Project ID and Employee email are required');
        return;
    }

    // Fetch the user's name for the confirmation message
    let fetchEmpNameSQL = "SELECT Fname, Lname FROM EMPLOYEE WHERE email = ?";
    conn.query(fetchEmpNameSQL, [empEmail], (err, empNameResult) => {
        if (err) {
            return next(err);
        }

        // Insert the user into the project
        let addEmpToProjectSQL = "INSERT INTO WORKS_ON (Essn, Pno) " +
            "SELECT Ssn, ? FROM EMPLOYEE WHERE email = ?";
        conn.query(addEmpToProjectSQL, [Pnumber, empEmail], (err, result) => {
            if (err) {
                return next(err);
            } else {
                // Send confirmation message with the user's name
                const empName = `${empNameResult[0].Fname} ${empNameResult[0].Lname}`;
                res.send(`Employee ${empName} added to project.`);
            }
        });
    });
});

//8. Remove user from project (input: project id, user email; output: confirmation message)
app.delete('/project/removeEmp', (req, res, next) => {
    const { Pnumber, empEmail } = req.body;
    if (!Pnumber || !empEmail) {
        res.status(400).send('Project ID and Employee email are required');
        return;
    }

    // Fetch the user's name for the confirmation message
    let fetchEmpNameSQL = "SELECT Fname, Lname FROM EMPLOYEE WHERE email = ?";
    conn.query(fetchEmpNameSQL, [empEmail], (err, empNameResult) => {
        if (err) {
            return next(err);
        }

        // Delete the user from the project
        let removeEmpFromProjectSQL = "DELETE FROM WORKS_ON WHERE Pno = ? AND Essn IN (SELECT Ssn FROM EMPLOYEE WHERE email = ?)";
        conn.query(removeEmpFromProjectSQL, [Pnumber, empEmail], (err, result) => {
            if (err) {
                return next(err);
            } else {
                // Send confirmation message with the user's name
                const empName = `${empNameResult[0].Fname} ${empNameResult[0].Lname}`;
                res.send(`User ${empName} removed from project.`);
            }
        });
    });
});

//9. Get tasks from project id (input: project id; output: list of all task ids, names, deadlines, and states):
app.get('/project/tasks/:Pnumber', (req, res, next) => {
    let projectID = req.params.Pnumber;
    if (!projectID) {
        res.status(400).send('Project ID is required');
        return;
    }

    let sql = "SELECT Tnumber, Tname, Deadline, Tstatus FROM TASK WHERE Pno = ?";
    conn.query(sql, [projectID], (err, result) => {
        if (err) {
            return next(err);
        } else {
            res.send(result);
        }
    });
});

//10. A. 
//Add task (input: task name, task deadline; output: confirmation message)
//Added User SSN as required input as it is can't be NULL currently
//Added Tstatus as it is NOT NULL in the schema
app.post('/newTask', (req, res, next) => {
    const { Tname, Deadline, Tssn , Tstatus} = req.body;

    // Validate required fields
    if (!Tname || !Deadline || !Tssn || !Tstatus ) {
        res.status(400).send('Task name, task deadline, and user SSN are required');
        return;
    }
    // Insert the new task
    let sql = "INSERT INTO TASK (Tname, Deadline, Tssn, Tstatus) VALUES (?, ?, ?)";
    conn.query(sql, [Tname, Deadline, Tssn, Tstatus], (err, result) => {
        if (err) {
            return next(err);
        } else {
            res.send('New task added successfully.');
        }
    });
});

// 11. Remove task (input: task id; output: confirmation message)
app.delete('/task/:Tnumber', (req, res, next) => {
    let taskNumber = req.params.Tnumber;
    if (!taskNumber) {
        res.status(400).send('Task ID is required');
        return;
    }

    let sql = "DELETE FROM TASK WHERE Tnumber = ?";
    conn.query(sql, [taskNumber], (err, result) => {
        if (err) {
            return next(err);
        } else {
            res.send('Task deleted successfully.');
        }
    });
});

// 12. Set task state (input: task id, task state; output: confirmation message)
app.put('/task/state/:Tnumber', (req, res, next) => {
    const taskNumber = req.params.Tnumber;
    const { Tstatus } = req.body;

    if (!taskNumber || !Tstatus) {
        res.status(400).send('Task ID and task status are required');
        return;
    }

    let sql = "UPDATE TASK SET Tstatus = ? WHERE Tnumber = ?";
    conn.query(sql, [Tstatus, taskNumber], (err, result) => {
        if (err) {
            return next(err);
        } else {
            res.send('Task state updated successfully.');
        }
    });
});

//Deletion Routes

app.delete('/profile/:Ssn',(req, res, next) => {
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
            return next(err);
        }else{
            res.send(result);
        }
    });  
});

//File Routes

app.get('/file_upload',(req, res, next) => {
    res.sendFile(__dirname+'/index.html');
 });

app.post('/file_upload',(req, res, next) => {
    if(req.files){
        let file = req.files.file;
        let filename = file.name;
        //console.log(filename);
        file.mv('./uploads/' + filename, (err)=>{
            if(err){
                return next(err);
            }else{
                res.send("File Uploaded");
            }
        });
    };
 });
 
 //Global Error Handler
 app.use((err, req, res, next) => {
    // Handle the error
    console.error(err);
    res.status(500).send('Internal Server Error');
});
app.listen(4000);
