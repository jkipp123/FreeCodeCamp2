const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  let convertHandler = new ConvertHandler();

  app.get('/api/convert', (req, res, next) => {
    try {
      const input = req.query.input;
      const initNum = convertHandler.getNum(input);
      const initUnit = convertHandler.getUnit(input);

      console.log(`Input: ${input}`);
      console.log(`Initial Number: ${initNum}`);
      console.log(`Initial Unit: ${initUnit}`);

      if (initNum === 'invalid number' && initUnit === 'invalid unit') {
        return res.status(200).json({ error: 'invalid number and unit' });
      } else if (initNum === 'invalid number') {
        return res.status(200).json({ error: 'invalid number' });
      } else if (initUnit === 'invalid unit') {
        return res.status(200).json({ error: 'invalid unit' });
      }

      const returnNum = convertHandler.convert(initNum, initUnit);
      const returnUnit = convertHandler.getReturnUnit(initUnit);

      console.log(`Return Number: ${returnNum}`);
      console.log(`Return Unit: ${returnUnit}`);

      const resultString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

      res.json({
        initNum: initNum,
        initUnit: initUnit,
        returnNum: returnNum,
        returnUnit: returnUnit,
        string: resultString
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });
};
