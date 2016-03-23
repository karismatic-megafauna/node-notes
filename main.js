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
  var noteMd = fs.createWriteStream(toMd);
  Object.keys(jsonObj).map(function(title) {
    noteMd.write("# " + title + "\n");
    Object.keys(jsonObj[title]['items']).map(function(items){
      var status = jsonObj[title]['items'][items]['status'];
      var checkBox = '- [ ] ';
      if (status === 'complete') {
        checkBox = '- [x] ';
      } else if (status === 'failed') {
        checkBox = '- [-] ';
      }
      noteMd.write(checkBox + jsonObj[title]['items'][items]['description'] + "\n");
    });
  });
}

function addNote(noteObj, key) {
  var noteString = noteObj.reduce(function(memo, word){
    return memo + ' ' + word;
  });

  var descriptionObj = {
    description: noteString,
    status: 'incomplete',
  };

  // modify toData
  Object.keys(dataFile).map(function(note){
    if (dataFile[note]['cli-ref'] === key) {
      dataFile[note]['items'].push(descriptionObj);
      fs.writeJsonSync(toData, dataFile);
    }
  });
  makeNote(dataFile);
}

function removeNote(index, key) {
  Object.keys(dataFile).map(function(note){
    if (dataFile[note]['cli-ref'] === key) {
      dataFile[note]['items'].splice(index, 1);
      fs.writeJsonSync(toData, dataFile);
    }
  });
  makeNote(dataFile);
}

var cmdValue = '';
var noteValue = '';
var noteIndex = '';

program
  .version('0.0.1')
  .command('new')
  .description('welp...')
  .action(function(cmd) {
    console.log('command: ' + cmd._name);
    cmdValue = cmd;
  });

program
  .command('add [cli-ref] <notes...>')
  .description('add note to object')
  .action(function(ref, note, cmd) {
    cmdValue = cmd;
    refValue = ref;
    noteValue = note;
  });

program
  .command('remove [cli-ref] <index>')
  .description('add note to object')
  .action(function(ref, note, cmd) {
    cmdValue = cmd;
    refValue = ref;
    noteIndex = note;
  });

  program.parse(process.argv);

  if (cmdValue._name === undefined) {
    console.log(program.help());
  } else if (cmdValue._name === 'new' && !fs.existsSync(toDir)) {
    console.log(chalk.cyan('creating new note for today!'));

    var newDir = fs.mkdirsSync(toDir);
    fs.copySync(weekdayTemplate, toData);
    makeNote(dataFile);

    console.log(chalk.white('new note created for: ') + chalk.bold.green(today));
  } else if (cmdValue._name === 'add') {
    addNote(noteValue, refValue);
    console.log(chalk.cyan('note added!'));
  } else if (cmdValue._name === 'delete' || cmdValue._name === 'remove') {
    removeNote(noteIndex, refValue);
    console.log(chalk.cyan('note at index[' + noteIndex + '] was removed!'));
  } else {
    console.log(chalk.cyan('note already exists, edit it with one of the following commands:'));
    console.log('nonote' + chalk.red(' add ') + '<note description>');
    console.log('nonote' + chalk.red(' complete ') + '<note index>');
    console.log('nonote' + chalk.red(' fail ') + '<note index>');
    console.log('nonote' + chalk.red(' delete ') + '<note index>');
    return;
  }
