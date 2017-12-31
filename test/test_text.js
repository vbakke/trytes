var chai = require('chai');
var assert = chai.assert;
var Trytes = require('../index.js');



describe('Encode and decode Unicode strings to tryte', function () {
    let tests = [
        {
            message: '',
            expected: ''
        },
        {
            message: 'Hi',
            expected: 'RBXC'
        },
        {
            message: 'Hi',
            encoding: [undefined, 'latin1', 'utf8', 'utf16le'],
            expected: ['RBXC', 'RBXC', 'YYRBXC', 'YZRB99XC99']
        },
        {
            message: 'Blåbærøl',
            expected: 'YYLB9DFGCFQCFGDFFDFGVF9D'
        },
        {
            message: '\u2603\u{1F332}\u96EA',
            expected: 'YZC9KAFB9HWAGHRHOE'
        },
        {
            message: '\u0E10',
            expected: 'YZP9N9'
        },
        {
            message: 'AA\u0E10',
            expected: 'YYKBKBHHVFIE'
        },
        {
            message: 'AA\u0E10\u0E10',
            expected: 'YYKBKBHHVFIEHHVFIE'
        },
        {
            message: 'AA\u0E10\u0E10\u0E10',
            expected: 'YZKB99KB99P9N9P9N9P9N9'
        },
    ];

    tests.forEach(function (test) {
        var encodings = test.encoding || [undefined];
        console.log(encodings);
        var expectedTrytes = test.expected;
        console.log(encodings);
        if (typeof encodings === 'string') encodings = [encodings];
        if (typeof expectedTrytes === 'string') expectedTrytes = [expectedTrytes];
        console.log(encodings);


        for (var i = 0; i < expectedTrytes.length; i++) {
            let encoding = encodings[Math.min(i, encodings.length-1)];
            let expectedTryte = expectedTrytes[i];
            it('should convert Unicode strings ' + test.message + ' using '+encoding+' to '+expectedTryte+' and back', function () {
                var trytes = Trytes.encodeTextAsTryteString(test.message, encoding);
                var reverted = Trytes.decodeTextFromTryteString(trytes);
                //console.log('Converted ' + trytes + '-' + reverted + ', via [' + bytes.toString() + ']');
                if (expectedTryte)
                    assert.equal(trytes, expectedTryte);
                assert.equal(reverted, test.message);
            });
        }
    });
});
