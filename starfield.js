// mog
/*jslint devel: true, browser: true */
var Starfield = function() {

	"use strict";

	var PARTICLE_COUNT = 2000,
		palette = ['#db2128', '#1a5dad', '#e0d9c9'],
		sprites = [starfieldSprite1, starfieldSprite2, starfieldSprite3],
		spritesSpecial = [starfieldSprite1special, starfieldSprite2special, starfieldSprite3special, starfieldSprite4special, starfieldSprite5special],
		maxZ,
		particles = [],
		_ctx,
		_width,
		_height,
		_speed = .06,
		_centerX,
		_centerY,
		MIN_DIAMETER,
		MAX_DIAMETER;

	var init = () => {
		var ctx = document.createElement('canvas').getContext('2d');
		var width = window.innerWidth;
		var height = window.innerHeight;
		ctx.canvas.width = width;
		ctx.canvas.height = height;

		// get container element
		var $container = document.querySelector(Config.viewContainerElement);
		//add canvas to DOM
		$container.appendChild(ctx.canvas);

		setContext(ctx);

		sprites = [starfieldSprite1, starfieldSprite2, starfieldSprite3];
		spritesSpecial = [starfieldSprite1special, starfieldSprite2special, starfieldSprite3special, starfieldSprite4special, starfieldSprite5special];

		//maxZ = Math.sqrt(Math.pow(_width/2, 2) + Math.pow(_height/2, 2));

		//populate start array
		for (var i = 0; i < PARTICLE_COUNT; i++) {
			var p = {};
			p.x = ((Math.random() * _centerX - 1) + 1) * ((Math.random()) > .5 ? -1 : 1);
			p.y = ((Math.random() * _centerY - 1) + 1) * ((Math.random()) > .5 ? -1 : 1);
			p.w = Random.range(MIN_DIAMETER, MAX_DIAMETER);
			p.size = Math.min(Math.random() + .1, 1);
			p.z = Random.range(maxZ * .3, maxZ);
			p.oldX = false;
			p.oldY = false;
			p.colorIndex = Math.round(Random.range(0, palette.length));
			p.spriteIndex = Math.floor(Random.range(0, sprites.length - 1));
			p.spriteSpecialIndex = Math.floor(Random.range(0, spritesSpecial.length - 1));
			p.color = palette[p.colorIndex];
			particles.push(p);
		}

		render();
	};

	var frameDelta = Date.now();
	var render = () => {
		_ctx.fillStyle = '#1e1e1e';
		_ctx.globalAlpha = .4;
		_ctx.fillRect(0, 0, _width, _height);
		//fillRect(0, 0, _width, _height);
		moveParticle(Date.now() - frameDelta);
		frameDelta = Date.now();
		window.requestAnimationFrame(render);
	}

	function onResize() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		_ctx.canvas.width = width;
		_ctx.canvas.height = height;

		setContext(_ctx);
	}

	function setContext(ctx) {

		_ctx = ctx;

		_width = _ctx.canvas.width;
		_height = _ctx.canvas.height;

		maxZ = _width - _height;
		//maxZ = Math.sqrt(Math.pow(_width, 2) + Math.pow(_height, 2));

		_ctx.lineWidth = 3;

		MIN_DIAMETER = 2 / 1920 * _width;
		MAX_DIAMETER = 7 / 1920 * _width;

		setCenter(_width / 2, _height / 2);
	}

	function setCenter(centerX, centerY) {
		_centerX = centerX;
		_centerY = centerY;
	}

	var needsSort = true;

	function moveParticle(frameDelta) {

		if (Config.starfieldSprite === 1) {
			sprites = [starfieldSprite1, starfieldSprite2, starfieldSprite3];
			//PARTICLE_COUNT = 200;
			//particles = [];
		} else if (Config.starfieldSprite === 2) {
			spritesSpecial = [starfieldSprite1special, starfieldSprite2special, starfieldSprite3special, starfieldSprite4special, starfieldSprite5special];
			//PARTICLE_COUNT = 200;
			//particles = [];
		} else {
			PARTICLE_COUNT = 2000;
		}

		var i = 0,
			p,
			newX,
			newY;

		//z-sort particles
		if (needsSort === true) {
			particles = particles.sort((a, b) => {
				return b.z - a.z;
			});
			needsSort == false;
		}
		//_ctx.save();

		for (i; i < PARTICLE_COUNT; i++) {

			if (particles[i] === undefined) {
				particles[i] = {
					z: -1
				};
				//particles[i].z = -1;
			}

			p = particles[i];

			p.z = p.z - (_speed * frameDelta);

			if (p.z < 0) {

				p.x = ((Math.random() * _centerX - 1) + 1) * ((Math.random()) > .5 ? -1 : 1);
				p.y = ((Math.random() * _centerY - 1) + 1) * ((Math.random()) > .5 ? -1 : 1);
				p.w = Random.range(MIN_DIAMETER, MAX_DIAMETER);
				p.size = Math.min(Math.random() + .1, 1);
				//p.z = Random.range(0, maxZ);
				p.z = Random.range(maxZ * .999, maxZ);

				p.oldX = false;
				p.oldY = false;
				p.colorIndex = Math.round(Random.range(0, palette.length));
				p.spriteIndex = Math.floor(Random.range(0, sprites.length - 1));
				p.spriteSpecialIndex = Math.floor(Random.range(0, spritesSpecial.length - 1));
				p.color = palette[p.colorIndex];

				needsSort = true;
			} else {

				newX = (_centerX) + (p.x / p.z) * _width / 2;
				newY = (_centerY) + (p.y / p.z) * _height / 2;

				var trailLength = 5;
				var trailX = (_centerX) + (p.x / (p.z + trailLength)) * _width / 2;
				var trailY = (_centerY) + (p.y / (p.z + trailLength)) * _height / 2;
				var graceOffset = _height / 3;

				if (((trailX >= -graceOffset) && (trailX <= _width + graceOffset)) && (trailY >= -graceOffset) && (trailY <= _height + graceOffset)) {
					//if (((newX >= -p.w) && (newX <= _width + p.w)) && (newY >= -p.w) && (newY <= _height + p.w)) {

					var alpha = 0;
					if (p.z < maxZ) {
						alpha = (maxZ - p.z) / maxZ;
					}

					_ctx.globalAlpha = alpha;

					if (p.oldX) {

						// deadline logo
						if (Config.starfieldSprite === 1) {
							var scale = (maxZ - p.z) / maxZ;
							var zScale = scale / p.size;
							var maxSize = .3;

							var img = sprites[p.spriteIndex];
							var w = img.naturalWidth * maxSize * zScale;
							var h = img.naturalHeight * maxSize * zScale;
							_ctx.drawImage(sprites[p.spriteIndex], newX - w/2, newY - h/2, w, h);
						}
						//pandas <3
						else if (Config.starfieldSprite === 2) {
							var scale = (maxZ - p.z) / maxZ;
							var zScale = scale / p.size;
							var maxSize = .1;
							var img = spritesSpecial[p.spriteSpecialIndex];

							var w = img.naturalWidth * maxSize * zScale;
							var h = img.naturalHeight * maxSize * zScale;
							_ctx.drawImage(img, newX - w/2, newY - h/2, w, h);
						// starfield
						} else {
							_ctx.beginPath();
							_ctx.strokeStyle = p.color;
							_ctx.moveTo(trailX, trailY);
							_ctx.lineTo(newX, newY);
							_ctx.closePath();
							_ctx.stroke();
						}
					}

					p.oldX = newX;
					p.oldY = newY;

				} else {
					p.z = -1;
				}
			}
		}

		//_ctx.restore();
	}

	function setSpeed(newSpeed) {
		if (newSpeed) {
			_speed = newSpeed;
		}
	}

	init();

	return {
		setContext: setContext,
		render: moveParticle,
		setSpeed: setSpeed,
		setCenter: setCenter,
		onResize: onResize
	};
};