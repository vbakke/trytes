/**
 * trytes.js
 * 
 * Deals with "converting" to and from trytes.
 *  
 * A little glossary for _this_ package:
 *  - trit: equivalent to bit, just trinary instead of binary.
 *  - tryte: a collective noun for any trinary tryte, independent on number of trits.
 *  - tryte3: a tryte of 3 trits, (may hold values of 0-26).
 *  - tryte5: a tryte of 5 trits, (may hold values of 0-242).
 *  - tryte6: a tryte of 6 trits, of 2 "IOTA trytes" (e.g. 'KB'), may hold values of 0-728.
 *  - tryte character: in IOTA a string representation of a tryte3, i.e 9 + A-Z.
 *  - tryte string: a text string containing tryte characters. Equivalent to a hex string "FF" that has 2 letters, and not the value (255 or 0xFF).
 *  - tryte value: just a number, like the number 42, stored internally in whatever way. Outside the boundaries for a tryte3, may be a legal value for tryte5 and tryte6. 
 * 
 * A little note about conversions:
 *  - convert: a conversion must work equally in both directions, such as a byte to a character, and a character to a byte. On the other hand, a tryte3 may be "converted" to a (tryte) character, but not all characters may be converted to a tryte3. 
 * Therefore, I try to use a different word. Such as:
 *  - encode/decode: A tryte3 may be encoded to a (tryte) character, and may be reverted by decoding it back. This does not imply that all characters may be decoded to a tryte3.
 *  - shifting: in binary you may shift bites left and right. Equivalent, we may shift trits left and right when going from tryte3 to tryte5 and vice versa.
 * 
 * Directions:
 * - Order in all array and strings, are with least significant value first, ending with most significant. (Opposite for normal numbers, but following the IOTA standard.)
 */

const TRYTE_CHARS = '9ABCDEFGHIJKLMNOPQRSTUVWXYZ';         // All legal tryte3 characters
const POWEROF3 = [1, 3, 9, 27, 3 * 27, 9 * 27, 27 * 27];   // Pre calculated 3^i


/**
 * Encode tryte3 strings (e.g. 'KB9Z') to array of bytes, Uint8Array.
 * 
 * Under the hood, it: 
 *  - converts tryte characters (9 + A-Z) to its corresponding trey3 values (0-26)
 *  - then, shifts the tryte3 (0-26), to tryte5 (0-242).
 * In other words, it not really converted to bytes, but to tryte5. But this may be stored inside bytes.
 * 
 * Last byte may contain a padding code, to indicate if and how many tryte3s should be removed,
 * when decoding back to original form.
 * 
 * @param {*} tryte3Str, texts tring with tryte chars (9 + A-Z), such as an IOTA seed, address, etc.
 * @returns Uint8Array A representation of the trytes, stored within an 8-bit byte.
 */
function encodeTryteStringAsBytes(tryte3Str) {
    let tryte3Values = convertTryte3CharsToValues(tryte3Str);

    let tryte5Values = _shiftTrytes(tryte3Values, 3, 5);

    return new Uint8Array(tryte5Values);
}

/**
 * Decode bytes back to the original tryte string (e.g. 'KB9Z').
 * 
 * Under the hood, the "bytes" can only hold tryte5 values (0-242), which are:
 *  - shifted from tryte5 (0-242) to tryte3 (0-26) values
 *  - then converted from tryte3 to a tryte character (9 + A-Z)
 * The last byte may contain a flag for removing some trailing zero values (or '9' characters).
 * 
 * @param {*} bytes Array of values from 0-242
 * @returns A tryte3 string, containing only characters (9 + A-Z)
 */
function decodeTryteStringFromBytes(bytes) {
    let tryte3Values = _shiftTrytes(bytes, 5, 3);

    let tryte3Str = convertTryte3ValuesToChars(tryte3Values);
    return tryte3Str;
}




/**
 * Shifting trits in arrays of tryte values, e.g. from tryte3 to tryte5, or vice versa
 *  
 * @param {*} fromArray Array of the original tryte values
 * @param {*} sizeFrom  Numer of trits in the original tryte values
 * @param {*} sizeTo Number of trits in the new "converted" tryte
 * 
 * @returns an array of tryte values
 */
function _shiftTrytes(fromArray, sizeFrom, sizeTo) {
    let toArray = [];
    let trits = 0;
    let tmpTryte = 0;
    let padding = 0;

    for (let i = 0; i < fromArray.length; i++) {
        // Verify boundaries (exception for the last element)
        if (fromArray[i] > POWEROF3[sizeFrom]) {
            padding = fromArray[i];
            break;
        }

        // Add new trits into the tryte
        let factor = POWEROF3[trits]; // = 3^trits
        trits += sizeFrom;
        tmpTryte += fromArray[i] * factor;

        // If more 
        while (trits >= sizeTo) {
            let tryte = tmpTryte % POWEROF3[sizeTo];
            tmpTryte = (tmpTryte - tryte) / POWEROF3[sizeTo];
            trits -= sizeTo;
            toArray.push(tryte);
        }
    }
    while (trits > 0) {
        let newTryte = tmpTryte % POWEROF3[sizeTo];
        tmpTryte = (tmpTryte - newTryte) / POWEROF3[sizeTo];
        trits -= sizeTo;
        toArray.push(newTryte);
    }


    if (sizeTo > sizeFrom) {
        // If going up in size, a padding code may be added at the end
        if (trits < 0) {
            toArray.push(Math.floor(trits / sizeFrom));
        }
    } else {
        // When going down in size, check if any padding characters should be removed
        if (padding != 0) {
            let minus1 = fromArray.slice(-1); // Get -1 in the same type as fromArray (i.e. 255 for UINT8)
            minus1[0] = -1;

            let skip = minus1[0] - padding + 1;
            //console.log("skip last ", (skip), "chars");
            toArray = toArray.slice(0, -skip);
        }
    }
    //console.log('Converted '+fromArray+' from ' + sizeFrom + '-' + sizeTo + ': Length: ' + fromArray.length + '-' + toArray.length + ': Remaining trits: ' + trits);
    return toArray;
}


/**
 * Convert a tryte string (9+A-Z), to an array of tryte3 values (0-26)
 * 
 * @param {*} tryte3Str a tryte string, e.g. "KB0Z"
 * 
 * @returns  Array of tryte3 valules, e.g. [11, 2, 0, 26]
 *
 */
function convertTryte3CharsToValues(tryte3Str) {
    let tryte3Values = new Array(tryte3Str.length);
    for (let i = 0; i < tryte3Str.length; i++) {
        let value = TRYTE_CHARS.indexOf(tryte3Str[i]);
        if (value < 0)
            return null;
        tryte3Values[i] = value;
    }
    return tryte3Values;
}

/**
 * Convert an array of tryte3 values (0-26) to a tryte string (9+A-Z)
 * 
 * @param {*} tryte3Values Array of tryte3 valules, e.g. [11, 2, 0, 26]
 * 
 * @returns a tryte string, e.g. "KB0Z"
 * 
 */
function convertTryte3ValuesToChars(tryte3Values) {
    let tryte3Str = "";
    let value = 0;
    for (let i = 0; i < tryte3Values.length; i++) {
        value = tryte3Values[i];
        if (value < 0 || value >= TRYTE_CHARS.length)
            return null;
        tryte3Str += TRYTE_CHARS[value];
    }
    return tryte3Str;
}

module.exports = {
    encodeTryteStringAsBytes,
    decodeTryteStringFromBytes,
};