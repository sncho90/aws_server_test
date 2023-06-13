const express    = require('express');
const mysql      = require('mysql2');
const dbconfig   = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);
const cors    = require("cors");
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
//let userName = "sncho";
//let user_id = 1;

const app = express();

try {
  fs.readdirSync('uploads'); // 폴더 확인
} catch(err) {
  console.error('uploads 폴더가 없습니다. 폴더를 생성합니다.');
fs.mkdirSync('uploads'); // 폴더 생성
}

const FileFilter = (req, file, cb) => {
const typeArray = file.mimetype.split('/');
const fileType = typeArray[1];

if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg' || fileType == 'gif' || fileType == 'wwebp') {
  req.fileValidationError = null;
  console.log(fileType)
  cb(null, true);
} else {
  req.fileValidationError = "jpg,jpeg,png,gif,webp 파일만 업로드 가능합니다.";
  console.log("jpg,jpeg,png,gif,webp 파일만 업로드 가능합니다. ",fileType)
  cb(null, false)
}
}

const upload = multer({
storage: multer.diskStorage({ // 저장한공간 정보 : 하드디스크에 저장
  destination: process.env.UPLOAD_DIR || 'uploads/',
  filename(req, file, cb) { // 파일명을 어떤 이름으로 올릴지
      console.log('clear_hear1')
      const ext = path.extname(file.originalname); // 파일의 확장자
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext); // 파일이름 + 날짜 + 확장자이름으로 저장
      console.log('clear_hear2')
  }
}),
fileFilter : FileFilter,
limits: { fileSize: 10 * 1024 * 1024,files: 10,parts: 10 } // 5메가로 용량 제한
});

// configuration =========================
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Root');
});

app.use(cors());

// post 요청 시 값을 객체로 바꿔줌
app.use(express.urlencoded({ extended: false })) 

app.get('/user', (req, res) => {
  connection.query('SELECT * from user', (error, rows) => {
    if (error) {
      console.log(err);
      res.send(err);
    } else {
    console.log('User info is: ', rows);
    res.send(rows);
    }
  });
});

//짐승 이미지 추가 여러개
app.post('/transaction/img/plus_multi', upload.array('files'), async (req, res) => {
  console.log('animal adjust image');
  console.log(req.body);
  const files = req.files;
  const t_id = req.body.frontT_id;

  // 업로드된 이미지 파일들
  const imagePaths = [];
  try {
      for (const file of files) {
              const imagePath = file.path; // 이미지 파일 경로
              imagePaths.push(imagePath);
              console.log(file.path)
              // 이미지 정보를 데이터베이스에 저장
              connection.query('insert into t_img (img_path, t_id) values (?,?)',
              [file.path, t_id],
              (err, response) => {
                      if(err) {
                              console.log(err);
                              res.send(err);
                      } else {
                              console.log(response);
                              res.send(response);
                      }
              });
      }

      res.status(200).json({ success: true, imagePaths });
      } catch (err) {
              res.status(500).send('Server error');
              console.log('Error:', err);
      }
});

//짐승 이미지 추가 1개
app.post('/api/diary/animal/image', upload.single('file'), async (req, res) => {
  console.log('animal adjust image');
  console.log(req.body);
  console.log(req.file)
  const file = req.file
  const t_id = req.body.frontT_id;

  //console.log(id, animal_name, file)
  // 업로드된 이미지 파일들
  const imagePaths = [];

  try {
  const imagePath = file.path; // 이미지 파일 경로
  imagePaths.push(imagePath);
  console.log(file.path)
  // 이미지 정보를 데이터베이스에 저장
  connection.query('insert into t_img (img_path, t_id) values (?,?)',
      [file.path, t_id],
      (err, response) => {
              if(err) {
                      console.log(err);
                      res.send(err);
              } else {
                      console.log(response);
                      res.send(response);
              }
     });


    //res.status(200).json({ success: true, imagePaths });
  } catch (err) {
    res.status(500).send('Server error');
    console.log('Error:', err);
  }
});

// 짐승 이미지 불러오기
app.post('/api/diary/animal/images', async (req, res) => {
  console.log('try get image');
  //console.log(req.query);
  const t_id = req.body.frontT_id;
      let img_path;

  try {
          connection.query('select img_path from t_img where t_id = ?', [t_id],
          (err, response)=> {
              if(err) {
                      console.log(err);
                      res.send(err);
              } else {
                      console.log("img load");
                      res.send(response);
                      img_path = response;
              }
          })
          //console.log()
          const data = await fs.promises.readFile(img_path);
          //images.push(data);

          // 이미지 MIME 타입 설정
          res.setHeader('Content-Type', 'image/jpeg');

          res.write(image);

          res.end();
      } catch (err) {
      res.status(501).send('mongo error in find id');
      console.log('mongo error in find id', err);
      return;
  }
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
    if (error)  {
      console.log(err);
      res.send(err);
    } else {
    console.log('user_id is: ', rows);
    res.send(rows);
    }
  });
});*/

