const { google } = require('googleapis');
const { client_id, client_secret, redirect_uri } = require('./credentials.json');
const client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
client.setCredentials(require('./bs.json'));
const sheets = google.sheets({version: 'v4', auth: client});
sheets.spreadsheets.values.get({
  spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  range: 'Class Data!A2:E',
}, (err, res) => {
  const rows = res.data.values;
  console.log('Name, Major:');
  rows.map((row) => {
    console.log(`${row[0]}, ${row[4]}`);
  });
});
//listMajors(client);

function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Class Data!A2:E',
  }, (err, res) => {
    const rows = res.data.values;
    console.log('Name, Major:');
    rows.map((row) => {
      console.log(`${row[0]}, ${row[4]}`);
    });
  });
  // sheets.spreadsheets.create({
  //   resource: {
  //     properties: {
  //       title: 'fax no'
  //     }
  //   }
  // }).then((ss) => {console.log(ss)
  // });
  // sheets.spreadsheets.values.update({
  //   spreadsheetId: '1sfyioJG296PW5c5yzjHeZCcWG88XKqmnD-xJ8ZzAbAk',
  //   range: 'Sheet1!A1:A1',
  //   valueInputOption: 'RAW',
  //   resource: {
  //     values: [['newday']]
  //   }
  // });
  const drive = google.drive({version: 'v3', auth});
  drive.files.copy({fileId: '1j1BH0CI_LX2B386aAUbQKWhhvEYDtZPmTB-N_2a4c4s', resource: {name: 'abcdef'}}).then(res => {
    drive.permissions.create({resource: {type: 'anyone', role: 'reader'}, fileId: res.data.id});
    sheets.spreadsheets.values.update({
      spreadsheetId: res.data.id,
      range: '1:1',
      valueInputOption: 'Raw',
      resource: {
        values: [['Server: ',,'Channel: ',,,'Moderator: ']]
      }
    });
    sheets.spreadsheets.get({
      spreadsheetId: res.data.id,
    }).then(s => console.log(s.data.spreadsheetUrl));
  })
  // drive.permissions.create({resource: {type: 'anyone', role: 'reader'}, fileId: '1sfyioJG296PW5c5yzjHeZCcWG88XKqmnD-xJ8ZzAbAk'});
  // drive.files.list({
  //   pageSize: 10,
  //   fields: 'nextPageToken, files(id, name)',
  // }, (err, res) => {
  //   if (err) return console.log('The API returned an error: ' + err);
  //   const files = res.data.files;
  //   if (files.length) {
  //     console.log('Files:');
  //     files.map((file) => {
  //       console.log(`${file.name} (${file.id})`);
  //     });
  //   } else {
  //     console.log('No files found.');
  //   }
  // });
}