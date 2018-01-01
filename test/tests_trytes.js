var chai = require('chai');
var assert = chai.assert;
var Trytes = require('../index.js');




describe('Testing encoding and decoding seeds and addresses', function () {
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
            //console.log('Converted ' + trytes + '-' + reverted + ', via [' + bytes.toString() + ']');
            assert.equal(trytes, reverted);
        }
    });
});


describe('Testing encoding trytes as bytes and verify padding byte', function () {
    let tests = [
        { message: 'Z', bytes: [26, 244] },
        { message: 'ZZ', bytes: [242, 2, 245] },
        { message: 'ZZZ', bytes: [242, 80, 244] },
        { message: 'ZZZZ', bytes: [242, 242, 8, 244] },
        { message: 'ZZZZZ', bytes: [242, 242, 242] },
        { message: 'ZZZZZZ', bytes: [242, 242, 242, 26, 244] },
        { message: '9', bytes: [0, 244] },
        { message: '99', bytes: [0, 0, 245] },
        { message: '999', bytes: [0, 0, 244] },
        { message: '9999', bytes: [0, 0, 0, 244] },
        { message: '99999', bytes: [0, 0, 0] },
        { message: '999999', bytes: [0, 0, 0, 0, 244] },
    ];

    tests.forEach(function (test) {
        var MyTrytes = test.message;
        var excepctedBytes = test.bytes;

        it('should convert tryte string ' + MyTrytes + ' to byte ' + excepctedBytes + ' and back', function () {
            var bytes = Trytes.encodeTryteStringAsBytes(MyTrytes);
            var reverted = Trytes.decodeTryteStringFromBytes(bytes);
            //console.log('Converted ' + MyTrytes + '-' + reverted + ', via [' + bytes.toString() + ']');
            assertByteArray(bytes, excepctedBytes);

            assert.equal(MyTrytes, reverted);
        });
    });
});






function assertByteArray(actual, expected, message) {
    message = message || "";

    assert.isNotNull(actual);
    assert.isNotNull(expected);

    let match = true;
    let length = Math.min(actual.length, expected.length);
    for (var i = 0; i < length; i++) {
        if (actual[i] != expected[i]) {
            console.log('Mismatch in byte #' + i + ', expected 0x' + expected[i].toString(16) + ', but was 0x' + actual[i].toString(16) + ' ' + message);
            match = false;
        }

        assert.strictEqual(actual[i], expected[i], 'Mismatch in byte #' + i + ', expected ' + expected[i] + ' (0x' + expected[i].toString(16) + '), but was ' + actual[i] + ' (0x' + actual[i].toString(16) + ') in ' + actual.toString() + message);
    }
    assert.strictEqual(actual.length, expected.length, 'Arrays are not of the same length ' + message);
    //console.log('Assertion ',(match)?'OK':'FAILED')
}