const express = require('express');
const router = express.Router();
const moment = require('moment');
const fs = require('fs');

router.get('/', (req, res) => {
  fs.readFile('date.json', (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      let jsonObject = JSON.parse(data);
      let origDate = moment(jsonObject.origDate, 'YYYY-MM-DD');
      let currentDate = moment();
      //let diff = moment.duration(currentDate.diff(origDate)).asDays();
      let diff = currentDate.diff(origDate, 'days');
      res.status(200).send(`${diff}`);
    }
  });
});

router.get('/reset', (req, res) => {
  let origDate = {
    origDate: moment()
  };

  let data = JSON.stringify(origDate);
  fs.writeFileSync('date.json', data);

  res.status(200).send(data);
});

router.get('/initialize', (req, res) => {
  let origDate = {
    origDate: moment('2019-12-07', 'YYYY-MM-DD')
  };
  let data = JSON.stringify(origDate);
  fs.writeFileSync('date.json', data);
  res.status(200).send(data);
});

module.exports = router;
