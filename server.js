// get the client
const mysql = require('mysql2');
const inquirer = require('inquirer');


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

const menu = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'what would you like to do?',
            choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role", "exit"]
        }
    ])
        .then(userChoice => {
            switch (userChoice.menu) {
                case "view all departments":
                    viewDepartments()
                    break;

                case "view all roles":
                    viewRoles()
                    break;

                case "view all employees":
                    viewEmployees()
                    break;

                case "add a department":
                    getDepName()
                    break;

                case "add a role":
                    addIntern()
                    break;

                case "add an employee":
                    addIntern()
                    break;

                case "update an employee role":
                    addIntern()
                    break;

                case "exit":
                    connection.end()
                    break;


                default:
                    makePage(data)
            }
        })

}

const viewDepartments = () => {

    const query = connection.query(
        `SELECT * FROM department`, [], (error, result) => {
            if (error) throw error;
            console.table(result)
        }
    )

    menu()
}

const viewRoles = () => {

    const query = connection.query(
        `SELECT * FROM role`, [], (error, result) => {
            if (error) throw error;
            console.table(result)
        }
    )

    menu()

}

const viewEmployees = () => {

    const query = connection.query(
        `SELECT * FROM employee`, [], (error, result) => {
            if (error) throw error;
            console.table(result)
        }
    )

    menu()

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

