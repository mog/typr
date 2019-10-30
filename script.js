let Typr = () => {
  
  let $listener;
  let _view;
  let _starfield;
  let _particle;
  let _pong;
  let _clock;
  
  let init = () => {
    $listener = document.querySelector(Config.keyPressElement);
    $listener.addEventListener('keypress', onKeyPressed);
    $listener.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    
    _starfield = Starfield();
    _particle = Particle();
    _pong = Pong();
    _clock = Clock();
    _view = View(_starfield, _particle);
  };
  
  let onKeyPressed = (event) => {

    var keyCode = event.which;
    
    // ignore backspace and enter
    if ( (keyCode == 8) || (keyCode == 13)) {
      event.preventDefault();
    } else {
      var character = String.fromCharCode( keyCode );
      onAddCharacter(String.fromCharCode(keyCode), event);
    }
  }

  let isCapsLock = (event) => {

    return event.getModifierState && event.getModifierState( 'CapsLock' );
  }
  
  let isScrollLock = (event) => {

    return event.getModifierState && event.getModifierState( 'ScrollLock' );
  }

  let onKeyDown = (event) => {

    Config.isScreenShakeEnabled = isCapsLock(event) || isScrollLock(event) || Config.isScreenShakeEnabled;

    switch(event.keyCode){

      //backspace
      case 8:
        onDeleteCharacter(event);
        break;
      
      //enter
      case 13:
        onAddLineBreak(event);
        break;

      //F4 -- change background
        case 115:
        Config.starfieldSprite = ++Config.starfieldSprite < 3 ? Config.starfieldSprite : 0;
        break;

      //F6 -- change word replace
        case 117:
        Config.replaceWords = ++Config.replaceWords <= Config.replaceWordsWith.length ? Config.replaceWords : 0;
        _view.onUpdate();
        break;

      //F7 -- change textcolor
        case 118:
        Config.textColor = ++Config.textColor < Config.textColorPalette.length ? Config.textColor : 0;
        _view.onUpdate();
        break;
      
      //F8 -- change font
        case 119:
        Config.textFont = ++Config.textFont < Config.textFontList.length ? Config.textFont : 0;
        _view.onUpdate();
        break;

      //F9 -- pong
        case 120:
        Config.isPongEnabled = !Config.isPongEnabled;
        break;
    }
  }
  
  var onResize = () => {
    _view.onResize();
    _starfield.onResize();
    _particle.onResize();
    _pong.onResize();
    _clock.onResize();
  }
  
  var onAddCharacter = (character, event) => {
    _view.onAddCharacter(character);
  }
  
  var onDeleteCharacter = (event) => {
    _view.onDeleteCharacter(event);
  }

  var onAddLineBreak = (event) => {
    _view.onAddLineBreak(event);
  }
  init();
};

Typr();