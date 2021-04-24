const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'employee_trackerDB',
});

connection.connect((err) => {
    if (err) throw err;
    menu();
});

const menu = () => {
    inquirer
        .prompt([
            {
                name:'options',
                type:'list',
                message:'What would you like to do?',
                choices: ['View Employees', 'View Employees by departments', 'View Employees by Manager', 'Add Employee', 'View Roles', 'Add Department', 'Add role', 'View Departments']
            },
        ])
        .then((answer) => {
            console.log(answer.options);
            switch (answer.options) {
                case 'View Employees':
                    viewEmployees();
                    break;
                
                case 'View Employees by Departments':
                    viewDepartment();
                    break;

                case 'View Employees by Manager':
                    viewManager();
                    break;
                    
                case 'Add Employee':
                    addEmployees();
                    break;
                    
                case 'View Roles':
                    viewRoles();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;

                case 'Add Role':
                    addRole();
                    break;
                
                case 'View Departments':
                    viewDepartments();
                    break;
                
            }
        });
};

const viewEmployees = () => {
    console.log('Retrieving all Employees...');
    connection.query('SELECT * FROM employee', (err, data) => {
        if(err) throw err;
        console.table(data);
        menu();

    });
};

const viewDepartments = () => {
    console.log('Retrieving all Departments...');
    connection.query('SELECT name FROM department', (err, data) => {
        if(err) throw err;
        console.table(data);
        menu();
        
    });
};

const viewRoles = () => {
    console.log('Retrieving all Roles...');
    connection.query('SELECT title, salary FROM role', (err, data) => {
        if(err) throw err;
        console.table(data);
        menu();

    });
};

const addEmployees = () => {
    inquirer
        .prompt([
            {
                name: 'first',
                type: 'input',
                message: 'What is your new employees first name?'
            },
            {
                name: 'last',
                type: 'input',
                message: 'What is your new employees last name?'
            },
            {
                name: 'roleId',
                type: 'input',
                message: 'What is your new employees role id?'
            },
            {
                name: 'managerId',
                type: 'input',
                message: 'What is your new employees manager id?'
            },
        ])
        .then((answer) => {
            console.log('Adding Employee...');
            const query = 'INSERT first_name, last_name, role_id, manager_id INTO employee'
            connection.query(query, {first_name: answer.first, last_name: answer.last, role_id: answer.roleId, manager_id: answer.managerId}, (err, data) => {
                if(err) throw err;
                console.table(data);
                menu();

            });
        });
};