var chai = require('chai');
var assert = chai.assert;
var Trytes = require('../index.js');


describe('Various lengths of Z trytes', function () {
    it('should convert tryte strings of 0 to 6, to byte and back', function () {

        var str = 'ZZZZZZ';
        for (var i = 0; i < str.length; i++) {
            var trytes = str.substr(0, i);
            var bytes = Trytes.encodeTryteStringAsBytes(trytes);
            var reverted = Trytes.decodeTryteStringFromBytes(bytes);
            console.log('Converted '+trytes+'-'+reverted+', via '+bytes.toString());
            assert.equal(trytes, reverted);
        }
    });
});



describe('Various length of 9 trytes', function () {
    it('should convert tryte strings of 0 to 6, to byte and back', function () {

        var str = '999999';
        for (var i = 0; i < str.length; i++) {
            var trytes = str.substr(0, i);
            var bytes = Trytes.encodeTryteStringAsBytes(trytes);
            var reverted = Trytes.decodeTryteStringFromBytes(bytes);
            console.log('Converted '+trytes+'-'+reverted+', via '+bytes.toString());
            assert.equal(trytes, reverted);
        }
    });
});



describe('Encode and decode seeds and addresses', function () {
    let testTrytes = [
        '',
        'KB9Z',
        'ZYXWVUTSRQPONMLKJIHGFEDCBA9',
        '9ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        'A9TEST9SEED99RMDKUTQVGFMYPYGAQVOTGJCEFIEELKHRBCZYKAOQQWFRYNGYDAEIKTHQJINZDPYNYOS9',
        'A9TEST9ADDRESS99BTFKEHPQNGELDPWJSZCLRKU9EAIMDLNCOAIEI9JISIPWTSFUWIUCFWYXNUEPVAESHEQPKIHHNB'];

    it('should convert tryte strings to byte and back', function () {

        for (var i = 0; i < testTrytes.length; i++) {
            var trytes = testTrytes[i];
            var bytes = Trytes.encodeTryteStringAsBytes(trytes);
            var reverted = Trytes.decodeTryteStringFromBytes(bytes);
            console.log('Converted '+trytes+'-'+reverted+', via ['+bytes.toString()+']');
            assert.equal(trytes, reverted);
        }
    });
});


