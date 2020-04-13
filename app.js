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
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!
// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.
// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.
// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an 
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!```