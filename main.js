#!/usr/bin/env node --harmony

// Libs
var chalk = require('chalk');
var program = require('commander');
var fs = require('fs-extra');
var moment = require('moment');

// Globals
var today = moment().format("DD-MM-YYYY");

// TODO: move to config
// TODO: create nonote init command
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

// TODO: move these to a helper file
// Util Functions
function makeNote(jsonObj) {
  var noteMd = fs.createWriteStream(toMd);
  Object.keys(jsonObj).map(function(title) {
    noteMd.write("# " + title + "\n");
    Object.keys(jsonObj[title]['items']).map(function(items, index){
      var status = jsonObj[title]['items'][items]['status'];
      var checkBox = '- [ ]';
      var itemIndex = ' ' + index + '.) ';
      if (status === 'complete') {
        checkBox = '- [x]';
      } else if (status === 'failed') {
        checkBox = '- [-]';
      }
      noteMd.write(checkBox + itemIndex + jsonObj[title]['items'][items]['description'] + "\n");
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

// TODO: think about changing these status functions to a single type
// signiture -> changeStatus(index, key, newStatus)
function removeNote(index, key) {
  Object.keys(dataFile).map(function(note){
    if (dataFile[note]['cli-ref'] === key) {
      dataFile[note]['items'].splice(index, 1);
      fs.writeJsonSync(toData, dataFile);
    }
  });
  makeNote(dataFile);
}

function completeNote(index, key) {
  Object.keys(dataFile).map(function(note) {
    if (dataFile[note]['cli-ref'] === key) {
      dataFile[note]['items'][index]['status'] = 'complete';
      fs.writeJsonSync(toData, dataFile);
    }
  });
  makeNote(dataFile);
}

function incompleteNote(index, key) {
  Object.keys(dataFile).map(function(note) {
    if (dataFile[note]['cli-ref'] === key) {
      dataFile[note]['items'][index]['status'] = 'incomplete';
      fs.writeJsonSync(toData, dataFile);
    }
  });
  makeNote(dataFile);
}

function failNote(index, key) {
  Object.keys(dataFile).map(function(note) {
    if (dataFile[note]['cli-ref'] === key) {
      dataFile[note]['items'][index]['status'] = 'failed';
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
  .alias('n')
  .description('create a new note for the day')
  .action(function(cmd) {
    console.log('command: ' + cmd._name);
    cmdValue = cmd;
  });

program
  .command('add [cli-ref] <notes...>')
  .alias('a')
  .description('add note to object')
  .action(function(ref, note, cmd) {
    cmdValue = cmd;
    refValue = ref;
    noteValue = note;
  });

program
  .command('remove [cli-ref] <index>')
  .alias('r')
  .alias('rem')
  .alias('del')
  .alias('d')
  .alias('delete')
  .description('remove note from note object')
  .action(function(ref, note, cmd) {
    cmdValue = cmd;
    refValue = ref;
    noteIndex = note;
  });

program
  .command('complete [cli-ref] <index>')
  .alias('comp')
  .alias('check')
  .alias('c')
  .description('mark item as complete')
  .action(function(ref, note, cmd) {
    cmdValue = cmd;
    refValue = ref;
    noteIndex = note;
  });

program
  .command('incomplete [cli-ref] <index>')
  .alias('incomp')
  .alias('uncheck')
  .alias('i')
  .description('mark item as incomplete')
  .action(function(ref, note, cmd) {
    cmdValue = cmd;
    refValue = ref;
    noteIndex = note;
  });

program
  .command('failed [cli-ref] <index>')
  .alias('fail')
  .alias('f')
  .description('mark item as failed')
  .action(function(ref, note, cmd) {
    cmdValue = cmd;
    refValue = ref;
    noteIndex = note;
  });


  program.parse(process.argv);

  // TODO: clean up below, shit is terrifying
  // TODO: handle some errors more elegantly...don't cover those cases well
  // what happens when i pass in an index that doesn't exist?
  // what happens when i pass in a cli-ref that doesn't exist?
  // Parse the commands and do something
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
  } else if (cmdValue._name === 'remove') {
    removeNote(noteIndex, refValue);
    console.log(chalk.cyan('note at index[' + noteIndex + '] was removed!'));
  } else if (cmdValue._name === 'complete') {
    completeNote(noteIndex, refValue);
    console.log(chalk.cyan('note at index[' + noteIndex + '] was marked as complete!'));
  } else if (cmdValue._name === 'incomplete') {
    incompleteNote(noteIndex, refValue);
    console.log(chalk.cyan('note at index[' + noteIndex + '] was marked as incomplete!'));
  } else if (cmdValue._name === 'failed') {
    failNote(noteIndex, refValue);
    console.log(chalk.cyan('note at index[' + noteIndex + '] was marked as failed... :('));
  } else {
    console.log(chalk.cyan('note already exists, edit it with one of the following commands:'));
    console.log('nonote' + chalk.red(' add ') + '<note description>');
    console.log('nonote' + chalk.red(' complete ') + '<note index>');
    console.log('nonote' + chalk.red(' fail ') + '<note index>');
    console.log('nonote' + chalk.red(' delete ') + '<note index>');
    return;
  }
