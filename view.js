var View = (starfield, particle) => {

  var _starfield = starfield;
  var _particle = particle;

  var ctx;
  var $container;
  var text = [];

  var width = window.innerWidth;
  var height = window.innerHeight;
  var MAX_FONT_SIZE = height;
  var currentFontSize = MAX_FONT_SIZE;

  var letterSpacingMulti = 10;

  var init = () => {
    ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    // get container element
    $container = document.querySelector(Config.viewContainerElement);
    //add canvas to DOM
    $container.appendChild(ctx.canvas);

    initFont();
    //init text
    text.push("");

    render();
  };

  var initFont = () => {
    MAX_FONT_SIZE = height;
    currentFontSize = MAX_FONT_SIZE;

    currentFont = Config.textFontList[Config.textFont];

    ctx.fillStyle = Config.textColorPalette[Config.textColor];
    // set text defaults
    ctx.font = currentFontSize + 'px ' + currentFont;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.canvas.style.letterSpacing = (-currentFontSize / letterSpacingMulti) + 'px';
  }

  // API - get new letter entered
  var onAddCharacter = (character, event) => {
    //get last line - add text
    text[text.length - 1] += character;

    updateText();
  };

  var onDeleteCharacter = (character, event) => {
    //delete character in last line
    text[text.length - 1] = text[text.length - 1].slice(0, -1);

    //keep at least one line in textArray
    if (text.length > 1) {
      //if line is empty - remove line
      if (text[text.length - 1].length === 0) {
        text.pop();
      }
    }

    updateText();
  }

  var onAddLineBreak = () => {
    text.push("");
    updateText();
  }

  var getLongestLine = (input) => {
    return input.reduce(function(a, b) {
      return ctx.measureText(a).width > ctx.measureText(b).width ? a : b;
    });
  }

  var replace = (where, what) => {
    return where.map((line) => {
      return line.split(" ").map((word) => {
        return what;
      }).join(" ");
    })
  }

  function padZero(number) {
    if (number < 10) {
      number = '0' + number;
    }

    return number + '';
  }

  var countdownArray = [];
  var replaceBangs = (where) => {
    return where.map((line) => {

      // !time
      var today = new Date();
      var h = padZero(today.getHours());
      var m = padZero(today.getMinutes());
      var s = padZero(today.getSeconds());
      var time = `${h}:${m}:${s}`;
      line = line.replace("!clock", time);

      return line;
    })
  }

  var countdownArray = [];
  var replaceTimerBang = (where) => {
    //var where = ["meow ", "katze!countdown15"];

    //find countdowns
    var currentCountdown = 0;
    where.map((line) => {
      // !countdown15
      if (line.indexOf('!timer') > -1) {
        // https://stackoverflow.com/a/1388885
        // matches strings like !countdown15 or !countdown.15
        var countdownList = line.match(/\!timer(\d*[1-9]\d*(\.\d+)?|0*\.\d*[1-9]\d*)/g) || [];

        countdownList.map((countdown) => {
          // get time from countdown
          var time = countdown.match(/(\d*[1-9]\d*(\.\d+)?|0*\.\d*[1-9]\d*)/g);

          //if there's no countdown yet - make one
          if (!countdownArray[currentCountdown]) {

            countdownArray.push({
              start: Date.now() + (time[0] * 60 * 1000),
              bang: time
            });

          } else {
            //update time if - eG from !timer1 to !timer15
            if (countdownArray[currentCountdown].bang !== time[0]) {
              countdownArray[currentCountdown].bang = time[0];
              countdownArray[currentCountdown].start = Date.now() + (time[0] * 60 * 1000);
            }
          }
          currentCountdown++;
        })
      }
    });

    //remove old timer
    if (currentCountdown !== countdownArray.length) {
      countdownArray.pop();
    }
    //console.log(currentCountdown, countdownArray.length)

    function countdownText(timestamp) {
      var delta = Math.max(0, timestamp - Date.now());
      var minutes = Math.floor(delta / 60000);
      var seconds = ((delta % 60000) / 1000).toFixed(0);
      return (seconds == 60 ? (minutes+1) + ".00" : minutes + "." + (seconds < 10 ? "0" : "") + seconds);

      //return Math.abs(Math.min(0, (Date.now() - timestamp) / 60000)).toFixed(2)
    }

    //replace countdown text
    var currentCountdown = 0;
    var result = where.map((line) => {

      while (line.match(/\!timer(\d*[1-9]\d*(\.\d+)?|0*\.\d*[1-9]\d*)/g)) {
        var matches = line.match(/\!timer(\d*[1-9]\d*(\.\d+)?|0*\.\d*[1-9]\d*)/g);
        for (var i = 0; i < matches.length; i++) {
          line = line.replace(matches[i], countdownText(countdownArray[currentCountdown].start));
          currentCountdown++;
        }
      }
      return line;
    });

    return result;
  }

  var updateText = () => {
    currentFont = Config.textFontList[Config.textFont];
    ctx.font = currentFontSize + 'px ' + currentFont;

    ctx.fillStyle = Config.textColorPalette[Config.textColor];

    var linesToRender = text;

    if (Config.replaceWords > 0) {
      linesToRender = replace(text, Config.replaceWordsWith[Config.replaceWords - 1]);
    }

    // handle bangs
    var linesToRender = replaceBangs(text);

    linesToRender = replaceTimerBang(linesToRender);

    renderText(linesToRender);
  }

  var previousLetterSpacing;
  //slim render to update bangs
  var render = () => {

    ctx.clearRect(0, 0, width, height);

    // handle bangs
    var linesToRender = replaceBangs(text);
    linesToRender = replaceTimerBang(linesToRender);

    if (Config.replaceWords > 0) {
      linesToRender = replace(text, Config.replaceWordsWith[Config.replaceWords - 1]);
    }

    //get longest line so we can meassure it's width
    var longestText = getLongestLine(linesToRender);

    //shrink font size by width
    currentFontSize = currentFontSize / ctx.measureText(longestText).width * (width * (letterSpacingMulti * .1));
    currentFontSize = Math.min(currentFontSize, MAX_FONT_SIZE);

    //shrink font size by height
    var lines = linesToRender.length;
    var lineHeight = currentFontSize;
    var textHeight = lines * lineHeight;
    var maxHeight = height * .75;

    if (textHeight > maxHeight) {
      currentFontSize = Math.min(maxHeight / lines, MAX_FONT_SIZE);
    }

    var lineHeight = currentFontSize;
    // optimization against stuttering
    var letterSpacing = (-currentFontSize / letterSpacingMulti);
    if(previousLetterSpacing !== letterSpacing){
      ctx.canvas.style.letterSpacing = letterSpacing + 'px';
      ctx.font = currentFontSize + 'px ' + currentFont;
      previousLetterSpacing = letterSpacing;
    }

    for (var line = 0; line < linesToRender.length; line++) {
      lines = linesToRender.length - 1;
      var startY = (height - lineHeight * lines) / 2;
      ctx.fillText(linesToRender[line], width / 2, startY + (line * lineHeight));
    }

    requestAnimationFrame(render);
  }

  var renderText = (input) => {
    //clear screen
    ctx.clearRect(0, 0, width, height);

    //get longest line so we can meassure it's width
    var longestText = getLongestLine(input);

    //shrink font size by width
    currentFontSize = currentFontSize / ctx.measureText(longestText).width * (width * (letterSpacingMulti*.1));
    currentFontSize = Math.min(currentFontSize, MAX_FONT_SIZE);

    //shrink font size by height
    var lines = input.length;
    var lineHeight = currentFontSize;
    var textHeight = lines * lineHeight;
    var maxHeight = height * .75;

    if (textHeight > maxHeight) {
      currentFontSize = Math.min(maxHeight / lines, MAX_FONT_SIZE);
    }

    lineHeight = currentFontSize;
    ctx.canvas.style.letterSpacing = (-currentFontSize / letterSpacingMulti) + 'px';
    ctx.font = currentFontSize + 'px ' + currentFont;

    //ctx.canvas.style.letterSpacing = (-currentFontSize / 14) + 'px';

    // draw lines
    for (var line = 0; line < input.length; line++) {
      lines = input.length - 1;
      var startY = (height - lineHeight * lines) / 2;
      ctx.fillText(input[line], width / 2, startY + (line * lineHeight));
    }

    var lastLine = line - 1;
    var letterX = width - ((width - ctx.measureText(input[lastLine]).width) / 2);
    var letterY = startY + (lastLine * lineHeight);
    _screenshakeEffect(letterX, letterY);
  }

  var onResize = () => {
    width = window.innerWidth;
    height = window.innerHeight;

    ctx.canvas.width = width;
    ctx.canvas.height = height;

    initFont();

    updateText();
  }

  var _screenshakeEffect = (letterX, letterY) => {
    if (!Config.isScreenShakeEnabled) {
      return;
    }
    var intensity = 15;
    var y = Math.random() * (intensity * 2);
    y *= Math.random() > .5 ? -1 : 1;
    var x = Math.random() * intensity;
    x *= Math.random() > .5 ? -1 : 1;
    ctx.canvas.style.transform = `translate(${y}px, ${y}px)`;
    ctx.canvas.style.transitionDuration = ".90";
    _starfield.setCenter(width / 2 - (x*2), height / 2 - (y*2));

    setTimeout(() => {
      ctx.canvas.style.transform = "";
      _starfield.setCenter(width / 2, height / 2);
    }, 75);

    // get x and y of the last letter added
    _particle.add(letterX - (currentFontSize / 3), letterY, currentFontSize);
  }

  init();

  return {
    onAddCharacter: onAddCharacter,
    onDeleteCharacter: onDeleteCharacter,
    onAddLineBreak: onAddLineBreak,
    onResize: onResize,
    onUpdate: updateText
  };
};