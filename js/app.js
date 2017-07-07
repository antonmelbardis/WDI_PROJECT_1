$(init);

function init (){

  var score = 0;
  var level = 1;
  var speed = 500;

  var gameInterval;
  const levels = {
    1: 10,
    2: 20,
    3: 30,
    4: 40,
    5: 50,
    6: 60,
    7: 70,
    8: 80,
    9: 90
  };

  var basket = $('#basket');
  var pane = $('#playingTable'),
    box = $('#basket'),
    wh = pane.width() - box.width();
  var wv = pane.height() - box.height(),
    d = {},
    x = 5;

  const bgcolorlist = new Array('#114B5F', '#CEE0DC', '#EEC643');
  const chooseColor = function() {
    return bgcolorlist[Math.floor(Math.random()*bgcolorlist.length)];
  };

  basket.css('background-color',`${chooseColor()}`);


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
    wh = (pane.width() - box.width())-2;
    wv = (pane.height() - box.height())-2;
  }, 20);

  function createNewBox() {
    const randomNumber = Math.floor(Math.random() * 330) + 1;
    const box = $('<div id="snowflakes"></div>');
    box.css('left', `${randomNumber}px`);
    box.css('background-color', `${chooseColor()}`);
    $('#playingTable').append(box).show('slow');
    animateBox(box);
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
              checkforlevelup();
              playSoundWin();
            }else{
              playSoundLose();
              score--;
            }
            if(score < 0){
              gameOver();
              $onscreenBasket.toggle('explode').stop().remove();
              setTimeout(location.reload.bind(location), 500);
            }
            $('.score').hide().html(score).fadeIn('slow');
            $('.level').html(level).show;
          }
        },
        easing: 'linear',
        complete: function() {
          $(this).remove();
        }
      });
  }

  $('#start').click(function() {
    gameInterval = setInterval(createNewBox, speed);
  });

  $('#reset').click(function() {
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

  function levelUp() {
    setTimeout(function() {
      new Audio('sounds/levelUp.wav').play();
    }, 500);

  }

  setInterval(function () {
    changePaddleColor();
  },5000);

  function checkforlevelup() {
    score++;
    if (score === levels[level]) {
      level++;
      levelUp();
      speed -= 50;
      console.log(level);
      console.log(speed);
      console.log('Level up!');
      clearInterval(gameInterval);
      gameInterval = setInterval(createNewBox, speed);
    }
  }
}

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
