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

function markTask(/*STRING: failed, complete, incomplete*/){
  // implement me
}

program
  .arguments('new', 'create new note for day')
  .action(function() {
    // if (fs.existsSync(toDir)) {
    //   console.log(chalk.cyan('note already exists, edit it with one of the following commands:'));
    //   console.log(chalk.red('nonote <cli-ref> add <note description>'));
    //   console.log(chalk.red('nonote <cli-ref> complete <note index>'));
    //   console.log(chalk.red('nonote <cli-ref> fail <note index>'));
    //   console.log(chalk.red('nonote <cli-ref> delete <note index>'));
    //   return;
    // }
    var newDir = fs.mkdirsSync(toDir);
    fs.copySync(weekdayTemplate, toData);

    var obj = fs.readJsonSync(toData);
    makeNote(obj);
    console.log(chalk.cyan('new note created for: ') + chalk.bold.red(today));
  });

// program
//   .arguments('add', 'append item to specified object')
//   .action(function() {
//   });
// program
//   .arguments('complete', 'append item to specified object')
//   .action(function() {
//   });
// program
//   .arguments('fail', 'append item to specified object')
//   .action(function() {
//   });
// program
//   .arguments('delete', 'append item to specified object')
//   .action(function() {
//   });
program.parse(process.argv);
