var template = require('./template.js');
var db = require('./db')
var qs = require('querystring');

module.exports = {
  index: (req,res) => {    
    db.query(`SELECT * FROM topic`, function (err, topics) {
      db.query(`SELECT * FROM author`, function(err2, authors) {
      var title = 'author';
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `
        <table>
        <tr style="text-align:center;">
        <td>Name</td> 
        <td>Profile</td> 
        <td>Update</td> 
        <td>Delete</td> 
        </tr>
        ${template.authorTable(authors)}
        </table>

        <form action="author/create_process" method="post">
          <p><input type="text" placeholder="name" name="name">
          <input type="text" placeholder="profile" name="profile">
          <input type="submit" value="create">
          </p>
        </form>

        <style>
        table{
          border-collapse: collapse;
        }
        td{
          border: 1px solid black;
        }
        </style>

        `,
        ``
      );
      res.writeHead(200);
      res.end(html);
    })
      })
      
  },
  create_process:(req,res) => {
    var body = '';
    req.on('data', function (data) {
      body = body + data;
    });
    req.on('end', function () {
      var post = qs.parse(body);
      db.query(`INSERT INTO author (name, profile) VALUES(?,?)`,
      [post.name,post.profile],
      function(err, result) {
        if(err) {
          throw err;
        }
        res.writeHead(302, { Location: `/author` });
        res.end();
      })         
    });
  },
  update: (req,res,queryData) => {    
    db.query(`SELECT * FROM topic`, function (err, topics) {
      db.query(`SELECT * FROM author`, function(err2, authors) {
        db.query(`SELECT * FROM author WHERE id=?`,[queryData.id], function(err3, author) {
      var title = 'author';
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `
        <table>
        <tr style="text-align:center;">
        <td>Name</td> 
        <td>Profile</td> 
        <td>Update</td> 
        <td>Delete</td> 
        </tr>
        ${template.authorTable(authors)}
        </table>

        <form action="/author/update_process" method="post">
          <p>
          <input type="hidden" name="id" value="${queryData.id}">
          
          <input type="text" placeholder="name" name="name" value="${author[0].name}">
          <input type="text" placeholder="profile" name="profile" value="${author[0].profile}">
          <input type="submit" value="update">
          </p>
        </form>

        <style>
        table{
          border-collapse: collapse;
        }
        td{
          border: 1px solid black;
        }
        </style>

        `,
        ``
      );
      res.writeHead(200);
      res.end(html);
    })
      })
    })
      
  },
  update_process: (req,res) => {
    var body = '';
    req.on('data', function (data) {
      body = body + data;
    });
    req.on('end', function () {
      var post = qs.parse(body);
      db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
      [post.name,post.profile,post.id],
      function(err) {
        if(err) {
          throw err;
        }
          res.writeHead(302, { Location: `/author` });
          res.end();
      }) 
    });
  },
  delete_process: (req,res) => {
    var body = '';
    req.on('data', function (data) {
      body = body + data;
    });
    req.on('end', function () {
      var post = qs.parse(body);
      db.query(`DELETE FROM author WHERE id=? `,[post.id],function(err) {
        if(err) {
          throw err;          
        }
        res.writeHead(302, { Location: `/author` });
          res.end();
      })
    });
  }
}