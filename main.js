#!/usr/bin/env node --harmony

var chalk = require('chalk');
var program = require('commander');
var fs = require('fs-extra');
var moment = require('moment');

// TODO: move to config
var notesDir = process.env['HOME'] + '/Code/node-notes';
var weekdayTemplate = notesDir + '/weekday.json';
var days = notesDir + '/days/';
var today = moment().format("DD-MM-YYYY");
var toDir = days + today;
var toData = toDir + '/data.json';

// Reading the json template in:
// jsonfile.readFile(file, function(err, obj) {
//   console.dir(Object.keys(obj))
// });

// var lolz = jsonfile.readFileSync(file);

// console.log(lolz);

program
  .arguments('new', 'create new note for day')
  .action(function() {
    if (fs.existsSync(toDir)){
      return console.log('note already exists');
    }
    var newDir = fs.mkdirsSync(toDir);
    // copy template over
    fs.copySync(weekdayTemplate, toData);
    // make markdow file

  });

program.parse(process.argv);

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
