// keyj
// mog
/*jslint devel: true, browser: true */
var Random = (function () {
	"use strict";

	var x = 2323233,
		y = 8000085,
		z = 1333337,
		w = 4242424;

	function seed(newX, newY, newZ, newW) {
		x = newX;
		y = newY;
		z = newZ;
		w = newW;
	}

	function xor128() {
		var t = x ^ (x << 11);
		x = y;
		y = z;
		z = w;
		w = w ^ (w >>> 19) ^ (t ^ (t >>> 8));
		return (w < 0) ? (w + 4294967296) : w;
	}

	function xor128Float() {
		return (xor128() * (1 / 4294967296));
	}

	function range(min, max) {
		return xor128Float() * (max - min + 1) + min;
	}

	function color() {
		return "#" + ((1 << 24) * xor128Float() | 0).toString(16);
	}

	function uniqueID() {
		return Math.random().toString(36).substr(2, 8);
	}

	return {
		int: xor128,
		float: xor128Float,
		range: range,
		color: color,
		uniqueID: uniqueID,
		seed: seed
	};
}());