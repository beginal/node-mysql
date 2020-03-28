
var template = require('./template.js');
var db = require('./db')
var qs = require('querystring');

module.exports= {
  index: (req,res) => {
    db.query(`SELECT * FROM topic`, function (err, topics) {
      var title = 'Welcome';
      var description = 'Hello, mysql';
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}`,
        `<a href="/create">create</a>`
      );
      res.writeHead(200);
      res.end(html);
    })
  },
  page: (req,res,queryData) => {
    db.query(`SELECT * FROM topic`, function (err, topics) {
      if(err){
        throw err;
      }
      db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id =?`,[queryData.id], function (err2, topic) {
        if(err2) {
          throw err2;
        }
        console.log(topic)
        var title = topic[0].title;
        var description = topic[0].description;
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}
          <p>by. ${topic[0].name} - ${topic[0].profile}</p>
          <p>created -${topic[0].created}</p>`,
          ` <a href="/create">create</a>
              <a href="/update?id=${queryData.id}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
              </form>`
        );
        
        res.writeHead(200);
        res.end(html);
      })
    })
  },
  create: (req,res) => {
    db.query(`SELECT * FROM topic`, function (err, topics) {
      db.query(`SELECT * FROM author`, function(err2, authors) {
      var title = 'Create';
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `
        <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
            ${template.authorSelect(authors)}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,
        `<a href="/create">create</a>`
      );
      res.writeHead(200);
      res.end(html);
    })
      });
  },
  create_process:(req,res) => {
    var body = '';
    req.on('data', function (data) {
      body = body + data;
    });
    req.on('end', function () {
      var post = qs.parse(body);
      db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?,?, NOW(), ?)`,
      [post.title,post.description,post.author],
      function(err, result) {
        if(err) {
          throw err;
        }
        res.writeHead(302, { Location: `/?id=${result.insertId}` });
        res.end();
      }) 
        
    });
  },
  update: (req,res,queryData) => {
    db.query(`SELECT * FROM topic`, function(err,topics){
      if(err) {
        throw err;
      }
      db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id],function(err2, topic) {
        if(err2) {
          throw err2
        }
        db.query(`SELECT * FROM author`, function(err2, authors) {
        var list = template.list(topics);
        var html = template.HTML(topic[0].title, list,
          `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${topic[0].id}">
              <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
              <p>
                <textarea name="description" placeholder="description">${topic[0].description}</textarea>
              </p>
              <p>
              ${template.authorSelect(authors,topic[0].author_id)}
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
          `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
        );
        res.writeHead(200);
        res.end(html);
      });
      
    });
    });
  },
  update_process: (req,res) => {
    var body = '';
    req.on('data', function (data) {
      body = body + data;
    });
    req.on('end', function () {
      var post = qs.parse(body);
      db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
      [post.title,post.description,post.author,post.id],
      function(err) {
        if(err) {
          throw err;
        }
          res.writeHead(302, { Location: `/?id=${post.id}` });
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
      db.query(`DELETE FROM topic WHERE id=? `,[post.id],function(err) {
        if(err) {
          throw err;          
        }
        res.writeHead(302, { Location: `/` });
          res.end();
      })
    });
  }
}