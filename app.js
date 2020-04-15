const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");
let employeeArray = [];

// Function to start questions again or create html
function startOrRender() {
    inquirer.prompt({
        type: "confirm",
        name: "new",
        message: "Would you like to add another employee?",
    })
    .then((newResponse) => {
        if (newResponse.new === false) {
            employeeArray.sort();
            fs.writeFile(outputPath, render(employeeArray), (err) => {
                if (err) throw err;
            });
        }
        else if (newResponse.new === true) {
            createEmployee();
        }
    })
};

// Alerts user to a failed input, allows them to restart employee creation or to disengage with the option to render what they have
function failedQuery() {
    inquirer.prompt({
        type: "confirm",
        name: "continue",
        message: "You have entered the above field/fields in an unacceptable format. I am disappointed in you, but will allow you to redo this employee's information. Do you wish to continue?",
    })
    .then((restartResponse) => {
        if (restartResponse.continue === true) {
            createEmployee();
        }
        else {
            inquirer.prompt({
                type: "confirm",
                name: "render",
                message: "Would you like to render your document with the employees that were previously completed?",
            })
            .then((renderResponse) => {
                if (renderResponse.render === true) {
                    employeeArray.sort();
                    fs.writeFile(outputPath, render(employeeArray), (err) => {
                    if (err) throw err;
                    });
                }
            })
        }
    })
}

// Validating email response
function isEmail(email) {
    let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

// Questions to gather data from user for employee cards
function createEmployee() {
    inquirer
    .prompt([
        {
            message: "What is your employee's name?",
            name: "name"
        },
        {
            type: "checkbox",
            message: "What is your employee's role in the company?",
            name: "role",
            choices: [
            "Manager", 
            "Engineer", 
            "Intern"
            ]
        },
        {
            message: "What is your employee's id number?",
            name: "id"
        },
        {
            message: "What is your employee's email?",
            name: "email"
        }, 
    ])
    .then((response) => {
        if (/^[a-zA-Z\s]*$/.test(response.name) === true && /^[a-zA-Z]+$/.test(response.role) === true && /^\d+$/.test(response.id) === true && isEmail(response.email) === true) {
            if (response.role[0] === "Manager") {
                inquirer.prompt({
                    name: "officeNumber",
                    message: "What is your office number?",
                })
                .then((managerResponse) => {
                    if (/^\d+$/.test(managerResponse.officeNumber) === true) {
                        let newManager = new Manager(response.name, response.id, response.email, managerResponse.officeNumber);
                        employeeArray.push(newManager);
                        startOrRender();
                    }
                    else {
                        console.log(`Your "office number" response was not in the correct format. Please try again.`);
                        failedQuery();
                    }
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
                    if (/^[a-zA-Z\s.-]*$/.test(internResponse.school) === true) {
                        let newIntern = new Intern(response.name, response.id, response.email, internResponse.school);
                        employeeArray.push(newIntern);
                        startOrRender();
                    }
                    else {
                        console.log(`Your "school" response was not in the correct format. Please try again.`);
                        failedQuery();
                    }
                })
            }
        }
        else {
            // Iterating through the responses, picking the ones that returned false and console logging what fields the user should enter correctly, then restarting employee creation.
            let failedArray = [];
            let failedQueries = [];
            failedArray.push(/^[a-zA-Z\s]*$/.test(response.name), /^[a-zA-Z]+$/.test(response.role), /^\d+$/.test(response.id), isEmail(response.email));
            for (i=0; i < failedArray.length; i++) {
                if (failedArray[i] === false) {
                    if (i === 0) {
                        failedQueries.push("name");
                    }
                    else if (i === 1) {
                        failedQueries.push("role");
                    }
                    else if (i === 2) {
                        failedQueries.push("id");
                    }
                    else if (i === 3) {
                        failedQueries.push("email");
                    }
                }
            }
            failedQueries.forEach(query => console.log(`Your "${query}" response was not in the correct format.`));
            failedQuery();
        }
    })
};

createEmployee();