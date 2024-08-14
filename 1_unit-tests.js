const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
    test('should correctly read a whole number input', function(){
        assert.equal(convertHandler.getNum('12 lbs'), 12, 'should return 12');
    });
    test('should correctly read a decimal number input', function(){
        assert.equal(convertHandler.getNum('12.05 lbs'), 12.05, 'should return 12.05');
    });
    test('should correctly read a fractional input', function (){
        assert.equal(convertHandler.getNum('2/5 lbs'), 0.4, 'should correctly read a fractional input');
    });
    test('should correctly read a fractional input with a decimal', function (){
        assert.equal(convertHandler.getNum('2.5/10 lbs'), 0.25, 'should correctly read a fractional input with a decimal');
    });
    test('should correctly return an error on a double-fraction', function (){
        assert.equal(convertHandler.getNum('2/5/10 lbs'), 'invalid number', 'should return invalid number');
    });
    test('should correctly default to a numerical input of 1 when no numerical input is provided.', function (){
        assert.equal(convertHandler.getNum('lbs'), 1, 'default to a numerical input of 1');
    });
    test('should correctly read each valid input unit', function (){
        assert.equal(convertHandler.getUnit('1lbs'), 'lbs', 'should correctly read each input unit');
    });
    test('should correctly return an error for an invalid input unit.', function (){
        assert.equal(convertHandler.getUnit('1xyz'), 'invalid unit', 'should return invalid unit');
    });
    test('should return the correct return unit for each valid input unit.', function (){
        assert.equal(convertHandler.getReturnUnit('lbs'), 'kg', 'should correctly return unit');
    });
    test('should correctly return the spelled-out string unit for each valid input unit.', function (){
        assert.equal(convertHandler.spellOutUnit('lbs'), 'pounds', 'should correctly return spelled-out unit');
    });
    test('should correctly convert gal to L.', function (){        
        assert.equal(convertHandler.convert(5, 'gal'), 18.92705 ,'should correctly convert gal to L');
    });
    test('should correctly convert L to gal.', function (){        
        assert.equal(convertHandler.convert(5, 'L'), 1.32086 ,'should correctly convert L to gal');
    });
    test('should correctly convert mi to km.', function (){        
        assert.equal(convertHandler.convert(5, 'mi'), 8.0467 ,'should correctly convert mi to km');
    });
    test('should correctly convert km to mi.', function (){        
        assert.equal(convertHandler.convert(5, 'km'), 3.10686 ,'should correctly convert km to mi');
    });
    test('should correctly convert lbs to kg.', function (){        
        assert.equal(convertHandler.convert(5, 'lbs'), 2.26796 ,'should correctly convert lbs to kg');
    });
    test('should correctly convert kg to lbs.', function (){        
        assert.equal(convertHandler.convert(5, 'kg'), 11.02312 ,'should correctly convert kg to lbs');
    });
});
