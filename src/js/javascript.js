var stkCities = {
	init: function(){
		stkCities.scrollSnap('.stkCities .cities','.cityOutline');
	},
	// This function is called in scrollSnap. After the scroll function completes, populateNewCity will take
	// in the new position in the div and repopulate the content with the new city's details.
	populateNewCity: function(cityNum) {
		var currCity = $('.cityOutline--'+cityNum);
		var cityNames = ['Baltimore','Milwaukee','Chicago','Los Angeles','New York','Detroit']
		$('.activeCity').removeClass('activeCity');			
		currCity.addClass('activeCity');
		cityNum = currCity.attr('data-city');
		$('.cityName').fadeOut('fast',function(){
			$(this).text(cityNames[cityNum]);
			$(this).fadeIn();
		});
		return false;
	},
	// This function requires jQuery. It takes two classes as arguments, input as strings with the period in front.
	// This function takes one vertically scrollable div that includes multiple child divs and "snaps" the scroll
	// behavior to the nearest child div.
	// Right now, it is very limited to child divs of this specific style:
	// width: $widthPct; height: 0; padding-bottom: $widthPct;
	// Developing this further to have different child divs should not be a trememndous amount of work.
	// I may get around to that in the near future.
	scrollSnap: function(scrollDivClass, childDivClass) {
		var scrollDiv = $(scrollDivClass);
		var childDivs = $(childDivClass);
		var childDivWidth = $(childDivs[0]).width();
		var animating = false;
		var currDiv, newDiv, currDivPos, newDivPos, divNum;
		// On window resize, the childDivWidth is recalculated. This is a potentially wasteful and unnecessary function
		// that I may phase out in the future. It is a soft patch for user resizing behavior.
		var resizeId;
		$(window).resize(function(){
			clearTimeout(resizeId);
			resizeId = setTimeout(doneResizing, 500);
		});
		function doneResizing() {
			childDivWidth = $(childDivs[0]).width();
		};
		// The on scroll function is set on a timeout to help reduce site load.
		scrollDiv.on('scroll', function() {
			clearTimeout($.data(this, 'scrollTimer'));
			if (!animating) {
				$.data(this, 'scrollTimer', setTimeout(function() {
					animating = true;
					divNum = Math.round(scrollDiv.scrollTop() / childDivWidth);
					if(divNum > 5){
						divNum = 5;
					};
					scrollDiv.animate({
						scrollTop: divNum * childDivWidth + 'px'
					}, 250);
					setTimeout(function() { animating = false; }, 300);
					// On scroll end, we populate with new data from the current div.
					stkCities.populateNewCity(divNum);
					return false;
				}, 200));
			}
		});
	}
}
$(document).ready(function(){
	stkCities.init();
	console.log("connected");
});
