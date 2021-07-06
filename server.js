const express = require('express');
const app = express();

const cors = require('cors');
const setHeaders = require('./src/functions/setHeader');
let fs = require('fs');

const generate_exercises = require('./src/functions/generate_exercises');

const jwt = require('jsonwebtoken');
const registSchema = require('./src/functions/registValidation');
const loginSchema = require('./src/functions/loginValidation');
const authenticateJWT = require('./src/functions/authenticateJWT');
const createTxt = require('./src/functions/createTxt');
const deleteZip = require('./src/functions/deleteZip');

const firebase = require('firebase');
require('firebase-admin');
const firebaseConfig = require('./src/functions/firebaseConfig');
require('express');
firebase.initializeApp(firebaseConfig);
const admin = firebase.auth();
const database = firebase.database();

const port = process.env.PORT || 8080;
const refreshTokenSecret = 'thisisatokensecret';
let refreshTokens = [];

app.use(cors());

app.use(setHeaders);

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.post('/addcategory', async (req, res) => {
  try{
    const { category } = req.body;
    await database.ref('exercises/' + category)
    .set({'title': category, 'tips':''}) 
    .then( () => {
      res.send({'state':'added'});
    })
    .catch((error) => {
      res.send(error);
    })
  } catch (e) {
    res.send({code: 400, message: "Actualy fields are required!"});
  }
});

app.post('/deletecategory', async (req, res) => {
  try{
    const { category } = req.body;
    await database.ref('exercises/' + category)
    .remove() 
    .then( () => {
      res.send({'state':'deleted'});
    })
    .catch((error) => {
      res.send(error);
    })
  } catch (e) {
    res.send({code: 400, message: "Actualy fields are required!"});
  }
});

app.post('/addexercise', async (req, res) => {
  try{
    const { category, exercise } = req.body;
    await database.ref('exercises/' + category + '/tips/' + exercise)
    .set({'name': exercise})
    .then( () => {
      res.send({'state':'added'});
    })
    .catch((error) => {
      res.send(error);
    })
  } catch (e) {
    res.send({code: 400, message: "Actualy fields are required!"});
  }
});

app.post('/deleteexercise', async (req, res) => {
  try{
    const { category, exercise } = req.body;
    await database.ref('exercises/' + category + '/tips/' + exercise)
    .remove()
    .then( () => {
      res.send({'state':'deleted'});
    })
    .catch((error) => {
      res.send(error);
    })
  } catch (e) {
    res.send({code: 400, message: "Actualy fields are required!"});
  }
});

app.post('/page', authenticateJWT, async (req, res) => {
  const { token } = req.body;

  if (!token) {
      return res.json({code: 401, message: "Token is missing in /token!"});;
  }

  if (!refreshTokens.includes(token)) {
      return res.json({code: 403, message: "Token is wrong in /token 1!"});
  }

  await jwt.verify(token, refreshTokenSecret, (err, user) => {
      if (err) {
          return res.json({code: 403, message: "Token is wrong in /token 2!"});
      }
      res.json({
          "token": token
      });
  });
});

app.post('/login', async (req, res) => {
  try{
    const { email, password } = req.body;

    if(email === "admin@administration.adm" && password === "admin")
    {
      res.send({ "token": "administration" });
      res.end();
    }
    else
      await loginSchema.validateAsync(req.body)
      .then( () => {
        admin.signInWithEmailAndPassword(email, password)
        .then( () => { 
          if(!admin.currentUser.emailVerified){
            admin.signOut();
            res.json({code: 400, message: "Registration is not verified!"});
          }
          else
          {
            const accessToken = jwt.sign({ 
                email: email,  
                password: password
              }, 
              refreshTokenSecret,
              { expiresIn: '2h' }
            );

            refreshTokens.push(accessToken);
            
            res.send({
              "token": accessToken
            });
          }
        })
        .catch((error) => {
          res.send({code: 400, message: error.message});
        })
    })  
    .catch((error) => {
      res.send({code: 400, message: error.message});
    })
  } catch (e) {
    res.json({code: 400, message: "Both fields are required!"});
  }
});

