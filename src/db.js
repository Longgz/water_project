const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'water',
  password: '2608',
  port: 5432,
});

client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});



var queryString = `INSERT INTO student(
firstname, lastname, age, address, email
) VALUES(
'Mary Ann2', 'Wilters', 20, '74 S Westgate St', 'mroyster2@royster.com'
)`;


// client.query(
//   "INSERT INTO public.FeatureDraw(type, name, geom, feature_id)VALUES('water', 'ABX', '12341234', '17052022')",
//   (err, res) => {
//     console.log(err, res);
//     client.end();
//   }
// );

// client.query(queryString, (err,res)=>{
//   console.log(err, res);
//   client.end();
// });

// client.query(`Select * from student`, (err, res) => {
//   if(!err) {
//     console.log(res.rows);
//   } else {
//     console.log(err.message);
//   }
//   client.end();
// })

module.exports = client;