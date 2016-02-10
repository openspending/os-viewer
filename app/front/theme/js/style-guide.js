jQuery(document).ready(function($){
	/*******************
		color swatch
	********************/
	//convert rgba color to hex color
	$.cssHooks.backgroundColor = {
	    get: function(elem) {
	        if (elem.currentStyle)
	            var bg = elem.currentStyle["background-color"];
	        else if (window.getComputedStyle)
	            var bg = document.defaultView.getComputedStyle(elem,
	                null).getPropertyValue("background-color");
	        if (bg.search("rgb") == -1)
	            return bg;
	        else {
	            bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	            function hex(x) {
	                return ("0" + parseInt(x).toString(16)).slice(-2);
	            }
	            return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
	        }
	    }
	}
	//set a label for each color swatch
	$('.color-swatch').each(function(){
		var actual = $(this);
		$('<b>'+actual.css("background-color")+'</b>').insertAfter(actual);
	});

	/*******************
		buttons
	********************/
	/*
	var buttonsWrapper = $('#buttons .box'),
		buttonsHtml = buttonsWrapper.html(),
		containerHtml = $('<div class="box"></div>').insertAfter(buttonsWrapper),
		buttonsHtmlText = buttonsHtml.split('</button>');

	$.map(buttonsHtmlText, function(value){
		if(value.indexOf('button') >= 0 ) {
			var splitText = value.split('class="'),
				block1 = splitText[0]+'class="';
				block2 = splitText[1].split('"');

			var wrapperElement = $('<p></p>').text(block1),
				spanElement = $('<span></span>').text(block2[0]);
			spanElement.appendTo(wrapperElement);
			wrapperElement.appendTo(containerHtml);
			wrapperElement.append('"'+block2[1]+'&lt;/button&gt;');
		}
	});
	*/

	/*******************
		typography
	********************/
	var heading = $('#typography h1'),
		headingDescriptionText = heading.children('span').eq(0),
		body = heading.next('p'),
		bodyDescriptionText = body.children('span').eq(0);

	setTypography(heading, headingDescriptionText);
	setTypography(body, bodyDescriptionText);
	$(window).on('resize', function(){
		setTypography(heading, headingDescriptionText);
		setTypography(body, bodyDescriptionText);
	});

	function setTypography(element, textElement) {
		var fontSize = Math.round(element.css('font-size').replace('px',''))+'px',
			fontFamily = (element.css('font-family').split(','))[0].replace(/\'/g, '').replace(/\"/g, ''),
			fontWeight = element.css('font-weight');
		textElement.text(fontWeight + ' '+ fontFamily+' '+fontSize );
	}

	/*******************
		main  navigation
	********************/
	var contentSections = $('main section');
	//open navigation on mobile
	$('.nav-trigger').on('click', function(){
		$('body > header').toggleClass('nav-is-visible');
	});
	//smooth scroll to the selected section
	$('body > header .main-nav a[href^="#"]').on('click', function(event){
        event.preventDefault();
        $('body > header').removeClass('nav-is-visible');
        var target= $(this.hash),
        	topMargin = target.css('marginTop').replace('px', ''),
        	hedearHeight = $('body > header').height();
        $('body,html').animate({'scrollTop': parseInt(target.offset().top - hedearHeight - topMargin)}, 200);
    });
    //update selected navigation element
    $(window).on('scroll', function(){
    	updateNavigation();
    });

    function updateNavigation() {
		contentSections.each(function(){
			var actual = $(this),
				actualHeight = actual.height(),
				topMargin = actual.css('marginTop').replace('px', ''),
				actualAnchor = $('.main-nav').find('a[href="#'+actual.attr('id')+'"]');

			if ( ( parseInt(actual.offset().top - $('.main-nav').height() - topMargin )<= $(window).scrollTop() ) && ( parseInt(actual.offset().top +  actualHeight - topMargin )  > $(window).scrollTop() +1 ) ) {
				actualAnchor.addClass('selected');
			}else {
				actualAnchor.removeClass('selected');
			}
		});
	}

});