//게시글 전부 불러오기
app.get('/community', (req, res) => {
  connection.query('SELECT * from community', (error, rows) => {
    if (error) {
      console.log(err);
      res.send(err);
    } else {
    console.log('community info is: ', rows);
    res.send(rows);
    }
  });
});

//게시글 댓글 전부 불러오기
app.get('/community_dat', (req, res) => {
  connection.query('SELECT * from community_dat', (error, rows) => {
    if (error) {
      console.log(err);
      res.send(err);
    } else {
    console.log('community datgul info is: ', rows);
    res.send(rows);
    }
  });
});

//특정 게시물 보기
app.post('/community/detail', (req, res) => {
  const c_id = req.body.frontC_id;
  connection.query('select * from community where c_id=?',
  [c_id],
  (err, rows) => {
    if(err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(rows);
    }
  })
});

//특정 게시물의 댓글들 보기
app.post('/community_dat/get', (req, res) => {
  const c_id = req.body.frontC_id;
  connection.query('select * from community_dat where c_id=?',
  [c_id],
  (err, rows) => {
    if(err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(rows);
    }
  })
});

//qna전부 불러오기
app.get('/qna', (req, res) => {
  connection.query('SELECT * from qna', (error, rows) => {
    if (error) {
      console.log(err);
      res.send(err);
    } else {
    console.log('qna info is: ', rows);
    res.send(rows);
    }
  });
});

//특정 qna글 보기
app.post('/qna/detail', (req, res) => {
  const q_id = req.body.frontQ_id;
  connection.query('select * from qna where q_id=?',
  [q_id],
  (err, rows) => {
    if(err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(rows);
    }
  })
});

//qna 댓글 전부 불러오기
app.get('/qna_dat', (req, res) => {
  connection.query('SELECT * from qna_dat', (error, rows) => {
    if (error)  {
      console.log(err);
      res.send(err);
    } else {
    console.log('qna: ', rows);
    res.send(rows);
    }
  });
});

//특정 qna 댓글 보기
app.post('/qna_dat/get', (req, res) => {
  const q_id = req.body.frontQ_id;
  connection.query('select * from qna_dat where q_id=?',
  [q_id],
  (err, rows) => {
    if(err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(rows);
    }
  })
});

//거래 전부 불러오기
app.get('/transaction', (req, res) => {
  connection.query('SELECT * from transaction', (error, rows) => {
    if (error)  {
      console.log(err);
      res.send(err);
    } else {
    console.log('transaction: ', rows);
    res.send(rows);
    }
  });
});

//특정 거래 보기
app.post('/transaction/get', (req, res) => {
  const t_id = req.body.frontT_id;
  connection.query('select * from transaction where t_id=?',
  [t_id],
  (err, rows) => {
    if(err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(rows);
    }
  })
});

//유저 추가
app.post("/user/plus", (req, res) => {
  const name = req.body.frontName;
  const userName = req.body.frontUserName;
  const userPassword = req.body.frontUserPassword;
  const phone_num = req.body.frontPhone_num;
  const user_level = 1;
  const user_email = req.body.frontUser_email;

  connection.query("Insert into user (name, userName, userPassword, phone_num, user_level, user_email) VALUES (?,?,?,?,?,?)",
  [name, userName, userPassword, phone_num, user_level, user_email],
  (err, response) => {
    if(err) {
      console.log(err);
      res.send(err);
    } else {
      console.log("user inserted");
      res.send(response);
    }
  })
});

//게시글 추가
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
        res.send(err);
      } else {
        console.log("community inserted");
        res.send(response);
      }
    }
  );
});

//게시글 댓글 추가
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
        res.send(err);
      } else {
        response.send("community_dat Inserted");
        response.send(res);
      }
    }
  );
});

//qna글 추가
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
        res.send(err);
      } else {
        console.log("qna inserted");
        res.send(response);
      }
    }
  );
});

//qna댓글 추가
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

  if(user_level == 1)
    response.send(false);
  else {
    connection.query(
      "INSERT INTO community_dat (qna_q_id, user_userName, q_d_contents, q_d_date) VALUES (?,?,?,?)",
      [qna_q_id, user_userName, q_d_contents, q_d_date],
      //콜백함수
      (err, res) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log("qna_dat inserted");
          response.send(res);
        }
      }
    )
  }
});

app.post("/userphone_num", (req, res) => {
  const userName = req.body.frontUserName;

  connection.query(
    "Select phone_num from user where userName = ?", [userName],
    (err, response) => {
      if(err) {
        console.log(err);
        res.send(err);
      } else {
        console.log(response);
        res.send(response);
      }
    }
  )
})

