var stkCities = {
	init: function(){
		console.log('stkCities running');
		stkCities.scrollSnap('.stkCities .cities','.cityOutline');
	},
	// This function requires jQuery. It takes two classes as arguments, input as strings.
	// This function takes one vertically scrollable div that includes multiple child divs and 
	// "snaps" the scroll behavior to the nearest child div.
	// Right now, it is very limited to child divs of this specific style:
	// width: $widthPct; height: 0; padding-bottom: $widthPct;
	// Developing this further to have different child divs should not be a ton of work.
	// I may get around to that in the near future.
	scrollSnap: function(scrollDivClass, childDivClass) {
		var scrollDiv = $(scrollDivClass);
		var childDivs = $(childDivClass);
		var childDivWidth = $(childDivs[0]).width();
		var animating = false;
		var currDiv, newDiv, currDivPos, newDivPos, divNum;
		// On window resize, the childDivWidth is recalculated. This is a potentially wasteful and 
		// unnecessary function that I may phase out in the future. It is a soft patch for now.
		var resizeId;
		$(window).resize(function(){
			clearTimeout(resizeId);
			resizeId = setTimeout(doneResizing, 500);
		});
		function doneResizing() {
			childDivWidth = $(childDivs[0]).width();
		};
		// The on scroll function is set on a timeout to help reduce site load.
		scrollDiv.on('scroll', function(){
			clearTimeout($.data(this, 'scrollTimer'));
			if (!animating) {
				$.data(this, 'scrollTimer', setTimeout(function() {
					divNum = Math.round(scrollDiv.scrollTop() / childDivWidth);
					scrollBehavior();
					return false;
				}, 200));
			};
			return false;
		});
		// The on click function will actually trigger the on scroll function above because it will
		// scroll the parent div. This isn't ideal, but the clearTimeout and animating boolean 
		// ensures that the heavy lifting isn't done on the scroll function -- 
		// multiple instances of the scrollBehavior will not run.
		childDivs.on('click', function(){
			if (!animating) {
				divNum = $(this).data('city');
				scrollBehavior();
				return false;
			};		
			return false;
		});
		// The scroll behavior is broken out into a helper function to reduce bloat.
		// Code itself is fairly self-explanatory.
		function scrollBehavior(){
			if(divNum > 5){
				divNum = 5;
			};
			animating = true;
			scrollDiv.animate({
				scrollTop: divNum * childDivWidth + 'px'
			}, 250);
			setTimeout(function() { animating = false; }, 300);
			// On scroll end, we populate with new data from the current div.
			stkCities.populateNewCity(divNum);
			return false;
		};
	},
	// This function is called in scrollSnap. populateNewCity will take in the new position in the 
	// div and repopulate the content with the new city's details. 
	populateNewCity: function(cityNum) {
		var currCity = $('.cityOutline--'+cityNum);
		var cityNames = [
			['Baltimore','300','637','0.47'],
			['Milwaukee','59','300','0.20'],
			['Chicago','360','1,726','0.21'],
			['Los Angeles','164','802','0.20'],
			['New York','234','1,138','0.21'],
			['Washington, D.C.','123','299','0.41'],
		];
		$('.activeCity').removeClass('activeCity');
		currCity.addClass('activeCity');
		cityNum = currCity.attr('data-city');
		$('.jsFade').fadeOut('fast',function(){
			$('.cityName').text(cityNames[cityNum][0]);
			$('.nonFatStat').text(cityNames[cityNum][1]);
			$('.fatStat').text(cityNames[cityNum][2]);
			$('.ratioStat').text(cityNames[cityNum][3]);
			$('.graph img').attr('src','images/graph' + cityNum + '.png');
			$(this).fadeIn();
		});
		return false;
	}
};
var stkNeighborhoods = {
	init: function(){
		console.log('stkNeighborhoods running');
		stkNeighborhoods.createMap();
	},
	createMap: function(){
		cartodb.createVis('map', 
			'https://baltsun.carto.com/api/v2/viz/798d62cc-6b9e-11e6-834a-0e05a8b3e3d7/viz.json', {
			shareable: false,
			title: false,
			description: false,
			search: false,
			tiles_loader: true,
			infowindow: true,
			center_lat: 39.264492,
			center_lon: -76.612630,
			zoom: 11
		})
		.done(function(vis, layers) {
		  // layer 0 is the base layer, layer 1 is cartodb layer
		  // setInteraction is disabled by default
		  // layers[0].hide();
		  layers[1].setInteraction(true);
		})
		.error(function(err) {
		  console.log(err);
		});
	}
};
$(document).ready(function(){
	stkCities.init();
	stkNeighborhoods.init();
	console.log('connected');
});
