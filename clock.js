var Clock = () => {

	var ctx;
	var $container;

	var width = window.innerWidth;
	var height = window.innerHeight;

	var currentFontSize = 181/617*(width*.162);

	var init = () => {
		ctx = document.createElement('canvas').getContext('2d');
		ctx.canvas.width = width;
		ctx.canvas.height = height;

		// get container element
		$container = document.querySelector(Config.viewContainerElement);
		//add canvas to DOM
		$container.appendChild(ctx.canvas);

		setLetterSpacing();

		render();
	};

	function padZero(number) {
		if (number < 10) {
			number = '0' + number;
		}

		return number + '';
	}

	function render() {
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = Config.textColorPalette[1];

		var today = new Date();
		var h = padZero(today.getHours());
		var m = padZero(today.getMinutes());
		var s = padZero(today.getSeconds());

		// make clock as large as logo in other corner
		currentFontSize = 181/617*(width*.162); // actually .13
		
		var time = `${h}:${m}:${s}`;
		ctx.font = currentFontSize + 'px ' + Config.textFontList[0];

		ctx.textBaseline = "top";

		if(Config.isPongEnabled){
			//move time in upper middle
			ctx.textAlign = "center";
			ctx.fillText(time, width / 2, height * .03);
		} else {
			//top left
			ctx.textAlign = "left";
			ctx.fillText(time, height * .03, height * .03);
		}
		
/*
		//timestamp
		var timestamp = Math.floor((new Date()).getTime() / 1000);
		ctx.textBaseline = "middle";
		var timestampFontSize = currentFontSize/ctx.measureText(timestamp).width * ctx.measureText(time).width;
		ctx.font = timestampFontSize + 'px ' + Config.textFontList[0];
		ctx.fillText(timestamp, height * .03, height - height * .03);
*/
		requestAnimationFrame(render);
	}

	function setLetterSpacing(){
		ctx.canvas.style.letterSpacing = (-currentFontSize / 8) + 'px';
	}

	function onResize() {
		setLetterSpacing();

		width = window.innerWidth;
		height = window.innerHeight;

		ctx.canvas.width = width;
		ctx.canvas.height = height;
	}

	init();

	return {
		onResize: onResize
	}
}