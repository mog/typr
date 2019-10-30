var Pong = () => {
	let WIDTH = window.innerWidth;
	let HEIGHT = window.innerHeight;
	let _ctx = document.createElement('canvas').getContext('2d');

	let currentFontSize = 181/617*(WIDTH*.162);

	_ctx.canvas.width = WIDTH;
	_ctx.canvas.height = HEIGHT;
	document.body.appendChild(_ctx.canvas);

	let AMOUNT_OF_BALLS = 30;

	let _p = [];
	let _paddle = [];
	let _pointsLeft = 0;
	let _pointsRight = 0;
	let paddleWidth = 20; //20;
	let paddleHeight = paddleWidth * 4; //HEIGHT / 3;
	let paddleSpeed = 20;

	init();

	function setLetterSpacing(){
		_ctx.canvas.style.letterSpacing = (-currentFontSize / 8) + 'px';
	}

	function onResize() {
		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;

		setLetterSpacing();

		_ctx.canvas.width = WIDTH;
		_ctx.canvas.height = HEIGHT;

		_paddle[0].x = HEIGHT * .03;
		_paddle[1].x = WIDTH - (HEIGHT * .03) - paddleWidth;
	}

	function createBalls() {
		for (let i = 0; i < AMOUNT_OF_BALLS; i++) {
			let x = Math.min(1, Math.random() + .4);
			let y = Math.min(1, Math.random() + .4);

			let d = Math.min(Math.random() + .3, 1);

			_p.push({
				x: WIDTH / 2,
				y: HEIGHT / 2,
				width: d * (50 / 1920 * WIDTH),
				height: d * (50 / 1920 * WIDTH),
				sX: x * (Math.random() >= .5 ? 1 : -1),
				sY: y * (Math.random() >= .5 ? 1 : -1),
				speed: (Math.random() * (1 - d) * (paddleSpeed * .90)) + (paddleSpeed *.75),
				color: Math.floor(Random.range(1, Config.textColorPalette.length - 1))
			});
		}
	}

	function init() {

		setLetterSpacing();

		createBalls();

		_paddle.push({
			x: HEIGHT * .03,
			y: (HEIGHT - paddleHeight) / 2,
			width: paddleWidth,
			height: paddleHeight,
			sY: paddleSpeed
		});

		_paddle.push({
			x: WIDTH - (HEIGHT * .03) - paddleWidth,
			y: (HEIGHT - paddleHeight) / 2,
			width: paddleWidth,
			height: paddleHeight,
			sY: paddleSpeed
		});

		render();
	}

	function render() {

		_ctx.clearRect(0, 0, WIDTH, HEIGHT);

		if (Config.isPongEnabled) {

			_paddle.map(movePaddle);
			_paddle.map(drawPaddle);

			_p.map(drawBall);

			if (_p.length === 0) {
				createBalls();
			}

			drawPoints();
		}

		requestAnimationFrame(render);
	}

	function drawBall(ball, index, allBalls) {

		ball.x = ball.x - (ball.sX * ball.speed);
		ball.y = ball.y - (ball.sY * ball.speed);

		//bound check
		//points
		if (isPoint(ball, index, allBalls)) {
			return;
		}

		handleWallCollision(ball);

		_paddle.map((paddle) => {
			handlePaddleCollision(ball, paddle);
		});

		//draw
		_ctx.save();
		_ctx.beginPath();
		_ctx.fillStyle = Config.textColorPalette[ball.color];
		_ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
		_ctx.fill();
		_ctx.closePath();
		_ctx.restore();
	}

	function drawPoints() {
		_ctx.save();
		_ctx.fillStyle = Config.textColorPalette[0];
		_ctx.font = currentFontSize+'px DS Yakuti65R';
		_ctx.textAlign = 'left';
		_ctx.textBaseline = 'top';
		_ctx.fillText(_pointsLeft, HEIGHT * .03, HEIGHT * .03);
		_ctx.textAlign = 'right';
		_ctx.fillText(_pointsRight, WIDTH - HEIGHT * .03, HEIGHT * .03);
		_ctx.restore();
	}

	function movePaddle(paddle) {
		//find closest ball on x axis
		let closest = _p[0];

		if (!closest) {
			return;
		}

		_p.map((ball) => {
			if (Math.abs(paddle.x - ball.x) <= Math.abs(closest.x - ball.x)) {
				closest = ball;
			}
		});

		let distance = closest.y - (paddle.y + paddle.height / 2);

		if (Math.abs(distance) <= paddle.sY) {
			//only move if needed, otherwise we get jittering paddles
			return;
		} else if (closest.y <= (paddle.y + paddle.height / 2)) {
			//move paddle up
			paddle.y = paddle.y - paddle.sY;
		} else {
			paddle.y = paddle.y + paddle.sY;
		}

		paddle.y = Math.max(0, Math.min(HEIGHT - paddle.height, paddle.y));
	}

	function drawPaddle(paddle) {
		_ctx.save();
		_ctx.fillStyle = Config.textColorPalette[0];
		_ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
		_ctx.restore();
	}

	function isPoint(ball, index, allBalls) {
		if (ball.x < 0) {
			_pointsRight++;
			allBalls.splice(index, 1);
			return true;
		}

		if (ball.x > WIDTH) {
			_pointsLeft++;
			allBalls.splice(index, 1);
			return true;
		}

		return false
	}

	function handleWallCollision(ball) {
		//switch direction on hitting surface
		if (ball.y < 0 || (ball.y + ball.height) > HEIGHT) {
			ball.sY *= -1;
		}
	}

	function handlePaddleCollision(ball, paddle) {
		let w = (ball.width + paddle.width) / 2;
		let h = (ball.height + paddle.height) / 2;
		let dx = (ball.x + ball.width / 2) - (paddle.x + paddle.width / 2);
		let dy = (ball.y + ball.height / 2) - (paddle.y + paddle.height / 2);

		if ((Math.abs(dx) <= w) && (Math.abs(dy) <= h)) {
			//collision
			let wy = w * dy;
			let hx = h * dx;

			if (wy > hx) {
				if (wy > -hx) {
					//collision at the bottom
					ball.sY *= -1;
					ball.y = paddle.y + paddle.height + ball.height;
				} else {
					// on the left
					ball.sX *= -1;
					ball.x = paddle.x - ball.width;
				}
			} else {
				if (wy > -hx) {
					//on the right
					ball.sX *= -1;
					ball.x = paddle.x + paddle.width;
				} else {
					// at the top
					ball.sY *= -1;
					ball.y = paddle.y - ball.height
				}
			}
		}
	}

	return {
		onResize: onResize
	}
}