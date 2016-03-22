#!/usr/bin/env node --harmony

// Libs
var chalk = require('chalk');
var program = require('commander');
var fs = require('fs-extra');
var moment = require('moment');

// Globals
var today = moment().format("DD-MM-YYYY");

// TODO: move to config
var notesDir = process.env['HOME'] + '/Code/node-notes';
var weekdayTemplate = notesDir + '/weekday.json';
var days = notesDir + '/days/';
var toDir = days + today;
var toData = toDir + '/data.json';
var toMd = toDir + '/note.md';
var dataFile = '';
try {
  dataFile = fs.readJsonSync(toData);
} catch (e) {
  dataFile = fs.readJsonSync(weekdayTemplate);
}

// Util Functions
function makeNote(jsonObj) {
  var noteData = fs.createWriteStream(toMd);
  Object.keys(jsonObj).map(function(title) {
    noteData.write("# " + title + "\n");
    Object.keys(jsonObj[title]['items']).map(function(items){
      var status = jsonObj[title]['items'][items]['status'];
      var checkBox = '- [ ] ';
      if (status === 'complete') {
        checkBox = '- [x] ';
      } else if (status === 'failed') {
        checkBox = '- [-] ';
      }
      noteData.write(checkBox + jsonObj[title]['items'][items]['description'] + "\n");
    });
  });
}

// Get user input
program
  .version('0.0.1');
  Object.keys(dataFile).map(function(item) {
    program.option('-'+dataFile[item]['cli-ref'], '<cli-ref> ' + dataFile[item]['description']);
  });

program
  .command('new', 'create new note for day')
  .action(function(cmd) {
    cmdValue = cmd;
  });

program
  .command('add', 'add to an exsisting note')
  .action(function(cmd) {
    cmdValue = cmd;
  });

program
  .command('complete', 'check off a completed task')
  .action(function(cmd) {
    cmdValue = cmd;
  });

  program.parse(process.argv);

  // if (fs.existsSync(toDir)) {
  //   console.log(chalk.cyan('note already exists, edit it with one of the following commands:'));
  //   console.log(chalk.red('nonote add <note description>'));
  //   console.log(chalk.red('nonote complete <note index>'));
  //   console.log(chalk.red('nonote fail <note index>'));
  //   console.log(chalk.red('nonote delete <note index>'));
  //   return;
  // }
  if (cmdValue === 'new') {

    console.log(chalk.cyan('creating new note for today!'));

    var newDir = fs.mkdirsSync(toDir);
    fs.copySync(weekdayTemplate, toData);
    makeNote(dataFile);

    console.log(chalk.white('new note created for: ') + chalk.bold.green(today));
  }
