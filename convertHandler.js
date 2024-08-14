class ConvertHandler {
  constructor() {
    this.convertionObject = {
      gal: {
        factor: 3.78541,
        name: "gallons",
        newUnit: "L"
      },
      L: {
        factor: 0.264172,
        name: "liters",
        newUnit: "gal"
      },
      lbs: {
        factor: 0.453592,
        name: "pounds",
        newUnit: "kg"
      },
      kg: {
        factor: 2.204624,
        name: "kilograms",
        newUnit: "lbs"
      },
      mi: {
        factor: 1.60934,
        name: "miles",
        newUnit: "km"
      },
      km: {
        factor: 0.62137273665,
        name: "kilometers",
        newUnit: "mi"
      }
    };
  }

  roundTo5 = (num) => Math.round(num * 100000) / 100000;

  parseFraction = (fraction) => {
    const [numerator, denominator] = fraction.split("/");
    if (isNaN(numerator) || isNaN(denominator)) {
      return "invalid number";
    }
    if (!numerator || !denominator) {
      return "invalid number";
    }
    if (fraction.split("/").length !== 2) {
      return "invalid number";
    }
    return numerator / denominator;
  };

  getNum = (input) => {
    let result;
    try {
      result = input.match(/[\d|\.|\/]+/)[0];
    } catch (err) {
      result = "1"; // Default to "1" as a string if no numerical input is provided.
    }
    if (result.includes("/")) {
      result = this.parseFraction(result);
    }
    if (isNaN(result)) {
      return "invalid number";
    }
    return Number(result); // Ensure the result is a number.
  };

  getUnit = (input) => {
    let result;
    try {
      result = input.match(/[a-zA-Z]+/)[0].toLowerCase();
    } catch (err) {
      return "invalid unit";
    }
    if (result === "l") {
      result = "L";
    }
    if (!this.convertionObject.hasOwnProperty(result)) {
      return "invalid unit";
    }
    return result;
  };

  getReturnUnit = (initUnit) => {
    return this.convertionObject[initUnit].newUnit;
  };

  spellOutUnit = (unit) => {
    return this.convertionObject[unit].name;
  };

  convert = (initNum, initUnit) => {
    if (initNum === "invalid number" || initUnit === "invalid unit") {
      return "invalid conversion";
    }
    let result = initNum * this.convertionObject[initUnit].factor;
    return this.roundTo5(result);
  };

  getString = (initNum, initUnit, returnNum, returnUnit) => {
    if (initNum === "invalid number" && returnUnit === "invalid unit") {
      return "invalid number and unit";
    } else if (initNum === "invalid number") {
      return "invalid number";
    } else if (returnUnit === "invalid unit") {
      return "invalid unit";
    }
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
}

module.exports = ConvertHandler;
