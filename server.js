// get the client
const mysql = require('mysql2');
const inquirer = require('inquirer');
// const viewAll = require('./utils/Query')


// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'nextS+3p',
    database: 'employeesDB'
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');
    menu();
});

//function to view full table
const viewAll = (table) => {

    connection.query(
        `SELECT * FROM ${table}`, [], (error, result) => {
            if (error) throw error;
            console.log("-----------------");
            console.table(result)
        }
    )
    menu()
}

const addData = () =>{

    
}

const menu = () => {
    inquirer.prompt([
        {
            type: 'rawlist',
            name: 'action',
            message: 'what would you like to do?',
            choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role", "exit"]
        }
    ])
        .then(userChoice => {
            switch (userChoice.action) {
                case "view all departments":
                    viewAll("department")
                    break;

                case "view all roles":
                    viewAll("role");
                    break;

                case "view all employees":
                    viewAll("employee");
                    break;

                case "add a department":
                    getDepName()
                    break;

                case "add a role":
                    addRole()
                    break;

                case "add an employee":
                    addEmployee()
                    break;

                case "update an employee role":
                    updateRole()
                    break;

                case "exit":
                    connection.end()
                    break;


                // default:
                //     makePage(data)
            }
        })

}

const getDepName = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'depName',
            message: 'what department would you like to add?'
        }
    ])
        .then(answer => {
            const params = answer.depName
            
            const query = connection.query(
                `INSERT INTO department (name) VALUES ('${answer.depName}')`, [], (error, result) => {
                    console.log("depNAme variable " + answer.depName, "params "+params);
                    if (error) throw error;
                    console.table(result)
                }
            )
           

            menu()
        })
}

const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'what role would you like to add?'
        }
    ])
        .then(answer => {
            const params = answer.depName
            
            const query = connection.query(
                `INSERT INTO role (title) VALUES ('${answer.roleName}')`, [], (error, result) => {
                    console.log("depNAme variable " + answer.roleName, "params "+params);
                    if (error) throw error;
                    console.table(result)
                }
            )
           

            menu()
        })
}
//make blanket add function then plug in diff queries, tables etc.!!
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "what is employee's first name?"
        },
        {
            type: 'input',
            name: 'lastName',
            message: "what is employee's last name?"
        }
    ])
        .then(answer => {
            const params = answer.depName
            
            const query = connection.query(
                `INSERT INTO employee (first_name, last_name) VALUES ('${answer.firstName}', '${answer.lastName}')`, [], (error, result) => {
                    console.log("depNAme variable " + answer.employeeName, "params "+params);
                    if (error) throw error;
                    
                    
                    console.table(result)
                }
            )
           

            menu()
        })
}

const updateRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "what is employee's first and last name?"
        },
        {
            type: 'input',
            name: 'role',
            message: "what is the updated role?"
        }
    ])
        .then(answer => {
            const params = answer.depName

            const newRoleId =connection.query(
                `SELECT FROM role WHERE title = ${answer.role}`
            )
            
            const query = connection.query(
                `UPDATE employee SET ? WHERE ?`, [{role_id: newRoleId}, {first_name: answer.name[0]}], (error, result) => {
                    console.log("depNAme variable " + answer.employeeName, "params "+params);
                    if (error) throw error;
                    console.table(result)
                }
            )
           

            menu()
        })
}