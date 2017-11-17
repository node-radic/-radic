#!/usr/bin/env node
import * as inquirer from 'inquirer';
import { logs } from '../'


inquirer.prompt([
    <inquirer.Question> { message: 'What categories do you want', type: 'checkbox', choices: Object.keys(logs), name: 'categories',pageSize: 20 }
]).then(answers => {
    let files = [];
    answers.categories.forEach(cat => {
        files = files.concat(logs[cat])
    })
    console.log('lnav ' + files.join(' '));
})