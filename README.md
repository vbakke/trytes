# trytes
This prject is currently discussing how to convert between trytes and bytes in a good way, that may be implemented in most programming languages. 


Currently this project does not contain any code.\
That might change. 

# What's a tryte?
Some treat 3 trits as a tryte.\
Some treat 5 trits as a tryte.\
Some treat 6 trits as a tryte.\
(Just as there were 7-bits and 8-bits bytes at the beginning of time.)

Here we'll use the `tryte3`, `tryte5` and `tryte6` to indicate which tryte we are talking about. 

# How do we fit the square peg in the round hole?
We need to both put square pegs in round holes, as well as the round pegs in the square holes.

There's going to be some wasted space, no matter how we solve this.

* tryte3 can hold values 0-26
* tryte5 can hold values 0-242
* byte8 can hold values 0-255
* tryte6 can hold values 0-728

One cannot convert down this chain, without restricting the input.

Adding two-bytes Unicode does not help. It just creates another step in the pyramid, with same drawback when moving the opposite direction.

Read the [wiki](https://github.com/vbakke/trytes/wiki) and the [issues](https://github.com/vbakke/trytes/issues) for more info.
