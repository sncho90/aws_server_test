const express    = require('express');
const mysql      = require('mysql2');
const dbconfig   = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);
const cors    = require("cors");
const bodyParser = require('body-parser');
let userName = "sncho";
let user_id = 1;

const app = express();

// configuration =========================
app.set('port', process.env.PORT || 3001);

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Root');
});

app.use(cors());

// post 요청 시 값을 객체로 바꿔줌
app.use(express.urlencoded({ extended: false })) 

app.get('/user', (req, res) => {
  connection.query('SELECT * from user', (error, rows) => {
    if (error) throw error;
    console.log('User info is: ', rows);
    res.send(rows);
  });
});

/*(app.post('/userName', (req, res) => {
  const get_userName = req.body.userName;
  console.log(req.body.userName);
  console.log(req.body);
  console.log(get_userName);
  res.send(get_userName);
});*/

/*app.get('/user_id', (req, res) => {
  connection.query('SELECT id from user where userName = ?',
  [userName], 
  (error, rows) => {
    if (error) throw error;
    console.log('user_id is: ', rows);
    res.send(rows);
  });
});*/


app.get('/community', (req, res) => {
  connection.query('SELECT * from community', (error, rows) => {
    if (error) throw error;
    console.log('community info is: ', rows);
    res.send(rows);
  });
});

app.get('/community_dat', (req, res) => {
  connection.query('SELECT * from community_dat', (error, rows) => {
    if (error) throw error;
    console.log('User info is: ', rows);
    res.send(rows);
  });
});

app.post('/community_dat/get', (req, res) => {
  const c_id = req.body.frontC_id;
  connection.query('select * from community_dat where c_id=?',
  [c_id],
  (err, response) => {
    if(err) {
      console.log(err);
    } else {
      res.send("datgul sended.");
    }
  })
});

app.get('/qna', (req, res) => {
  connection.query('SELECT * from qna', (error, rows) => {
    if (error) throw error;
    console.log('community info is: ', rows);
    res.send(rows);
  });
});

app.get('/qna_dat', (req, res) => {
  connection.query('SELECT * from qna_dat', (error, rows) => {
    if (error) throw error;
    console.log('User info is: ', rows);
    res.send(rows);
  });
});

app.post('/qna_dat/get', (req, res) => {
  const q_id = req.body.frontQ_id;
  connection.query('select * from qna_dat where q_id=?',
  [q_id],
  (err, response) => {
    if(err) {
      console.log(err);
    } else {
      res.send("datgul sended.");
    }
  })
})

app.post("/user/plus", (req, res) => {
  const userName = req.body.frontUserName;
  const userPassword = req.body.frontUserPassword;
  const user_level = req.body.frontUser_level;
  const user_email = req.body.frontUser_email;

  connection.query("Insert into user (userName, userPassword, user_level, user_email) VALUES (?,?,?,?)",
  [userName, userPassword, user_level, user_email],
  (err, response) => {
    if(err) {
      console.log(err);
    } else {
      console.log("value inserted")
    }
  })
})

app.post("/community/plus", (req, res) => {
  const user_userName = req.body.frontUser_userName;
  console.log(user_userName);
  const c_title = req.body.frontC_title;
  console.log(c_title);
  const c_contents = req.body.frontC_contents;
  console.log(c_contents);
  const c_createDate = req.body.frontC_createDate;
  console.log(c_createDate);

  connection.query(
    "INSERT INTO community (user_userName, c_title, c_contents, c_createDate, c_updateDate) VALUES (?,?,?,?,?)",
    [user_userName, c_title, c_contents, c_createDate, c_createDate],
    //콜백함수
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send("value Inserted");
      }
    }
  );
});

app.post("/community_dat/plus", (req, response) => {
  const user_userName = req.body.frontUser_userName;
  console.log(user_userName);
  const community_c_id = req.body.frontC_id;
  console.log(community_c_id);
  const c_d_contents = req.body.frontC_d_contents;
  console.log(c_d_contents);
  const c_d_date = req.body.frontC_d_date;
  console.log(c_d_date);

  connection.query(
    "INSERT INTO community_dat (community_c_id, user_userName, c_d_contents, c_d_date) VALUES (?,?,?,?)",
    [community_c_id, user_userName, c_d_contents, c_d_date],
    //콜백함수
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        response.send("value Inserted");
      }
    }
  );
});

app.post("/qna/plus", (req, res) => {
  const user_userName = req.body.frontUser_userName;
  console.log(user_userName);
  const q_title = req.body.frontQ_title;
  console.log(q_title);
  const q_contents = req.body.frontQ_contents;
  console.log(q_contents);
  const q_createDate = req.body.frontQ_createDate;
  console.log(q_createDate);

  connection.query(
    "INSERT INTO qna (user_userName, q_title, q_contents, q_createDate, q_updateDate) VALUES (?,?,?,?,?)",
    [user_userName, q_title, q_contents, q_createDate, q_createDate],
    //콜백함수
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send("value Inserted");
      }
    }
  );
});

