var buttonArray = ['trending'];

//Display buttons in the array by default
for (i in buttonArray) {
  var defaultButton = $('<a>').text(buttonArray[i]);
  defaultButton.addClass('defaultGiphyButton btn btn-white').attr('href', '#');
  $('#giphyButtons').append(defaultButton);
}

//When page opens, display the default trending gif
displayDefaultGiphy();

//create buttons when user click Add
function createButtons() {
  event.preventDefault();
  var inputValue = $('form input').val();

  if (inputValue) {
    buttonArray.push(inputValue);
  } else {
    alert('Please enter a value');
  }

  var removeIcon = $('<i class="fas fa-times"></i>');
  var customButton = $('<a>').text(inputValue);
  customButton.addClass('giphyButton btn btn-white').attr('href', '#');
  customButton.append(removeIcon);
  $('#giphyButtons').append(customButton);

  //clear input
  $('form input').val('');

  //Add a toaster message
  var options = {
    style: {
      main: {
        background: '#d9453d',
        color: 'white'
      }
    }
  };
  iqwerty.toast.Toast("Button's added successfully!", options);
}

//In case, user clicks the default button again, run this function
function displayDefaultGiphy() {
  var trendingUrl = `http://api.giphy.com/v1/gifs/trending?q=&api_key=5eNZ3fJ1SoaiszpjweOSKPdly0goEupo&limit=10`;

  //remove old gif
  $('img').remove();

  $.ajax({
    url: trendingUrl,
    method: 'GET'
  }).then(function(response) {
    for (var gif in response.data) {
      var stillGif = response.data[gif].images.original_still.url;
      var animatedGif = response.data[gif].images.original.url;
      var stillGifWidth = parseInt(response.data[gif].images.original_still.width);

      var giphyImageEle = $('<img>')
        .attr('src', stillGif)
        .attr('data-animated', animatedGif)
        .attr('data-still', stillGif)
        .addClass('grid-item');
      $('#giphyImages').append(giphyImageEle);

      if (stillGifWidth > 350 && stillGifWidth < 500) {
        giphyImageEle.addClass('medium');
      } else if (stillGifWidth < 350) {
        giphyImageEle.addClass('small');
      } else {
        giphyImageEle.addClass('large');
      }
    }
  });
}

//Fetch gif from api and display static gif
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
      var stillGifWidth = parseInt(response.data[gif].images.original_still.width);

      var giphyImageEle = $('<img>')
        .attr('src', stillGif)
        .attr('data-animated', animatedGif)
        .attr('data-still', stillGif);
      $('#giphyImages').append(giphyImageEle);

      if (stillGifWidth > 350 && stillGifWidth < 500) {
        giphyImageEle.addClass('medium');
      } else if (stillGifWidth < 350) {
        giphyImageEle.addClass('small');
      } else {
        giphyImageEle.addClass('large');
      }
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

function removeButton(e) {
  $(this).closest("a").remove();
  //Handle event bubbling
  e.stopPropagation();
}

//Initialize popover
$(function () {
  $('[data-toggle="popover"]').popover({
    html: true,
    title: "Add Button to Search for GIF",
    content: '<form><input type="text" name="add"><button id="newGifButton">ADD</button></form>'
  })
})

//When default display button is clicked, run this function
$(document).on('click', '.defaultGiphyButton', displayDefaultGiphy);

//when gif button is clicked, display 10 static giphy
$(document).on('click', '.giphyButton', displayGiphy);

//When user hover over gif, display animate gif
$(document).on('mouseover', 'img', displayAnimateGiphy);

//On Add button, make input value a butto
$(document).on('click', '#newGifButton', createButtons);

//remove button
$(document).on('click', '.fa-times', removeButton);


