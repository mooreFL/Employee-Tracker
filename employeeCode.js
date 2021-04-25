const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "employee_trackerDB",
});

connection.connect((err) => {
  if (err) throw err;
  menu();
});

//=========menu=========//
const menu = () => {
  inquirer
    .prompt([
      {
        name: "options",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View Employees",
          "View Employees by departments",
          "View Employees by Manager",
          "Add Employee",
          "View Roles",
          "Add Department",
          "Add role",
          "View Departments",
        ],
      },
    ])
    .then((answer) => {
      console.log(answer.options);
      switch (answer.options) {
        case "View Employees":
          viewEmployees();
          break;

        case "View Employees by Departments":
          viewDepartment();
          break;

        case "View Employees by Manager":
          viewManager();
          break;

        case "Add Employee":
          addEmployees();
          break;

        case "View Roles":
          viewRoles();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Add Role":
          addRole();
          break;

        case "View Departments":
          viewDepartments();
          break;
      }
    });
};

//===========viewEmployees=========//
const viewEmployees = () => {
  console.log("Retrieving all Employees...");
  connection.query("SELECT * FROM employee", (err, data) => {
    if (err) throw err;
    console.table(data);
    menu();
  });
};

//==========viewDepartments========//
const viewDepartments = () => {
  console.log("Retrieving all Departments...");
  connection.query("SELECT name FROM department", (err, data) => {
    if (err) throw err;
    console.table(data);
    menu();
  });
};

//=========viewRoles=========//
const viewRoles = () => {
  console.log("Retrieving all Roles...");
  connection.query("SELECT title, salary FROM role", (err, data) => {
    if (err) throw err;
    console.table(data);
    menu();
  });
};

//============role============//
let rolesArr = [];
function role() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      rolesArr.push(res[i].title);
    }
  });
  return rolesArr;
}

//==========manager=============//
let managerArr = [];
function manager() {
  connection.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    function (err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        managerArr.push(res[i].first_name);
      }
    }
  );
  return managerArr;
}

//=========add employees and prompts==========//
const addEmployees = () => {
  inquirer
    .prompt([
      {
        name: "first",
        type: "input",
        message: "What is your new employees first name?",
      },
      {
        name: "last",
        type: "input",
        message: "What is your new employees last name?",
      },
      {
        name: "role",
        type: "list",
        message: "What is your new employees role?",
        choices: role(),
      },
      {
        name: "manager",
        type: "rawlist",
        message: "Whos is your new employees manager?",
        choices: manager(),
      },
    ])
    .then((answer) => {
      console.log("Adding Employee...");
      let roleId = role().indexOf(answer.role) + 1;
      let managerId = manager().indexOf(answer.manager) + 1;
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first,
          last_name: answer.last,
          role_id: roleId,
          manager_id: managerId,
        },
        (err) => {
          if (err) throw err;
          console.table(answer);
          menu();
        }
      );
    });
};