//거래 추가
app.post("/transaction/plus", (req, response) => {
  const seller_userName = req.body.frontSeller_userName;
  const seller_phone = req.body.frontSeller_phone;
  const reptile_species = req.body.frontReptile_species;
  const price = req.body.frontPrice;
  const createDate = req.body.frontCreateDate;

  connection.query(
    "INSERT INTO transaction (seller_userName, seller_phone, reptile_species, price, createDate) VALUES (?,?,?,?,?)",
    [seller_userName, seller_phone, reptile_species, price, createDate],
    //콜백함수
    (err, res) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        console.log("transaction inserted");
        response.send(res);
      }
    }
  );
});

//유저 삭제
app.delete("/user/delete", (req, res) => {
  const id = req.body.frontId;
  connection.query(
    "Delete from user where id=?", [id],
    (err, response) => {
      if(err) {
        console.log(err);
        res.send(err);
      }
      else {
        console.log("user deleted");
        res.send(response);
      }
    }
  )
})

//게시글 삭제
app.delete("/community/delete", (req, res) => {
  //res.header("Access-Control-Allow-Origin", "*");
  const c_id = req.body.frontC_id;
  connection.query(
    "Delete from community where c_id=?;",
    [c_id],
    (err, response) => {
      if(err) {
        console.log(err);
        res.send(err);
      }
      else {
        console.log("community deleted");
        res.send(response);
      }
    }
  )
});

//게시글 댓글 삭제
app.delete("/community_dat/delete", (req, res) => {
  //res.header("Access-Control-Allow-Origin", "*");
  const c_d_id = req.body.frontC_d_id;
  connection.query(
    "Delete from community where c_d_id=?;",
    [c_d_id],
    (err, response) => {
      if(err) {
        console.log(err);
        res.send(err);
      }
      else {
        console.log("community_dat deleted");
        res.send(response);
      }
    }
  )
});

//qna글 삭제
app.delete("/qna/delete", (req, res) => {
  //res.header("Access-Control-Allow-Origin", "*");
  const q_id = req.body.frontQ_id;
  connection.query(
    "Delete from community where q_id=?;",
    [q_id],
    (err, response) => {
      if(err) {
        console.log(err);
        res.send(err);
      }
      else {
        console.log("qna deleted");
        res.send(response);
      }
    }
  )
});

//qna 댓글 삭제
app.delete("/qna_dat/delete", (req, res) => {
  //res.header("Access-Control-Allow-Origin", "*");
  const q_d_id = req.body.frontQ_d_id;
  connection.query(
    "Delete from community where q_d_id=?;",
    [q_d_id],
    (err, response) => {
      if(err) {
        console.log(err);
        res.send(err);
      }
      else {
        console.log("qna_dat deleted");
        res.send(response);
      }
    }
  )
});

//거래 삭제
app.delete("/transaction/delete", (req, res) => {
  //res.header("Access-Control-Allow-Origin", "*");
  const t_id = req.body.frontT_id;
  connection.query(
    "Delete from transaction where t_id=?;",
    [t_id],
    (err, response) => {
      if(err) {
        console.log(err);
        res.send(err);
      }
      else {
        console.log("transaction deleted");
        res.send(response);
      }
    }
  )
});

//유저 정보 update
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
      res.send(err);
    } else {
      console.log("user updated");
      res.send(response);
    }
  })
})

//게시글 update
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
        res.send(err);
      }
      else {
        console.log("community updated");
        res.send(response);
      }
    }
  )
});

//qna update
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
        res.send(err);
      }
      else {
        console.log("qna updated");
        res.send(response);
      }
    }
  )
});

//거래 update
app.post("/transaction/update", (req, res) => {
  const t_id = req.body.frontT_id;
  const buyer_userName = req.body.frontBuyer_userName;
  const completeDate = req.body.frontCompleteDate;

  connection.query(
    "update transaction set buyer_userName=?, completeDate=?, where t_id=?",
    [buyer_userName, completeDate, t_id],
    (err, response) => {
      if(err) {
        console.log(err);
        res.send(err);
      }
      else {
        console.log("transaction updated");
        res.send(response);
      }
    }
  )
});

//게시글 검색
app.post("/community/search", (req, res) => {
  const search = req.body.frontSearch;

  connection.query(
    "select * from community where c_title like '%'?'%'", [search],
    (err, response) => {
      if(err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(response);
        console.log(response);
      }
    }
  )
});

//qna글 검색
app.post("/qna/search", (req, res) => {
  const search = req.body.frontSearch;

  connection.query(
    "select * from qna where q_title like '%'?'%'", [search],
    (err, response) => {
      if(err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(response);
        console.log(response);
      }
    }
  )
});

//app.use(cors({
  //origin: "*",                // 출처 허용 옵션
  //credentials: true,          // 응답 헤더에 Access-Control-Allow-Credentials 추가
  //optionsSuccessStatus: 200,  // 응답 상태 200으로 설정
//}))

app.listen(3000, () => {
  console.log('Express server listening on port 3000');
});
