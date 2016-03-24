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
    noteMd.write("\n");
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
// would this be a case for currying? or some other functional tecq?

function removeNote(index, key) {
  var cliFound = false;
  Object.keys(dataFile).map(function(note, noteIndex){
    if (dataFile[note]['cli-ref'] === key) {
      cliFound = true;
      if (!dataFile[note]['items'][index]) {
        throw new Error('index ' + index + ' in "' + key + '" object does not exist');
      }
      dataFile[note]['items'].splice(index, 1);
      fs.writeJsonSync(toData, dataFile);
    } else if (Object.keys(dataFile).length === (noteIndex + 1) && !cliFound) {
      throw new Error('"' + key + '" <cli-ref> does not exist');
    }
  });
  makeNote(dataFile);
}

function completeNote(index, key) {
  var cliFound = false;
  Object.keys(dataFile).map(function(note, noteIndex) {
    if (dataFile[note]['cli-ref'] === key) {
      cliFound = true;
      if (!dataFile[note]['items'][index]) {
        throw new Error('index ' + index + ' in "' + key + '" object does not exist');
      }
      dataFile[note]['items'][index]['status'] = 'complete';
      fs.writeJsonSync(toData, dataFile);
    } else if (Object.keys(dataFile).length === (noteIndex + 1) && !cliFound) {
      throw new Error('"' + key + '" <cli-ref> does not exist');
    }
  });
  makeNote(dataFile);
}

function incompleteNote(index, key) {
  var cliFound = false;
  Object.keys(dataFile).map(function(note, noteIndex) {
    if (dataFile[note]['cli-ref'] === key) {
      cliFound = true;
      if (!dataFile[note]['items'][index]) {
        throw new Error('index ' + index + ' in "' + key + '" object does not exist');
      }
      dataFile[note]['items'][index]['status'] = 'incomplete';
      fs.writeJsonSync(toData, dataFile);
    } else if (Object.keys(dataFile).length === (noteIndex + 1) && !cliFound) {
      throw new Error('"' + key + '" <cli-ref> does not exist');
    }
  });
  makeNote(dataFile);
}

function failNote(index, key) {
  var cliFound = false;
  Object.keys(dataFile).map(function(note, noteIndex) {
    if (dataFile[note]['cli-ref'] === key) {
      cliFound = true;
      if (!dataFile[note]['items'][index]) {
        throw new Error('index ' + index + ' in "' + key + '" object does not exist');
      }
      dataFile[note]['items'][index]['status'] = 'failed';
      fs.writeJsonSync(toData, dataFile);
      return makeNote(dataFile);
    } else if (Object.keys(dataFile).length === (noteIndex + 1) && !cliFound) {
      throw new Error('"' + key + '" <cli-ref> does not exist');
    }
  });
}

var cmdValue = '';
var noteValue = '';
var refValue = '';
var noteIndex = '';

program
  .version('0.0.1')
  .command('new')
  .alias('n')
  .description('create a new note for the day')
  .action(function(cmd) {
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
  .description('remove note from note object')
  .action(function(ref, note, cmd) {
    cmdValue = cmd;
    refValue = ref;
    noteIndex = note;
  });

program
  .command('complete [cli-ref] <index>')
  .alias('c')
  .description('mark item as complete')
  .action(function(ref, note, cmd) {
    cmdValue = cmd;
    refValue = ref;
    noteIndex = note;
  });

program
  .command('incomplete [cli-ref] <index>')
  .alias('i')
  .description('mark item as incomplete')
  .action(function(ref, note, cmd) {
    cmdValue = cmd;
    refValue = ref;
    noteIndex = note;
  });

program
  .command('failed [cli-ref] <index>')
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
    try {
      addNote(noteValue, refValue);
      console.log(chalk.green('note added!'));
    } catch (e) {
      console.log(chalk.red(e));
    }
  } else if (cmdValue._name === 'remove') {
    try {
      removeNote(noteIndex, refValue);
      console.log(chalk.green('note at index[' + noteIndex + '] was removed!'));
    } catch (e) {
      console.log(chalk.red(e));
    }
  } else if (cmdValue._name === 'complete') {
    try {
      completeNote(noteIndex, refValue);
      console.log(chalk.green('note at index[' + noteIndex + '] was marked as complete!'));
    } catch (e) {
      console.log(chalk.red(e));
    }
  } else if (cmdValue._name === 'incomplete') {
    try {
    incompleteNote(noteIndex, refValue);
    console.log(chalk.green('note at index[' + noteIndex + '] was marked as incomplete!'));
    } catch (e) {
      console.log(chalk.red(e));
    }

  } else if (cmdValue._name === 'failed') {
    try {
      failNote(noteIndex, refValue);
      console.log(chalk.green('note at index[' + noteIndex + '] was marked as failed :('));
    } catch (e) {
      console.log(chalk.red(e));
    }
  } else {
    console.log(chalk.cyan('note already exists, edit it with one of the following commands:'));
    console.log('nonote' + chalk.red(' add ') + '<note description>');
    console.log('nonote' + chalk.red(' complete ') + '<note index>');
    console.log('nonote' + chalk.red(' fail ') + '<note index>');
    console.log('nonote' + chalk.red(' delete ') + '<note index>');
    return;
  }
