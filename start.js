var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "EmployeeDB"
});

connection.connect(function(err) {
  if (err) throw err;
  main_menu();
});

function main_menu(){
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View All Employees by Department",
            //"View All Employees by Manager", //bonus
            "Add Employee",
            //"Remove Employee", //bonus
            "Update Employee Role",
            //"Update Employee Manager", //bonus
            "View All Roles",
            "Add Role",
            //"Remove Role", //bonus
            "View All Departments",
            "Add Department",
            //"Remove Department", //bonus
            //"View Budget by Department", //bonus
            "Exit"
        ]
    }).then(function(answer){
        switch(answer.action){
            case "View All Employees":
                view_all_employees();
                break;
            case "View All Employees by Department":
                view_all_employees_by_department();
                break;
            case "Add Employee":
                add_employee();
                break;
            case "Update Employee Role":
                update_employee_role();
                break;
            case "View All Roles":
                view_all_roles();
                break;
            case "Add Role":
                add_role();
                break;
            case "View All Departments":
                view_all_departments();
                break;
            case "Add Department":
                add_department();
                break;
            case "Exit":
                connection.end();
                break;
        }
    });
}

function view_all_employees(){
    var query = `SELECT E1.id, E1.first_name, E1.last_name, role.title, 
    role.salary, department.name AS department,
    CONCAT(E2.first_name, " ", E2.last_name) AS manager FROM role
    INNER JOIN department ON department.id = role.department_id
    INNER JOIN employee E1 ON E1.role_id = role.id
    LEFT JOIN employee E2 ON E1.manager_id = E2.id;`;
      connection.query(query, function(err, res) {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        main_menu();
    });
    
}

function view_all_employees_by_department(){
    var query_A = `SELECT name FROM department;`;

    connection.query(query_A, function(err, res) {
        if (err) throw err;

        var departments_list = []; //converting response into a list of strings, for inquirer to use
        for (var i = 0; i < res.length; i++){
            departments_list.push(res[i].name)
        }
        inquirer.prompt({
            name: "department",
            type: "list",
            message: "Which department would you like to view?",
            choices: departments_list
        }).then(function(answer){
            var query_B = `SELECT E1.id, E1.first_name, E1.last_name, role.title, 
            role.salary, department.name AS department, 
            CONCAT(E2.first_name, " ", E2.last_name) AS manager FROM role
            INNER JOIN department ON department.id = role.department_id
            INNER JOIN employee E1 ON E1.role_id = role.id
            LEFT JOIN employee E2 ON E1.manager_id = E2.id
            WHERE department.name = ?;`;
            connection.query(query_B, [answer.department], function(err, res) {
                if (err) throw err;
                console.log("\n");
                console.table(res);
                main_menu();
            });
        });
    });

    
}

function view_all_roles(){
    var query = `SELECT role.id, role.title, role.salary, department.name AS department from role
    INNER JOIN department on role.department_id = department.id;`;
      connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        main_menu();
    });
}

function view_all_departments(){
    var query = `SELECT * FROM department;`;
      connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        main_menu();
    });
}

function add_role(){
    
    var query_A = `SELECT name FROM department;`;

    connection.query(query_A, function(err, res) { //query departments and store response into list (res)
        if (err) throw err;

        var departments_list = []; //converting response into a list of strings, for inquirer to use
        for (var i = 0; i < res.length; i++){
            departments_list.push(res[i].name)
        }
        
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "What is the title of the new role?" 
            },
            {
                name: "salary_str",
                type: "input",
                message: "What is the new role's salary?" 
            },
            {
                name: "department_name",
                type: "list",
                message: "What is the new role's department?",
                choices: departments_list
            }
        ]).then(function(answer){
            var query_B = 'SELECT id FROM department WHERE name = ?';
            connection.query(query_B, [answer.department_name], function(err, res) {
                if (err) throw err;
                var dept_id = parseInt(res[0].id); //convert's user's chosen department back into an id

                var query_C = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';

                connection.query(query_C, [answer.title, parseInt(answer.salary_str), dept_id], function(err, res) {
                    if (err) throw err;
                    main_menu();
                });
            });

            
        });
    });
}

function add_department(){
    inquirer.prompt({
        name: "new_dept",
        type: "input",
        message: "What is the name of the new department?",
    }).then(function(answer){
        var query = 'INSERT INTO department (name) VALUES (?)';
        connection.query(query, [answer.new_dept], function(err, res) {
            if (err) throw err;
            main_menu();
        });
    });
}

