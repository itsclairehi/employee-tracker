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

const viewAll = (query) => {

    connection.query(
        query, [], (error, result) => {
            if (error) throw error;
            console.log("-----------------");
            console.table(result)
        }
    )
    menu()
}

// const addData = (table, params) => {
//     inquirer.prompt([
//         {
//             type: 'input',
//             name: 'newData',
//             message: `what ${table} would you like to add?`
//         }
//     ])
//         .then(answer => {

//             // allParams = [params,answer.newData]

//             const query = connection.query(
//                 `INSERT INTO ${table} SET ?`, `{ ${params}: ${answer.newData} } `, (error, result) => {

//                     if (error) throw error;
//                     // console.table(result)
//                     menu()
//                 }
//             )
//         })

// }

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
                    query = "SELECT * FROM department"
                    viewAll(query)
                    break;

                case "view all roles":
                    query = "SELECT * FROM role JOIN department ON department.id = role.department_id "
                    viewAll(query);
                    // viewRoles()
                    break;

                case "view all employees":
                    query = "SELECT * FROM employee LEFT JOIN role ON role.id = employee.role_id"
                    viewAll(query);
                    break;

                case "add a department":
                    getDepName()
                    // addData("department", 'name' )
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
            connection.query(
                "INSERT INTO department SET ? ", { name: answer.depName }, (error, result) => {

                    if (error) throw error;
                    console.log(answer.depName + " added to departments!")
                    menu()
                }
            )
        })
}

const addRole = () => {
    connection.query("SELECT department.name, department.id FROM department", function (err, depResult) {


        inquirer.prompt([
            {
                type: 'input',
                name: 'roleName',
                message: 'what role would you like to add?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'what is the salary?'
            },
            {
                type: 'list',
                name: 'department',
                message: 'what is the department?',
                choices: depResult.map((department) => {
                    return {
                        name: department.name,
                        value: department.id
                    }
                })
            }
        ])
            .then(answer => {

                const query = connection.query(
                    "INSERT INTO role SET ? ",
                    {
                        title: answer.roleName,
                        salary: answer.salary,
                        department_id: answer.department

                    },
                    (error, result) => {
                        if (error) throw error;
                        console.log("added new department!")
                        menu()
                    }
                )
            })
    })
}

const addEmployee = () => {
    connection.query("SELECT role.title, role.id FROM role", function (err, roleResult) {



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
            },
            {
                type: 'list',
                name: 'role',
                message: "what is employee's role?",
                choices: roleResult.map((role) => {
                    return {
                        name: role.title,
                        value: role.id
                    }
                })
            }
        ])
            .then(answer => {

                connection.query(
                    "INSERT INTO employee SET ? ",
                    {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        role_id: answer.role
                    },
                    (error, result) => {
                        if (error) throw error;
                        console.log(`
                        -------------------
                          added employee!
                        -------------------
                        `);

                        menu()
                    }
                )
            })
    })
}

const updateRole = () => {
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
        },
        {
            type: 'input',
            name: 'role',
            message: "what is the updated role?"
        }
    ])
        .then(answer => {
            const params = answer.depName

            const newRoleId = connection.query(
                `SELECT FROM role WHERE title = ${answer.role}`
            )

            const query = connection.query(
                `UPDATE employee SET ? WHERE ?`, [{ role_id: newRoleId }, { first_name: answer.name[0] }], (error, result) => {
                    console.log("depNAme variable " + answer.employeeName, "params " + params);
                    if (error) throw error;
                    console.table(result)
                }
            )


            menu()
        })
}