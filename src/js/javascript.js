var stkCities = {
	init: function(){
		stkCities.citiesScrollSnap();
	},
	citiesScrollSnap: function() {
		var scrollDiv = $('.stkCities .cities');
		var cityWidth = $('.cityOutline--0').width();
		var animating = false;
		var cities = $('.cityOutline');
		var currCity, newCity, currCityPos, newCityPos, cityNum;
		var cityNames = ['Baltimore','Milwaukee','Chicago','Los Angeles','New York','Detroit']

		scrollDiv.on('scroll', function() {
			clearTimeout($.data(this, 'scrollTimer'));
			if (!animating) {
				$('.activeCity').removeClass('activeCity');
				$.data(this, 'scrollTimer', setTimeout(function() {
					animating = true;
					scrollDiv.animate({
						scrollTop: Math.round(scrollDiv.scrollTop() / cityWidth) * cityWidth + 'px'
					}, 250);
					setTimeout(function() { animating = false; }, 300);
					cities.each(function(key, value){
						newCity = $(value);
						currCityPos = newCityPos;
						newCityPos = Math.abs($(value).position().top);
						if(newCityPos < currCityPos) {
							currCity = newCity;
						};
					});
					currCity.addClass('activeCity');
					cityNum = currCity.attr('data-city');
					$('.cityName').fadeOut('fast',function(){
						$(this).text(cityNames[cityNum]);
						$(this).fadeIn();
					});
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
