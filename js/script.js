'use strict';

(function (root) {

	// Инициализация прилдожения
	var windowWidth = $(window).width();

	function init() {

		if ($('.gallery').get(0)) {
			$('.gallery__element').first().trigger('click');
		}

		$('[data-tabs]').each(function (i, tabs) {
			$(tabs).children().first().trigger('click');
		});

		$('.toggle_close').each(function (i, toggle) {
			var data = $(this).data('toggle');

			$(this).parent().find('.' + data).hide();
		});
	};

	$(window).on('resize', function () {
		windowWidth = $(window).width();
	});

	// Слайдеры
	var dataSliders = {
		feautures: {
			items: 6,
			nav: true
		},
		gallery: {
			items: 1,
			nav: true,
			dots: true,
			mouseDrag: false,
			responsive: {
				961: {
					items: 4,
					dots: false
				}
			}
		},
		promo: {
			items: 1,
			dots: true,
			loop: true,
			autoplay: true
		}
	};

	$('[data-slider]').each(function (i, slider) {
		var data = $(this).data('slider');

		$(slider).owlCarousel(dataSliders[data]);
	});

	$('.range__slider').each(function () {
		var range = this,
		    minInput = $(range).closest('.range').find('[data-input="min"]'),
		    maxInput = $(range).closest('.range').find('[data-input="max"]');

		function update() {
			var from = $(range).data('from'),
			    to = $(range).data('to');

			$(minInput).val(from);
			$(maxInput).val(to);
		}

		$(range).ionRangeSlider({
			extra_classes: 'range__slider',
			hide_min_max: true,
			hide_from_to: true
		});

		update();
		$(range).on('change', update);
	});

	$('[data-input]').on('change', function () {
		var range = $(this).closest('.range').find('input.range__slider').data("ionRangeSlider"),
		    val = $(this).val(),
		    min = range.options.min,
		    max = range.options.max,
		    from = range.options.from,
		    to = range.options.to,
		    step = range.options.step;

		switch ($(this).data('input')) {
			case 'min':
				if (val <= min) {
					val = min;
				} else if (val >= max) {
					val = max - step;
				} else if (val >= to) {
					val = to - step;
				}

				range.update({
					from: val
				});
				break;
			case 'max':
				if (val >= max) {
					val = max;
				} else if (val <= min) {
					val = min + step;
				} else if (val <= from) {
					val = from + step;
				}

				range.update({
					to: val
				});
				break;
		}

		$(this).val(val);
	});

	function filled(field) {
		var val = $(field).val().trim();

		if (val.length > 0) {
			$(field).closest('.field').addClass('field_filled');
		} else {
			$(field).closest('.field').removeClass('field_filled');
		}
	}

	$('.field input').each(function () {
		filled(this);
	});

	$('.toggle').on('click', function (e) {
		e.stopPropagation();
		var content = $(this).parent().find($('.' + $(this).data('toggle')));
		$(this).toggleClass('toggle_close');
		$(content).stop().slideToggle(300);
	});

	$('.filter__block-content').each(function (i, block) {
		var checks = $(block).find('.checkbox').length;

		if (checks > 5) {
			$(block).addClass('filter__block-content_more');
			$(block).append('<span class="filter__block-more">Показать все</span>');
		}
	});

	$('.filter__block-more').on('click', function () {
		$(this).parent().removeClass('filter__block-content_more');
		$(this).remove();
	});

	$('.drop__item').on('click', function () {
		if (!$(this).hasClass('drop__item_link')) {
			$(this).addClass('drop__item_active').siblings().removeClass('drop__item_active');
		}

		$(this).closest('[data-drop]').removeClass('drop-open');
	});

	$(document).on('click', '[data-drop]', function () {

		var data = $(this).data('drop');

		if (data == 'trigger') {
			$('.drop-open').removeClass('drop-open');
			$(this).parent().closest('[data-drop]').addClass('drop-open');
		} else return;
	});

	$(document).on('click', function (e) {

		var drop = $(e.target).parent().closest('[data-drop]').get(0),
		    tip = $(e.target).parent().closest('.tip').get(0);

		if ($(e.target).hasClass('counter__btn_plus')) return;

		if (!drop) {
			$('.drop-open').removeClass('drop-open');
		}

		if (!tip) {
			$('.tip__hidecontent').hide();
		}
	});

	$('.description__show').on('click', function () {
		$(this).hide();
		$('.description__short').hide();
		$('.description__all').show();
	});

	$('[data-close]').on('click', function (e) {
		e.preventDefault();

		$(this).parent().hide();
		$(this).closest('.card').css('z-index', '');
	});

	$('.tip__name').on('click', function () {
		$('.card').css('z-index', '');
		$('.tip__hidecontent').hide();
		$(this).parent().find('.tip__hidecontent').show();
		$(this).closest('.card').css('z-index', '2');
	});

	// Gallery
	$('.gallery__element').on('click', function () {

		if ($(this).hasClass('gallery__element_video')) {
			var video = $(this).find('video').clone();

			$('.modal_zoom .modal__content').html(video);

			$('.modal_zoom').iziModal('open');
		} else {
			var img = $(this).find('img').clone();

			$(this).closest('.gallery').find('.gallery__view').empty().append(img);

			$(this).closest('.gallery__list').find('.gallery__element_active').removeClass('gallery__element_active');
			$(this).addClass('gallery__element_active');
		}
	});

	$('.vlist_full').each(function (i, list) {
		var show = $(list).data('show'),
		    line = $(list).find('.vlist__line:not(.vlist__line_head)').get(show);

		$(line).hide().nextAll(':not(.vlist__line_more)').hide();
	});

	$('.vlist__more').on('click', function () {
		$(this).closest('.vlist').toggleClass('vlist_allshow');
	});

	// Modal

	setTimeout(function () {
		$('[data-modal]').iziModal({
			onClosing: function onClosing(r) {
				var video = r.$element.find('video').get(0);

				if (video) {
					video.pause();
				}
			}
		});
	}, 1);

	$('[data-open]').on('click', function (e) {
		e.preventDefault();

		var m = $(this).data('open');
		$('[data-modal=' + m + ']').iziModal('open');
	});

	$('.gallery__view').on('click', function () {
		var img = $(this).find('img').clone();

		$('.modal_zoom .modal__content').html(img);

		$('.modal_zoom').iziModal('open');
	});

	$('.filter-toggle').on('click', function () {
		$('.filter .toggle:not(.toggle_close)').trigger('click');
		$('.filter').toggle();
	});

	$('.m-menu__toggle').on('click', function () {
		$('.m-menu__content').toggle();
	});

	$('.m-menu__item_drop').on('click', function (e) {
		e.stopPropagation();

		var drop = $(this).find('.m-menu__drop').first();

		if ($(e.target).parentsUntil('.m-menu__item_drop').length <= 1) {
			$(drop).toggleClass('m-menu__drop_show');
		}
	});

	$('.m-menu__back').on('click', function (e) {
		e.stopPropagation();

		$(this).closest('.m-menu__drop_show').removeClass('m-menu__drop_show');
	});

	$('[data-tabs] > *').on('click', function (e) {
		e.preventDefault();

		var data = $(this).parent().data('tabs'),
		    index = $(this).index(),
		    content = $('[data-tabs-content=' + data + ']').children().get(index);

		$(content).show().siblings().hide();

		if (!content) {
			$('[data-tabs-content=' + data + ']').children().hide();
		}

		$(this).addClass('active').siblings().removeClass('active');
	});

	// if ($('.modal_video').get(0)) {
	// 	$(".modal_video").iziModal({
	// 		history: false,
	// 		iframe : true,
	// 		fullscreen: true,
	// 		headerColor: '#000000',
	// 		group: 'group1',
	// 		loop: true
	// 	});
	// }


	$('.video').on('click', function () {
		var id = $(this).data('id');

		$('#' + id).iziModal('open');
	});

	$('.checkbox input').on('click', function (e) {
		e.stopPropagation();

		$(this).closest('.checkbox').toggleClass('checkbox_active');
	});

	var scrolling,
	    toTop = document.querySelector('.to-top');

	document.addEventListener('scroll', function () {
		scrolling = document.body.scrollTop;

		if ($('body').scrollTop() >= 200) {
			$('.header__fix').addClass('header__fix_show');
		} else {
			$('.header__fix').removeClass('header__fix_show');
		}

		if (scrolling >= 1000 && windowWidth > 960) {
			toTop.classList.add('to-top_show');
		} else {
			toTop.classList.remove('to-top_show');
		}
	}, true);

	$('.to-top').on('click', function () {
		$("html, body").stop().animate({ scrollTop: 0 }, 500, 'swing');
	});

	$('.counter__btn_plus').on('click', function (e) {
		e.preventDefault();

		$('.tip__hidecontent').hide();
		$(this).parent().find('.tip__hidecontent').first().show();
	});

	init();

	$('button.btn, .counter__btn, .cart__close, .close').on('click', function (e) {
		e.preventDefault();
	});
})(window);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjcmlwdC5qcyJdLCJuYW1lcyI6WyJyb290Iiwid2luZG93V2lkdGgiLCIkIiwid2luZG93Iiwid2lkdGgiLCJpbml0IiwiZ2V0IiwiZmlyc3QiLCJ0cmlnZ2VyIiwiZWFjaCIsImkiLCJ0YWJzIiwiY2hpbGRyZW4iLCJ0b2dnbGUiLCJkYXRhIiwicGFyZW50IiwiZmluZCIsImhpZGUiLCJvbiIsImRhdGFTbGlkZXJzIiwiZmVhdXR1cmVzIiwiaXRlbXMiLCJuYXYiLCJnYWxsZXJ5IiwiZG90cyIsIm1vdXNlRHJhZyIsInJlc3BvbnNpdmUiLCJwcm9tbyIsImxvb3AiLCJhdXRvcGxheSIsInNsaWRlciIsIm93bENhcm91c2VsIiwicmFuZ2UiLCJtaW5JbnB1dCIsImNsb3Nlc3QiLCJtYXhJbnB1dCIsInVwZGF0ZSIsImZyb20iLCJ0byIsInZhbCIsImlvblJhbmdlU2xpZGVyIiwiZXh0cmFfY2xhc3NlcyIsImhpZGVfbWluX21heCIsImhpZGVfZnJvbV90byIsIm1pbiIsIm9wdGlvbnMiLCJtYXgiLCJzdGVwIiwiZmlsbGVkIiwiZmllbGQiLCJ0cmltIiwibGVuZ3RoIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJjb250ZW50IiwidG9nZ2xlQ2xhc3MiLCJzdG9wIiwic2xpZGVUb2dnbGUiLCJibG9jayIsImNoZWNrcyIsImFwcGVuZCIsInJlbW92ZSIsImhhc0NsYXNzIiwic2libGluZ3MiLCJkb2N1bWVudCIsImRyb3AiLCJ0YXJnZXQiLCJ0aXAiLCJzaG93IiwicHJldmVudERlZmF1bHQiLCJjc3MiLCJ2aWRlbyIsImNsb25lIiwiaHRtbCIsIml6aU1vZGFsIiwiaW1nIiwiZW1wdHkiLCJsaXN0IiwibGluZSIsIm5leHRBbGwiLCJzZXRUaW1lb3V0Iiwib25DbG9zaW5nIiwiciIsIiRlbGVtZW50IiwicGF1c2UiLCJtIiwicGFyZW50c1VudGlsIiwiaW5kZXgiLCJpZCIsInNjcm9sbGluZyIsInRvVG9wIiwicXVlcnlTZWxlY3RvciIsImFkZEV2ZW50TGlzdGVuZXIiLCJib2R5Iiwic2Nyb2xsVG9wIiwiY2xhc3NMaXN0IiwiYWRkIiwiYW5pbWF0ZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxDQUFDLFVBQVNBLElBQVQsRUFBZTs7QUFFZjtBQUNBLEtBQUlDLGNBQWNDLEVBQUVDLE1BQUYsRUFBVUMsS0FBVixFQUFsQjs7QUFFQSxVQUFTQyxJQUFULEdBQWdCOztBQUVmLE1BQUlILEVBQUUsVUFBRixFQUFjSSxHQUFkLENBQWtCLENBQWxCLENBQUosRUFBMEI7QUFDekJKLEtBQUUsbUJBQUYsRUFBdUJLLEtBQXZCLEdBQStCQyxPQUEvQixDQUF1QyxPQUF2QztBQUNBOztBQUVETixJQUFFLGFBQUYsRUFBaUJPLElBQWpCLENBQXNCLFVBQVNDLENBQVQsRUFBWUMsSUFBWixFQUFrQjtBQUN2Q1QsS0FBRVMsSUFBRixFQUFRQyxRQUFSLEdBQW1CTCxLQUFuQixHQUEyQkMsT0FBM0IsQ0FBbUMsT0FBbkM7QUFDQSxHQUZEOztBQUlBTixJQUFFLGVBQUYsRUFBbUJPLElBQW5CLENBQXdCLFVBQVNDLENBQVQsRUFBWUcsTUFBWixFQUFvQjtBQUMzQyxPQUFJQyxPQUFPWixFQUFFLElBQUYsRUFBUVksSUFBUixDQUFhLFFBQWIsQ0FBWDs7QUFFQVosS0FBRSxJQUFGLEVBQVFhLE1BQVIsR0FBaUJDLElBQWpCLENBQXNCLE1BQUlGLElBQTFCLEVBQWdDRyxJQUFoQztBQUNBLEdBSkQ7QUFLQTs7QUFFRGYsR0FBRUMsTUFBRixFQUFVZSxFQUFWLENBQWEsUUFBYixFQUF1QixZQUFXO0FBQ2pDakIsZ0JBQWNDLEVBQUVDLE1BQUYsRUFBVUMsS0FBVixFQUFkO0FBQ0EsRUFGRDs7QUFJQTtBQUNBLEtBQUllLGNBQWM7QUFDakJDLGFBQVc7QUFDVkMsVUFBTyxDQURHO0FBRVZDLFFBQUs7QUFGSyxHQURNO0FBS2pCQyxXQUFTO0FBQ1JGLFVBQU8sQ0FEQztBQUVSQyxRQUFLLElBRkc7QUFHUkUsU0FBTSxJQUhFO0FBSVJDLGNBQVcsS0FKSDtBQUtSQyxlQUFZO0FBQ1gsU0FBSztBQUNKTCxZQUFPLENBREg7QUFFSkcsV0FBTTtBQUZGO0FBRE07QUFMSixHQUxRO0FBaUJqQkcsU0FBTztBQUNOTixVQUFPLENBREQ7QUFFTkcsU0FBTSxJQUZBO0FBR05JLFNBQU0sSUFIQTtBQUlOQyxhQUFVO0FBSko7QUFqQlUsRUFBbEI7O0FBeUJBM0IsR0FBRSxlQUFGLEVBQW1CTyxJQUFuQixDQUF3QixVQUFTQyxDQUFULEVBQVlvQixNQUFaLEVBQW9CO0FBQzNDLE1BQUloQixPQUFPWixFQUFFLElBQUYsRUFBUVksSUFBUixDQUFhLFFBQWIsQ0FBWDs7QUFFQVosSUFBRTRCLE1BQUYsRUFBVUMsV0FBVixDQUFzQlosWUFBWUwsSUFBWixDQUF0QjtBQUNBLEVBSkQ7O0FBTUFaLEdBQUUsZ0JBQUYsRUFBb0JPLElBQXBCLENBQXlCLFlBQVc7QUFDbkMsTUFBSXVCLFFBQVEsSUFBWjtBQUFBLE1BQ0VDLFdBQVcvQixFQUFFOEIsS0FBRixFQUFTRSxPQUFULENBQWlCLFFBQWpCLEVBQTJCbEIsSUFBM0IsQ0FBZ0Msb0JBQWhDLENBRGI7QUFBQSxNQUVFbUIsV0FBV2pDLEVBQUU4QixLQUFGLEVBQVNFLE9BQVQsQ0FBaUIsUUFBakIsRUFBMkJsQixJQUEzQixDQUFnQyxvQkFBaEMsQ0FGYjs7QUFJQSxXQUFTb0IsTUFBVCxHQUFrQjtBQUNqQixPQUFJQyxPQUFPbkMsRUFBRThCLEtBQUYsRUFBU2xCLElBQVQsQ0FBYyxNQUFkLENBQVg7QUFBQSxPQUNFd0IsS0FBS3BDLEVBQUU4QixLQUFGLEVBQVNsQixJQUFULENBQWMsSUFBZCxDQURQOztBQUdBWixLQUFFK0IsUUFBRixFQUFZTSxHQUFaLENBQWdCRixJQUFoQjtBQUNBbkMsS0FBRWlDLFFBQUYsRUFBWUksR0FBWixDQUFnQkQsRUFBaEI7QUFDQTs7QUFFRHBDLElBQUU4QixLQUFGLEVBQVNRLGNBQVQsQ0FBd0I7QUFDdkJDLGtCQUFlLGVBRFE7QUFFdkJDLGlCQUFjLElBRlM7QUFHdkJDLGlCQUFjO0FBSFMsR0FBeEI7O0FBTUFQO0FBQ0FsQyxJQUFFOEIsS0FBRixFQUFTZCxFQUFULENBQVksUUFBWixFQUFzQmtCLE1BQXRCO0FBQ0EsRUFyQkQ7O0FBdUJBbEMsR0FBRSxjQUFGLEVBQWtCZ0IsRUFBbEIsQ0FBcUIsUUFBckIsRUFBK0IsWUFBVztBQUN6QyxNQUFJYyxRQUFROUIsRUFBRSxJQUFGLEVBQVFnQyxPQUFSLENBQWdCLFFBQWhCLEVBQTBCbEIsSUFBMUIsQ0FBK0IscUJBQS9CLEVBQXNERixJQUF0RCxDQUEyRCxnQkFBM0QsQ0FBWjtBQUFBLE1BQ0V5QixNQUFNckMsRUFBRSxJQUFGLEVBQVFxQyxHQUFSLEVBRFI7QUFBQSxNQUVFSyxNQUFNWixNQUFNYSxPQUFOLENBQWNELEdBRnRCO0FBQUEsTUFHRUUsTUFBTWQsTUFBTWEsT0FBTixDQUFjQyxHQUh0QjtBQUFBLE1BSUVULE9BQU9MLE1BQU1hLE9BQU4sQ0FBY1IsSUFKdkI7QUFBQSxNQUtFQyxLQUFLTixNQUFNYSxPQUFOLENBQWNQLEVBTHJCO0FBQUEsTUFNRVMsT0FBT2YsTUFBTWEsT0FBTixDQUFjRSxJQU52Qjs7QUFRQSxVQUFRN0MsRUFBRSxJQUFGLEVBQVFZLElBQVIsQ0FBYSxPQUFiLENBQVI7QUFDQyxRQUFLLEtBQUw7QUFDQyxRQUFJeUIsT0FBT0ssR0FBWCxFQUFnQjtBQUNmTCxXQUFNSyxHQUFOO0FBQ0EsS0FGRCxNQUVPLElBQUlMLE9BQU9PLEdBQVgsRUFBZ0I7QUFDdEJQLFdBQU1PLE1BQU1DLElBQVo7QUFDQSxLQUZNLE1BRUEsSUFBSVIsT0FBT0QsRUFBWCxFQUFlO0FBQ3JCQyxXQUFNRCxLQUFLUyxJQUFYO0FBQ0E7O0FBRURmLFVBQU1JLE1BQU4sQ0FBYTtBQUNaQyxXQUFNRTtBQURNLEtBQWI7QUFHQTtBQUNELFFBQUssS0FBTDtBQUNDLFFBQUlBLE9BQU9PLEdBQVgsRUFBZ0I7QUFDZlAsV0FBTU8sR0FBTjtBQUNBLEtBRkQsTUFFTyxJQUFJUCxPQUFPSyxHQUFYLEVBQWdCO0FBQ3RCTCxXQUFNSyxNQUFNRyxJQUFaO0FBQ0EsS0FGTSxNQUVBLElBQUlSLE9BQU9GLElBQVgsRUFBaUI7QUFDdkJFLFdBQU1GLE9BQU9VLElBQWI7QUFDQTs7QUFFRGYsVUFBTUksTUFBTixDQUFhO0FBQ1pFLFNBQUlDO0FBRFEsS0FBYjtBQUdBO0FBMUJGOztBQTZCQXJDLElBQUUsSUFBRixFQUFRcUMsR0FBUixDQUFZQSxHQUFaO0FBRUEsRUF4Q0Q7O0FBMENBLFVBQVNTLE1BQVQsQ0FBZ0JDLEtBQWhCLEVBQXVCO0FBQ3RCLE1BQUlWLE1BQU1yQyxFQUFFK0MsS0FBRixFQUFTVixHQUFULEdBQWVXLElBQWYsRUFBVjs7QUFFQSxNQUFJWCxJQUFJWSxNQUFKLEdBQWEsQ0FBakIsRUFBb0I7QUFDbkJqRCxLQUFFK0MsS0FBRixFQUFTZixPQUFULENBQWlCLFFBQWpCLEVBQTJCa0IsUUFBM0IsQ0FBb0MsY0FBcEM7QUFDQSxHQUZELE1BRU87QUFDTmxELEtBQUUrQyxLQUFGLEVBQVNmLE9BQVQsQ0FBaUIsUUFBakIsRUFBMkJtQixXQUEzQixDQUF1QyxjQUF2QztBQUNBO0FBQ0Q7O0FBRURuRCxHQUFFLGNBQUYsRUFBa0JPLElBQWxCLENBQXVCLFlBQVc7QUFDakN1QyxTQUFPLElBQVA7QUFDQSxFQUZEOztBQUlBOUMsR0FBRSxTQUFGLEVBQWFnQixFQUFiLENBQWdCLE9BQWhCLEVBQXlCLFVBQVNvQyxDQUFULEVBQVk7QUFDcENBLElBQUVDLGVBQUY7QUFDQSxNQUFJQyxVQUFVdEQsRUFBRSxJQUFGLEVBQVFhLE1BQVIsR0FBaUJDLElBQWpCLENBQXNCZCxFQUFFLE1BQUlBLEVBQUUsSUFBRixFQUFRWSxJQUFSLENBQWEsUUFBYixDQUFOLENBQXRCLENBQWQ7QUFDQVosSUFBRSxJQUFGLEVBQVF1RCxXQUFSLENBQW9CLGNBQXBCO0FBQ0F2RCxJQUFFc0QsT0FBRixFQUFXRSxJQUFYLEdBQWtCQyxXQUFsQixDQUE4QixHQUE5QjtBQUNBLEVBTEQ7O0FBT0F6RCxHQUFFLHdCQUFGLEVBQTRCTyxJQUE1QixDQUFpQyxVQUFTQyxDQUFULEVBQVlrRCxLQUFaLEVBQW1CO0FBQ25ELE1BQUlDLFNBQVMzRCxFQUFFMEQsS0FBRixFQUFTNUMsSUFBVCxDQUFjLFdBQWQsRUFBMkJtQyxNQUF4Qzs7QUFFQSxNQUFJVSxTQUFTLENBQWIsRUFBZ0I7QUFDZjNELEtBQUUwRCxLQUFGLEVBQVNSLFFBQVQsQ0FBa0IsNEJBQWxCO0FBQ0FsRCxLQUFFMEQsS0FBRixFQUFTRSxNQUFULENBQWdCLHNEQUFoQjtBQUNBO0FBQ0QsRUFQRDs7QUFTQTVELEdBQUUscUJBQUYsRUFBeUJnQixFQUF6QixDQUE0QixPQUE1QixFQUFxQyxZQUFXO0FBQy9DaEIsSUFBRSxJQUFGLEVBQVFhLE1BQVIsR0FBaUJzQyxXQUFqQixDQUE2Qiw0QkFBN0I7QUFDQW5ELElBQUUsSUFBRixFQUFRNkQsTUFBUjtBQUNBLEVBSEQ7O0FBS0E3RCxHQUFFLGFBQUYsRUFBaUJnQixFQUFqQixDQUFvQixPQUFwQixFQUE2QixZQUFXO0FBQ3ZDLE1BQUksQ0FBQ2hCLEVBQUUsSUFBRixFQUFROEQsUUFBUixDQUFpQixpQkFBakIsQ0FBTCxFQUEwQztBQUN6QzlELEtBQUUsSUFBRixFQUFRa0QsUUFBUixDQUFpQixtQkFBakIsRUFBc0NhLFFBQXRDLEdBQWlEWixXQUFqRCxDQUE2RCxtQkFBN0Q7QUFDQTs7QUFFRG5ELElBQUUsSUFBRixFQUFRZ0MsT0FBUixDQUFnQixhQUFoQixFQUErQm1CLFdBQS9CLENBQTJDLFdBQTNDO0FBQ0EsRUFORDs7QUFRQW5ELEdBQUVnRSxRQUFGLEVBQVloRCxFQUFaLENBQWUsT0FBZixFQUF3QixhQUF4QixFQUF1QyxZQUFXOztBQUVqRCxNQUFJSixPQUFPWixFQUFFLElBQUYsRUFBUVksSUFBUixDQUFhLE1BQWIsQ0FBWDs7QUFFQSxNQUFJQSxRQUFRLFNBQVosRUFBdUI7QUFDdEJaLEtBQUUsWUFBRixFQUFnQm1ELFdBQWhCLENBQTRCLFdBQTVCO0FBQ0FuRCxLQUFFLElBQUYsRUFBUWEsTUFBUixHQUFpQm1CLE9BQWpCLENBQXlCLGFBQXpCLEVBQXdDa0IsUUFBeEMsQ0FBaUQsV0FBakQ7QUFDQSxHQUhELE1BR087QUFFUCxFQVREOztBQVdBbEQsR0FBRWdFLFFBQUYsRUFBWWhELEVBQVosQ0FBZSxPQUFmLEVBQXdCLFVBQVNvQyxDQUFULEVBQVk7O0FBRW5DLE1BQUlhLE9BQU9qRSxFQUFFb0QsRUFBRWMsTUFBSixFQUFZckQsTUFBWixHQUFxQm1CLE9BQXJCLENBQTZCLGFBQTdCLEVBQTRDNUIsR0FBNUMsQ0FBZ0QsQ0FBaEQsQ0FBWDtBQUFBLE1BQ0UrRCxNQUFNbkUsRUFBRW9ELEVBQUVjLE1BQUosRUFBWXJELE1BQVosR0FBcUJtQixPQUFyQixDQUE2QixNQUE3QixFQUFxQzVCLEdBQXJDLENBQXlDLENBQXpDLENBRFI7O0FBR0EsTUFBSUosRUFBRW9ELEVBQUVjLE1BQUosRUFBWUosUUFBWixDQUFxQixtQkFBckIsQ0FBSixFQUErQzs7QUFFL0MsTUFBSSxDQUFDRyxJQUFMLEVBQVc7QUFDVmpFLEtBQUUsWUFBRixFQUFnQm1ELFdBQWhCLENBQTRCLFdBQTVCO0FBQ0E7O0FBRUQsTUFBSSxDQUFDZ0IsR0FBTCxFQUFVO0FBQ1RuRSxLQUFFLG1CQUFGLEVBQXVCZSxJQUF2QjtBQUNBO0FBRUQsRUFmRDs7QUFpQkFmLEdBQUUsb0JBQUYsRUFBd0JnQixFQUF4QixDQUEyQixPQUEzQixFQUFvQyxZQUFXO0FBQzlDaEIsSUFBRSxJQUFGLEVBQVFlLElBQVI7QUFDQWYsSUFBRSxxQkFBRixFQUF5QmUsSUFBekI7QUFDQWYsSUFBRSxtQkFBRixFQUF1Qm9FLElBQXZCO0FBQ0EsRUFKRDs7QUFNQXBFLEdBQUUsY0FBRixFQUFrQmdCLEVBQWxCLENBQXFCLE9BQXJCLEVBQThCLFVBQVNvQyxDQUFULEVBQVk7QUFDekNBLElBQUVpQixjQUFGOztBQUVBckUsSUFBRSxJQUFGLEVBQVFhLE1BQVIsR0FBaUJFLElBQWpCO0FBQ0FmLElBQUUsSUFBRixFQUFRZ0MsT0FBUixDQUFnQixPQUFoQixFQUF5QnNDLEdBQXpCLENBQTZCLFNBQTdCLEVBQXdDLEVBQXhDO0FBQ0EsRUFMRDs7QUFPQXRFLEdBQUUsWUFBRixFQUFnQmdCLEVBQWhCLENBQW1CLE9BQW5CLEVBQTRCLFlBQVc7QUFDdENoQixJQUFFLE9BQUYsRUFBV3NFLEdBQVgsQ0FBZSxTQUFmLEVBQTBCLEVBQTFCO0FBQ0F0RSxJQUFFLG1CQUFGLEVBQXVCZSxJQUF2QjtBQUNBZixJQUFFLElBQUYsRUFBUWEsTUFBUixHQUFpQkMsSUFBakIsQ0FBc0IsbUJBQXRCLEVBQTJDc0QsSUFBM0M7QUFDQXBFLElBQUUsSUFBRixFQUFRZ0MsT0FBUixDQUFnQixPQUFoQixFQUF5QnNDLEdBQXpCLENBQTZCLFNBQTdCLEVBQXdDLEdBQXhDO0FBQ0EsRUFMRDs7QUFPQTtBQUNBdEUsR0FBRSxtQkFBRixFQUF1QmdCLEVBQXZCLENBQTBCLE9BQTFCLEVBQW1DLFlBQVc7O0FBRTdDLE1BQUloQixFQUFFLElBQUYsRUFBUThELFFBQVIsQ0FBaUIsd0JBQWpCLENBQUosRUFBZ0Q7QUFDL0MsT0FBSVMsUUFBUXZFLEVBQUUsSUFBRixFQUFRYyxJQUFSLENBQWEsT0FBYixFQUFzQjBELEtBQXRCLEVBQVo7O0FBRUF4RSxLQUFFLDZCQUFGLEVBQWlDeUUsSUFBakMsQ0FBc0NGLEtBQXRDOztBQUVBdkUsS0FBRSxhQUFGLEVBQWlCMEUsUUFBakIsQ0FBMEIsTUFBMUI7QUFFQSxHQVBELE1BT087QUFDTixPQUFJQyxNQUFNM0UsRUFBRSxJQUFGLEVBQVFjLElBQVIsQ0FBYSxLQUFiLEVBQW9CMEQsS0FBcEIsRUFBVjs7QUFFQXhFLEtBQUUsSUFBRixFQUFRZ0MsT0FBUixDQUFnQixVQUFoQixFQUE0QmxCLElBQTVCLENBQWlDLGdCQUFqQyxFQUFtRDhELEtBQW5ELEdBQTJEaEIsTUFBM0QsQ0FBa0VlLEdBQWxFOztBQUVBM0UsS0FBRSxJQUFGLEVBQVFnQyxPQUFSLENBQWdCLGdCQUFoQixFQUFrQ2xCLElBQWxDLENBQXVDLDBCQUF2QyxFQUFtRXFDLFdBQW5FLENBQStFLHlCQUEvRTtBQUNBbkQsS0FBRSxJQUFGLEVBQVFrRCxRQUFSLENBQWlCLHlCQUFqQjtBQUNBO0FBRUQsRUFsQkQ7O0FBb0JBbEQsR0FBRSxhQUFGLEVBQWlCTyxJQUFqQixDQUFzQixVQUFTQyxDQUFULEVBQVlxRSxJQUFaLEVBQWtCO0FBQ3ZDLE1BQUlULE9BQU9wRSxFQUFFNkUsSUFBRixFQUFRakUsSUFBUixDQUFhLE1BQWIsQ0FBWDtBQUFBLE1BQ0VrRSxPQUFPOUUsRUFBRTZFLElBQUYsRUFBUS9ELElBQVIsQ0FBYSxxQ0FBYixFQUFvRFYsR0FBcEQsQ0FBd0RnRSxJQUF4RCxDQURUOztBQUdBcEUsSUFBRThFLElBQUYsRUFBUS9ELElBQVIsR0FBZWdFLE9BQWYsQ0FBdUIseUJBQXZCLEVBQWtEaEUsSUFBbEQ7QUFDQSxFQUxEOztBQU9BZixHQUFFLGNBQUYsRUFBa0JnQixFQUFsQixDQUFxQixPQUFyQixFQUE4QixZQUFXO0FBQ3hDaEIsSUFBRSxJQUFGLEVBQVFnQyxPQUFSLENBQWdCLFFBQWhCLEVBQTBCdUIsV0FBMUIsQ0FBc0MsZUFBdEM7QUFDQSxFQUZEOztBQUlBOztBQUVBeUIsWUFBVyxZQUFXO0FBQ3JCaEYsSUFBRSxjQUFGLEVBQWtCMEUsUUFBbEIsQ0FBMkI7QUFDMUJPLGNBQVcsbUJBQVNDLENBQVQsRUFBVztBQUNyQixRQUFJWCxRQUFRVyxFQUFFQyxRQUFGLENBQVdyRSxJQUFYLENBQWdCLE9BQWhCLEVBQXlCVixHQUF6QixDQUE2QixDQUE3QixDQUFaOztBQUVBLFFBQUltRSxLQUFKLEVBQVc7QUFDVkEsV0FBTWEsS0FBTjtBQUNBO0FBQ0Q7QUFQeUIsR0FBM0I7QUFTQSxFQVZELEVBVUcsQ0FWSDs7QUFhQXBGLEdBQUUsYUFBRixFQUFpQmdCLEVBQWpCLENBQW9CLE9BQXBCLEVBQTZCLFVBQVNvQyxDQUFULEVBQVk7QUFDeENBLElBQUVpQixjQUFGOztBQUVBLE1BQUlnQixJQUFJckYsRUFBRSxJQUFGLEVBQVFZLElBQVIsQ0FBYSxNQUFiLENBQVI7QUFDQVosSUFBRSxpQkFBZXFGLENBQWYsR0FBaUIsR0FBbkIsRUFBd0JYLFFBQXhCLENBQWlDLE1BQWpDO0FBQ0EsRUFMRDs7QUFRQTFFLEdBQUUsZ0JBQUYsRUFBb0JnQixFQUFwQixDQUF1QixPQUF2QixFQUFnQyxZQUFXO0FBQzFDLE1BQUkyRCxNQUFNM0UsRUFBRSxJQUFGLEVBQVFjLElBQVIsQ0FBYSxLQUFiLEVBQW9CMEQsS0FBcEIsRUFBVjs7QUFFQXhFLElBQUUsNkJBQUYsRUFBaUN5RSxJQUFqQyxDQUFzQ0UsR0FBdEM7O0FBRUEzRSxJQUFFLGFBQUYsRUFBaUIwRSxRQUFqQixDQUEwQixNQUExQjtBQUNBLEVBTkQ7O0FBU0ExRSxHQUFFLGdCQUFGLEVBQW9CZ0IsRUFBcEIsQ0FBdUIsT0FBdkIsRUFBZ0MsWUFBVztBQUMxQ2hCLElBQUUsb0NBQUYsRUFBd0NNLE9BQXhDLENBQWdELE9BQWhEO0FBQ0FOLElBQUUsU0FBRixFQUFhVyxNQUFiO0FBQ0EsRUFIRDs7QUFLQVgsR0FBRSxpQkFBRixFQUFxQmdCLEVBQXJCLENBQXdCLE9BQXhCLEVBQWlDLFlBQVc7QUFDM0NoQixJQUFFLGtCQUFGLEVBQXNCVyxNQUF0QjtBQUNBLEVBRkQ7O0FBSUFYLEdBQUUsb0JBQUYsRUFBd0JnQixFQUF4QixDQUEyQixPQUEzQixFQUFvQyxVQUFTb0MsQ0FBVCxFQUFZO0FBQy9DQSxJQUFFQyxlQUFGOztBQUVBLE1BQUlZLE9BQU9qRSxFQUFFLElBQUYsRUFBUWMsSUFBUixDQUFhLGVBQWIsRUFBOEJULEtBQTlCLEVBQVg7O0FBR0EsTUFBSUwsRUFBRW9ELEVBQUVjLE1BQUosRUFBWW9CLFlBQVosQ0FBeUIsb0JBQXpCLEVBQStDckMsTUFBL0MsSUFBeUQsQ0FBN0QsRUFBZ0U7QUFDL0RqRCxLQUFFaUUsSUFBRixFQUFRVixXQUFSLENBQW9CLG1CQUFwQjtBQUNBO0FBRUQsRUFWRDs7QUFZQXZELEdBQUUsZUFBRixFQUFtQmdCLEVBQW5CLENBQXNCLE9BQXRCLEVBQStCLFVBQVNvQyxDQUFULEVBQVk7QUFDMUNBLElBQUVDLGVBQUY7O0FBRUFyRCxJQUFFLElBQUYsRUFBUWdDLE9BQVIsQ0FBZ0Isb0JBQWhCLEVBQXNDbUIsV0FBdEMsQ0FBa0QsbUJBQWxEO0FBQ0EsRUFKRDs7QUFNQW5ELEdBQUUsaUJBQUYsRUFBcUJnQixFQUFyQixDQUF3QixPQUF4QixFQUFpQyxVQUFTb0MsQ0FBVCxFQUFZO0FBQzVDQSxJQUFFaUIsY0FBRjs7QUFFQSxNQUFJekQsT0FBT1osRUFBRSxJQUFGLEVBQVFhLE1BQVIsR0FBaUJELElBQWpCLENBQXNCLE1BQXRCLENBQVg7QUFBQSxNQUNFMkUsUUFBUXZGLEVBQUUsSUFBRixFQUFRdUYsS0FBUixFQURWO0FBQUEsTUFFRWpDLFVBQVV0RCxFQUFFLHdCQUFzQlksSUFBdEIsR0FBMkIsR0FBN0IsRUFBa0NGLFFBQWxDLEdBQTZDTixHQUE3QyxDQUFpRG1GLEtBQWpELENBRlo7O0FBSUF2RixJQUFFc0QsT0FBRixFQUFXYyxJQUFYLEdBQWtCTCxRQUFsQixHQUE2QmhELElBQTdCOztBQUVBLE1BQUksQ0FBQ3VDLE9BQUwsRUFBYztBQUNidEQsS0FBRSx3QkFBc0JZLElBQXRCLEdBQTJCLEdBQTdCLEVBQWtDRixRQUFsQyxHQUE2Q0ssSUFBN0M7QUFDQTs7QUFFRGYsSUFBRSxJQUFGLEVBQVFrRCxRQUFSLENBQWlCLFFBQWpCLEVBQTJCYSxRQUEzQixHQUFzQ1osV0FBdEMsQ0FBa0QsUUFBbEQ7QUFDQSxFQWREOztBQWdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0FuRCxHQUFFLFFBQUYsRUFBWWdCLEVBQVosQ0FBZSxPQUFmLEVBQXdCLFlBQVc7QUFDbEMsTUFBSXdFLEtBQUt4RixFQUFFLElBQUYsRUFBUVksSUFBUixDQUFhLElBQWIsQ0FBVDs7QUFFQVosSUFBRSxNQUFJd0YsRUFBTixFQUFVZCxRQUFWLENBQW1CLE1BQW5CO0FBQ0EsRUFKRDs7QUFNQTFFLEdBQUUsaUJBQUYsRUFBcUJnQixFQUFyQixDQUF3QixPQUF4QixFQUFpQyxVQUFTb0MsQ0FBVCxFQUFZO0FBQzVDQSxJQUFFQyxlQUFGOztBQUVBckQsSUFBRSxJQUFGLEVBQVFnQyxPQUFSLENBQWdCLFdBQWhCLEVBQTZCdUIsV0FBN0IsQ0FBeUMsaUJBQXpDO0FBQ0EsRUFKRDs7QUFNQSxLQUFJa0MsU0FBSjtBQUFBLEtBQ0VDLFFBQVExQixTQUFTMkIsYUFBVCxDQUF1QixTQUF2QixDQURWOztBQUdBM0IsVUFBUzRCLGdCQUFULENBQTBCLFFBQTFCLEVBQW9DLFlBQVc7QUFDN0NILGNBQVl6QixTQUFTNkIsSUFBVCxDQUFjQyxTQUExQjs7QUFFQSxNQUFJOUYsRUFBRSxNQUFGLEVBQVU4RixTQUFWLE1BQXlCLEdBQTdCLEVBQWtDO0FBQ2pDOUYsS0FBRSxjQUFGLEVBQWtCa0QsUUFBbEIsQ0FBMkIsa0JBQTNCO0FBQ0EsR0FGRCxNQUVPO0FBQ05sRCxLQUFFLGNBQUYsRUFBa0JtRCxXQUFsQixDQUE4QixrQkFBOUI7QUFDQTs7QUFFRCxNQUFJc0MsYUFBYSxJQUFiLElBQXFCMUYsY0FBYyxHQUF2QyxFQUE0QztBQUMzQzJGLFNBQU1LLFNBQU4sQ0FBZ0JDLEdBQWhCLENBQW9CLGFBQXBCO0FBQ0EsR0FGRCxNQUVPO0FBQ05OLFNBQU1LLFNBQU4sQ0FBZ0JsQyxNQUFoQixDQUF1QixhQUF2QjtBQUNBO0FBQ0YsRUFkRCxFQWNHLElBZEg7O0FBZ0JBN0QsR0FBRSxTQUFGLEVBQWFnQixFQUFiLENBQWdCLE9BQWhCLEVBQXlCLFlBQVc7QUFDbkNoQixJQUFFLFlBQUYsRUFBZ0J3RCxJQUFoQixHQUF1QnlDLE9BQXZCLENBQStCLEVBQUNILFdBQVUsQ0FBWCxFQUEvQixFQUE4QyxHQUE5QyxFQUFtRCxPQUFuRDtBQUNBLEVBRkQ7O0FBSUE5RixHQUFFLG9CQUFGLEVBQXdCZ0IsRUFBeEIsQ0FBMkIsT0FBM0IsRUFBb0MsVUFBU29DLENBQVQsRUFBWTtBQUMvQ0EsSUFBRWlCLGNBQUY7O0FBRUFyRSxJQUFFLG1CQUFGLEVBQXVCZSxJQUF2QjtBQUNBZixJQUFFLElBQUYsRUFBUWEsTUFBUixHQUFpQkMsSUFBakIsQ0FBc0IsbUJBQXRCLEVBQTJDVCxLQUEzQyxHQUFtRCtELElBQW5EO0FBQ0EsRUFMRDs7QUFPQWpFOztBQUVBSCxHQUFFLGlEQUFGLEVBQXFEZ0IsRUFBckQsQ0FBd0QsT0FBeEQsRUFBaUUsVUFBU29DLENBQVQsRUFBWTtBQUM1RUEsSUFBRWlCLGNBQUY7QUFDQSxFQUZEO0FBSUEsQ0E3WEQsRUE2WEdwRSxNQTdYSCIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24ocm9vdCkge1xuXG5cdC8vINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC/0YDQuNC70LTQvtC20LXQvdC40Y9cblx0dmFyIHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblxuXHRcdGlmICgkKCcuZ2FsbGVyeScpLmdldCgwKSkge1xuXHRcdFx0JCgnLmdhbGxlcnlfX2VsZW1lbnQnKS5maXJzdCgpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdFx0fVxuXG5cdFx0JCgnW2RhdGEtdGFic10nKS5lYWNoKGZ1bmN0aW9uKGksIHRhYnMpIHtcblx0XHRcdCQodGFicykuY2hpbGRyZW4oKS5maXJzdCgpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdFx0fSk7XG5cblx0XHQkKCcudG9nZ2xlX2Nsb3NlJykuZWFjaChmdW5jdGlvbihpLCB0b2dnbGUpIHtcblx0XHRcdHZhciBkYXRhID0gJCh0aGlzKS5kYXRhKCd0b2dnbGUnKTtcblxuXHRcdFx0JCh0aGlzKS5wYXJlbnQoKS5maW5kKCcuJytkYXRhKS5oaWRlKCk7XG5cdFx0fSk7XG5cdH07XG5cblx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcblx0XHR3aW5kb3dXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xuXHR9KTtcblxuXHQvLyDQodC70LDQudC00LXRgNGLXG5cdHZhciBkYXRhU2xpZGVycyA9IHtcblx0XHRmZWF1dHVyZXM6IHtcblx0XHRcdGl0ZW1zOiA2LFxuXHRcdFx0bmF2OiB0cnVlXG5cdFx0fSxcblx0XHRnYWxsZXJ5OiB7XG5cdFx0XHRpdGVtczogMSxcblx0XHRcdG5hdjogdHJ1ZSxcblx0XHRcdGRvdHM6IHRydWUsXG5cdFx0XHRtb3VzZURyYWc6IGZhbHNlLFxuXHRcdFx0cmVzcG9uc2l2ZToge1xuXHRcdFx0XHQ5NjE6IHtcblx0XHRcdFx0XHRpdGVtczogNCxcblx0XHRcdFx0XHRkb3RzOiBmYWxzZVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRwcm9tbzoge1xuXHRcdFx0aXRlbXM6IDEsXG5cdFx0XHRkb3RzOiB0cnVlLFxuXHRcdFx0bG9vcDogdHJ1ZSxcblx0XHRcdGF1dG9wbGF5OiB0cnVlLFxuXHRcdH1cblx0fVxuXG5cdCQoJ1tkYXRhLXNsaWRlcl0nKS5lYWNoKGZ1bmN0aW9uKGksIHNsaWRlcikge1xuXHRcdHZhciBkYXRhID0gJCh0aGlzKS5kYXRhKCdzbGlkZXInKTtcblxuXHRcdCQoc2xpZGVyKS5vd2xDYXJvdXNlbChkYXRhU2xpZGVyc1tkYXRhXSlcblx0fSk7XG5cblx0JCgnLnJhbmdlX19zbGlkZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdHZhciByYW5nZSA9IHRoaXMsXG5cdFx0XHRcdG1pbklucHV0ID0gJChyYW5nZSkuY2xvc2VzdCgnLnJhbmdlJykuZmluZCgnW2RhdGEtaW5wdXQ9XCJtaW5cIl0nKSxcblx0XHRcdFx0bWF4SW5wdXQgPSAkKHJhbmdlKS5jbG9zZXN0KCcucmFuZ2UnKS5maW5kKCdbZGF0YS1pbnB1dD1cIm1heFwiXScpO1xuXG5cdFx0ZnVuY3Rpb24gdXBkYXRlKCkge1xuXHRcdFx0dmFyIGZyb20gPSAkKHJhbmdlKS5kYXRhKCdmcm9tJyksXG5cdFx0XHRcdFx0dG8gPSAkKHJhbmdlKS5kYXRhKCd0bycpO1xuXG5cdFx0XHQkKG1pbklucHV0KS52YWwoZnJvbSk7XG5cdFx0XHQkKG1heElucHV0KS52YWwodG8pO1xuXHRcdH1cblxuXHRcdCQocmFuZ2UpLmlvblJhbmdlU2xpZGVyKHtcblx0XHRcdGV4dHJhX2NsYXNzZXM6ICdyYW5nZV9fc2xpZGVyJyxcblx0XHRcdGhpZGVfbWluX21heDogdHJ1ZSxcblx0XHRcdGhpZGVfZnJvbV90bzogdHJ1ZSxcblx0XHR9KTtcblxuXHRcdHVwZGF0ZSgpO1xuXHRcdCQocmFuZ2UpLm9uKCdjaGFuZ2UnLCB1cGRhdGUpO1xuXHR9KTtcblxuXHQkKCdbZGF0YS1pbnB1dF0nKS5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHJhbmdlID0gJCh0aGlzKS5jbG9zZXN0KCcucmFuZ2UnKS5maW5kKCdpbnB1dC5yYW5nZV9fc2xpZGVyJykuZGF0YShcImlvblJhbmdlU2xpZGVyXCIpLFxuXHRcdFx0XHR2YWwgPSAkKHRoaXMpLnZhbCgpLFxuXHRcdFx0XHRtaW4gPSByYW5nZS5vcHRpb25zLm1pbixcblx0XHRcdFx0bWF4ID0gcmFuZ2Uub3B0aW9ucy5tYXgsXG5cdFx0XHRcdGZyb20gPSByYW5nZS5vcHRpb25zLmZyb20sXG5cdFx0XHRcdHRvID0gcmFuZ2Uub3B0aW9ucy50byxcblx0XHRcdFx0c3RlcCA9IHJhbmdlLm9wdGlvbnMuc3RlcDtcblxuXHRcdHN3aXRjaCAoJCh0aGlzKS5kYXRhKCdpbnB1dCcpKSB7XG5cdFx0XHRjYXNlICdtaW4nOlxuXHRcdFx0XHRpZiAodmFsIDw9IG1pbikge1xuXHRcdFx0XHRcdHZhbCA9IG1pbjtcblx0XHRcdFx0fSBlbHNlIGlmICh2YWwgPj0gbWF4KSB7XG5cdFx0XHRcdFx0dmFsID0gbWF4IC0gc3RlcDtcblx0XHRcdFx0fSBlbHNlIGlmICh2YWwgPj0gdG8pIHtcblx0XHRcdFx0XHR2YWwgPSB0byAtIHN0ZXA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyYW5nZS51cGRhdGUoe1xuXHRcdFx0XHRcdGZyb206IHZhbFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdtYXgnOlxuXHRcdFx0XHRpZiAodmFsID49IG1heCkge1xuXHRcdFx0XHRcdHZhbCA9IG1heDtcblx0XHRcdFx0fSBlbHNlIGlmICh2YWwgPD0gbWluKSB7XG5cdFx0XHRcdFx0dmFsID0gbWluICsgc3RlcDtcblx0XHRcdFx0fSBlbHNlIGlmICh2YWwgPD0gZnJvbSkge1xuXHRcdFx0XHRcdHZhbCA9IGZyb20gKyBzdGVwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmFuZ2UudXBkYXRlKHtcblx0XHRcdFx0XHR0bzogdmFsXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHQkKHRoaXMpLnZhbCh2YWwpO1xuXG5cdH0pO1xuXG5cdGZ1bmN0aW9uIGZpbGxlZChmaWVsZCkge1xuXHRcdHZhciB2YWwgPSAkKGZpZWxkKS52YWwoKS50cmltKCk7XG5cblx0XHRpZiAodmFsLmxlbmd0aCA+IDApIHtcblx0XHRcdCQoZmllbGQpLmNsb3Nlc3QoJy5maWVsZCcpLmFkZENsYXNzKCdmaWVsZF9maWxsZWQnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JChmaWVsZCkuY2xvc2VzdCgnLmZpZWxkJykucmVtb3ZlQ2xhc3MoJ2ZpZWxkX2ZpbGxlZCcpO1xuXHRcdH1cblx0fVxuXG5cdCQoJy5maWVsZCBpbnB1dCcpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0ZmlsbGVkKHRoaXMpO1xuXHR9KTtcblxuXHQkKCcudG9nZ2xlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKClcblx0XHR2YXIgY29udGVudCA9ICQodGhpcykucGFyZW50KCkuZmluZCgkKCcuJyskKHRoaXMpLmRhdGEoJ3RvZ2dsZScpKSk7XG5cdFx0JCh0aGlzKS50b2dnbGVDbGFzcygndG9nZ2xlX2Nsb3NlJyk7XG5cdFx0JChjb250ZW50KS5zdG9wKCkuc2xpZGVUb2dnbGUoMzAwKTtcblx0fSk7XG5cblx0JCgnLmZpbHRlcl9fYmxvY2stY29udGVudCcpLmVhY2goZnVuY3Rpb24oaSwgYmxvY2spIHtcblx0XHR2YXIgY2hlY2tzID0gJChibG9jaykuZmluZCgnLmNoZWNrYm94JykubGVuZ3RoO1xuXG5cdFx0aWYgKGNoZWNrcyA+IDUpIHtcblx0XHRcdCQoYmxvY2spLmFkZENsYXNzKCdmaWx0ZXJfX2Jsb2NrLWNvbnRlbnRfbW9yZScpO1xuXHRcdFx0JChibG9jaykuYXBwZW5kKCc8c3BhbiBjbGFzcz1cImZpbHRlcl9fYmxvY2stbW9yZVwiPtCf0L7QutCw0LfQsNGC0Ywg0LLRgdC1PC9zcGFuPicpO1xuXHRcdH1cblx0fSk7XG5cblx0JCgnLmZpbHRlcl9fYmxvY2stbW9yZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcykucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2ZpbHRlcl9fYmxvY2stY29udGVudF9tb3JlJyk7XG5cdFx0JCh0aGlzKS5yZW1vdmUoKTtcblx0fSk7XG5cblx0JCgnLmRyb3BfX2l0ZW0nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRpZiAoISQodGhpcykuaGFzQ2xhc3MoJ2Ryb3BfX2l0ZW1fbGluaycpKSB7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdkcm9wX19pdGVtX2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2Ryb3BfX2l0ZW1fYWN0aXZlJyk7XG5cdFx0fVxuXG5cdFx0JCh0aGlzKS5jbG9zZXN0KCdbZGF0YS1kcm9wXScpLnJlbW92ZUNsYXNzKCdkcm9wLW9wZW4nKTtcblx0fSk7XG5cblx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJ1tkYXRhLWRyb3BdJywgZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgZGF0YSA9ICQodGhpcykuZGF0YSgnZHJvcCcpO1xuXG5cdFx0aWYgKGRhdGEgPT0gJ3RyaWdnZXInKSB7XG5cdFx0XHQkKCcuZHJvcC1vcGVuJykucmVtb3ZlQ2xhc3MoJ2Ryb3Atb3BlbicpO1xuXHRcdFx0JCh0aGlzKS5wYXJlbnQoKS5jbG9zZXN0KCdbZGF0YS1kcm9wXScpLmFkZENsYXNzKCdkcm9wLW9wZW4nKTtcblx0XHR9IGVsc2UgcmV0dXJuO1xuXG5cdH0pO1xuXG5cdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblxuXHRcdHZhciBkcm9wID0gJChlLnRhcmdldCkucGFyZW50KCkuY2xvc2VzdCgnW2RhdGEtZHJvcF0nKS5nZXQoMCksXG5cdFx0XHRcdHRpcCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLmNsb3Nlc3QoJy50aXAnKS5nZXQoMCk7XG5cblx0XHRpZiAoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2NvdW50ZXJfX2J0bl9wbHVzJykpIHJldHVybjtcblxuXHRcdGlmICghZHJvcCkge1xuXHRcdFx0JCgnLmRyb3Atb3BlbicpLnJlbW92ZUNsYXNzKCdkcm9wLW9wZW4nKTtcblx0XHR9XG5cblx0XHRpZiAoIXRpcCkge1xuXHRcdFx0JCgnLnRpcF9faGlkZWNvbnRlbnQnKS5oaWRlKCk7XG5cdFx0fVxuXG5cdH0pXG5cblx0JCgnLmRlc2NyaXB0aW9uX19zaG93Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0JCh0aGlzKS5oaWRlKCk7XG5cdFx0JCgnLmRlc2NyaXB0aW9uX19zaG9ydCcpLmhpZGUoKTtcblx0XHQkKCcuZGVzY3JpcHRpb25fX2FsbCcpLnNob3coKTtcblx0fSk7XG5cblx0JCgnW2RhdGEtY2xvc2VdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdCQodGhpcykucGFyZW50KCkuaGlkZSgpO1xuXHRcdCQodGhpcykuY2xvc2VzdCgnLmNhcmQnKS5jc3MoJ3otaW5kZXgnLCAnJyk7XG5cdH0pO1xuXG5cdCQoJy50aXBfX25hbWUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHQkKCcuY2FyZCcpLmNzcygnei1pbmRleCcsICcnKTtcblx0XHQkKCcudGlwX19oaWRlY29udGVudCcpLmhpZGUoKTtcblx0XHQkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy50aXBfX2hpZGVjb250ZW50Jykuc2hvdygpO1xuXHRcdCQodGhpcykuY2xvc2VzdCgnLmNhcmQnKS5jc3MoJ3otaW5kZXgnLCAnMicpO1xuXHR9KTtcblxuXHQvLyBHYWxsZXJ5XG5cdCQoJy5nYWxsZXJ5X19lbGVtZW50Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cblx0XHRpZiAoJCh0aGlzKS5oYXNDbGFzcygnZ2FsbGVyeV9fZWxlbWVudF92aWRlbycpKSB7XG5cdFx0XHR2YXIgdmlkZW8gPSAkKHRoaXMpLmZpbmQoJ3ZpZGVvJykuY2xvbmUoKTtcblxuXHRcdFx0JCgnLm1vZGFsX3pvb20gLm1vZGFsX19jb250ZW50JykuaHRtbCh2aWRlbyk7XG5cblx0XHRcdCQoJy5tb2RhbF96b29tJykuaXppTW9kYWwoJ29wZW4nKTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgaW1nID0gJCh0aGlzKS5maW5kKCdpbWcnKS5jbG9uZSgpO1xuXG5cdFx0XHQkKHRoaXMpLmNsb3Nlc3QoJy5nYWxsZXJ5JykuZmluZCgnLmdhbGxlcnlfX3ZpZXcnKS5lbXB0eSgpLmFwcGVuZChpbWcpO1xuXG5cdFx0XHQkKHRoaXMpLmNsb3Nlc3QoJy5nYWxsZXJ5X19saXN0JykuZmluZCgnLmdhbGxlcnlfX2VsZW1lbnRfYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2dhbGxlcnlfX2VsZW1lbnRfYWN0aXZlJyk7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdnYWxsZXJ5X19lbGVtZW50X2FjdGl2ZScpO1xuXHRcdH1cblxuXHR9KTtcblxuXHQkKCcudmxpc3RfZnVsbCcpLmVhY2goZnVuY3Rpb24oaSwgbGlzdCkge1xuXHRcdHZhciBzaG93ID0gJChsaXN0KS5kYXRhKCdzaG93JyksXG5cdFx0XHRcdGxpbmUgPSAkKGxpc3QpLmZpbmQoJy52bGlzdF9fbGluZTpub3QoLnZsaXN0X19saW5lX2hlYWQpJykuZ2V0KHNob3cpO1xuXG5cdFx0JChsaW5lKS5oaWRlKCkubmV4dEFsbCgnOm5vdCgudmxpc3RfX2xpbmVfbW9yZSknKS5oaWRlKCk7XG5cdH0pO1xuXG5cdCQoJy52bGlzdF9fbW9yZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcykuY2xvc2VzdCgnLnZsaXN0JykudG9nZ2xlQ2xhc3MoJ3ZsaXN0X2FsbHNob3cnKTtcblx0fSk7XG5cblx0Ly8gTW9kYWxcblxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCQoJ1tkYXRhLW1vZGFsXScpLml6aU1vZGFsKHtcblx0XHRcdG9uQ2xvc2luZzogZnVuY3Rpb24ocil7XG5cdFx0XHRcdHZhciB2aWRlbyA9IHIuJGVsZW1lbnQuZmluZCgndmlkZW8nKS5nZXQoMCk7XG5cblx0XHRcdFx0aWYgKHZpZGVvKSB7XG5cdFx0XHRcdFx0dmlkZW8ucGF1c2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LCAxKVxuXG5cblx0JCgnW2RhdGEtb3Blbl0nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIG0gPSAkKHRoaXMpLmRhdGEoJ29wZW4nKTtcblx0XHQkKCdbZGF0YS1tb2RhbD0nK20rJ10nKS5pemlNb2RhbCgnb3BlbicpO1xuXHR9KTtcblxuXG5cdCQoJy5nYWxsZXJ5X192aWV3Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGltZyA9ICQodGhpcykuZmluZCgnaW1nJykuY2xvbmUoKTtcblxuXHRcdCQoJy5tb2RhbF96b29tIC5tb2RhbF9fY29udGVudCcpLmh0bWwoaW1nKVxuXG5cdFx0JCgnLm1vZGFsX3pvb20nKS5pemlNb2RhbCgnb3BlbicpO1xuXHR9KTtcblxuXG5cdCQoJy5maWx0ZXItdG9nZ2xlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0JCgnLmZpbHRlciAudG9nZ2xlOm5vdCgudG9nZ2xlX2Nsb3NlKScpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdFx0JCgnLmZpbHRlcicpLnRvZ2dsZSgpO1xuXHR9KTtcblxuXHQkKCcubS1tZW51X190b2dnbGUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHQkKCcubS1tZW51X19jb250ZW50JykudG9nZ2xlKCk7XG5cdH0pO1xuXG5cdCQoJy5tLW1lbnVfX2l0ZW1fZHJvcCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0dmFyIGRyb3AgPSAkKHRoaXMpLmZpbmQoJy5tLW1lbnVfX2Ryb3AnKS5maXJzdCgpO1xuXG5cblx0XHRpZiAoJChlLnRhcmdldCkucGFyZW50c1VudGlsKCcubS1tZW51X19pdGVtX2Ryb3AnKS5sZW5ndGggPD0gMSkge1xuXHRcdFx0JChkcm9wKS50b2dnbGVDbGFzcygnbS1tZW51X19kcm9wX3Nob3cnKTtcblx0XHR9XG5cblx0fSk7XG5cblx0JCgnLm0tbWVudV9fYmFjaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0JCh0aGlzKS5jbG9zZXN0KCcubS1tZW51X19kcm9wX3Nob3cnKS5yZW1vdmVDbGFzcygnbS1tZW51X19kcm9wX3Nob3cnKTtcblx0fSk7XG5cblx0JCgnW2RhdGEtdGFic10gPiAqJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHZhciBkYXRhID0gJCh0aGlzKS5wYXJlbnQoKS5kYXRhKCd0YWJzJyksXG5cdFx0XHRcdGluZGV4ID0gJCh0aGlzKS5pbmRleCgpLFxuXHRcdFx0XHRjb250ZW50ID0gJCgnW2RhdGEtdGFicy1jb250ZW50PScrZGF0YSsnXScpLmNoaWxkcmVuKCkuZ2V0KGluZGV4KTtcblxuXHRcdCQoY29udGVudCkuc2hvdygpLnNpYmxpbmdzKCkuaGlkZSgpO1xuXG5cdFx0aWYgKCFjb250ZW50KSB7XG5cdFx0XHQkKCdbZGF0YS10YWJzLWNvbnRlbnQ9JytkYXRhKyddJykuY2hpbGRyZW4oKS5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0JCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdH0pO1xuXG5cdC8vIGlmICgkKCcubW9kYWxfdmlkZW8nKS5nZXQoMCkpIHtcblx0Ly8gXHQkKFwiLm1vZGFsX3ZpZGVvXCIpLml6aU1vZGFsKHtcblx0Ly8gXHRcdGhpc3Rvcnk6IGZhbHNlLFxuXHQvLyBcdFx0aWZyYW1lIDogdHJ1ZSxcblx0Ly8gXHRcdGZ1bGxzY3JlZW46IHRydWUsXG5cdC8vIFx0XHRoZWFkZXJDb2xvcjogJyMwMDAwMDAnLFxuXHQvLyBcdFx0Z3JvdXA6ICdncm91cDEnLFxuXHQvLyBcdFx0bG9vcDogdHJ1ZVxuXHQvLyBcdH0pO1xuXHQvLyB9XG5cblxuXHQkKCcudmlkZW8nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgaWQgPSAkKHRoaXMpLmRhdGEoJ2lkJyk7XG5cblx0XHQkKCcjJytpZCkuaXppTW9kYWwoJ29wZW4nKTtcblx0fSk7XG5cblx0JCgnLmNoZWNrYm94IGlucHV0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHQkKHRoaXMpLmNsb3Nlc3QoJy5jaGVja2JveCcpLnRvZ2dsZUNsYXNzKCdjaGVja2JveF9hY3RpdmUnKTtcblx0fSk7XG5cblx0dmFyIHNjcm9sbGluZyxcblx0XHRcdHRvVG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvLXRvcCcpO1xuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuXHRcdCBzY3JvbGxpbmcgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcblxuXHRcdCBpZiAoJCgnYm9keScpLnNjcm9sbFRvcCgpID49IDIwMCkge1xuXHRcdFx0ICQoJy5oZWFkZXJfX2ZpeCcpLmFkZENsYXNzKCdoZWFkZXJfX2ZpeF9zaG93Jyk7XG5cdFx0IH0gZWxzZSB7XG5cdFx0XHQgJCgnLmhlYWRlcl9fZml4JykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZml4X3Nob3cnKTtcblx0XHQgfVxuXG5cdFx0IGlmIChzY3JvbGxpbmcgPj0gMTAwMCAmJiB3aW5kb3dXaWR0aCA+IDk2MCkge1xuXHRcdFx0IHRvVG9wLmNsYXNzTGlzdC5hZGQoJ3RvLXRvcF9zaG93Jyk7XG5cdFx0IH0gZWxzZSB7XG5cdFx0XHQgdG9Ub3AuY2xhc3NMaXN0LnJlbW92ZSgndG8tdG9wX3Nob3cnKTtcblx0XHQgfVxuXHR9LCB0cnVlKTtcblxuXHQkKCcudG8tdG9wJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoe3Njcm9sbFRvcDowfSwgNTAwLCAnc3dpbmcnKTtcblx0fSk7XG5cblx0JCgnLmNvdW50ZXJfX2J0bl9wbHVzJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdCQoJy50aXBfX2hpZGVjb250ZW50JykuaGlkZSgpO1xuXHRcdCQodGhpcykucGFyZW50KCkuZmluZCgnLnRpcF9faGlkZWNvbnRlbnQnKS5maXJzdCgpLnNob3coKTtcblx0fSk7XG5cblx0aW5pdCgpO1xuXG5cdCQoJ2J1dHRvbi5idG4sIC5jb3VudGVyX19idG4sIC5jYXJ0X19jbG9zZSwgLmNsb3NlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0fSlcblxufSkod2luZG93KTtcbiJdfQ==
