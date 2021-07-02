// FRONT END FILE TO INTERACT WITH THE DOM
(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$banner = $('#banner');

	// Breakpoints.
		breakpoints({
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = (browser.name == 'ie' || browser.name == 'edge' || browser.mobile) ? function() { return $(this) } : function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				on, off;

			on = function() {

				$t.css('background-position', 'center 100%, center 100%, center 0px');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

					});

			};

			off = function() {

				$t
					.css('background-position', '');

				$window
					.off('scroll._parallax');

			};

			breakpoints.on('<=medium', off);
			breakpoints.on('>medium', on);

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Clear transitioning state on unload/hide.
		$window.on('unload pagehide', function() {
			window.setTimeout(function() {
				$('.is-transitioning').removeClass('is-transitioning');
			}, 250);
		});

	// Fix: Enable IE-only tweaks.
		if (browser.name == 'ie' || browser.name == 'edge')
			$body.addClass('is-ie');

	// Scrolly.
		$('.scrolly').scrolly({
			offset: function() {
				return $header.height() - 2;
			}
		});

	// Tiles.
		var $tiles = $('.tiles > article');

		$tiles.each(function() {

			var $this = $(this),
				$image = $this.find('.image'), $img = $image.find('img'),
				$link = $this.find('.link'),
				x;

			// Image.

				// Set image.
					$this.css('background-image', 'url(' + $img.attr('src') + ')');

				// Set position.
					if (x = $img.data('position'))
						$image.css('background-position', x);

				// Hide original.
					$image.hide();

			// Link.
				if ($link.length > 0) {

					$x = $link.clone()
						.text('')
						.addClass('primary')
						.appendTo($this);

					$link = $link.add($x);

					$link.on('click', function(event) {

						var href = $link.attr('href');

						// Prevent default.
							event.stopPropagation();
							event.preventDefault();

						// Target blank?
							if ($link.attr('target') == '_blank') {

								// Open in new tab.
									window.open(href);

							}

						// Otherwise ...
							else {

								// Start transitioning.
									$this.addClass('is-transitioning');
									$wrapper.addClass('is-transitioning');

								// Redirect.
									window.setTimeout(function() {
										location.href = href;
									}, 500);

							}

					});

				}

		});

	// Header.
		if ($banner.length > 0
		&&	$header.hasClass('alt')) {

			$window.on('resize', function() {
				$window.trigger('scroll');
			});

			$window.on('load', function() {

				$banner.scrollex({
					bottom:		$header.height() + 10,
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt'); },
					leave:		function() { $header.removeClass('alt'); $header.addClass('reveal'); }
				});

				window.setTimeout(function() {
					$window.triggerHandler('scroll');
				}, 100);

			});

		}

	// Banner.
		$banner.each(function() {

			var $this = $(this),
				$image = $this.find('.image'), $img = $image.find('img');

			// Parallax.
				$this._parallax(0.275);

			// Image.
				if ($image.length > 0) {

					// Set image.
						$this.css('background-image', 'url(' + $img.attr('src') + ')');

					// Hide original.
						$image.hide();

				}

		});

	// Menu.
		var $menu = $('#menu'),
			$menuInner;

		$menu.wrapInner('<div class="inner"></div>');
		$menuInner = $menu.children('.inner');
		$menu._locked = false;

		$menu._lock = function() {

			if ($menu._locked)
				return false;

			$menu._locked = true;

			window.setTimeout(function() {
				$menu._locked = false;
			}, 350);

			return true;

		};

		$menu._show = function() {

			if ($menu._lock())
				$body.addClass('is-menu-visible');

		};

		$menu._hide = function() {

			if ($menu._lock())
				$body.removeClass('is-menu-visible');

		};

		$menu._toggle = function() {

			if ($menu._lock())
				$body.toggleClass('is-menu-visible');

		};

		$menuInner
			.on('click', function(event) {
				event.stopPropagation();
			})
			.on('click', 'a', function(event) {

				var href = $(this).attr('href');

				event.preventDefault();
				event.stopPropagation();

				// Hide.
					$menu._hide();

				// Redirect.
					window.setTimeout(function() {
						window.location.href = href;
					}, 250);

			});

		$menu
			.appendTo($body)
			.on('click', function(event) {

				event.stopPropagation();
				event.preventDefault();

				$body.removeClass('is-menu-visible');

			})
			.append('<a class="close" href="#menu">Close</a>');

		$body
			.on('click', 'a[href="#menu"]', function(event) {

				event.stopPropagation();
				event.preventDefault();

				// Toggle.
					$menu._toggle();

			})
			.on('click', function(event) {

				// Hide.
					$menu._hide();

			})
			.on('keydown', function(event) {

				// Hide on escape.
					if (event.keyCode == 27)
						$menu._hide();

			});

})(jQuery);


