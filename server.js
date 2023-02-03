require("dotenv").config();
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

// establish mysql connection
const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// initial prompt
const prompt = [
  {
    name: "Select",
    message: "Select an option!",
    type: "list",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Add A Department",
      "Add A Role",
      "Add An Employee",
      "Update An Employee Role",
    ],
  },
];

// end prompt or continue
const endPrompt = [
  {
    name: "continue",
    message: "Continue or quit?",
    type: "list",
    choices: ["Continue", "Quit"],
  },
];

const addDepartment = [
  {
    name: "department_name",
    message: "Enter the new department's name.",
    type: "input",
  },
];

const addRole = [
  {
    name: "roleName",
    message: "What is the name of your new role?",
    type: "input",
  },
  {
    name: "roleSalary",
    message: "What is the annual salary for this role?",
    type: "input",
  },
  {
    name: "roleDept",
    message: "Which department does this role belong to?",
    type: "input",
  },
];

const addEmployee = [
  {
    name: "employeeName",
    message: "What is the first name of your new employee?",
    type: "input",
  },
  {
    name: "employeeLastName",
    message: "What is the last name of your new employee?",
    type: "input",
  },
  {
    name: "employeeRole",
    message: "What role does your new employee hold?",
    type: "input",
  },
];

const updateEmployee = [
  {
    name: "id",
    message: "What is the ID of the employee you want to update?",
    type: "input",
  },
  {
    name: "newRole",
    message: "What is ID of their new role?",
  },
];

// show contents of department table
const showDepartments = () => {
  db.query("SELECT * FROM department", (error, results, fields) => {
    if (error) throw error;
    console.table(results);
    continuePrompt();
  });
};

const showRoles = () => {
  db.query("SELECT * FROM employeeRole", (error, results, fields) => {
    if (error) throw error;
    console.table(results);
    continuePrompt();
  });
};

const showEmployees = () => {
  db.query("SELECT * FROM employee", (error, results, fields) => {
    if (error) throw error;
    console.table(results);
    continuePrompt();
  });
};

// prompt to end or continue
const continuePrompt = () => {
  inquirer.prompt(endPrompt).then((answers) => {
    if (answers.continue === "Continue") {
      init();
    } else {
      process.exit();
    }
  });
};

// inquirer initialize
const init = () => {
  inquirer.prompt(prompt).then((answers) => {
    if (answers.Select === "View All Departments") {
      showDepartments();
    }

    if (answers.Select === "View All Roles") {
      showRoles();
    }

    if (answers.Select === "View All Employees") {
      showEmployees();
    }

    if (answers.Select === "Add A Department") {
      inquirer.prompt(addDepartment).then((answers) => {
        db.query(
          'INSERT INTO department (dept_name) VALUES ("' +
            answers.department_name +
            '")',
          (err, result, fields) => {
            if (err) throw err;
            console.log(
              answers.department_name +
                "was created and added to the list of available departments."
            );
            showDepartments();
          }
        )
      })
    }

    
    if(answers.select === "Add A Role") {
        inquirer.prompt(addRole)
        .then(answers => {
            db.query('INSERT INTO role (title, salary, department_id) VALUES ("' + answers.roleName + '", ' + answers.roleSalary + ', (SELECT id FROM department where dept_name="' + answers.roleDept + '"))', (error, result, fields) => {
                if (error) throw error;
                console.log(answers.roleName + ' was created and added to the list of available roles.');
                showRoles();
            })
        })
    }
    
    if (answers.Select === "Add A Employee") {
      inquirer.prompt(addEmployee).then((answers) => {
        db.query(
          'INSERT INTO role (first_name, last_name, role_id) VALUES ("' + answers.employeeName +
            '", "' +
            answers.employeeLastName + '(SELECT id FROM role WHERE title = ' + answers.employeeRole + ')',
          (err, result, fields) => {
            if (err) throw err;
            console.log(
              answers.employeeName + "was added to the list of employees!"
            );
            showEmployees();
          }
        )
      })
    }

    if (answers.Select === "Update An Employee Role") {
      inquirer.prompt(updateEmployee).then((answers) => {
        db.query(
          "UPDATE employee SET role_id = " +
            answers.newRole +
            " WHERE id =" +
            answers.id +
            ";"
        ),
          (err, result, fields) => {
            if (err) throw err;
            console.log(answers.employeeName + "was updated!");
            showEmployees();
          }
      })
    }
  })
}

init();
