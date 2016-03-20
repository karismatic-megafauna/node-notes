#!/usr/bin/env node --harmony

var co = require('co');
var chalk = require('chalk');
var request = require('superagent');
var prompt = require('co-prompt');
var program = require('commander');
var jsonfile = require('jsonfile');
var fs = require('fs');
var moment = require('moment');

// TODO: move to config
var notesDir = '~/Code/node-notes';
var template = notesDir+'/note-template.json';
var days = notesDir+'/days/';

// Reading the json template in:
// jsonfile.readFile(file, function(err, obj) {
//   console.dir(Object.keys(obj))
// });

// var lolz = jsonfile.readFileSync(file);

// console.log(lolz);

program
  .arguments('new', 'create new note for day')
  .action(function(cmd) {
    var now = moment().format("DD-MM-YYYY");
    var newDir = days+now;
    console.log(newDir);
    if (!fs.existsSync(newDir)) {
      // fs.mkdirSync(newDir);
    }
  })
  .parse(process.argv);

// program
//   .arguments('<file>')
//   .option('-u, --username <username>', 'The user to authenticate as')
//   .option('-p, --password <password>', 'The user\'s password')
//   .action(function(file) {
//     co(function *() {
//       var username = yield prompt('username: ');
//       var password = yield prompt.password('password: ');
//       request
//         .post('https://api.bitbucket.org/2.0/snippets/')
//         .auth(username, password)
//         .attach('file', file)
//         .set('Accept', 'application/json')
//         .end(function (err, res) {
//           if (!err && res.ok) {
//             var link = res.body.links.html.href;
//             console.log(chalk.bold.cyan('Snippet created: ') + link);
//             process.exit(0);
//           }

//           var errorMessage;
//           if (res && res.status === 401) {
//             errorMessage = "Auth failed! Make sure user and pass are correct.";
//           } else if (err) {
//             errorMessage = err;
//           } else {
//             errorMessage = res.text;
//           }
//           console.error(chalk.red(errorMessage));
//           process.exit(1);
//         });
//     });
//   })
//   .parse(process.argv);
