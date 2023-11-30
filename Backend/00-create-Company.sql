/*  
    Gabriela Aldrete  1001712206  CSE 5333
    TEAM 3
    Source code of SQL CREATE statements used to create the 
    tables for the Company Database.
*/

CREATE SCHEMA IF NOT EXISTS Company;
USE Company;

-- create table for EMPLOYEE
CREATE TABLE IF NOT EXISTS EMPLOYEE ( 
    Ssn CHAR(9) NOT NULL,
    Fname VARCHAR(15) NOT NULL,
    Minit CHAR,
    Lname VARCHAR(15) NOT NULL,
    Bdate DATE,
    Address VARCHAR(30),
    email VARCHAR(50) NOT NULL,
    Cphone VARCHAR(13), 
    Sex CHAR,
    Super_ssn CHAR(9),
    Dno INT NOT NULL,
    PRIMARY KEY(Ssn)
);

-- create table for DEPARTMENT
CREATE TABLE IF NOT EXISTS DEPARTMENT (
    Dname VARCHAR(15) NOT NULL,
    Dnumber INT NOT NULL,
    Mgr_ssn CHAR(9) NOT NULL,
    PRIMARY KEY (Dnumber),
    UNIQUE (Dname),
    FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn) ON DELETE CASCADE
);

-- Ccreate table for DEP_LOCATIONS
CREATE TABLE IF NOT EXISTS DEP_LOCATIONS (
    Dnumber INT NOT NULL,
    Dlocation VARCHAR(15) NOT NULL,
    PRIMARY KEY (Dnumber, Dlocation),
    FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber)
);

-- create table for PROJECT
CREATE TABLE IF NOT EXISTS PROJECT (
    Pname VARCHAR(15) NOT NULL,
    Pnumber INT NOT NULL,
    Plocation VARCHAR(15),
    Pstart_date DATE,
    Dnum INT NOT NULL,
    PRIMARY KEY(Pnumber),
    UNIQUE(Pname),
    FOREIGN KEY(Dnum) REFERENCES DEPARTMENT(Dnumber)
);

-- create table for WORK_ON
CREATE TABLE IF NOT EXISTS WORKS_ON (
    Essn CHAR(9) NOT NULL,
    Pno INT NOT NULL,
    Hours DECIMAL(3,1) NOT NULL,
    PRIMARY KEY (Essn, Pno),
    FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn) ON DELETE CASCADE,
    FOREIGN KEY (Pno) REFERENCES PROJECT(Pnumber)
);