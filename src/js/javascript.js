// stkGphx contains all of the code for the interactives in Shoot to Kill. They are 
// combined into one namespace in order to share use of the scrolljacking code.
var stkGphx = {
	scrollerInstance: null,
	unlock: false,
	touchX0: null,
	touchX1: null,
	cityNames: [
		['Baltimore','300','637','0.47'],
		['Milwaukee','59','300','0.20'],
		['Chicago','360','1,726','0.21'],
		['Los Angeles','164','802','0.20'],
		['New York','234','1,138','0.21'],
		['Washington, D.C.','123','299','0.41'],
	],
	stats: [
		['123','234','345','456'],
		['234','345','456','567'],
		['345','456','567','678'],
		['456','567','678','789']
	],
	allChars: ['1','2','3','4','5','6','7','8','9','0'],
	init: function(){
		console.log('stkGphx running');
		stkGphx.scrollFuncs();
		stkGphx.neighborhoods();
	},
	scrollFuncs: function(){
		$(window).scroll(function(){
			if(stkGphx.isScrolledIntoView('.stkHeadshots')){
				// Firefox
				$('body').bind('DOMMouseScroll', function(e){
					clearTimeout(stkGphx.scrollerInstance);
					if(e.originalEvent.detail > 0) {
						stkGphx.headshotScroller(1);
					} else {
						stkGphx.headshotScroller(0);
					};
					return stkGphx.unlockCheck(e);
				});
				//IE, Opera, Safari
				$('body').bind('mousewheel', function(e){
					clearTimeout(stkGphx.scrollerInstance);
					if(e.originalEvent.wheelDelta < 0) {
						stkGphx.headshotScroller(1);
					} else {
						stkGphx.headshotScroller(0);
					};
					return stkGphx.unlockCheck(e);
				});
				$('body').bind('keydown', function(e){
					clearTimeout(stkGphx.scrollerInstance);
					if(e.keyCode == 40) {
						stkGphx.headshotScroller(1);
					} else if(e.keyCode == 38) {
						stkGphx.headshotScroller(0);
					};
					return stkGphx.unlockCheck(e);
				});
				$('body').bind('touchstart', function(e){
					clearTimeout(stkGphx.scrollerInstance);
					stkGphx.touchX0 = e.touches[0].clientX;
					return stkGphx.unlockCheck(e);
				});
				$('body').bind('touchend', function(e){
					// e.preventDefault();
					clearTimeout(stkGphx.scrollerInstance);
					stkGphx.touchX1 = e.originalEvent.changedTouches[0].clientX;
					if(stkGphx.touchX1 - stkGphx.touchX0 > 50) {
						stkGphx.headshotScroller(1);
					} else if(stkGphx.touchX1 - stkGphx.touchX0 < -50){
						stkGphx.headshotScroller(0);
					};
					return stkGphx.unlockCheck(e);
				});
				$('body').bind('touchmove', function(e){
					clearTimeout(stkGphx.scrollerInstance);
					return stkGphx.unlockCheck(e);
				});
			// } else if(stkGphx.isScrolledIntoView('.stkCities')){
			// 	// Firefox
			// 	$('body').bind('DOMMouseScroll', function(e){
			// 		clearTimeout(stkGphx.scrollerInstance);
			// 		if(e.originalEvent.detail > 0) {
			// 			stkGphx.cityScroller(1);
			// 		} else {
			// 			stkGphx.cityScroller(-1);
			// 		};
			// 		return stkGphx.unlockCheck(e);
			// 	});
			// 	//IE, Opera, Safari
			// 	$('body').bind('mousewheel', function(e){
			// 		clearTimeout(stkGphx.scrollerInstance);
			// 		if(e.originalEvent.wheelDelta < 0) {
			// 			stkGphx.cityScroller(1);
			// 		} else {
			// 			stkGphx.cityScroller(-1);
			// 		};
			// 		return stkGphx.unlockCheck(e);
			// 	});
			// 	$('body').bind('keydown', function(e){
			// 		clearTimeout(stkGphx.scrollerInstance);
			// 		if(e.keyCode == 40) {
			// 			stkGphx.cityScroller(1);
			// 		} else if(e.keyCode == 38) {
			// 			stkGphx.cityScroller(-1);
			// 		};
			// 		return stkGphx.unlockCheck(e);
			// 	});
			} else {
				$('body').unbind();
				stkGphx.unlock = true;
			};
			return false;
		});
		$('.arrow').on('click', function(){
			stkGphx.headshotScroller(Number($(this).data('dir')));
		});
		$('.cityOutline').on('click', function(){
			stkGphx.populateNewCity($(this).data('city'));
			return false;
		});
		stkGphx.scrollSnap('.stkCities .cities','.cityOutline');
	},
	// isScrolledIntoView takes an element name as an argument and compares it to the positions
	// of the window to see if the element is within view.
	isScrolledIntoView: function(elem) {
		var docViewTop = $(window).scrollTop();
		var docViewBottom = docViewTop + $(window).height();
		var elemTop = $(elem).offset().top;
		var elemBottom = elemTop + $(elem).height();
		var pad = Math.round((docViewBottom - docViewTop) * 0);
		return (((docViewTop + pad) < elemTop) && ((docViewBottom - pad) > elemBottom));
	},
	headshotScroller: function(direction){
		stkGphx.scrollerInstance = setTimeout(function(){
			stkGphx.unlock = false;
			var center = $('.center');
			var pos = center.data('pos');
			var newPos;
			var domStats = $('.statNum');
			if(direction == 0 && pos > 0){
				newPos = pos - 1;
				center.removeClass('center').addClass('right');
				$('.slide--' + newPos).addClass('center').removeClass('left');
			} else if(direction == 1 && pos < 3){
				newPos = pos + 1;
				center.removeClass('center').addClass('left');
				$('.slide--' + newPos).addClass('center').removeClass('right');
			} else {
				stkGphx.unlock = true;
			};
			if(!stkGphx.unlock) {
				for(var i = 0;i < domStats.length; i++){
					stkGphx.charScrambler(stkGphx.stats[newPos][i], domStats[i].children, 0);
				};
			};
			return stkGphx.unlock;
		}, 200);
		return false;
	},
	unlockCheck: function(e) {
		if(stkGphx.unlock) {
			$('body').unbind();
		} else {
			e.preventDefault();
		};
		return stkGphx.unlock;
	},
	charScrambler: function(chars, dom, count){
		var char_cycles = 15; //how many nonsense letters it cycles through
		var char_cycle_length = 30; //length of each cycle in milliseconds
		//Cycle through the appropriate number of letters, according to the settings above
		if(count < char_cycles){
			setTimeout(function(){
				for(var x = 0; x < chars.length; x++){
					$(dom[x]).text(stkGphx.allChars[Math.floor((Math.random()*10))]);
				}
				stkGphx.charScrambler(chars, dom, (count+1));
			}, char_cycle_length);
		} else {
			for(var y = 0; y < chars.length; y++){
				$(dom[y]).text(chars.substring(y,y+1));
			}
		};
		return false;
	},
	cityScroller: function(direction){
		stkGphx.scrollerInstance = setTimeout(function(){
			stkGphx.unlock = false;
			var active = $('.activeCity');
			var pos = active.data('city');
			var newPos;
			var domStats = $('.statNum');
			if(direction == -1 && pos > 0){
				stkGphx.populateNewCity(pos-1);
			} else if(direction == 1 && pos < 5){
				stkGphx.populateNewCity(pos+1);
			} else {
				stkGphx.unlock = true;
			};
			return stkGphx.unlock;
		}, 200);
		return false;
	},	
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
			stkGphx.populateNewCity(divNum);
			return false;
		};
	},
	populateNewCity: function(cityNum) {
		var currCity = $('.cityOutline--'+cityNum);
		var scrollDiv = $('.cities');
		var childDivWidth = $('.cityOutline--0').width();
		var animating = false;
		var resizeId;
		$(window).resize(function(){
			clearTimeout(resizeId);
			resizeId = setTimeout(doneResizing, 500);
		});
		function doneResizing() {
			childDivWidth = $('.cityOutline--0').width();
		};
		scrollDiv.animate({
			scrollTop: cityNum * childDivWidth + 'px'
		}, 250);
		$('.activeCity').removeClass('activeCity');
		currCity.addClass('activeCity');
		cityNum = currCity.attr('data-city');
		$('.jsFade').fadeOut('fast',function(){
			$('.cityName').text(stkGphx.cityNames[cityNum][0]);
			$('.nonFatStat').text(stkGphx.cityNames[cityNum][1]);
			$('.fatStat').text(stkGphx.cityNames[cityNum][2]);
			$('.ratioStat').text(stkGphx.cityNames[cityNum][3]);
			$('.graph img').attr('src','images/graph' + cityNum + '.png');
			$(this).fadeIn();
		});
		return false;
	},
	// neighborhoods creates the Carto map. There's not much to it -- basically just 
	// boilerplate embed code {from Carto's website.
	neighborhoods: function(){
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
$(document).ready(function(){
	stkGphx.init();
	console.log('connected');
});
