const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');
const useragent = require('express-useragent');
const fs = require('fs')
const https = require('https')


const app = express();
const port = 5000;
app.use(express.static('public'))
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

mongoose.connect('mongodb+srv://darshanckick:kick@cluster0.b9m2glb.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection Error:'));
/*----------------------------------------------------*/
const key = fs.readFileSync('private.key')
const cert = fs.readFileSync('certificate.crt')
const cred = {
  key,
  cert
}

const httpsServer = https.createServer(cred, app)
httpsServer.listen(443);

/* ------------------------------------------------------ data post and get 01  ------------------------------------------------  */
const dataSchema = new mongoose.Schema({
    qno:Number,
    Question: String,
    img : String,
    option1: String,
    option2: String,
    option3: String,
    option4: String,
    answer: String
})

const DataModel = mongoose.model('Data', dataSchema);

app.delete('/api/items/1/:id', async (req, res) => {
  try {
    const item = await DataModel.findByIdAndRemove(req.params.id);
    if (!item) {
      return res.status(201).json({ Status : "BAD" });
    }
    return res.status(200).json({ Status : "OK" });
  } catch (error) {
    return res.status(100).json({ message: 'Server error' });
  }
});


app.put('/edit/put/:qno', async (req, res) => {
  const { qno } = req.params;
  const {answer} = req.params;
  const { option1, option2, option3, option4, Question } = req.body;

  try {
    // Find the user by email
    const user = await DataModel.findOne({ qno });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashqno = await bcrypt.hash(answer, saltRounds);

    // Update the user's password
    user.answer = hashqno;
    user.option1 = option1;
    user.option2 = option2;
    user.option3 = option3;
    user.option4 = option4;
    user.Question = Question;
    await user.save();

    res.status(200).json({ Status : "OK" });
  } catch (error) {
    console.error(error);
    res.status(205).json({ message: 'Internal Server Error' });
  }
});

app.get('/data/:qno', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const qno = req.params.qno;
      const user = await DataModel.find({ qno });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  }else{
    return res.json({ message : "Nothing Found"})
  }
});



app.post('/vall1', (req, res) => {
  const {value1 , qno} = req.body; 
  DataModel.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value1, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})


app.post('/vall2', (req, res) => {
  const {value2 ,qno} = req.body; 
  DataModel.findOne({qno:qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value2, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})

app.post('/vall3', (req, res) => {
  const {value3 , qno} = req.body; 
  DataModel.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value3, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})


app.post('/vall4', (req, res) => {
  const {value4 , qno} = req.body; 
  DataModel.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value4, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})

app.post('/data', async (req, res) => {
  try{
    const { img ,qno ,Question, option1, option2, option3, option4, answer } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      DataModel.create({ img ,qno ,Question, option1, option2, option3, option4, answer: hash })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});

app.get('/', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    res.setHeader("Access-Control-Allow-Credentials", "true");
    DataModel.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  }else{
    return res.json({ message : "Nothing Found"})
  }
})

/* ------------------------------------------------------ data post and get 02 ------------------------------------------------*/

const data02Schema = new mongoose.Schema({
  qno:Number,
  Question: String,
  img : String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answer: String
})

const Data02Model = mongoose.model('Data02', data02Schema);

app.delete('/api/items/2/:id', async (req, res) => {
  try {
    const item = await Data02Model.findByIdAndRemove(req.params.id);
    if (!item) {
      return res.status(201).json({ Status : "BAD" });
    }
    return res.status(200).json({ Status : "OK" });
  } catch (error) {
    return res.status(100).json({ message: 'Server error' });
  }
});


app.get('/data/02/:qno', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const qno = req.params.qno;
      const user = await Data02Model.find({ qno });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  }else{
    return res.json({ message : "Nothing Found"})
  }
});



