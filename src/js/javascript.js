// stkCities functions control scrolling behavior to "snap" to a selected city and repopulates
// content with new city information. The populateNewCity function holds the data.
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
// stkNeighborhoods functions create the Carto map. There's not much to it -- basically just 
// boilerplate embed code from Carto's website.
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
		  layers[1].setInteraction(true);
		})
		.error(function(err) {
		  console.log(err);
		});
	}
};
// stkHeadshots functions detect when the headshots graphic is in view and scrolljacks the page
// in order to force horizontal scrolling. After going through all of the slides in the graphic,
// the scrolljacking releases and allows the user to scroll down again.
var stkHeadshots = {
	init: function(){
		console.log('stkHeadshots running');
		stkHeadshots.horizontalScroll();
	},
	horizontalScroll: function() {
		var scrollerInstance;
		var pos, newPos, center;
		var lock;
		var counter;
		var domStats = $('.statNum');
		var currDom;
		var allChars = ['1','2','3','4','5','6','7','8','9','0'];
		var stats = [
			['123','234','345','456'],
			['234','345','456','567'],
			['345','456','567','678'],
			['456','567','678','789']
		];
		// var stats = [
		// 	[123,234,345,456],
		// 	[234,345,456,567],
		// 	[345,456,567,678],
		// 	[456,567,678,789]
		// ];
		function charScrambler(chars){
			console.log(currDom);
			console.log(chars);
			//Settings
			var char_cycles = 15; //how many nonsense letters it cycles through
			var char_cycle_length = 30; //length of each cycle in milliseconds
			//Cycle through the appropriate number of letters,
			//according to the settings above
			if(counter < char_cycles){
				console.log('cycling'+counter);
				setTimeout(function(){
					counter++;
					for(var x = 0; x < chars.length; x++){
						$(currDom[x]).text(allChars[Math.floor((Math.random()*10))]);
					}
					charScrambler(chars);
				}, char_cycle_length);
			} else {
				for (var y = 0; y < chars.length; y++){
					$(currDom[y]).text(chars.substring(y,y+1));
				}
			}
		};
		function scroller(direction){
			scrollerInstance = setTimeout(function(){
				center = $('.center');
				pos = center.data('pos');
				if(direction == -1 && pos > 0){
					newPos = pos - 1;
					center.removeClass('center').addClass('right');
					$('.slide--' + newPos).addClass('center').removeClass('left');
					lock = false;
				} else if(direction == 1 && pos < 3){
					newPos = pos + 1;
					center.removeClass('center').addClass('left');
					$('.slide--' + newPos).addClass('center').removeClass('right');
					lock = false;
					for (var i = 0;i < domStats.length; i++) {
						counter = 0;
						currDom = domStats[i].children;
					};
						charScrambler(stats[newPos][0]);
				} else {
					lock = true;
				};	
				return lock;
			}, 200);
			return false;
		};
		function isScrolledIntoView(elem) {
			var docViewTop = $(window).scrollTop();
			var docViewBottom = docViewTop + $(window).height();
			var elemTop = $(elem).offset().top;
			var elemBottom = elemTop + $(elem).height();
			var pad = Math.round((docViewBottom - docViewTop) * .1);
			return (((docViewTop + pad) < elemTop) && ((docViewBottom - pad) > elemBottom));
		};
		$(window).scroll(function(){
			if(isScrolledIntoView('.stkHeadshots')){
				// $('body').addClass('stopScroll');
				// Firefox
				$('body').bind('DOMMouseScroll', function(e){
					clearTimeout(scrollerInstance);
					if(e.originalEvent.detail > 0) {
						scroller(1);
					} else {
						scroller(-1);
					};
					return lock;
				});
				//IE, Opera, Safari
				$('body').bind('mousewheel', function(e){
					clearTimeout(scrollerInstance);
					if(e.originalEvent.wheelDelta < 0) {
						scroller(1);
					} else {
						scroller(-1);
					};
					return lock;
				});
			} else {
				$('body').unbind('DOMMouseScroll mousewheel');
			};
		});
	}
};
$(document).ready(function(){
	stkCities.init();
	stkNeighborhoods.init();
	stkHeadshots.init();
	console.log('connected');
});
