/* Enter an EMPLOYEE SSn and retrieve a list of projects 
names/hours per week that the EMPLOYEE work on.
*/

SELECT Pname AS ProjectName, Hours AS hrsPerwk 
    FROM PROJECT AS P, EMPLOYEE AS E, WORKS_ON AS W
    WHERE E.Ssn= W.Essn AND W.Pno = P.Pnumber AND E.Ssn = 122344668;
    
/* Enter Employee ID  and get all user information*/

SELECT * FROM EMPLOYEE where Ssn = 122344668;

/* Create a new project*/

/* Add users to project */

/* Remove users from projects */

