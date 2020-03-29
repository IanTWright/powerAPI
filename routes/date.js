const express = require('express');
const router = express.Router();
const moment = require('moment');
const fs = require('fs');

var currentRecord;
var prevRecord;
var bestRecord;
var origDate;

router.get('/', (req, res) => {
  loadFile('data.json')
    .then(() => {
      let recordInfo = {
        currentRecord: currentRecord,
        bestRecord: bestRecord,
        prevRecord: prevRecord
      };
      console.log(recordInfo);
      res.status(200).send(recordInfo);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.post('/reset', (req, res) => {
  loadFile('data.json')
    .then(() => {
      newObject = {
        origDate: moment(),
        prevRecord: currentRecord,
        bestRecord: bestRecord
      };

      let newData = JSON.stringify(newObject);
      fs.writeFileSync('data.json', newData);
      res.status(200).send(newData);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.post('/set', (req, res) => {
  loadFile('data.json')
    .then(() => {
      console.log(req.body);
      newObject = {
        origDate: moment(req.body.origDate, 'YYYY-MM-DD')
      };

      if (req.body.prevRecord) {
        newObject.prevRecord = req.body.prevRecord;
      } else {
        newObject.prevRecord = prevRecord;
      }

      if (req.body.bestRecord) {
        newObject.bestRecord = req.body.bestRecord;
      } else {
        newObject.bestRecord = bestRecord;
      }

      let newData = JSON.stringify(newObject);
      fs.writeFileSync('data.json', newData);
      res.status(200).send(newData);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.get('/initialize', (req, res) => {
  let origDate = {
    origDate: moment('2019-12-08', 'YYYY-MM-DD'),
    prevRecord: 71,
    bestRecord: 71
  };
  let data = JSON.stringify(origDate);
  fs.writeFileSync('data.json', data);
  res.status(200).send(data);
});

function checkRecord(jsonObject, currentRecord) {
  let prevRecord = jsonObject.prevRecord;
  let bestRecord = jsonObject.bestRecord;
  let data = {};
  if (!bestRecord) {
    bestRecord = 0;
  }

  if (currentRecord > bestRecord) {
    data.origDate = jsonObject.origDate;
    data.bestRecord = currentRecord;
    data.prevRecord = prevRecord;
    console.log('bestRecord updated');
    let newData = JSON.stringify(data);
    fs.writeFileSync('data.json', newData);

    return data.bestRecord;
  } else {
    return bestRecord;
  }
}

async function loadFile(fileName) {
  return new Promise(function(resolve, reject) {
    fs.readFile(fileName, (err, data) => {
      if (err) {
        reject(err);
      } else {
        let currentDate = moment().utcOffset(-240);
        console.log(`Current Date: ${currentDate._d}`);
        console.log(`Current Offset: ${currentDate._offset}`);
        jsonObject = JSON.parse(data);
        origDate = moment(jsonObject.origDate, 'YYYY-MM-DD');
        currentRecord = currentDate.diff(origDate, 'days');
        bestRecord = checkRecord(jsonObject, currentRecord);
        prevRecord = jsonObject.prevRecord;
        resolve();
      }
    });
  });
}

module.exports = router;
