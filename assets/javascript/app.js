//Create an array of buttons
//Display buttons
//when button is clicked, use ajax to fetch giphy api
//Limit to 10 giphy
//Fetch still giphy and animated giphy
//Display still giphy by default
//When hover over, show annimated giphy
//Create a search input
//on search button clicked, add the button
//Alert user button has added

var buttonArray = [];

//create buttons
function createButtons() {
  event.preventDefault();
  var inputValue = $('form input').val();

  if (inputValue) {
    buttonArray.push(inputValue);
  } else {
    alert('Please enter a value');
  }

  var button = $('<button>').text(inputValue);
  button.addClass('giphyButton');
  button.attr('data-animation');
  $('#giphyButtons').append(button);

  //Add a toaster message
  var options = {
    style: {
      main: {
        background: '#d9453d',
        color: 'white'
      }
    }
  };

  iqwerty.toast.Toast('Button\'s added successfully!', options);
}

//Fetch gif from api and display static gif by default
function displayGiphy() {
  var giphyValue = $(this).text();
  var requestUrl = `https://api.giphy.com/v1/gifs/search?q=${giphyValue}&api_key=5eNZ3fJ1SoaiszpjweOSKPdly0goEupo&limit=10`;

  //remove old gif
  $('img').remove();

  $.ajax({
    url: requestUrl,
    method: 'GET'
  }).then(function(response) {
    for (var gif in response.data) {
      var stillGif = response.data[gif].images.original_still.url;
      var animatedGif = response.data[gif].images.original.url;

      var giphyImageEle = $('<img>')
        .attr('src', stillGif)
        .attr('data-animated', animatedGif)
        .attr('data-still', stillGif);
      $('#giphyImages').append(giphyImageEle);
    }
  });
}

function displayStillGiphy() {
  var stillGifUrl = $(this).attr('data-still');
  $(this).attr('src', stillGifUrl);
}

function displayAnimateGiphy() {
  var animateGifUrl = $(this).attr('data-animated');
  $(this).attr('src', animateGifUrl);

  $(this).on('mouseout', displayStillGiphy);
}

//when gif button is clicked, display 10 static giphy
$(document).on('click', '.giphyButton', displayGiphy);

//When user hover over gif, display animate gif
$(document).on('mouseover', 'img', displayAnimateGiphy);

//On Add button, make input value a button
$(document).on('click', '#newGifButton', createButtons);
