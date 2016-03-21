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
      noteData.write("- [ ] " + jsonObj[title]['items'][items]['description'] + "\n");
    });
  });
  console.log(chalk.cyan('new note created for: ') + chalk.bold.red(today));
}

program
  .arguments('new', 'create new note for day')
  .action(function() {
    if (fs.existsSync(toDir)){
      // return console.log('note already exists');
    }
    var newDir = fs.mkdirsSync(toDir);
    fs.copySync(weekdayTemplate, toData);

    var obj = fs.readJsonSync(toData);
    makeNote(obj);
  });

program.parse(process.argv);
