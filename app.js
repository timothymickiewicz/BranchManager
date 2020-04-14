const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");
var employeeArray = [];

// Function to start questions again or create html
function startOrRender() {
    inquirer.prompt({
        type: "confirm",
        name: "new",
        message: "Would you like to add another employee?",
    })
    .then((newResponse) => {
        if (newResponse.new === false) {
            fs.writeFile(outputPath, render(employeeArray), (err) => {
                if (err) throw err;
            });
        }
        else if (newResponse.new === true) {
            createEmployee();
        }
    })
};

// Questions to gather data from user for employee cards
function createEmployee() {
    inquirer
    .prompt([
        {
            message: "What is your name?",
            name: "name"
        },
        {
            type: "checkbox",
            message: "What is your role?",
            name: "role",
            choices: [
            "Manager", 
            "Engineer", 
            "Intern"
            ]
        },
        {
            message: "What is your id number?",
            name: "id"
        },
        {
            message: "What is your email?",
            name: "email"
        }, 
    ])
    .then((response) => {
        if (response.role[0] === "Manager") {
            inquirer.prompt({
                name: "officeNumber",
                message: "What is your office number?",
            })
            .then((managerResponse) => {
                let newManager = new Manager(response.name, response.id, response.email, managerResponse.officeNumber);
                employeeArray.push(newManager);
                startOrRender();
            })
        }
        else if (response.role[0] === "Engineer") {
            inquirer.prompt({
                name: "github",
                message: "What is your Github username?",
            })
            .then((engineerResponse) => {
                let newEngineer = new Engineer(response.name, response.id, response.email, engineerResponse.github);
                employeeArray.push(newEngineer);
                startOrRender();
            })
        }
        else if (response.role[0] === "Intern") {
            inquirer.prompt({
                name: "school",
                message: "What is the name of your school?",
            })
            .then((internResponse) => {
                let newIntern = new Intern(response.name, response.id, response.email, internResponse.school);
                employeeArray.push(newIntern);
                startOrRender();
            })
        }
    })
};

createEmployee();