const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");

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

// ===== allows use of async=====//
connection.query = util.promisify(connection.query);

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
          "View Employees by Manager",
          "Add Employee",
          "View Roles",
          "Add Department",
          "Add Role",
          "View Departments",
          "Update Employee Role",
          "Delete Department",
          "Delete Role",
          "Delete Employee",
          "Update Employee Managers",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      console.log(answer.options);
      switch (answer.options) {
        case "View Employees":
          viewEmployees();
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

        case "Update Employee Role":
          updateRole();
          break;

        case "Delete Department":
          deleteDepartments();
          break;

        case "Delete Role":
          deleteRole();
          break;

        case "Delete Employee":
          deleteEmployee();
          break;

        case "Update Employee Managers":
          updateEmpManager();
          break;

        case "Exit":
          console.log("Thank you for using the employee tracker!");
          connection.end();
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

//=========update roles array========//
let updateRolesArr = [];

const getUpdatedRole = () => {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    res.forEach(({ title, id }) => {
      updateRolesArr.push({ name: title, value: id });
    });
  });
  return updateRolesArr;
};

//=========add role=========//
const addRole = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Please enter the role's title.",
          validate: (data) => {
            if (data !== "") {
              return true;
            }
            return "Please enter a name.";
          },
        },
        {
          type: "input",
          name: "salary",
          message: "Please enter the role's salary.",
          validate: (data) => {
            if (data !== "") {
              return true;
            }
            return "Please enter a name.";
          },
        },
        {
          type: "list",
          name: "department",
          message: "Please choose what department the role is from.",
          choices: getDepartment(),
        },
      ])
      .then(function (answer) {
        let deptId = getDepartment().indexOf(answer.department) + 1;
        let newRole = {
          title: answer.title,
          salary: answer.salary,
          department_id: deptId,
        };
        connection.query(
          "INSERT INTO role SET ?",
          newRole,
          function (err, data) {
            if (err) throw err;
            viewRoles();
          }
        );
      });
  });
};

//==========manager=============//
let managerArr = [];
function manager() {
  connection.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    function (err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        managerArr.push(res[i].first_name + " " + res[i].last_name);
      }
    }
  );
  return managerArr;
}


//=========update employee managers=========//
function updateEmpManager() {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    console.table(res); 
    inquirer
      .prompt([
        {
          name: "updateEmpMan",
          type: "list",
          message: "What employee would you like to update?",
          choices(){
            const updateMan = [];
            res.forEach(({ id, first_name, last_name }) => {
              updateMan.push({name: first_name + " " + last_name, value: id});
            });
            return updateMan;
        },
      },
      {
        name: "updateManager",
        type: "list",
        message: "Which manager are you assigning to the selected employee?",
        choices(){
          const updateManager = [];
          res.forEach(({ id, first_name, last_name }) => {
            updateManager.push({name: first_name + " " + last_name, value: id});
          });
          return updateManager;
      },
    },
      ])
      .then(function (answer) {
        connection.query("UPDATE employee SET manager_id = ? WHERE id = ?",[answer.updateManager, answer.updateEmpMan], (err, res) => {
            if (err) throw err;
          viewEmployees();
          });
          });
      })
}

//=========getDepartment=========//
let departmentArray = [];
const getDepartment = () => {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      departmentArray.push(res[i].name);
    }
  });
  return departmentArray;
};

//========= add department=========//
const addDepartment = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    inquirer
      .prompt([
        {
          type: "input",
          name: "deptname",
          message: "What is the name of the department you are adding?",
          validate: (data) => {
            if (data !== "") {
              return true;
            }
            return "Pleaser enter a valid name.";
          },
        },
      ])
      .then(function (answer) {
        let newDept = { name: answer.deptname };
        connection.query(
          "INSERT INTO department SET ?",
          newDept,
          function (err, data) {
            if (err) throw err;
            viewDepartments();
          }
        );
      });
  });
};

//========= update roles ==========//
const updateRole = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          name: "roleUpdate",
          message: "Which employee would you like to update?",
          choices() {
            const choiceArray = [];
            res.forEach(({ first_name, last_name, id }) => {
              choiceArray.push({
                name: first_name + " " + last_name,
                value: id,
              });
            });
            return choiceArray;
          },
        },
        {
          type: "list",
          name: "newRole",
          message: "Which role would you like to assign to this employee?",
          choices: getUpdatedRole(),
        },
      ])
      .then(function (answer) {
        console.log(answer.newRole);
        console.log(answer.roleUpdate);
        connection.query(
          "UPDATE employee SET role_id = ? WHERE id = ?",
          [answer.newRole, answer.roleUpdate],
          function (err, data) {
            if (err) throw err;
            viewEmployees();
          }
        );
      });
  });
};

//=========add employees and prompts==========//
const addEmployees = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    console.table(res);

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
  });
};

//======deleting department=========//
const deleteDepo = async () => {
  let res = await connection.query("SELECT * FROM department");
  return res.map((department) => {
    return {
      name: department.name,
      value: department.id,
    };
  });
};

const deleteDepartments = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "deleteDepart",
        message: "What department are you deleting?",
        choices: () => deleteDepo(),
      },
    ])
    .then((answer) => {
      connection.query(
        "DELETE FROM department WHERE id = ?",
        answer.deleteDepart,
        (err, data) => {
          if (err) throw err;
          viewDepartments();
        }
      );
    });
};

//=========delete employee=========//
const deleteEmp = async () => {
  let res = await connection.query("SELECT * FROM employee");
     let deleteEmpArr = res.map((employees) => {
     return {
      name: `${employees.first_name} ${employees.last_name}`,
      value: employees.id,
    };
  });
  console.log(deleteEmpArr);
  return deleteEmpArr;
};

const deleteEmployee = () => {
  inquirer
  .prompt([
    {
    type: "list",
    name: "deleteEmp",
    message: "Which employee would you like to remove?",
    choices: () => deleteEmp(),
    },
  ])
  .then((answer) => {
    connection.query(" DELETE FROM employee WHERE id = ?",
    [answer.deleteEmp],
    (err, data) => {
      if (err) throw err;
      viewEmployees();
    })
  })
}


//========= delete role=========//
// const deleteRole = async () => {
//   let res = await connection.query("SELECT * FROM role");
//      let deleteRoleArr = res.map((role) => {
//      return {
//       name: ,
//       value: employees.id,
//     };
//   });
//   console.log(deleteRoleArr);
//   return deleteRoleArr;
// };

// const deleteEmployee = () => {
//   inquirer
//   .prompt([
//     {
//     type: "list",
//     name: "deleteEmp",
//     message: "Which employee would you like to remove?",
//     choices: () => deleteEmp(),
//     },
//   ])
//   .then((answer) => {
//     connection.query(" DELETE FROM employee WHERE id = ?",
//     [answer.deleteEmp],
//     (err, data) => {
//       if (err) throw err;
//       viewEmployees();
//     })
//   })
// }

//======= view by the manager=========//
const viewManager = async () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          name: "manager",
          message: "Which manager's employees would you like to view?",
          choices() {
            const choiceArray = [];
            res.forEach(({ first_name, last_name, id, manager_id }) => {
              if (!manager_id) {
                choiceArray.push({
                  name: first_name + " " + last_name,
                  value: id,
                });
              }
            });
            return choiceArray;
          },
        },
      ])
      .then(function (answer) {
        connection.query(
          "SELECT * FROM employee WHERE manager_id = ?",
          [answer.manager],
          function (err, res) {
            if (err) throw err;
            console.table(res);
            menu();
          }
        );
      });
  });
};
