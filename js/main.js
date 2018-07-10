

/*
  Code by Gabriel Nunes
  Modified by Todd Chaffee to use Camper gist for JSON Quote data.
*/
var colors = new Array(
  [27, 188, 155],
  [68,108,179],
  [220, 198, 224],
  [241, 169, 160],
[246, 36, 89]);

var step = 0;
//color table indices for:
// current color left
// next color left
// current color right
// next color right
var colorIndices = [0,1,2,3];

//transition speed
var gradientSpeed = 0.001;

function updateGradient()
{

  if ( $===undefined ) return;

var c0_0 = colors[colorIndices[0]];
var c0_1 = colors[colorIndices[1]];
var c1_0 = colors[colorIndices[2]];
var c1_1 = colors[colorIndices[3]];


var istep = 1 - step;
var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
var color1 = "rgb("+r1+","+g1+","+b1+")";

var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
var color2 = "rgb("+r2+","+g2+","+b2+")";

 $('#gradient',).css({
   background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
    background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});
   $('.transparent',).css({
   background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
    background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});

  step += gradientSpeed;
  if ( step >= 1 )
  {
    step %= 1;
    colorIndices[0] = colorIndices[1];
    colorIndices[2] = colorIndices[3];


    //pick two new target color indices
    //do not pick the same as the current one
    colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
    colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;

  }
}

setInterval(updateGradient,10);


function inIframe () { try { return window.self !== window.top; } catch (e) { return true; } }

var colors = ['#16a085', '#27ae60', '#2c3e50', '#f39c12', '#e74c3c', '#9b59b6', '#FB6964', '#342224', "#472E32", "#BDBB99", "#77B1A9", "#73A857"];
var currentQuote = '', currentAuthor = '';
function openURL(url){
  window.open(url, 'Share', 'width=550, height=400, toolbar=0, scrollbars=1 ,location=0 ,statusbar=0,menubar=0, resizable=0');
}

function getQuotes() {
  return $.ajax({
    headers: {
      Accept: "application/json"
    },
    url: 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json',
    success: function(jsonQuotes) {
      if (typeof jsonQuotes === 'string') {
        quotesData = JSON.parse(jsonQuotes);
        console.log('quotesData');
        console.log(quotesData);
      }
    }
  });
}

function getRandomQuote() {
  return quotesData.quotes[Math.floor(Math.random() * quotesData.quotes.length)];
}

function getQuote() {

  let randomQuote = getRandomQuote();

  currentQuote = randomQuote.quote;
  currentAuthor = randomQuote.author;

  if(inIframe())
  {
    $('#tweet-quote').attr('href', 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent('"' + currentQuote + '" ' + currentAuthor));

    $('#tumblr-quote').attr('href', 'https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption='+encodeURIComponent(currentAuthor)+'&content=' + encodeURIComponent(currentQuote)+'&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button');
  }

  $(".quote-text").animate(
    { opacity: 0 },
    500,
    function() {
      $(this).animate({ opacity: 1}, 500);
      $('#text').text(randomQuote.quote);
    }
  );

  $(".quote-author").animate(
    { opacity: 0 },
    500,
    function() {
      $(this).animate({ opacity: 1}, 500);
      $('#author').html(randomQuote.author);
    }
  );

  var color = Math.floor(Math.random() * colors.length);
  $("html body").animate(
    {
      backgroundColor: colors[color],
      color: colors[color]
    },
    1000
  );
  $(".button").animate(
    {
      backgroundColor: colors[color]
    },
    1000
  );
}

$(document).ready(function() {
  getQuotes().then(() => {
    getQuote();
  });

  $('#new-quote').on('click', getQuote);

  $('#tweet-quote').on('click', function() {
    if(!inIframe()) {
      openURL('https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent('"' + currentQuote + '" ' + currentAuthor));
    }
  });

  $('#tumblr-quote').on('click', function() {
    if(!inIframe()) {
      openURL('https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption='+encodeURIComponent(currentAuthor)+'&content=' + encodeURIComponent(currentQuote)+'&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button');
    }
  });
});