app.post("/qna_dat/plus", (req, response) => {
  const user_level = req.body.frontUser_level;
  const user_userName = req.body.frontUser_userName;
  console.log(user_userName);
  const qna_q_id = req.body.frontQ_id;
  console.log(qna_q_id);
  const q_d_contents = req.body.frontQ_d_contents;
  console.log(q_d_contents);
  const q_d_date = req.body.frontQ_d_date;
  console.log(q_d_date);

  connection.query(
    "INSERT INTO community_dat (qna_q_id, user_userName, q_d_contents, q_d_date) VALUES (?,?,?,?)",
    [qna_q_id, user_userName, q_d_contents, q_d_date],
    //콜백함수
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        response.send("value Inserted");
      }
    }
  );
});

app.delete("/user/delete", (req, res) => {
  const id = req.body.frontId;
  connection.query(
    "Delete from user where id=?", [id],
    (err, response) => {
      if(err) {
        console.log(err);
      }
      else {
        res.send("value deleted");
      }
    }
  )
})

app.delete("/community/delete", (req, res) => {
  //res.header("Access-Control-Allow-Origin", "*");
  const c_id = req.body.frontC_id;
  connection.query(
    "Delete from community where c_id=?;",
    [c_id],
    (err, respose) => {
      if(err) {
        console.log(err);
      }
      else {
        res.send("value deleted");
      }
    }
  )
});

app.delete("/community_dat/delete", (req, res) => {
  //res.header("Access-Control-Allow-Origin", "*");
  const c_d_id = req.body.frontC_d_id;
  connection.query(
    "Delete from community where c_d_id=?;",
    [c_d_id],
    (err, respose) => {
      if(err) {
        console.log(err);
      }
      else {
        res.send("value deleted");
      }
    }
  )
});

app.delete("/qna/delete", (req, res) => {
  //res.header("Access-Control-Allow-Origin", "*");
  const q_id = req.body.frontQ_id;
  connection.query(
    "Delete from community where q_id=?;",
    [q_id],
    (err, respose) => {
      if(err) {
        console.log(err);
      }
      else {
        res.send("value deleted");
      }
    }
  )
});

app.delete("/qna_dat/delete", (req, res) => {
  //res.header("Access-Control-Allow-Origin", "*");
  const q_d_id = req.body.frontQ_d_id;
  connection.query(
    "Delete from community where q_d_id=?;",
    [q_d_id],
    (err, respose) => {
      if(err) {
        console.log(err);
      }
      else {
        res.send("value deleted");
      }
    }
  )
});

app.post("/user/update", (req, res) => {
  const id = req.body.frontId;
  const userName = req.body.frontUserName;
  const userPassword = req.body.frontUserPassword;
  const user_level = req.body.frontUser_level;
  const user_email = req.body.frontUser_email;

  connection.query("update user set userName=?, userPassword=?, user_level=?, user_email=? where id=?",
  [userName, userPassword, user_level, user_email, id],
  (err, response) => {
    if(err) {
      console.log(err);
    } else {
      console.log("value updated");
    }
  })
})

app.post("/community/update", (req, res) => {
  const c_id = req.body.frontC_id;
  const c_title = req.body.frontC_title;
  const c_contents = req.body.frontC_contents;
  const c_updateDate = req.body.frontC_updateDate;

  connection.query(
    "update community set c_titl=?, c_contents=?, c_updateDate=? where c_id=?",
    [c_title, c_contents, c_updateDate, c_id],
    (err, response) => {
      if(err) {
        console.log(err);
      }
      else {
        res.send("value updated");
      }
    }
  )
});

app.post("/qna/update", (req, res) => {
  const q_id = req.body.frontQ_id;
  const q_title = req.body.frontQ_title;
  const q_contents = req.body.frontQ_contents;
  const q_updateDate = req.body.frontQ_updateDate;

  connection.query(
    "update community set q_title=?, q_contents=?, q_updateDate=? where q_id=?",
    [q_title, q_contents, q_updateDate, q_id],
    (err, response) => {
      if(err) {
        console.log(err);
      }
      else {
        res.send("value updated");
      }
    }
  )
});

app.post("/community/search", (req, res) => {
  const search = req.body.frontSearch;

  connection.query(
    "select * from community where c_title like '%'?'%'", [search],
    (err, response) => {
      if(err) {
        console.log(err);
      } else {
        res.send("search completed");
      }
    }
  )
});

app.post("/qna/search", (req, res) => {
  const search = req.body.frontSearch;

  connection.query(
    "select * from qna where q_title like '%'?'%'", [search],
    (err, response) => {
      if(err) {
        console.log(err);
      } else {
        res.send("search completed");
      }
    }
  )
});

//app.use(cors({
  //origin: "*",                // 출처 허용 옵션
  //credentials: true,          // 응답 헤더에 Access-Control-Allow-Credentials 추가
  //optionsSuccessStatus: 200,  // 응답 상태 200으로 설정
//}))

app.listen(3001, () => {
  console.log('Express server listening on port 3001');
});