const listContainer = document.getElementById('cards')
let deleteBtn = document.getElementById('btnDelete')
let share = document.getElementById('share-activity')

share.addEventListener('click', (event) => {
let input = document.getElementById('input').value
let input2 = document.getElementById('input2').value
let input3 = document.getElementById('input3').value
//checkboxes 
let adventure = document.getElementById('inputcheck')
let spot = document.getElementById('inputcheck2')
let nature = document.getElementById('inputcheck3')
let relaxing = document.getElementById('inputcheck4')
let cultural = document.getElementById('inputcheck5')
let sport = document.getElementById('inputcheck6')
let checkboxes = {adventure: adventure, spot: spot, nature: nature, cultural: cultural, sport: sport}


let inputs = {name: input, location: input2, price: input3, type:checkboxes }
addActivityBtn = document.getElementById('input')
sendActivityToServer(inputs)
	console.log(inputs)
	alert("you're activity has been added")
	
})


const sendActivityToServer = (activities) => {
	fetch('api/activity/add', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify(activities),
	})
	.then(response => response.json())
	.then(data => {
	  console.log('Success:', data);
	})
	.catch((error) => {
	  console.error('Error:', error);
	});
  }

  const fetchactivityFromDB = (activity) => {
	let input = document.getElementById('input').value
	let input2 = document.getElementById('input2').value
	let input3 = document.getElementById('input3').value

	fetch('api/activity/all', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
	  }
	})
	.then(response => response.json())
	.then(data => {
	  console.log('Success fetch:', data);
	  data.activities.forEach((activity) => {
		let activityCard = `
		<div class="card">
		<p class="para">Name:${activity.name}</p>
		<p class="para">Location:${activity.location}</p>
		<p class="para">Price:${activity.price}€</p>
		<button data-id="${activity.id}" class="btnDelete">Delete</button>
		</div>
		`
	  listContainer.insertAdjacentHTML('afterend', activityCard);
	  let deleteBtn = document.querySelectorAll('.btnDelete')
	  deleteBtn.forEach((btn) => {
		btn.addEventListener('click', (event) => {
			console.log('working')
			sendActivityToDeleteToMyServer({activity_id: activity.id})
      btn.parentNode.remove()
			})
	  })
	})
	  })



	.catch((error) => {
	  console.error('Error:', error);
	});
  };

  fetchactivityFromDB();


  const sendActivityToDeleteToMyServer = (activity) => {
	fetch('api/activity/delete', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify(activity),
	})
	.then(response => response.json())
	.then(data => {
	  console.log('Success:', data);
	})
	.catch((error) => {
	  console.error('Error:', error);
	});
  }

//   checkboxes 
let adventure = document.getElementById('inputcheck')
let spot = document.getElementById('inputcheck2')
let nature = document.getElementById('inputcheck3')
let relaxing = document.getElementById('inputcheck4')
let cultural = document.getElementById('inputcheck5')
let sport = document.getElementById('inputcheck6')
// let checkboxes = {adventure: adventure, spot: spot, nature: nature, cultural: cultural, sport: sport}

share.addEventListener('click', (e) => {
	const checkboxes = document.querySelectorAll('input[name="activity"]');
		let selectedValue;
		for (const checkbox of checkboxes) {
			if (checkbox.checked) {
				selectedValue = checkbox.value;
				break;
			}
		};
	console.log({inputCheckbox: selectedValue});
	});


