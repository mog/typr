var Particle = () => {

	var ctx;
	var $container;

	var width = window.innerWidth;
	var height = window.innerHeight;

	var particles = [];

	var init = () => {
		ctx = document.createElement('canvas').getContext('2d');
		ctx.canvas.width = width;
		ctx.canvas.height = height;

		// get container element
		$container = document.querySelector(Config.viewContainerElement);
		//add canvas to DOM
		$container.appendChild(ctx.canvas);

		particles = [];

		render();
	};

	function render() {
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = Config.textColorPalette[Config.textColor];

		var p;

		for (var i = 0; i < particles.length; i++) {

			p = particles[i];

			p.time = p.time - p.life;
			p.x = p.x - (p.speedHorz * p.direction);
			p.y = p.y - p.speedUp;
			p.speedUp = Math.min(p.size, p.speedUp - 1);
			p.spinVal = p.spinVal + p.spinSpeed;

			var x = p.x - (p.size / 2);
			var y = p.y - (p.size / 2);
			var rot = p.spinVal * Math.PI / 180
			ctx.save();

			ctx.globalAlpha = ((p.time / p.otime) / 2) + .25;
			ctx.translate(x, y);
			ctx.rotate(rot);
			ctx.fillRect(0, 0, p.size, p.size);
			ctx.rotate(-rot);
			ctx.translate(-x, -y);

			ctx.restore();
		}

		//remove dead
		particles = particles.filter((p) => {
			return !(p.time <= 0 || p.x <= -p.size || p.x >= width + p.size || p.y >= width + p.size);
		});

		requestAnimationFrame(render);
	}

	var add = (x, y, size) => {
		for (var i = 0; i < 30; i++) {

			var t = (1 + (.5 * Math.random())) * 1000;
			var d = Math.min((Math.random() + .1), 1);
			var actualSize = Math.random() * (size / 10);
			particles.push({
				speedHorz: Math.random() * 10,
				speedUp: Math.random() * 25,
				spinVal: 360 * Math.random(),
				spinSpeed: ((36 * Math.random())) * (Math.random() <= .5 ? -1 : 1),
				otime: t,
				time: t,
				x: x,
				y: y,
				direction: Math.random() > .5 ? -1 : 1,
				life: 10 + (Math.random() * actualSize/5),
				size: actualSize
			})
		}
	}

	var onResize = () => {
		width = window.innerWidth;
		height = window.innerHeight;

		ctx.canvas.width = width;
		ctx.canvas.height = height;
	}

	init();

	return {
		add: add,
		onResize: onResize
	}

}