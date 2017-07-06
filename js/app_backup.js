$(setUp);

function setUp() {
  var basket = $('#basket');
  var snowflakes = $('#snowflakes');
  var pane = $('#playingTable'),
  box = $('#basket'),
  wh = pane.width() - box.width();
  var wv = pane.height() - box.height(),
  d = {},
  x = 5;
  var score = 0;
  var level = 1;
  var speed = 500;
  const bgcolorlist = new Array('red', 'green', 'blue');
  const chooseColor = function() {
    return bgcolorlist[Math.floor(Math.random()*bgcolorlist.length)];
  };
  basketControl();
  createNewBox();
}

function basketControl()){

    function newh(v,a,b) {
      var n = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0);
      return n < 0 ? 0 : n > wh ? wh : n;
    }

    function newv(v,a,b) {
      var n = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0);
      return n < 0 ? 0 : n > wv ? wv : n;
    }

    $(window).keydown(function(e) {
      d[e.which] = true;
    });
    $(window).keyup(function(e) {
      d[e.which] = false;
    });

    setInterval(function() {
      box.css({
        left: function(i,v) {
          return newh(v, 37, 39);
        },
        top: function(i,v) {
          return newv(v, 38, 40);
        }
      });
      wh = pane.width() - box.width();
      wv = pane.height() - box.height();
    }, 20);

    basket.css('background-color',`${chooseColor()}`);
}

function init (){
  // $('#loading').show(0).delay(10000).fadeOut(1600);
  // $('#gamename').animate({left: '250px'});






  function createNewBox() {
    const randomNumber = Math.floor(Math.random() * 330) + 1;
    const box = $('<div id="snowflakes"></div>');
    box.css('left', `${randomNumber}px`);
    box.css('background-color', `${chooseColor()}`);
    $('#playingTable').append(box);
    animateBox(box);
    // console.log(speed);
    // clearInterval(interval);
    // var interval = setInterval(createNewBox, speed);

  }

  function animateBox(box) {
    box.animate({
      'top': '600px'
    },
    {
      duration: 2000,
      step: function() {
        const $onscreenBasket = $('#basket');
        var basketColour = $onscreenBasket.css('background-color');
        var snowflakeColour = $(this).css('background-color');
        if (collision($onscreenBasket, $(this))) {
          $(this).toggle('explode').stop().remove();
          if(basketColour===snowflakeColour){
            score++;
            playSoundWin();
            // levelChanger();
          }else{
            score--;
            playSoundLose();
          }
          if(score < 0){
            gameOver();
            $onscreenBasket.toggle('explode').stop().remove();
            setTimeout(location.reload.bind(location), 500);
            // setInterval(createNewBox, speed);
          }
          $('.score').html(score);
          $('.level').html(level);
        }
      },
      easing: 'linear',
      complete: function() {
        $(this).remove();
      }
    });
  }

  function levelChanger() {
    if (score < 20) {
      clearInterval(initialise);
      level = 1;
      speed =500;
      initialise = setInterval(createNewBox, speed);
      console.log(speed);
      console.log(level);
    } if (score < 30 && score > 20) {
      clearInterval(initialise);
      level = 2;
      speed = 400;
      var initialise = setInterval(createNewBox, speed);
      console.log(speed);
      console.log(level);
    }
}
// levelChanger();
$( "#start" ).click(function() {
  var initialise = setInterval(createNewBox, speed);
});

$( "#reset" ).click(function() {
  location.reload();
});

  function changePaddleColor(){
    basket.css('background-color',`${chooseColor()}`);
  }

  function playSoundWin() {
    audio.src = 'sounds/win.wav';
    audio.play();
  }

  function playSoundLose() {
    audio.src = 'sounds/lose.wav';
    audio.play();
  }

  function gameOver() {
    audio.src = 'sounds/gameOver.wav';
    audio.play();
  }

  setInterval(function () {
    changePaddleColor();
  },5000);

  function collision($div1, $div2) {
    var x1 = $div1.offset().left;
    var y1 = $div1.offset().top;
    var h1 = $div1.outerHeight();
    var w1 = $div1.outerWidth();
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    var h2 = $div2.outerHeight();
    var w2 = $div2.outerWidth();
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;

    return true;
  }

}
