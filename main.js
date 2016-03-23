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
  // pull note array items into space seperated string
  var noteString = noteObj.reduce(function(memo, word){
    return memo + ' ' + word;
  });
  var descriptionObj = {
    description: noteString,
    status: 'incomplete',
  };
  // modify toData
  Object.keys(dataFile).map(function(noteType){
    // find correct cli-ref object
    if (dataFile[noteType]['cli-ref'] === key) {
      dataFile[noteType]['items'].push(descriptionObj);
      fs.writeJsonSync(toData, dataFile);
    }
  });
  // add to end of items array
  // call makeNote
  console.log('_________________________');
  console.log(key);
  console.log('_________________________');
  console.log(noteObj);
  console.log('_________________________');
  console.log(dataFile);
}

var cmdValue = '';
var noteValue = '';

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
    // TODO
    // parse the note into text here? or is that a util functions job?
    noteValue = note;
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
  } else {
    console.log(chalk.cyan('note already exists, edit it with one of the following commands:'));
    console.log('nonote' + chalk.red(' add ') + '<note description>');
    console.log('nonote' + chalk.red(' complete ') + '<note index>');
    console.log('nonote' + chalk.red(' fail ') + '<note index>');
    console.log('nonote' + chalk.red(' delete ') + '<note index>');
    return;
  }
