$(init);

function init (){
  var basket = $('#basket');
  var snowflakes = $('#snowflakes');
  var pane = $('#playingTable'),
  box = $('#basket'),
  wh = pane.width() - box.width();
  var wv = pane.height() - box.height(),
  d = {},
  x = 5;
  var score = 0;
  const bgcolorlist = new Array('red', 'green', 'blue');
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
    wh = pane.width() - box.width();
    wv = pane.height() - box.height();
  }, 20);

  function createNewBox() {
    const randomNumber = Math.floor(Math.random() * 330) + 1;
    const box = $('<div id="snowflakes"></div>');
    box.css('left', `${randomNumber}px`);
    box.css('background-color', `${chooseColor()}`);
    $('#playingTable').append(box);
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
            score++;
            playSoundWin();
          }else{
            score--;
            playSoundLose();
          }
          if(score < 0){
            gameOver();
            $onscreenBasket.toggle('explode').stop().remove();
            setTimeout(location.reload.bind(location), 500);
          }
          $('.score').html(score);
        }
      },
      easing: 'linear',
      complete: function() {
        $(this).remove();
      }
    });
  }

  // function gameLogic() {
  //   function() {
  //     const $onscreenBasket = $('#basket');
  //     var basketColour = $onscreenBasket.css('background-color');
  //     var snowflakeColour = $(this).css('background-color');
  //     if (collision($onscreenBasket, $(this))) {
  //       $(this).toggle('explode').stop().remove();
  //       if(basketColour===snowflakeColour){
  //         score++;
  //         playSoundWin();
  //       }else{
  //         score--;
  //         playSoundLose();
  //       }
  //       if(score < 0){
  //         gameOver();
  //         $onscreenBasket.toggle('explode').stop().remove();
  //         setTimeout(location.reload.bind(location), 500);
  //       }
  //       $('.score').html(score);
  //     }
  // }

  setInterval(createNewBox, 500);

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
