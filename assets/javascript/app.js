var buttonArray = ['trending'],
    inputValue = "",
    defaultLimit = 0,
    searchLimit = 0,
    defaultButtonVal = 'trending',
    customButtonVal = "",
    previousButton = "trending";

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
  inputValue = $('form input').val();

  if (inputValue) {
    buttonArray.push(inputValue);
  } else {
    alert('Please enter a value');
  }

  var removeIcon = $('<i class="fas fa-times"></i>');
  var customButton = $('<a>').text(inputValue);
  customButton.addClass('customGiphyButton btn btn-white').attr('href', '#');
  customButton.append(removeIcon);
  $('#giphyButtons').append(customButton);

  //clear input
  $('form input').val('');

  //Add a toaster message
  var options = {
    style: {
      main: {
        background: '#dc3545',
        color: 'white'
      }
    }
  };
  iqwerty.toast.Toast("Button's added successfully!", options);
}

//Display default trending gif if user click the trending button or scroll down
function displayDefaultGiphy() {
  //remove default gif if user clicks on a custom button
  if (previousButton !== defaultButtonVal) {
    $('img').remove();
    previousButton = defaultButtonVal; //Needed if trending button is clicked
    defaultLimit = 0;
  }
  defaultLimit += 10;
  var trendingUrl = `http://api.giphy.com/v1/gifs/trending?q=&api_key=5eNZ3fJ1SoaiszpjweOSKPdly0goEupo&limit=${defaultLimit}`;

  $.ajax({
    url: trendingUrl,
    method: 'GET'
  }).then(function(response) {
    for (var gif = defaultLimit - 9; gif < defaultLimit; gif++) {
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
function displaySearchGiphy() {
  //use for button click event
  customButtonVal = $(this).text();

  //Use for scrolling event
  if (!customButtonVal) {
    customButtonVal = previousButton;
  }

  if (previousButton !== customButtonVal) {
    $('img').remove();
    previousButton = customButtonVal;
    searchLimit = 0;
  }

  searchLimit += 10;
  var requestUrl = `https://api.giphy.com/v1/gifs/search?q=${customButtonVal}&api_key=5eNZ3fJ1SoaiszpjweOSKPdly0goEupo&limit=${searchLimit}`;

  $.ajax({
    url: requestUrl,
    method: 'GET'
  }).then(function(response) {
    for (var gif = searchLimit - 9; gif < searchLimit; gif++) {
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

//when custom gif button is clicked, display 10 static giphy
$(document).on('click', '.customGiphyButton', displaySearchGiphy);

//When user hover over gif, display animate gif
$(document).on('mouseover', 'img', displayAnimateGiphy);

//On Add button, make input value a button
$(document).on('click', '#newGifButton', createButtons);

//remove button
$(document).on('click', '.fa-times', removeButton);

//Append more gif when page is scrolled to bottom
$(window).scroll(function() {
  if($(window).scrollTop() == $(document).height() - $(window).height()) {
    if (previousButton === 'trending') {
      displayDefaultGiphy();
    } else {
      displaySearchGiphy();
    }
  }
});


