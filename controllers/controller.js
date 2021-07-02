const sqlite3 = require('sqlite3').verbose();

// BACKEND FILE FOR MY DATABASES QUERIES

const addActivityToDB = (activityFromTheBrain) =>{
    // code to add to the database
    // console.log("From the server I present:", taskFromTheBrain)
      let db = new sqlite3.Database('./db/db.activity');
  
      // insert one row into the langs table
      db.run(`INSERT INTO activity(name, location, price, type) VALUES(?, ?, ?, ?)`, [activityFromTheBrain.name, activityFromTheBrain.location, activityFromTheBrain.price, activityFromTheBrain.type], function(err) {
        if (err) {
          return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      });
  
      // close the database connection
      db.close();
  }
  

  
const fetchAllActivityFromDb = (res) => {
  let dataForTheUser = {activities: []}
  let db = new sqlite3.Database('./db/db.activity');

  let sql = `SELECT * FROM activity`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
      dataForTheUser.activities.push(row)
    });
    console.log(dataForTheUser)
    res.send(dataForTheUser)
  });

  // close the database connection
  db.close();
}

const deleteActivityFromDB = (activityid) => {
  console.log("Delete:", activityid.activity_id )
  let db = new sqlite3.Database('./db/db.activity', (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  let id = activityid.activity_id
  // delete a row based on id
  db.run(`DELETE FROM activity WHERE id=${activityid.activity_id}`, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) deleted ${this.changes}`);
  });

  // close the database connection
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  // console.log('work')
}
  exports.deleteActivityFromDB = deleteActivityFromDB;
  exports.addActivityToDB = addActivityToDB;
  exports.fetchAllActivityFromDb = fetchAllActivityFromDb;
