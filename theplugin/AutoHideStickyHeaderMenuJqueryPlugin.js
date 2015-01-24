/* 
	Auto Hide Sticky Header/Menu Jquery Plugin by Bagusa4
*/
/*
	! Instruction !
	Use the following code to activate the Auto Hide Sticky Jquery Plugin
	
	// JS
	$('.header').autohidesticky({ // Selector e.g ".header" must be Class not Id
		autohidestickyHidden: "header", // Must be the same as the above selector e.g ".header" > "header" Just Class name
		autohidestickyNarrow: "header", // Must be the same as the above selector e.g ".header" > "header" Just Class name
		autohidestickyNarrowOffset: 50*2, // The offset e.g 50/100/50*2=100
		autohidestickyType: "active" // The type "active" or "lazy"
	});
	
	// CSS
	This just example, you can rename the class as you want.
	The class must be same as Jquery selector in above
	.header
	{
		-webkit-transition-duration: .5s;
		transition-duration: .5s;
 
		-webkit-transition-timing-function: cubic-bezier( 0.215, 0.610, 0.355, 1.000 );
		transition-timing-function: cubic-bezier( 0.215, 0.610, 0.355, 1.000 );
 
		-webkit-transition-property: -webkit-transform;
		transition-property: transform;
	}
 
	.header--hidden
	{
		-webkit-transform: translateY( -100% );
		-ms-transform: translateY( -100% );
		transform: translateY( -100% );
	}
*/
/*	
	Edited by Bagusa4 for Making it into a jquery plugin
	Original Query 
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/
// JQUERY VERSION:

	;( function( $, window, document, undefined )
	{
		'use strict';
		
		$.fn.autohidesticky = function (options) {

		var opts = $.extend( {}, $.fn.autohidesticky.defaults, options );
		
		var autohidestickys = this;
		
		$.fn.autohidesticky.defaults = {
			autohidestickyHidden: "header",
			autohidestickyNarrow: "header",
			autohidestickyNarrowOffset: 50*2,
			autohidestickyType: "active"
		};

		return this.each(function() {
		
		var elSelector		= autohidestickys,
			elClassHidden	= opts.autohidestickyHidden + '--hidden',
			elClassNarrow	= opts.autohidestickyNarrow + '--narrow',
			elNarrowOffset	= opts.autohidestickyNarrowOffset,
			throttleTimeout	= 500,
			$element		= $( elSelector );

		if( !$element.length ) return true;

		var $window			= $( window ),
			wHeight			= 0,
			wScrollCurrent	= 0,
			wScrollBefore	= 0,
			wScrollDiff		= 0,
			elHeight		= 0,
			elTop			= 0,
			$document		= $( document ),
			dHeight			= 0,

			throttle = function( delay, fn )
			{
				var last, deferTimer;
				return function()
				{
					var context = this, args = arguments, now = +new Date;
					if( last && now < last + delay )
					{
						clearTimeout( deferTimer );
						deferTimer = setTimeout( function(){ last = now; fn.apply( context, args ); }, delay );
					}
					else
					{
						last = now;
						fn.apply( context, args );
					}
				};
			};
			
		if( opts.autohidestickyType == "lazy") {
		$window.on( 'scroll', throttle( throttleTimeout, function()
		{
			dHeight			= $document.height();
			wHeight			= $window.height();
			wScrollCurrent	= $window.scrollTop();
			wScrollDiff		= wScrollBefore - wScrollCurrent;

			$element.toggleClass( elClassNarrow, wScrollCurrent > elNarrowOffset ); // toggles "narrow" classname

			if( wScrollCurrent <= 0 ) // scrolled to the very top; element sticks to the top
				$element.removeClass( elClassHidden );

			else if( wScrollDiff > 0 && $element.hasClass( elClassHidden ) ) // scrolled up; element slides in
				$element.removeClass( elClassHidden );

			else if( wScrollDiff < 0 ) // scrolled down
			{
				if( wScrollCurrent + wHeight >= dHeight && $element.hasClass( elClassHidden ) ) // scrolled to the very bottom; element slides in
					$element.removeClass( elClassHidden );

				else // scrolled down; element slides out
					$element.addClass( elClassHidden );
			}

			wScrollBefore = wScrollCurrent;
		}));
		} // Lazy+ Mode
		
		if( opts.autohidestickyType == "active") {
		$window.on( 'scroll', function()
		{
			elHeight		= $element.outerHeight();
			dHeight			= $document.height();
			wHeight			= $window.height();
			wScrollCurrent	= $window.scrollTop();
			wScrollDiff		= wScrollBefore - wScrollCurrent;
			elTop			= parseInt( $element.css( 'top' ) ) + wScrollDiff;

			$element.toggleClass( elClassNarrow, wScrollCurrent > elNarrowOffset ); // toggles "narrow" classname

			if( wScrollCurrent <= 0 ) // scrolled to the very top; element sticks to the top
				$element.css( 'top', 0 );

			else if( wScrollDiff > 0 ) // scrolled up; element slides in
				$element.css( 'top', elTop > 0 ? 0 : elTop );

			else if( wScrollDiff < 0 ) // scrolled down
			{
				if( wScrollCurrent + wHeight >= dHeight - elHeight )  // scrolled to the very bottom; element slides in
					$element.css( 'top', ( elTop = wScrollCurrent + wHeight - dHeight ) < 0 ? elTop : 0 );

				else // scrolled down; element slides out
					$element.css( 'top', Math.abs( elTop ) > elHeight ? -elHeight : elTop );
			}

			wScrollBefore = wScrollCurrent;
		});		
		} // Active+ Mode
		
		});
		
		};

	})( jQuery, window, document );
	