app.post('/regist', async (req, res) => {
  try{
    const { fname, lname, email, password, teacher } = req.body;

    await registSchema.validateAsync(req.body)
    .then( () => { 
      admin.createUserWithEmailAndPassword(email, password)
      .then( () => {
        admin.currentUser.sendEmailVerification()
        .then( () => {
          database.ref('users/' + admin.currentUser.uid)
          .set({
              fname: fname,
              lname: lname,
              email: email,
              password: password,
              teacher: teacher
          })
          .then( () => {
            res.send({'status': 'Validated'})
          })
          .catch((error) => {
            res.send(error);
          })
        })
        .catch((error) => {
          res.send(error);
        })
      })
      .catch((error) => {
        res.send(error);
      })
    })
    .catch((error) => {
      res.send(error);
    })
  } catch (e) {
    res.send({code: 400, message: "All fields are required!"});
  }
});

app.post('/logout', (req, res) => {
  const { token } = req.body;
  if(token != "administration")
    refreshTokens = refreshTokens.filter(t => t !== token);

  res.json({code: 100, message: "Logged out!"});
});

app.post('/forgotten_pass', async (req, res) => {
  try{
    const { email } = req.body;

    await admin.sendPasswordResetEmail(email)
    .then( () => {
      res.send({'status': 'Sent'})
    })
    .catch((error) => {
      res.send({code: 400, message: error.message});
    })
  } catch (e) {
  res.send({code: 400, message: "Both fields are required!"});
}
})

app.post('/exercises', async (req, res) => {
  let exercises = [];
  try{
    await database.ref('exercises')
    .once('value')
    .then((ex) => {
      ex.forEach(cat => {
        let tips = [];
        cat.forEach(cat2 => {
          cat2.forEach(ex => {
            tips.push({'name': ex.val().name});
          })
        });
        exercises.push({
          'title': cat.val().title,
          'tips': tips
        })
      });
    })
    .then(()=>{
      res.send({'exercises': exercises});
    })
    .catch((error) => {
      res.send({code: 400, message: error.message});
    })
  } catch (e) {
    res.send({code: 400, message: "Something wrong in database!"});
  }
});

app.post('/generate', async (req, res) => {
  let all_exercises = [];
  let all_categories = [];

  await database.ref('exercises')
    .once('value')
    .then((ex) => {
      ex.forEach( cat => {
        all_categories.push( cat.val().title );
        let tips = [];
        cat.forEach(cat2 => {
          cat2.forEach( (ex,j) => {
            tips.push({ 'name' : ex.val().name });
          })
        });
        all_exercises.push({
          'title': cat.val().title,
          'tips': tips
        })
      });
    })
    .catch((error) => {
      res.send({code: 400, message: error.message});
    })
  const { token, exercises, params } = req.body;

  if (!token) {
    return res.json({code: 401, message: "Token is missing in /token!"});;
  }

  if (!refreshTokens.includes(token)) {
    return res.json({code: 403, message: "Token is wrong in /token 1!"});
  }

  await jwt.verify(token, refreshTokenSecret, (err, user) =>  {
    if (err) {
        return res.json({code: 403, message: "Token is wrong in /token 2!"});
    }

    const ex = JSON.parse(exercises);
    const par = JSON.parse(params);

    createTxt(all_exercises, all_categories, ex, par, token);

    res.json({
        "token": token
    });
  });
});

app.get('/download', async (req, res) => {
  const token = req.headers.authorization.replace('Bearer ','');
  const file = './src/files/' + token + '.zip';

  if (!token) {
    return res.json({code: 401, message: "Token is missing in /token!"});;
  }

  if (!refreshTokens.includes(token)) {
    return res.json({code: 403, message: "Token is wrong in /token 1!"});
  }

  await jwt.verify(token, refreshTokenSecret, (err) =>  {
    if (err) {
        return res.json({code: 403, message: "Token is wrong in /token 2!"});
    }
    res.download(file);
    setTimeout(() => deleteZip(file), 0);
  });
});

app.listen(port, () => {
  console.log(`Education app listening at http://localhost:${port}`);
})