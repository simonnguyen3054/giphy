(function(window, document) {
  'use strict';

  var buttonArray = ['trending'],
    inputValue = '',
    defaultLimit = 0,
    searchLimit = 0,
    defaultButtonVal = 'trending',
    customButtonVal = '',
    previousButton = 'trending';

  var gif = {
    init: function() {
      //Append the default button
      this.defaultButtonDisplay();

      //Display default gif on page load
      this.displayDefaultGiphy();

      // //Initialize popover
      $(function() {
        $('[data-toggle="popover"]').popover({
          html: true,
          title: 'Add Button to Search for GIF',
          content:
            '<form><input type="text" name="add"><button id="newGifButton">ADD</button></form>'
        });
      });

      //Fetch more default gif when user click the default button
      $(document).on('click', '.defaultGiphyButton', gif.displayDefaultGiphy);

      //Append more gif when page is scrolled to bottom
      $(window).scroll(function() {
        if($(window).scrollTop() == $(document).height() - $(window).height()) {
          if (previousButton === 'trending') {
            gif.displayDefaultGiphy();
          } else {
            gif.displaySearchGiphy();
          }
        }
      });

      //Change static gif to animated gif
      $(document).on('mouseover', 'img', gif.displayAnimateGiphy);

      //create custom button
      $(document).on('click', '#newGifButton', gif.createButton);
    },
    fetchGif: function(endpoint, limit) {
      $.ajax({
        url: endpoint,
        method: 'GET'
      }).then(function(response) {
        for (var gif = limit - 9; gif < limit; gif++) {
          var stillGif = response.data[gif].images.original_still.url;
          console.log(stillGif);
          var animatedGif = response.data[gif].images.original.url;
          var stillGifWidth = parseInt(
            response.data[gif].images.original_still.width
          );

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
    },
    defaultButtonDisplay: function() {
      //Display buttons in the array by default
      for (var i in buttonArray) {
        var defaultButton = $('<a>').text(buttonArray[i]);
        defaultButton
          .addClass('defaultGiphyButton btn btn-white')
          .attr('href', '#');
        $('#giphyButtons').append(defaultButton);
      }
    },
    displayDefaultGiphy: function() {
      //remove default gif if user clicks on a custom button
      if (previousButton !== defaultButtonVal) {
        $('img').remove();
        previousButton = defaultButtonVal; //Needed if trending button is clicked while user is on trending gif
        defaultLimit = 0;
      }

      defaultLimit += 10;

      var trendingUrl = `https://api.giphy.com/v1/gifs/trending?q=&api_key=5eNZ3fJ1SoaiszpjweOSKPdly0goEupo&limit=${defaultLimit}`;

      gif.fetchGif(trendingUrl, defaultLimit);
    },
    displaySearchGiphy: function() {
      // use for button click event
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

      gif.fetchGif(requestUrl, searchLimit);
    },
    displayStillGiphy: function() {
      var stillGifUrl = $(this).attr('data-still');
      $(this).attr('src', stillGifUrl);
    },
    displayAnimateGiphy: function() {
      var animateGifUrl = $(this).attr('data-animated');

      $(this).attr('src', animateGifUrl);
      $(this).on('mouseout', gif.displayStillGiphy);
    },
    createButton: function() {
      event.preventDefault();
      inputValue = $('form input').val();

      if (inputValue) {
        buttonArray.push(inputValue);
      } else {
        alert('Please enter a value');
      }

      var removeIcon = $('<i class="fas fa-times"></i>');
      var customButton = $('<a>').text(inputValue);
      customButton
        .addClass('customGiphyButton btn btn-white')
        .attr('href', '#');
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

      //when custom gif button is clicked, display 10 static giphy
      $(document).on('click', '.customGiphyButton', gif.displaySearchGiphy);

      //remove button
      $(document).on('click', '.fa-times', gif.removeButton);
    },
    removeButton: function(e) {
      $(this)
        .closest('a')
        .remove();
      //Handle event bubbling
      e.stopPropagation();
    }
  };

  gif.init();

})(window, document);