app.post('/vall1/02', (req, res) => {
  const {value1 , qno} = req.body; 
  Data02Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value1, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/vall2/02', (req, res) => {
  const {value2 ,qno} = req.body; 
  Data02Model.findOne({qno:qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value2, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.post('/vall3/02', (req, res) => {
  const {value3 , qno} = req.body; 
  Data02Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value3, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/vall4/02', (req, res) => {
  const {value4 , qno} = req.body; 
  Data02Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value4, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.get('/dataway02', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    Data02Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  }else{
    return res.json({ message : "Nothing Found"})
  }
})


app.post('/data/02', async (req, res) => {
  try{
    const { img ,qno ,Question, option1, option2, option3, option4, answer } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      Data02Model.create({ img ,qno ,Question, option1, option2, option3, option4, answer: hash })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});

/* ------------------------------------------------------------------------- Data Post And Get 03 --------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

const data03Schema = new mongoose.Schema({
  qno:Number,
  Question: String,
  img : String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answer: String
})

const Data03Model = mongoose.model('Data03', data03Schema);


app.delete('/api/items/3/:id', async (req, res) => {
  try {
    const item = await Data03Model.findByIdAndRemove(req.params.id);
    if (!item) {
      return res.status(201).json({ Status : "BAD" });
    }
    return res.status(200).json({ Status : "OK" });
  } catch (error) {
    return res.status(100).json({ message: 'Server error' });
  }
});



app.get('/data/03/:qno', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const qno = req.params.qno;
      const user = await Data03Model.find({ qno });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});



app.post('/vall1/03', (req, res) => {
  const {value1 , qno} = req.body; 
  Data03Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value1, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/vall2/03', (req, res) => {
  const {value2 ,qno} = req.body; 
  Data03Model.findOne({qno:qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value2, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.post('/vall3/03', (req, res) => {
  const {value3 , qno} = req.body; 
  Data03Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value3, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/vall4/03', (req, res) => {
  const {value4 , qno} = req.body; 
  Data03Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value4, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.get('/dataway03', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    Data03Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})


app.post('/data/03', async (req, res) => {
  try{
    const { img ,qno ,Question, option1, option2, option3, option4, answer } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      Data03Model.create({ img ,qno ,Question, option1, option2, option3, option4, answer: hash })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});



/* -------------------------------------------------------------------------------- Data Get An Post 04 ---------------------------------------------------------*/


const data04Schema = new mongoose.Schema({
  qno:Number,
  Question: String,
  img : String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answer: String
})

const Data04Model = mongoose.model('Data04', data04Schema);



app.delete('/api/items/4/:id', async (req, res) => {
  try {
    const item = await Data04Model.findByIdAndRemove(req.params.id);
    if (!item) {
      return res.status(201).json({ Status : "BAD" });
    }
    return res.status(200).json({ Status : "OK" });
  } catch (error) {
    return res.status(100).json({ message: 'Server error' });
  }
});

app.get('/data/04/:qno', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const qno = req.params.qno;
      const user = await Data04Model.find({ qno });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  }else{
    return res.json({ message : "Nothing Found"})
  }
});



app.post('/vall1/04', (req, res) => {
  const {value1 , qno} = req.body; 
  Data04Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value1, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/vall2/04', (req, res) => {
  const {value2 ,qno} = req.body; 
  Data04Model.findOne({qno:qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value2, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.post('/vall3/04', (req, res) => {
  const {value3 , qno} = req.body; 
  Data04Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value3, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/vall4/04', (req, res) => {
  const {value4 , qno} = req.body; 
  Data04Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value4, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.get('/dataway04', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    Data04Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found" })
  }
})


app.post('/data/04', async (req, res) => {
  try{
    const { img ,qno ,Question, option1, option2, option3, option4, answer } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      Data04Model.create({ img ,qno ,Question, option1, option2, option3, option4, answer: hash })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});

/* --------------------------------------------------------------- Data Get And Post 5 ------------------------------------------------------------*/


const data05Schema = new mongoose.Schema({
  qno:Number,
  Question: String,
  img : String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answer: String
})

const Data05Model = mongoose.model('Data05', data05Schema);

app.delete('/api/items/5/:id', async (req, res) => {
  try {
    const item = await Data05Model.findByIdAndRemove(req.params.id);
    if (!item) {
      return res.status(201).json({ Status : "BAD" });
    }
    return res.status(200).json({ Status : "OK" });
  } catch (error) {
    return res.status(100).json({ message: 'Server error' });
  }
});


app.get('/data/05/:qno', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const qno = req.params.qno;
      const user = await Data05Model.find({ qno });
      if (!user) {
        return res.status(405).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});



app.post('/vall1/05', (req, res) => {
  const {value1 , qno} = req.body; 
  Data05Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value1, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/vall2/05', (req, res) => {
  const {value2 ,qno} = req.body; 
  Data05Model.findOne({qno:qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value2, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.post('/vall3/05', (req, res) => {
  const {value3 , qno} = req.body; 
  Data05Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value3, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/vall4/05', (req, res) => {
  const {value4 , qno} = req.body; 
  Data05Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value4, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.get('/dataway05', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    Data05Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})


app.post('/data/05', async (req, res) => {
  try{
    const { img ,qno ,Question, option1, option2, option3, option4, answer } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      Data05Model.create({ img ,qno ,Question, option1, option2, option3, option4, answer: hash })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});


/* ------------------------------------------------------------------------- Data Get Post 06 -------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------------*/

const data06Schema = new mongoose.Schema({
  qno:Number,
  Question: String,
  img : String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answer: String
})

const Data06Model = mongoose.model('Data06', data06Schema);


app.delete('/api/items/6/:id', async (req, res) => {
  try {
    const item = await Data06Model.findByIdAndRemove(req.params.id);
    if (!item) {
      return res.status(201).json({ Status : "BAD" });
    }
    return res.status(200).json({ Status : "OK" });
  } catch (error) {
    return res.status(100).json({ message: 'Server error' });
  }
});

app.get('/data/06/:qno', async (req, res) => {
  try {
    const qno = req.params.qno;
    const user = await Data06Model.find({ qno });
    if (!user) {
      return res.status(406).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(205).json({ message: 'Internal server error' });
  }
});



app.post('/vall1/06', (req, res) => {
  const {value1 , qno} = req.body; 
  Data06Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value1, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/vall2/06', (req, res) => {
  const {value2 ,qno} = req.body; 
  Data06Model.findOne({qno:qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value2, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.post('/vall3/06', (req, res) => {
  const {value3 , qno} = req.body; 
  Data06Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value3, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/vall4/06', (req, res) => {
  const {value4 , qno} = req.body; 
  Data06Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value4, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.get('/dataway06', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    Data06Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found" })
  }
})


app.post('/data/06', async (req, res) => {
  try{
    const { img ,qno ,Question, option1, option2, option3, option4, answer } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      Data06Model.create({ img ,qno ,Question, option1, option2, option3, option4, answer: hash })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});

/* ------------------------------------------------------------------- Get Data Post Data 07 -------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------*/

const data07Schema = new mongoose.Schema({
  qno:Number,
  Question: String,
  img : String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answer: String
})

const Data07Model = mongoose.model('Data07', data07Schema);

app.delete('/api/items/7/:id', async (req, res) => {
  try {
    const item = await Data07Model.findByIdAndRemove(req.params.id);
    if (!item) {
      return res.status(201).json({ Status : "BAD" });
    }
    return res.status(200).json({ Status : "OK" });
  } catch (error) {
    return res.status(100).json({ message: 'Server error' });
  }
});


app.get('/data/07/:qno', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const qno = req.params.qno;
      const user = await Data07Model.find({ qno });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found" })
  }
});



app.post('/vall1/07', (req, res) => {
  const {value1 , qno} = req.body; 
  Data07Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value1, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/vall2/07', (req, res) => {
  const {value2 ,qno} = req.body; 
  Data07Model.findOne({qno:qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value2, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.post('/vall3/07', (req, res) => {
  const {value3 , qno} = req.body; 
  Data07Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value3, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/vall4/07', (req, res) => {
  const {value4 , qno} = req.body; 
  Data07Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value4, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.get('/dataway07', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    Data07Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found" })
  }
})


app.post('/data/07', async (req, res) => {
  try{
    const { img ,qno ,Question, option1, option2, option3, option4, answer } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      Data07Model.create({ img ,qno ,Question, option1, option2, option3, option4, answer: hash })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});




/*------------------------------------------------------------- Data Get Post Put 08 ---------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------*/


const data08Schema = new mongoose.Schema({
  qno:Number,
  Question: String,
  img : String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answer: String
})

const Data08Model = mongoose.model('Data08', data08Schema);

app.delete('/api/items/8/:id', async (req, res) => {
  try {
    const item = await Data08Model.findByIdAndRemove(req.params.id);
    if (!item) {
      return res.status(201).json({ Status : "BAD" });
    }
    return res.status(200).json({ Status : "OK" });
  } catch (error) {
    return res.status(100).json({ message: 'Server error' });
  }
});


app.get('/data/08/:qno', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const qno = req.params.qno;
      const user = await Data08Model.find({ qno });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found" })
  }
});



app.post('/vall1/08', (req, res) => {
  const {value1 , qno} = req.body; 
  Data08Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value1, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/vall2/08', (req, res) => {
  const {value2 ,qno} = req.body; 
  Data08Model.findOne({qno:qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value2, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.post('/vall3/08', (req, res) => {
  const {value3 , qno} = req.body; 
  Data08Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value3, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/vall4/08', (req, res) => {
  const {value4 , qno} = req.body; 
  Data08Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value4, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.get('/dataway08', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    Data08Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})


app.post('/data/08', async (req, res) => {
  try{
    const { img ,qno ,Question, option1, option2, option3, option4, answer } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      Data08Model.create({ img ,qno ,Question, option1, option2, option3, option4, answer: hash })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});












































































/* -------------------------------------------------------------------------- User Phrase Data ----------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/






const UserdataSchema = new mongoose.Schema({
  Data: String
})

const UserDataModel = mongoose.model('User_data', UserdataSchema);


app.post('/userdata', async (req, res) => {
  try{
    const {Data } = req.body;
    bcrypt.hash(Data, 10)
    .then(hash => {
      UserDataModel.create({Data : hash })
      res.status(200).json("OK");
    })
  } catch (error) {
    res.status(400).json("BAD");
  }

});




















const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if(!token) {
    return res.json('The token is missing')
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if(err) {
        return res.json("The token is wrong")
      } else {
        req.email = decoded.email;
        next()
      }
    })
  }
}

app.get('/logout', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    res.clearCookie('token');
    return res.json({Status : "OK"})
  } else{
    return res.json({ message : "Nothing Found"})
  }
})

const valkey = "292165673816767389872"

app.get('/valid', verifyUser, (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    return res.json({email: req.email})
  }else{
    return res.json({ message : "API is Secure"})
  }
})


    const ValidIdSchema = new mongoose.Schema({
      email : String,
      valid: String,
      Time : String,
      trID : String
      
    });
    
    const ValIDModel = mongoose.model('Valid_ID', ValidIdSchema)


    app.get('/validd/:email', async (req, res) => {
      const { key } = req.query;
      if(key === valkey){
        try {
          const email = req.params.email;
          const user = await ValIDModel.findOne({ email });
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          res.json(user);
        } catch (error) {
          res.status(205).json({ message: 'Internal server error' });
        }
      } else{
        return res.json({ message : "Nothing Found"})
      }
    });

    app.post('/validid/post', async (req, res) => {
      try {
        const { email, valid , trID} = req.body;
        const Time = new Date().toLocaleTimeString();
        const newPost = new ValIDModel({ email, Time, valid, trID });
        await newPost.save();
        res.status(201).json({ Status : "OK", post: newPost });
      } catch (err) {
        res.status(205).json({ error: err.message });
      }
    });

    app.post('/validtr/id', async (req, res) => {
      const { trID } = req.body;
      
      // Check if the email exists in the database
      const user = await ValIDModel.findOne({ trID });
    
      if (user) {
        res.status(200).json({Status : 'OK'});
      } else {
        res.status(210).json({Status : 'BAD'});
      }
    });


const TraIdSchema = new mongoose.Schema({
  email : String,
  trID : String,
  Time : String
  
});

const TrIdModel = mongoose.model('TR_ID', TraIdSchema)



app.post('/trid/id', async (req, res) => {
  const { trID } = req.body;
  
  // Check if the email exists in the database
  const user = await TrIdModel.findOne({ trID });

  if (user) {
    res.status(200).json({Status : 'OK'});
  } else {
    res.status(210).json({Status : 'BAD'});
  }
});



app.post('/trid', async (req, res) => {
  try {
    const { email, trID } = req.body;
    const Time = new Date().toLocaleTimeString();
    const newPost = new TrIdModel({ email, Time, trID });
    await newPost.save();
    res.status(201).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});


app.get('/trid/data', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    TrIdModel.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})

















const AmountSchema = new mongoose.Schema({
  amount : String,
  email : String,
  time: String
})

const AmountModel = mongoose.model('Amount_Fix', AmountSchema)


app.put('/amount/data/put/:email', async (req, res) => {
  const { email } = req.params;
  const { amount } = req.body;

  try {
    // Find the user by email
    const user = await AmountModel.findOne({ email });
    const time = new Date().toLocaleTimeString();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.amount = amount;
    user.time = time
    await user.save();

    res.status(200).json({ Status : "OK" });
  } catch (error) {
    console.error(error);
    res.status(205).json({ message: 'Internal Server Error' });
  }
});

app.get('/amount/dataLength', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const dataLength = await AmountModel.countDocuments();
      
      res.json({ length: dataLength });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching data length' });
    }
  } else{
    return res.json({message : "Nothing Found"})
  }
});


app.post('/amount/data/fix', async (req, res) => {
  try {
    const { amount , email } = req.body;
    const time = new Date().toLocaleTimeString();
    const newPost = new AmountModel({ amount,email ,time});
    await newPost.save();
    res.status(201).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});

app.get('/amount/data', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    AmountModel.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})

const GifWonDataSchema = new mongoose.Schema({
  gifno1 : String,
    gifname : String,
    gifdisc : String,
    gifimgurl: String,
    giftime : String,
    time : String,
    email1: String,
    rank: String
});

const GifWonDataModel = mongoose.model('Gif_won_Data', GifWonDataSchema);

app.get('/gif/won/data/:email1', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const email1 = req.params.email1;
      const user = await GifWonDataModel.find({ email1 });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});

app.post('/check/won/data', async (req, res) => {
  const { email1 } = req.body;
  
  // Check if the email exists in the database
  const user = await GifWonDataModel.findOne({ email1 });

  if (user) {
    res.status(200).json({Status : 'OK'});
  } else {
    res.status(200).json({Status : 'None'});
  }
});

app.post('/gif/won/data', async (req, res) => {
  try {
    const { gifno1, gifname, gifdisc, gifimgurl, giftime,rank,email1 } = req.body;
    const time = new Date().toLocaleString();
    const newPost = new GifWonDataModel({ gifno1, gifname, gifdisc, gifimgurl, giftime, rank, email1, time});
    await newPost.save();
    res.status(201).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});

const GifDataSchema = new mongoose.Schema({
  gifno : String,
  gifname : String,
  gifdisc : String,
  gifimgurl: String,
  giftime : String,
  time : String
});

const GifDataModel = mongoose.model('Gif_Data', GifDataSchema);

app.get('/all/gif/data', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    GifDataModel.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})

app.post('/gif/data', async (req, res) => {
  try {
    const { gifno, gifname, gifdisc, gifimgurl, giftime } = req.body;
    const time = new Date().toLocaleString();
    const newPost = new GifDataModel({ gifno, gifname, gifdisc, gifimgurl, giftime, time});
    await newPost.save();
    res.status(201).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});


app.get('/gif/data/:gifno', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const gifno = req.params.gifno;
      const user = await GifDataModel.find({ gifno });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});



const AdmchatSchema = new mongoose.Schema({
  chat : String,
  time : String,
  email : String,
  usernm : String,
  role : String    
});

const AdmChatModel = mongoose.model('admin_Chat', AdmchatSchema)


app.get('/admchat/:email', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const email = req.params.email;
      const user = await AdmChatModel.find({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({message : "Nothing Found"})
  }
  
});

app.get('/admchat1/:email', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const email = req.params.email;
      const user = await AdmChatModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
  
});

app.post('/admchat/post', async (req, res) => {
  try {
    const { email, chat,usernm, role } = req.body;
    const time = new Date().toLocaleString();
    const newPost = new AdmChatModel({ email, time, chat ,usernm, role});
    await newPost.save();
    res.status(201).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});




const PrizeSchema = new mongoose.Schema({
  email : String,
  total: String,
  time: String
    
});

const PrizeModel = mongoose.model('Total_Prizes', PrizeSchema)

app.get('/prize/data', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    PrizeModel.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})

app.put('/star/data/put/:email', async (req, res) => {
  const { email } = req.params;
  const { total } = req.body;
  try {
    // Find the user by email
    const user = await PrizeModel.findOne({ email });
    const time = new Date().toLocaleString();

    if (!user) {
      return res.status(201).json({ Status : "BAD" });
    }

    user.total = total;
    user.time = time
    await user.save();

    res.status(200).json({ Status : "OK" });
  } catch (error) {
    console.error(error);
    res.status(205).json({ message: 'Internal Server Error' });
  }
});

app.get('/total/prize/dataLength', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const dataLength = await PrizeModel.countDocuments();
      
      res.json({ length: dataLength });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching data length' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});

app.post('/prizzzess', async (req, res) => {
  try {
    const { email, total } = req.body;
    const time = new Date().toLocaleTimeString();
    const newPost = new PrizeModel({ email, time, total });
    await newPost.save();
    res.status(201).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});

/* ------------ star 5 ----------*/

const Star5Schema = new mongoose.Schema({
  email : String,
  total: String,
  time: String
    
});

const Star5Model = mongoose.model('star5', Star5Schema)

app.get('/prize/05/data', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    Star5Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})

app.put('/star5/data/put/:email', async (req, res) => {
  const { email } = req.params;
  const { total } = req.body;

  try {
    // Find the user by email
    const user = await Star5Model.findOne({ email });
    const time = new Date().toLocaleTimeString();

    if (!user) {
      return res.status(201).json({ Status : "BAD" });
    }

    user.total = total;
    user.time = time
    await user.save();

    res.status(200).json({ Status : "OK" });
  } catch (error) {
    console.error(error);
    res.status(205).json({ message: 'Internal Server Error' });
  }
});

app.get('/star/05/dataLength', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const dataLength = await Star5Model.countDocuments();
      
      res.json({ length: dataLength });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching data length' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});

app.post('/prizzzess/05', async (req, res) => {
  try {
    const { email, total } = req.body;
    const time = new Date().toLocaleTimeString();
    const newPost = new Star5Model({ email, time, total });
    await newPost.save();
    res.status(201).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});


/* ------------ star 4 ----------*/

const Star4Schema = new mongoose.Schema({
  email : String,
  total: String,
  time: String
    
});

const Star4Model = mongoose.model('star4', Star4Schema)

app.get('/prize/04/data', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    Star4Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})

app.put('/star4/data/put/:email', async (req, res) => {
  const { email } = req.params;
  const { total } = req.body;

  try {
    // Find the user by email
    const user = await Star4Model.findOne({ email });
    const time = new Date().toLocaleTimeString();

    if (!user) {
      return res.status(201).json({ Status : "BAD" });
    }

    user.total = total;
    user.time = time
    await user.save();

    res.status(200).json({ Status : "OK" });
  } catch (error) {
    console.error(error);
    res.status(205).json({ message: 'Internal Server Error' });
  }
});

app.get('/star/04/dataLength', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const dataLength = await Star4Model.countDocuments();
      
      res.json({ length: dataLength });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching data length' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});

app.post('/prizzzess/04', async (req, res) => {
  try {
    const { email, total } = req.body;
    const time = new Date().toLocaleTimeString();
    const newPost = new Star4Model({ email, time, total });
    await newPost.save();
    res.status(201).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});

/* ------------ star 3 ----------*/

const Star3Schema = new mongoose.Schema({
  email : String,
  total: String,
  time: String
    
});

const Star3Model = mongoose.model('star3', Star3Schema)

app.get('/prize/03/data', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    Star3Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})

app.put('/star3/data/put/:email', async (req, res) => {
  const { email } = req.params;
  const { total } = req.body;

  try {
    // Find the user by email
    const user = await Star3Model.findOne({ email });
    const time = new Date().toLocaleTimeString();

    if (!user) {
      return res.status(201).json({ Status : "BAD" });
    }

    user.total = total;
    user.time = time
    await user.save();

    res.status(200).json({ Status : "OK" });
  } catch (error) {
    console.error(error);
    res.status(205).json({ message: 'Internal Server Error' });
  }
});

app.get('/star/03/dataLength', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const dataLength = await Star3Model.countDocuments();
      
      res.json({ length: dataLength });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching data length' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});

app.post('/prizzzess/03', async (req, res) => {
  try {
    const { email, total } = req.body;
    const time = new Date().toLocaleTimeString();
    const newPost = new Star3Model({ email, time, total });
    await newPost.save();
    res.status(201).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});

/* ------------ star 2 ----------*/

const Star2Schema = new mongoose.Schema({
  email : String,
  total: String,
  time: String
    
});

const Star2Model = mongoose.model('star2', Star2Schema)

app.get('/prize/02/data', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    Star2Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})

app.put('/star2/data/put/:email', async (req, res) => {
  const { email } = req.params;
  const { total } = req.body;

  try {
    // Find the user by email
    const user = await Star2Model.findOne({ email });
    const time = new Date().toLocaleTimeString();

    if (!user) {
      return res.status(201).json({ Status : "BAD" });
    }

    user.total = total;
    user.time = time
    await user.save();

    res.status(200).json({ Status : "OK" });
  } catch (error) {
    console.error(error);
    res.status(205).json({ message: 'Internal Server Error' });
  }
});

app.get('/star/02/dataLength', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const dataLength = await Star2Model.countDocuments();
      
      res.json({ length: dataLength });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching data length' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});

app.post('/prizzzess/02', async (req, res) => {
  try {
    const { email, total } = req.body;
    const time = new Date().toLocaleTimeString();
    const newPost = new Star2Model({ email, time, total });
    await newPost.save();
    res.status(201).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});

/* ------------ star 1 ----------*/

const Star1Schema = new mongoose.Schema({
  email : String,
  total: String,
  time: String
    
});

const Star1Model = mongoose.model('star1', Star1Schema)

app.get('/prize/01/data', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    Star1Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else {
    return res.json({ message : "Nothing Found"})
  }
})

app.put('/star1/data/put/:email', async (req, res) => {
  const { email } = req.params;
  const { total } = req.body;

  try {
    // Find the user by email
    const user = await Star1Model.findOne({ email });
    const time = new Date().toLocaleTimeString();

    if (!user) {
      return res.status(201).json({ Status : "BAD" });
    }

    user.total = total;
    user.time = time
    await user.save();

    res.status(200).json({ Status : "OK" });
  } catch (error) {
    console.error(error);
    res.status(205).json({ message: 'Internal Server Error' });
  }
});

app.get('/star/01/dataLength', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const dataLength = await Star1Model.countDocuments();
      
      res.json({ length: dataLength });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching data length' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});

app.post('/prizzzess/01', async (req, res) => {
  try {
    const { email, total } = req.body;
    const time = new Date().toLocaleTimeString();
    const newPost = new Star1Model({ email, time, total });
    await newPost.save();
    res.status(201).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});














const winnnSchema = new mongoose.Schema({
  email : String,
  IP :String,
  Time : String,
  star : String,
  no : String,
  username : String,
  instaID : String
    
});

const WinnnModel = mongoose.model('Winnn', winnnSchema)

app.get('/winnn/data', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    WinnnModel.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})

app.get('/winnn/data/:email', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const email = req.params.email;
      const user = await WinnnModel.find({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
  
});


app.get('/wonnn/data/:no', async (req, res) => {
  const { key } = req.query;
  if( key === valkey){
    try {
      const no = req.params.no;
      const user = await WinnnModel.findOne({ no });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});



app.post('/winnn', async (req, res) => {
  try {
    const { email, IP, star, no, username, instaID } = req.body;
    const Time = new Date().toLocaleString();
    const newPost = new WinnnModel({ email, Time, IP , star, no, username, instaID});
    await newPost.save();
    res.status(201).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});


app.get('/winnn/length', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const dataLength = await WinnnModel.countDocuments();
      res.json({ dataLength });
    } catch (err) {
      console.error('Error:', err);
      res.status(205).json({ error: 'Server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});



const WonSchema = new mongoose.Schema({
  email : String,
  IP :String,
  Time : String,
  rank : String
    
});

const WonModel = mongoose.model('Won', WonSchema)

app.post('/won/id/check', async (req, res) => {
  const { email } = req.body;
  
  // Check if the email exists in the database
  const user = await WonModel.findOne({ email });

  if (user) {
    res.status(200).json({Status : 'OK'});
  } else {
    res.status(210).json({Status : 'BAD'});
  }
});


app.get('/won/length', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const dataLength = await WonModel.countDocuments();
      res.json({ dataLength });
    } catch (err) {
      console.error('Error:', err);
      res.status(205).json({ error: 'Server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});

app.get('/won/data/:email', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const email = req.params.email;
      const user = await WonModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});

app.post('/won/match', async (req, res) => {
  try {
    const { email, IP, rank } = req.body;
    const Time = new Date().toLocaleString();
    const newPost = new WonModel({ email, Time, IP, rank });
    await newPost.save();
    res.status(201).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});




const UserinfoSchema = new mongoose.Schema({
  name : String,
  username :String,
  email : String,
  picture : String,
  role: {
    default : 'user',
    type : String
  }
})
const UserinfoModel = mongoose.model('User_info', UserinfoSchema)



app.post('/api/check/nme', async (req, res) => {
  const { email } = req.body;
  
  // Check if the name exists in the database
  const user = await UserinfoModel.findOne({ email });

  if (user) {
    res.status(200).json({Status : 'OK'});
  } else {
    res.status(200).json({Status : 'BAD'});
  }
});

app.get('/users/length', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const dataLength = await UserinfoModel.countDocuments();
      res.json({ dataLength });
    } catch (err) {
      console.error('Error:', err);
      res.status(205).json({ error: 'Server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});


app.get('/user', async (req, res) => {
  const { key } = req.query;
  if( key === valkey){
    UserinfoModel.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else {
    return res.json({ message : "Nothing found"})
  }
})



app.get('/user/:email', async (req, res) => {
  const { key } = req.query;
  if( key === valkey){
    try {
      const email = req.params.email;
      const user = await UserinfoModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});



app.post('/api/check-email', async (req, res) => {
  const { email } = req.body;
  
  // Check if the email exists in the database
  const user = await UserinfoModel.findOne({ email });

  if (user) {
    res.status(200).json({Status : 'OK'});
  } else {
    res.status(200).json({Status : 'BAD'});
  }
});

app.post('/checkemail', async (req, res) => {
  const { email } = req.body;
  
  // Check if the email exists in the database
  const user = await UserphraseModel.findOne({ email });

  if (user) {
    res.status(200).json({Status : 'OK'});
  } else {
    res.status(200).json({Status : 'None'});
  }
});


app.post('/userinfo', async (req, res) => {
  try {
    const { name, username, email, picture} = req.body;
    const newPost = new UserinfoModel({ name, username, email, picture});
    await newPost.save();
    res.status(200).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});





app.post('/google/loginn', (req, res) => {
  const {email} = req.body;
  const token = jwt.sign({email: email },            
    "jwt-secret-key", {expiresIn: '1d'})
    res.cookie('token', token)
    return res.json({Status: "OK"})

})

const IpSchema = new mongoose.Schema({
  ipaddr : String
})
const IpModel = mongoose.model('IP', IpSchema)



app.post('/ippost', (req, res) => {
  try{
    const ipaddr = req.body;
    bcrypt.hash(phr1, 10)
    .then(hash => {
      IpModel.create(ipaddr)
      res.status(200).json({Status : 'OK'});
    })
  } catch (error) {
    res.status(400).json({Status : 'BAD'});
  }

});








/* checking if answer valid or not */

app.post('/userdatata1', async (req, res) => {
  try{
    const {qno ,ipaddr, value1 } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      UserDataModel.create({qno ,ipaddr, value1 })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});

app.post('/userdatata2', async (req, res) => {
  try{
    const {qno ,ipaddr, value2 } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      UserDataModel.create({qno ,ipaddr, value2 })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});

app.post('/userdatata3', async (req, res) => {
  try{
    const {qno ,ipaddr, value3 } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      UserDataModel.create({qno ,ipaddr, value3 })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});

app.post('/userdatata4', async (req, res) => {
  try{
    const {qno ,ipaddr, value4 } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      UserDataModel.create({qno ,ipaddr, value4 })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});




const WaySchema = new mongoose.Schema({
  email : String,
  way : String,
  ip :String
})
const WayModel = mongoose.model('Way', WaySchema)




app.post('/select', async (req, res) => {
  try {
    const { email, way, ip } = req.body;
    const newPost = new WayModel({ email, way, ip });
    await newPost.save();
    res.status(201).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});

app.get('/way/:email', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const email = req.params.email;
      const user = await WayModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});


app.post('/way/email', async (req, res) => {
  const { email } = req.body;
  
  // Check if the email exists in the database
  const user = await WayModel.findOne({ email });

  if (user) {
    res.status(200).json({Status : 'OK'});
  } else {
    res.status(200).json({Status : 'BAD'});
  }
});


const Way1Schema = new mongoose.Schema({
  email : String,
    qno1 : {
        default : "false",
        type : String
    },
    qno2 : {
        default : "false",
        type : String
    },
    qno3: {
        default : "false",
        type : String
    },
    qno4 : {
        default : "false",
        type : String
    },
    qno5 : {
        default : "false",
        type : String
    },
    qno6 : {
        default : "false",
        type : String
    },
    qno7 : {
        default : "false",
        type : String
    },
    qno8 : {
        default : "false",
        type : String
    },
    qno9: {
        default : "false",
        type : String
    },
    qno10 : {
        default : "false",
        type : String
    },
    qno11 : {
      default : "Yess",
      type : String
  }
    
})
const Way01Model = mongoose.model('way01', Way1Schema)

app.post('/way01', async (req, res) => {
  try {
    const { email, qno1, qno2, qno3, qno4, qno5, qno6, qno7, qno8, qno9, qno10, qno11 } = req.body;
    const newPost = new Way01Model({ email, qno1, qno2, qno3, qno4, qno5, qno6, qno7, qno8, qno9, qno10, qno11 });
    await newPost.save();
    res.status(200).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});

app.get('/way01/:email', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const email = req.params.email;
      const user = await Way01Model.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});

app.put('/way01/put/:id', async (req, res) => {
  const id = req.params.id;
  const {qno1, qno2, qno3, qno4, qno5, qno6, qno7, qno8, qno9, qno10} = req.body;
  Way01Model.findByIdAndUpdate({_id : id }, {qno1, qno2, qno3, qno4, qno5, qno6, qno7, qno8, qno9, qno10})
  .then(res => res.status(200).json({ Status : "OK" }))
  .catch(err => res.json(err))
});




const EliminateSchema = new mongoose.Schema({
  email : String,
  way : String,
  qno : String,
  IP :String,
  Time : String
})
const EliModel = mongoose.model('eliminate', EliminateSchema)


app.post('/eleminate', async (req, res) => {
  try {
    const Time = new Date().toLocaleString();
    const { email, IP, way, qno } = req.body;
    const newPost = new EliModel({ email, IP, way, qno, Time });
    await newPost.save();
    res.status(200).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});











/*---Lang Kannada---*/

const Ka1dataSchema = new mongoose.Schema({
  Lang : String,
  email: String

})

const KaLangModel = mongoose.model('kadata_Lang', Ka1dataSchema);

app.post('/lang/post/sel', async (req, res) => {
  try {
    const { email, Lang } = req.body;
    const newPost = new KaLangModel({ email, Lang});
    await newPost.save();
    res.status(200).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ Status : "Data Not Posted" });
  }
});

app.get('/lang/get/:email', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const email = req.params.email;
      const user = await KaLangModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});

app.post('/lang/put/data', async (req, res) => {
  const { email } = req.body;
  
  // Check if the email exists in the database
  const user = await KaLangModel.findOne({email});

  if (user) {
    res.status(200).json({Status : 'OK'});
  } else {
    res.status(201).json({Status : 'None'});
  }
});









































/*-----------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------- Add Kannada 01 -------------------------------------------------------------------- */


const kan01Schema = new mongoose.Schema({
  qno:Number,
  Question: String,
  img : String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answer: String
})

const KanData01Model = mongoose.model('Kan_dat_01', kan01Schema);

app.delete('/kan/add/01/api/items/1/:id', async (req, res) => {
  try {
    const item = await KanData01Model.findByIdAndRemove(req.params.id);
    if (!item) {
      return res.status(201).json({ Status : "BAD" });
    }
    return res.status(200).json({ Status : "OK" });
  } catch (error) {
    return res.status(100).json({ message: 'Server error' });
  }
});


app.get('/kan/add/01/data/01/:qno', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const qno = req.params.qno;
      const user = await KanData01Model.find({ qno });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});



app.post('/kan/add/01/vall1/01', (req, res) => {
  const {value1 , qno} = req.body; 
  KanData01Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value1, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/kan/add/01/vall2/01', (req, res) => {
  const {value2 ,qno} = req.body; 
  KanData01Model.findOne({qno:qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value2, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.post('/kan/add/01/vall3/01', (req, res) => {
  const {value3 , qno} = req.body; 
  KanData01Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value3, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/kan/add/01/vall4/01', (req, res) => {
  const {value4 , qno} = req.body; 
  KanData01Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value4, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.get('/kan/add/01/dataway01', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    KanData01Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})


app.post('/kan/add/01/data/01', async (req, res) => {
  try{
    const { img ,qno ,Question, option1, option2, option3, option4, answer } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      KanData01Model.create({ img ,qno ,Question, option1, option2, option3, option4, answer: hash })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});




  

/* -------------------------------------------- Kan 02 --------------------------------------------
----------------------------------------------------------------------------------------------------*/

const kan02Schema = new mongoose.Schema({
  qno:Number,
  Question: String,
  img : String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answer: String
})

const KanData02Model = mongoose.model('Kan_dat_02', kan02Schema);

app.delete('/kan/add/02/api/items/2/:id', async (req, res) => {
  try {
    const item = await KanData02Model.findByIdAndRemove(req.params.id);
    if (!item) {
      return res.status(201).json({ Status : "BAD" });
    }
    return res.status(200).json({ Status : "OK" });
  } catch (error) {
    return res.status(100).json({ message: 'Server error' });
  }
});


app.get('/kan/add/02/data/02/:qno', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const qno = req.params.qno;
      const user = await KanData02Model.find({ qno });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});



app.post('/kan/add/02/vall1/02', (req, res) => {
  const {value1 , qno} = req.body; 
  KanData02Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value1, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/kan/add/02/vall2/02', (req, res) => {
  const {value2 ,qno} = req.body; 
  KanData02Model.findOne({qno:qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value2, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.post('/kan/add/02/vall3/02', (req, res) => {
  const {value3 , qno} = req.body; 
  KanData02Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value3, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/kan/add/02/vall4/02', (req, res) => {
  const {value4 , qno} = req.body; 
  KanData02Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value4, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.get('/kan/add/02/dataway02', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    KanData02Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})


app.post('/kan/add/02/data/02', async (req, res) => {
  try{
    const { img ,qno ,Question, option1, option2, option3, option4, answer } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      KanData02Model.create({ img ,qno ,Question, option1, option2, option3, option4, answer: hash })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});







/* -------------------------------------------- Kan 03 --------------------------------------------
----------------------------------------------------------------------------------------------------*/

const kan03Schema = new mongoose.Schema({
  qno:Number,
  Question: String,
  img : String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answer: String
})

const KanData03Model = mongoose.model('Kan_dat_03', kan03Schema);

app.delete('/kan/add/03/api/items/3/:id', async (req, res) => {
  try {
    const item = await KanData03Model.findByIdAndRemove(req.params.id);
    if (!item) {
      return res.status(201).json({ Status : "BAD" });
    }
    return res.status(200).json({ Status : "OK" });
  } catch (error) {
    return res.status(100).json({ message: 'Server error' });
  }
});


app.get('/kan/add/03/data/03/:qno', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const qno = req.params.qno;
      const user = await KanData03Model.find({ qno });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});



app.post('/kan/add/03/vall1/03', (req, res) => {
  const {value1 , qno} = req.body; 
  KanData03Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value1, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/kan/add/03/vall2/03', (req, res) => {
  const {value2 ,qno} = req.body; 
  KanData03Model.findOne({qno:qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value2, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.post('/kan/add/03/vall3/03', (req, res) => {
  const {value3 , qno} = req.body; 
  KanData03Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value3, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/kan/add/03/vall4/03', (req, res) => {
  const {value4 , qno} = req.body; 
  KanData03Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value4, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.get('/kan/add/03/dataway03', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    KanData03Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})


app.post('/kan/add/03/data/03', async (req, res) => {
  try{
    const { img ,qno ,Question, option1, option2, option3, option4, answer } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      KanData03Model.create({ img ,qno ,Question, option1, option2, option3, option4, answer: hash })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});



/*--------------------------------04 kannada----------------------------------------
------------------------------------------------------------------------------------*/

const kan04Schema = new mongoose.Schema({
  qno:Number,
  Question: String,
  img : String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answer: String
})

const KanData04Model = mongoose.model('Kan_dat_04', kan04Schema);

app.delete('/kan/add/04/api/items/4/:id', async (req, res) => {
  try {
    const item = await KanData04Model.findByIdAndRemove(req.params.id);
    if (!item) {
      return res.status(201).json({ Status : "BAD" });
    }
    return res.status(200).json({ Status : "OK" });
  } catch (error) {
    return res.status(100).json({ message: 'Server error' });
  }
});


app.get('/kan/add/04/data/04/:qno', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const qno = req.params.qno;
      const user = await KanData04Model.find({ qno });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});



app.post('/kan/add/04/vall1/04', (req, res) => {
  const {value1 , qno} = req.body; 
  KanData04Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value1, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/kan/add/04/vall2/04', (req, res) => {
  const {value2 ,qno} = req.body; 
  KanData04Model.findOne({qno:qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value2, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.post('/kan/add/04/vall3/04', (req, res) => {
  const {value3 , qno} = req.body; 
  KanData04Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value3, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/kan/add/04/vall4/04', (req, res) => {
  const {value4 , qno} = req.body; 
  KanData04Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value4, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.get('/kan/add/04/dataway04', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    KanData04Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})


app.post('/kan/add/04/data/04', async (req, res) => {
  try{
    const { img ,qno ,Question, option1, option2, option3, option4, answer } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      KanData04Model.create({ img ,qno ,Question, option1, option2, option3, option4, answer: hash })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});












/*--------------------------------05 kannada----------------------------------------
------------------------------------------------------------------------------------*/

const kan05Schema = new mongoose.Schema({
  qno:Number,
  Question: String,
  img : String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answer: String
})

const KanData05Model = mongoose.model('Kan_dat_05', kan05Schema);

app.delete('/kan/add/05/api/items/5/:id', async (req, res) => {
  try {
    const item = await KanData05Model.findByIdAndRemove(req.params.id);
    if (!item) {
      return res.status(201).json({ Status : "BAD" });
    }
    return res.status(200).json({ Status : "OK" });
  } catch (error) {
    return res.status(100).json({ message: 'Server error' });
  }
});


app.get('/kan/add/05/data/05/:qno', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const qno = req.params.qno;
      const user = await KanData05Model.find({ qno });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});



app.post('/kan/add/05/vall1/05', (req, res) => {
  const {value1 , qno} = req.body; 
  KanData05Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value1, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/kan/add/05/vall2/05', (req, res) => {
  const {value2 ,qno} = req.body; 
  KanData05Model.findOne({qno:qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value2, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.post('/kan/add/05/vall3/05', (req, res) => {
  const {value3 , qno} = req.body; 
  KanData05Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value3, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/kan/add/05/vall4/05', (req, res) => {
  const {value4 , qno} = req.body; 
  KanData05Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value4, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.get('/kan/add/05/dataway05', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    KanData05Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})


app.post('/kan/add/05/data/05', async (req, res) => {
  try{
    const { img ,qno ,Question, option1, option2, option3, option4, answer } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      KanData05Model.create({ img ,qno ,Question, option1, option2, option3, option4, answer: hash })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});




/*--------------------------------06 kannada----------------------------------------
------------------------------------------------------------------------------------*/

const kan06Schema = new mongoose.Schema({
  qno:Number,
  Question: String,
  img : String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answer: String
})

const KanData06Model = mongoose.model('Kan_dat_06', kan06Schema);

app.delete('/kan/add/06/api/items/6/:id', async (req, res) => {
  try {
    const item = await KanData06Model.findByIdAndRemove(req.params.id);
    if (!item) {
      return res.status(201).json({ Status : "BAD" });
    }
    return res.status(200).json({ Status : "OK" });
  } catch (error) {
    return res.status(100).json({ message: 'Server error' });
  }
});


app.get('/kan/add/06/data/06/:qno', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const qno = req.params.qno;
      const user = await KanData06Model.find({ qno });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});



app.post('/kan/add/06/vall1/06', (req, res) => {
  const {value1 , qno} = req.body; 
  KanData06Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value1, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/kan/add/06/vall2/06', (req, res) => {
  const {value2 ,qno} = req.body; 
  KanData06Model.findOne({qno:qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value2, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.post('/kan/add/06/vall3/06', (req, res) => {
  const {value3 , qno} = req.body; 
  KanData06Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value3, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/kan/add/06/vall4/06', (req, res) => {
  const {value4 , qno} = req.body; 
  KanData06Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value4, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.get('/kan/add/06/dataway06', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    KanData06Model.find({})
   .then(datas => res.json(datas))
   .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})


app.post('/kan/add/06/data/06', async (req, res) => {
  try{
    const { img ,qno ,Question, option1, option2, option3, option4, answer } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      KanData06Model.create({ img ,qno ,Question, option1, option2, option3, option4, answer: hash })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});












/*--------------------------------07 kannada----------------------------------------
------------------------------------------------------------------------------------*/

const kan07Schema = new mongoose.Schema({
  qno:Number,
  Question: String,
  img : String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answer: String
})

const KanData07Model = mongoose.model('Kan_dat_07', kan07Schema);

app.delete('/kan/add/07/api/items/7/:id', async (req, res) => {
  try {
    const item = await KanData07Model.findByIdAndRemove(req.params.id);
    if (!item) {
      return res.status(201).json({ Status : "BAD" });
    }
    return res.status(200).json({ Status : "OK" });
  } catch (error) {
    return res.status(100).json({ message: 'Server error' });
  }
});


app.get('/kan/add/07/data/07/:qno', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const qno = req.params.qno;
      const user = await KanData07Model.find({ qno });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});



app.post('/kan/add/07/vall1/07', (req, res) => {
  const {value1 , qno} = req.body; 
  KanData07Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value1, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/kan/add/07/vall2/07', (req, res) => {
  const {value2 ,qno} = req.body; 
  KanData07Model.findOne({qno:qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value2, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.post('/kan/add/07/vall3/07', (req, res) => {
  const {value3 , qno} = req.body; 
  KanData07Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value3, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/kan/add/07/vall4/07', (req, res) => {
  const {value4 , qno} = req.body; 
  KanData07Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value4, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.get('/kan/add/07/dataway07', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    KanData07Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})


app.post('/kan/add/07/data/07', async (req, res) => {
  try{
    const { img ,qno ,Question, option1, option2, option3, option4, answer } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      KanData07Model.create({ img ,qno ,Question, option1, option2, option3, option4, answer: hash })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});












/*--------------------------------08 kannada----------------------------------------
------------------------------------------------------------------------------------*/

const kan08Schema = new mongoose.Schema({
  qno:Number,
  Question: String,
  img : String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answer: String
})

const KanData08Model = mongoose.model('Kan_dat_08', kan08Schema);

app.delete('/kan/add/08/api/items/8/:id', async (req, res) => {
  try {
    const item = await KanData08Model.findByIdAndRemove(req.params.id);
    if (!item) {
      return res.status(201).json({ Status : "BAD" });
    }
    return res.status(200).json({ Status : "OK" });
  } catch (error) {
    return res.status(100).json({ message: 'Server error' });
  }
});


app.get('/kan/add/08/data/08/:qno', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const qno = req.params.qno;
      const user = await KanData08Model.find({ qno });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});



app.post('/kan/add/08/vall1/08', (req, res) => {
  const {value1 , qno} = req.body; 
  KanData08Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value1, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/kan/add/08/vall2/08', (req, res) => {
  const {value2 ,qno} = req.body; 
  KanData08Model.findOne({qno:qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value2, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.post('/kan/add/08/vall3/08', (req, res) => {
  const {value3 , qno} = req.body; 
  KanData08Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value3, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



app.post('/kan/add/08/vall4/08', (req, res) => {
  const {value4 , qno} = req.body; 
  KanData08Model.findOne({qno: qno})
  .then(user => {
    if(user) {
      bcrypt.compare(value4, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})




app.get('/kan/add/08/dataway08', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    KanData08Model.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }
})


app.post('/kan/add/08/data/08', async (req, res) => {
  try{
    const { img ,qno ,Question, option1, option2, option3, option4, answer } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      KanData08Model.create({ img ,qno ,Question, option1, option2, option3, option4, answer: hash })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});




/*--------------------------------------------------------------------------------------------------------
--------------------------------------------------- Ading star -------------------------------------------*/


const TstarSchema = new mongoose.Schema({
  time : String,
  email : String,
  stars : String
});

const StarTotalModel = mongoose.model('T_star', TstarSchema)

app.get('/get/tot/star', (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    StarTotalModel.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
  } else{
    return res.json({ message : "Nothing Found"})
  }

})

app.post('/star/tot', async (req, res) => {
  try {
    const time = new Date().toLocaleString();
    const { email, stars} = req.body;
    const newPost = new StarTotalModel({ email, stars, time});
    await newPost.save();
    res.status(200).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(205).json({ error: err.message });
  }
});

app.put('/star/tot/put/:id', async (req, res) => {
  const id = req.params.id;
  const {stars} = req.body;
  const time = new Date().toLocaleString();
  StarTotalModel.findByIdAndUpdate({_id : id }, {stars, time})
  .then(res => res.status(200).json({ Status : "OK" }))
  .catch(err => res.json(err))
});

app.get('/star/tot/one/get/:email', async (req, res) => {
  const { key } = req.query;
  if(key === valkey){
    try {
      const email = req.params.email;
      const user = await StarTotalModel.find({ email });
      if (!user) {
        return res.status(204).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(205).json({ message: 'Internal server error' });
    }
  } else{
    return res.json({ message : "Nothing Found"})
  }
});

app.post('/chek/star', async (req, res) => {
  const { email } = req.body;
  
  // Check if the name exists in the database
  const user = await StarTotalModel.findOne({ email });

  if (user) {
    res.status(200).json({Status : 'OK'});
  } else {
    res.status(200).json({Status : 'BAD'});
  }
});