function add_employee(){
    //ask for employee details (first_name, last_name, role_id, manager_id)
    //query role and employees for choices for role and manager respectively
    //query role and employees again to convert the choices back into id's for entry into the employee table

    var query_A = `SELECT title FROM role;`;

    connection.query(query_A, function(err, res) { //query roles and store response into list (res)
        if (err) throw err;

        var role_list = []; //converting response into a list of strings, for inquirer to use
        for (var i = 0; i < res.length; i++){
            role_list.push(res[i].title)
        }

        var query_B = `SELECT first_name, last_name FROM employee;`;

        connection.query(query_B, function(err, res) { //query employees and store response into list (res)
            if (err) throw err;
    
            var employee_list = []; //converting response into a list of strings, for inquirer to use
            for (var i = 0; i < res.length; i++){
                employee_list.push(res[i].first_name + " " + res[i].last_name);
            }
        
            inquirer.prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "What is the new employee's first name?" 
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is the new employee's last name?" 
                },
                {
                    name: "role_name",
                    type: "list",
                    message: "What is the new employee's role?",
                    choices: role_list
                },
                {
                    name: "manager_name",
                    type: "list",
                    message: "Who is the new employee's manager?",
                    choices: employee_list
                }
            ]).then(function(answer){
                var query_C = 'SELECT id FROM role WHERE title = ?;';
                connection.query(query_C, [answer.role_name], function(err, res) {
                    if (err) throw err;
                    var role_id = parseInt(res[0].id); //convert's user's chosen role back into an id

                    var manager_first = answer.manager_name.split(" ")[0];
                    var manager_last = answer.manager_name.split(" ")[1];

                    var query_D = 'SELECT id FROM employee WHERE first_name = ? AND last_name = ?;';
                    connection.query(query_D, [manager_first, manager_last], function(err, res) {
                        if (err) throw err;
                        var manager_id = parseInt(res[0].id); //convert's user's chosen manager back into an id

                        var query_E = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);';

                        connection.query(query_E, 
                            [answer.first_name, answer.last_name, role_id, manager_id], function(err, res) {
                            if (err) throw err;
                            main_menu();
                        });
                    });
                });

            });
        });
    });
}

function update_employee_role(){
    //ask for which employee to alter
    //query role for role choices
    //query role again to convert role choice back into id
    //update employee table with a query
    var query_A = `SELECT first_name, last_name FROM employee;`;

    connection.query(query_A, function(err, res) { //query employees and store response into list (res)
        if (err) throw err;

        var employee_list = []; //converting response into a list of strings, for inquirer to use
        for (var i = 0; i < res.length; i++){
            employee_list.push(res[i].first_name + " " + res[i].last_name);
        }

        inquirer.prompt([
            {
                name: "employee_name",
                type: "list",
                message: "Which employee should be updated?",
                choices: employee_list
            }
        ]).then(function(answer){
            var employee_first = answer.employee_name.split(" ")[0];
            var employee_last = answer.employee_name.split(" ")[1];

            var query_B = 'SELECT id FROM employee WHERE first_name = ? AND last_name = ?;';
            connection.query(query_B, [employee_first, employee_last], function(err, res) {
                if (err) throw err;
                var employee_id = parseInt(res[0].id); //convert's user's chosen employee back into an id

                var query_C = `SELECT title FROM role;`;

                connection.query(query_C, function(err, res) { //query roles and store response into list (res)
                    if (err) throw err;

                    var role_list = []; //converting response into a list of strings, for inquirer to use
                    for (var i = 0; i < res.length; i++){
                        role_list.push(res[i].title);
                    }

                    inquirer.prompt([
                        {
                            name: "role",
                            type: "list",
                            message: "Which role should be used?",
                            choices: role_list
                        }
                    ]).then(function(answer){
                        var query_D = 'SELECT id FROM role WHERE title = ?;';
                        connection.query(query_D, [answer.role], function(err, res) {
                            if (err) throw err;
                            var role_id = parseInt(res[0].id); //convert's user's chosen role back into an id

                            var query_E = `UPDATE employee SET role_id = ? WHERE id = ?;`;

                            connection.query(query_E, [role_id, employee_id], function(err, res) { //update employee with the new role
                                if (err) throw err;
                                main_menu();
                            });
                        });
                    });
                });
            });
        });
    });
}