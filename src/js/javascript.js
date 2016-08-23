var stkCities = {
	init: function(){
		stkCities.citiesScrollSnap();
	},
	citiesScrollSnap: function() {
		var cities = $(".cityOutline");
		var animating = false;

		$(window).scroll(function() {
		    clearTimeout($.data(this, 'scrollTimer'));
		    if (!animating) {
		        $.data(this, 'scrollTimer', setTimeout(function() {
		            cities.each(function(key, value) {
		                if ($(value).offset().top > $(window).scrollTop()) {
		                    animating = true;
		                    $('body').animate( { scrollTop: $(value).offset().top + 'px' }, 250);
		                    setTimeout(function() { animating = false; }, 300);
		                    return false;
		                }
		            });
		        }, 200));
		    }
		});
	}
}
$(document).ready(function(){
	stkCities.init();
	console.log("connected");
});
