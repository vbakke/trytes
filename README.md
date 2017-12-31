# trytes
This project is currently discussing how to convert between trytes and bytes in a good way, that may be implemented in most programming languages. 


Currently this project ~~does not contain any~~ has now code for encoding trytes and bytes.\
~~That might change.~~  

It contains a JavaScript example for:
* encoding/decoding 'tryte3 strings' as bytes
* encoding/decoding bytes as 'tryte6 strings' (Why is this not the same? See below.)
* encoding/decoding unicode text as 'tryte6 strings'

Encoding Unicode strings to tryte strings is on the roadmap.

# What's a tryte?
People don't agree.\
Some treat 3 trits as a tryte.\
Some treat 5 trits as a tryte.\
Some treat 6 trits as a tryte.\
(Just as there were 7-bits and 8-bits bytes at the beginning of time.)

Here we'll use the `tryte3`, `tryte5` and `tryte6` to indicate which tryte we are talking about. 

# How do we fit the square peg in the round hole?
Dealing with bytes and trytes, we try to put square pegs in round holes, as well as the round pegs in the square holes.

There's going to be some wasted space, no matter how we solve this.

* tryte3 can hold values 0-26
* tryte5 can hold values 0-242
* byte8 can hold values 0-255
* tryte6 can hold values 0-728

If you want to convert, you have to go to a "bigger bucket"\
One cannot convert into "smaller buckets", without restricting the input.

# Byte <-> tryte conversion
A tryte5 may be converted into a byte8.\
But a byte8 cannot be converted into a tryte5, as is it too small to contain 243-255.\
Therefore, the byte8 must be converted to a tryte6.

(But, yet again, any tryte6 cannot be converted into a byte8.)

Therefore:
* a tryte5 may be encoded as a byte (and decoded back to its native form)
* a byte8 may be encoded as a tryte6 (and decoded back to its native form)

If your native form is trytes, use `encodeTryteStringAsBytes()` and `decodeTryteStringFromBytes()`.\
If your native form is bytes, use `encodeBytesAsTryteString()` and `decodeBytesFromTryteString()`.

Feel free to suggest better names. 

Read the [wiki](https://github.com/vbakke/trytes/wiki) and the [issues](https://github.com/vbakke/trytes/issues) for more info.


