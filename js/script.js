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

	// fields
	function filled(field) {
		var val = $(field).val().trim();

		if (val.length > 0) {
			$(field).closest('.field').addClass('field_filled');
		} else {
			$(field).closest('.field').removeClass('field_filled');
		}
	}

	$('.field input, .field textarea').each(function () {
		filled(this);
	});

	$(document).on('keydown', '.field input, .field textarea', function () {
		var t = this;
		setTimeout(function () {
			filled(t);
		}, 100);
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
			$('.container__main').css('z-index', '');
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
		$('.container__main').css('z-index', '3');
		$('.card').css('z-index', '');
		$('.tip__hidecontent').hide();
		$(this).parent().find('.tip__hidecontent').show();
		$(this).closest('.card').css('z-index', '2');
	});

	$('.tip_hover').hover(function () {
		$(this).find('.tip__hidecontent').show();
	}, function () {
		$('.tip__hidecontent').hide();
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

	document.addEventListener('scroll', function (e) {
		scrolling = document.body.scrollTop;

		if ($(e.target).closest('.results').get(0)) return;

		if (scrolling >= 200) {
			$('.header__fix').addClass('header__fix_show');
			$('.results').appendTo('.header__fix .search');
		} else if ($('.header__fix').hasClass('header__fix_show')) {
			$('.header__fix').removeClass('header__fix_show');
			$('.results').appendTo('.header__body .search');
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

	// search
	$('.search__field input').focus(function () {
		$(this).closest('.search').addClass('search_focus');
	});

	$('.search__field input').focusout(function () {
		$(this).closest('.search').removeClass('search_focus');
	});

	init();

	$('button.btn, .counter__btn, .close').on('click', function (e) {
		e.preventDefault();
	});
})(window);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjcmlwdC5qcyJdLCJuYW1lcyI6WyJyb290Iiwid2luZG93V2lkdGgiLCIkIiwid2luZG93Iiwid2lkdGgiLCJpbml0IiwiZ2V0IiwiZmlyc3QiLCJ0cmlnZ2VyIiwiZWFjaCIsImkiLCJ0YWJzIiwiY2hpbGRyZW4iLCJ0b2dnbGUiLCJkYXRhIiwicGFyZW50IiwiZmluZCIsImhpZGUiLCJvbiIsImRhdGFTbGlkZXJzIiwiZmVhdXR1cmVzIiwiaXRlbXMiLCJuYXYiLCJnYWxsZXJ5IiwiZG90cyIsIm1vdXNlRHJhZyIsInJlc3BvbnNpdmUiLCJwcm9tbyIsImxvb3AiLCJhdXRvcGxheSIsInNsaWRlciIsIm93bENhcm91c2VsIiwicmFuZ2UiLCJtaW5JbnB1dCIsImNsb3Nlc3QiLCJtYXhJbnB1dCIsInVwZGF0ZSIsImZyb20iLCJ0byIsInZhbCIsImlvblJhbmdlU2xpZGVyIiwiZXh0cmFfY2xhc3NlcyIsImhpZGVfbWluX21heCIsImhpZGVfZnJvbV90byIsIm1pbiIsIm9wdGlvbnMiLCJtYXgiLCJzdGVwIiwiZmlsbGVkIiwiZmllbGQiLCJ0cmltIiwibGVuZ3RoIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImRvY3VtZW50IiwidCIsInNldFRpbWVvdXQiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwiY29udGVudCIsInRvZ2dsZUNsYXNzIiwic3RvcCIsInNsaWRlVG9nZ2xlIiwiYmxvY2siLCJjaGVja3MiLCJhcHBlbmQiLCJyZW1vdmUiLCJoYXNDbGFzcyIsInNpYmxpbmdzIiwiZHJvcCIsInRhcmdldCIsInRpcCIsImNzcyIsInNob3ciLCJwcmV2ZW50RGVmYXVsdCIsImhvdmVyIiwidmlkZW8iLCJjbG9uZSIsImh0bWwiLCJpemlNb2RhbCIsImltZyIsImVtcHR5IiwibGlzdCIsImxpbmUiLCJuZXh0QWxsIiwib25DbG9zaW5nIiwiciIsIiRlbGVtZW50IiwicGF1c2UiLCJtIiwicGFyZW50c1VudGlsIiwiaW5kZXgiLCJpZCIsInNjcm9sbGluZyIsInRvVG9wIiwicXVlcnlTZWxlY3RvciIsImFkZEV2ZW50TGlzdGVuZXIiLCJib2R5Iiwic2Nyb2xsVG9wIiwiYXBwZW5kVG8iLCJjbGFzc0xpc3QiLCJhZGQiLCJhbmltYXRlIiwiZm9jdXMiLCJmb2N1c291dCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxDQUFDLFVBQVNBLElBQVQsRUFBZTs7QUFFZjtBQUNBLEtBQUlDLGNBQWNDLEVBQUVDLE1BQUYsRUFBVUMsS0FBVixFQUFsQjs7QUFFQSxVQUFTQyxJQUFULEdBQWdCOztBQUVmLE1BQUlILEVBQUUsVUFBRixFQUFjSSxHQUFkLENBQWtCLENBQWxCLENBQUosRUFBMEI7QUFDekJKLEtBQUUsbUJBQUYsRUFBdUJLLEtBQXZCLEdBQStCQyxPQUEvQixDQUF1QyxPQUF2QztBQUNBOztBQUVETixJQUFFLGFBQUYsRUFBaUJPLElBQWpCLENBQXNCLFVBQVNDLENBQVQsRUFBWUMsSUFBWixFQUFrQjtBQUN2Q1QsS0FBRVMsSUFBRixFQUFRQyxRQUFSLEdBQW1CTCxLQUFuQixHQUEyQkMsT0FBM0IsQ0FBbUMsT0FBbkM7QUFDQSxHQUZEOztBQUlBTixJQUFFLGVBQUYsRUFBbUJPLElBQW5CLENBQXdCLFVBQVNDLENBQVQsRUFBWUcsTUFBWixFQUFvQjtBQUMzQyxPQUFJQyxPQUFPWixFQUFFLElBQUYsRUFBUVksSUFBUixDQUFhLFFBQWIsQ0FBWDs7QUFFQVosS0FBRSxJQUFGLEVBQVFhLE1BQVIsR0FBaUJDLElBQWpCLENBQXNCLE1BQUlGLElBQTFCLEVBQWdDRyxJQUFoQztBQUNBLEdBSkQ7QUFLQTs7QUFFRGYsR0FBRUMsTUFBRixFQUFVZSxFQUFWLENBQWEsUUFBYixFQUF1QixZQUFXO0FBQ2pDakIsZ0JBQWNDLEVBQUVDLE1BQUYsRUFBVUMsS0FBVixFQUFkO0FBQ0EsRUFGRDs7QUFJQTtBQUNBLEtBQUllLGNBQWM7QUFDakJDLGFBQVc7QUFDVkMsVUFBTyxDQURHO0FBRVZDLFFBQUs7QUFGSyxHQURNO0FBS2pCQyxXQUFTO0FBQ1JGLFVBQU8sQ0FE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VztBQUM3Q3RHLElBQUUsSUFBRixFQUFRZ0MsT0FBUixDQUFnQixTQUFoQixFQUEyQm1CLFdBQTNCLENBQXVDLGNBQXZDO0FBQ0EsRUFGRDs7QUFJQWhEOztBQUVBSCxHQUFFLG1DQUFGLEVBQXVDZ0IsRUFBdkMsQ0FBMEMsT0FBMUMsRUFBbUQsVUFBU3VDLENBQVQsRUFBWTtBQUM5REEsSUFBRWlCLGNBQUY7QUFDQSxFQUZEO0FBSUEsQ0EzWkQsRUEyWkd2RSxNQTNaSCIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24ocm9vdCkge1xuXG5cdC8vINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC/0YDQuNC70LTQvtC20LXQvdC40Y9cblx0dmFyIHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblxuXHRcdGlmICgkKCcuZ2FsbGVyeScpLmdldCgwKSkge1xuXHRcdFx0JCgnLmdhbGxlcnlfX2VsZW1lbnQnKS5maXJzdCgpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdFx0fVxuXG5cdFx0JCgnW2RhdGEtdGFic10nKS5lYWNoKGZ1bmN0aW9uKGksIHRhYnMpIHtcblx0XHRcdCQodGFicykuY2hpbGRyZW4oKS5maXJzdCgpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdFx0fSk7XG5cblx0XHQkKCcudG9nZ2xlX2Nsb3NlJykuZWFjaChmdW5jdGlvbihpLCB0b2dnbGUpIHtcblx0XHRcdHZhciBkYXRhID0gJCh0aGlzKS5kYXRhKCd0b2dnbGUnKTtcblxuXHRcdFx0JCh0aGlzKS5wYXJlbnQoKS5maW5kKCcuJytkYXRhKS5oaWRlKCk7XG5cdFx0fSk7XG5cdH07XG5cblx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcblx0XHR3aW5kb3dXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xuXHR9KTtcblxuXHQvLyDQodC70LDQudC00LXRgNGLXG5cdHZhciBkYXRhU2xpZGVycyA9IHtcblx0XHRmZWF1dHVyZXM6IHtcblx0XHRcdGl0ZW1zOiA2LFxuXHRcdFx0bmF2OiB0cnVlXG5cdFx0fSxcblx0XHRnYWxsZXJ5OiB7XG5cdFx0XHRpdGVtczogMSxcblx0XHRcdG5hdjogdHJ1ZSxcblx0XHRcdGRvdHM6IHRydWUsXG5cdFx0XHRtb3VzZURyYWc6IGZhbHNlLFxuXHRcdFx0cmVzcG9uc2l2ZToge1xuXHRcdFx0XHQ5NjE6IHtcblx0XHRcdFx0XHRpdGVtczogNCxcblx0XHRcdFx0XHRkb3RzOiBmYWxzZVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRwcm9tbzoge1xuXHRcdFx0aXRlbXM6IDEsXG5cdFx0XHRkb3RzOiB0cnVlLFxuXHRcdFx0bG9vcDogdHJ1ZSxcblx0XHRcdGF1dG9wbGF5OiB0cnVlLFxuXHRcdH1cblx0fVxuXG5cdCQoJ1tkYXRhLXNsaWRlcl0nKS5lYWNoKGZ1bmN0aW9uKGksIHNsaWRlcikge1xuXHRcdHZhciBkYXRhID0gJCh0aGlzKS5kYXRhKCdzbGlkZXInKTtcblxuXHRcdCQoc2xpZGVyKS5vd2xDYXJvdXNlbChkYXRhU2xpZGVyc1tkYXRhXSlcblx0fSk7XG5cblx0JCgnLnJhbmdlX19zbGlkZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdHZhciByYW5nZSA9IHRoaXMsXG5cdFx0XHRcdG1pbklucHV0ID0gJChyYW5nZSkuY2xvc2VzdCgnLnJhbmdlJykuZmluZCgnW2RhdGEtaW5wdXQ9XCJtaW5cIl0nKSxcblx0XHRcdFx0bWF4SW5wdXQgPSAkKHJhbmdlKS5jbG9zZXN0KCcucmFuZ2UnKS5maW5kKCdbZGF0YS1pbnB1dD1cIm1heFwiXScpO1xuXG5cdFx0ZnVuY3Rpb24gdXBkYXRlKCkge1xuXHRcdFx0dmFyIGZyb20gPSAkKHJhbmdlKS5kYXRhKCdmcm9tJyksXG5cdFx0XHRcdFx0dG8gPSAkKHJhbmdlKS5kYXRhKCd0bycpO1xuXG5cdFx0XHQkKG1pbklucHV0KS52YWwoZnJvbSk7XG5cdFx0XHQkKG1heElucHV0KS52YWwodG8pO1xuXHRcdH1cblxuXHRcdCQocmFuZ2UpLmlvblJhbmdlU2xpZGVyKHtcblx0XHRcdGV4dHJhX2NsYXNzZXM6ICdyYW5nZV9fc2xpZGVyJyxcblx0XHRcdGhpZGVfbWluX21heDogdHJ1ZSxcblx0XHRcdGhpZGVfZnJvbV90bzogdHJ1ZSxcblx0XHR9KTtcblxuXHRcdHVwZGF0ZSgpO1xuXHRcdCQocmFuZ2UpLm9uKCdjaGFuZ2UnLCB1cGRhdGUpO1xuXHR9KTtcblxuXHQkKCdbZGF0YS1pbnB1dF0nKS5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHJhbmdlID0gJCh0aGlzKS5jbG9zZXN0KCcucmFuZ2UnKS5maW5kKCdpbnB1dC5yYW5nZV9fc2xpZGVyJykuZGF0YShcImlvblJhbmdlU2xpZGVyXCIpLFxuXHRcdFx0XHR2YWwgPSAkKHRoaXMpLnZhbCgpLFxuXHRcdFx0XHRtaW4gPSByYW5nZS5vcHRpb25zLm1pbixcblx0XHRcdFx0bWF4ID0gcmFuZ2Uub3B0aW9ucy5tYXgsXG5cdFx0XHRcdGZyb20gPSByYW5nZS5vcHRpb25zLmZyb20sXG5cdFx0XHRcdHRvID0gcmFuZ2Uub3B0aW9ucy50byxcblx0XHRcdFx0c3RlcCA9IHJhbmdlLm9wdGlvbnMuc3RlcDtcblxuXHRcdHN3aXRjaCAoJCh0aGlzKS5kYXRhKCdpbnB1dCcpKSB7XG5cdFx0XHRjYXNlICdtaW4nOlxuXHRcdFx0XHRpZiAodmFsIDw9IG1pbikge1xuXHRcdFx0XHRcdHZhbCA9IG1pbjtcblx0XHRcdFx0fSBlbHNlIGlmICh2YWwgPj0gbWF4KSB7XG5cdFx0XHRcdFx0dmFsID0gbWF4IC0gc3RlcDtcblx0XHRcdFx0fSBlbHNlIGlmICh2YWwgPj0gdG8pIHtcblx0XHRcdFx0XHR2YWwgPSB0byAtIHN0ZXA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyYW5nZS51cGRhdGUoe1xuXHRcdFx0XHRcdGZyb206IHZhbFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdtYXgnOlxuXHRcdFx0XHRpZiAodmFsID49IG1heCkge1xuXHRcdFx0XHRcdHZhbCA9IG1heDtcblx0XHRcdFx0fSBlbHNlIGlmICh2YWwgPD0gbWluKSB7XG5cdFx0XHRcdFx0dmFsID0gbWluICsgc3RlcDtcblx0XHRcdFx0fSBlbHNlIGlmICh2YWwgPD0gZnJvbSkge1xuXHRcdFx0XHRcdHZhbCA9IGZyb20gKyBzdGVwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmFuZ2UudXBkYXRlKHtcblx0XHRcdFx0XHR0bzogdmFsXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHQkKHRoaXMpLnZhbCh2YWwpO1xuXG5cdH0pO1xuXG5cdC8vIGZpZWxkc1xuXHRmdW5jdGlvbiBmaWxsZWQoZmllbGQpIHtcblx0XHR2YXIgdmFsID0gJChmaWVsZCkudmFsKCkudHJpbSgpO1xuXG5cdFx0aWYgKHZhbC5sZW5ndGggPiAwKSB7XG5cdFx0XHQkKGZpZWxkKS5jbG9zZXN0KCcuZmllbGQnKS5hZGRDbGFzcygnZmllbGRfZmlsbGVkJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoZmllbGQpLmNsb3Nlc3QoJy5maWVsZCcpLnJlbW92ZUNsYXNzKCdmaWVsZF9maWxsZWQnKTtcblx0XHR9XG5cdH1cblxuXHQkKCcuZmllbGQgaW5wdXQsIC5maWVsZCB0ZXh0YXJlYScpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0ZmlsbGVkKHRoaXMpO1xuXHR9KTtcblxuXHQkKGRvY3VtZW50KS5vbigna2V5ZG93bicsICcuZmllbGQgaW5wdXQsIC5maWVsZCB0ZXh0YXJlYScsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciB0ID0gdGhpcztcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0ZmlsbGVkKHQpO1xuXHRcdH0sIDEwMClcblx0fSk7XG5cblxuXHQkKCcudG9nZ2xlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKClcblx0XHR2YXIgY29udGVudCA9ICQodGhpcykucGFyZW50KCkuZmluZCgkKCcuJyskKHRoaXMpLmRhdGEoJ3RvZ2dsZScpKSk7XG5cdFx0JCh0aGlzKS50b2dnbGVDbGFzcygndG9nZ2xlX2Nsb3NlJyk7XG5cdFx0JChjb250ZW50KS5zdG9wKCkuc2xpZGVUb2dnbGUoMzAwKTtcblx0fSk7XG5cblx0JCgnLmZpbHRlcl9fYmxvY2stY29udGVudCcpLmVhY2goZnVuY3Rpb24oaSwgYmxvY2spIHtcblx0XHR2YXIgY2hlY2tzID0gJChibG9jaykuZmluZCgnLmNoZWNrYm94JykubGVuZ3RoO1xuXG5cdFx0aWYgKGNoZWNrcyA+IDUpIHtcblx0XHRcdCQoYmxvY2spLmFkZENsYXNzKCdmaWx0ZXJfX2Jsb2NrLWNvbnRlbnRfbW9yZScpO1xuXHRcdFx0JChibG9jaykuYXBwZW5kKCc8c3BhbiBjbGFzcz1cImZpbHRlcl9fYmxvY2stbW9yZVwiPtCf0L7QutCw0LfQsNGC0Ywg0LLRgdC1PC9zcGFuPicpO1xuXHRcdH1cblx0fSk7XG5cblx0JCgnLmZpbHRlcl9fYmxvY2stbW9yZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcykucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2ZpbHRlcl9fYmxvY2stY29udGVudF9tb3JlJyk7XG5cdFx0JCh0aGlzKS5yZW1vdmUoKTtcblx0fSk7XG5cblx0JCgnLmRyb3BfX2l0ZW0nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRpZiAoISQodGhpcykuaGFzQ2xhc3MoJ2Ryb3BfX2l0ZW1fbGluaycpKSB7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdkcm9wX19pdGVtX2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2Ryb3BfX2l0ZW1fYWN0aXZlJyk7XG5cdFx0fVxuXG5cdFx0JCh0aGlzKS5jbG9zZXN0KCdbZGF0YS1kcm9wXScpLnJlbW92ZUNsYXNzKCdkcm9wLW9wZW4nKTtcblx0fSk7XG5cblx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJ1tkYXRhLWRyb3BdJywgZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgZGF0YSA9ICQodGhpcykuZGF0YSgnZHJvcCcpO1xuXG5cdFx0aWYgKGRhdGEgPT0gJ3RyaWdnZXInKSB7XG5cdFx0XHQkKCcuZHJvcC1vcGVuJykucmVtb3ZlQ2xhc3MoJ2Ryb3Atb3BlbicpO1xuXHRcdFx0JCh0aGlzKS5wYXJlbnQoKS5jbG9zZXN0KCdbZGF0YS1kcm9wXScpLmFkZENsYXNzKCdkcm9wLW9wZW4nKTtcblx0XHR9IGVsc2UgcmV0dXJuO1xuXG5cdH0pO1xuXG5cdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblxuXHRcdHZhciBkcm9wID0gJChlLnRhcmdldCkucGFyZW50KCkuY2xvc2VzdCgnW2RhdGEtZHJvcF0nKS5nZXQoMCksXG5cdFx0XHRcdHRpcCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLmNsb3Nlc3QoJy50aXAnKS5nZXQoMCk7XG5cblx0XHRpZiAoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2NvdW50ZXJfX2J0bl9wbHVzJykpIHJldHVybjtcblxuXHRcdGlmICghZHJvcCkge1xuXHRcdFx0JCgnLmRyb3Atb3BlbicpLnJlbW92ZUNsYXNzKCdkcm9wLW9wZW4nKTtcblx0XHR9XG5cblx0XHRpZiAoIXRpcCkge1xuXHRcdFx0JCgnLnRpcF9faGlkZWNvbnRlbnQnKS5oaWRlKCk7XG5cdFx0XHQkKCcuY29udGFpbmVyX19tYWluJykuY3NzKCd6LWluZGV4JywgJycpO1xuXHRcdH1cblxuXHR9KVxuXG5cdCQoJy5kZXNjcmlwdGlvbl9fc2hvdycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcykuaGlkZSgpO1xuXHRcdCQoJy5kZXNjcmlwdGlvbl9fc2hvcnQnKS5oaWRlKCk7XG5cdFx0JCgnLmRlc2NyaXB0aW9uX19hbGwnKS5zaG93KCk7XG5cdH0pO1xuXG5cdCQoJ1tkYXRhLWNsb3NlXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHQkKHRoaXMpLnBhcmVudCgpLmhpZGUoKTtcblx0XHQkKHRoaXMpLmNsb3Nlc3QoJy5jYXJkJykuY3NzKCd6LWluZGV4JywgJycpO1xuXHR9KTtcblxuXHQkKCcudGlwX19uYW1lJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0JCgnLmNvbnRhaW5lcl9fbWFpbicpLmNzcygnei1pbmRleCcsICczJyk7XG5cdFx0JCgnLmNhcmQnKS5jc3MoJ3otaW5kZXgnLCAnJyk7XG5cdFx0JCgnLnRpcF9faGlkZWNvbnRlbnQnKS5oaWRlKCk7XG5cdFx0JCh0aGlzKS5wYXJlbnQoKS5maW5kKCcudGlwX19oaWRlY29udGVudCcpLnNob3coKTtcblx0XHQkKHRoaXMpLmNsb3Nlc3QoJy5jYXJkJykuY3NzKCd6LWluZGV4JywgJzInKTtcblx0fSk7XG5cblx0JCgnLnRpcF9ob3ZlcicpLmhvdmVyKGZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcykuZmluZCgnLnRpcF9faGlkZWNvbnRlbnQnKS5zaG93KCk7XG5cdH0sIGZ1bmN0aW9uKCkge1xuXHRcdCQoJy50aXBfX2hpZGVjb250ZW50JykuaGlkZSgpO1xuXHR9KTtcblxuXHQvLyBHYWxsZXJ5XG5cdCQoJy5nYWxsZXJ5X19lbGVtZW50Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cblx0XHRpZiAoJCh0aGlzKS5oYXNDbGFzcygnZ2FsbGVyeV9fZWxlbWVudF92aWRlbycpKSB7XG5cdFx0XHR2YXIgdmlkZW8gPSAkKHRoaXMpLmZpbmQoJ3ZpZGVvJykuY2xvbmUoKTtcblxuXHRcdFx0JCgnLm1vZGFsX3pvb20gLm1vZGFsX19jb250ZW50JykuaHRtbCh2aWRlbyk7XG5cblx0XHRcdCQoJy5tb2RhbF96b29tJykuaXppTW9kYWwoJ29wZW4nKTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgaW1nID0gJCh0aGlzKS5maW5kKCdpbWcnKS5jbG9uZSgpO1xuXG5cdFx0XHQkKHRoaXMpLmNsb3Nlc3QoJy5nYWxsZXJ5JykuZmluZCgnLmdhbGxlcnlfX3ZpZXcnKS5lbXB0eSgpLmFwcGVuZChpbWcpO1xuXG5cdFx0XHQkKHRoaXMpLmNsb3Nlc3QoJy5nYWxsZXJ5X19saXN0JykuZmluZCgnLmdhbGxlcnlfX2VsZW1lbnRfYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2dhbGxlcnlfX2VsZW1lbnRfYWN0aXZlJyk7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdnYWxsZXJ5X19lbGVtZW50X2FjdGl2ZScpO1xuXHRcdH1cblxuXHR9KTtcblxuXHQkKCcudmxpc3RfZnVsbCcpLmVhY2goZnVuY3Rpb24oaSwgbGlzdCkge1xuXHRcdHZhciBzaG93ID0gJChsaXN0KS5kYXRhKCdzaG93JyksXG5cdFx0XHRcdGxpbmUgPSAkKGxpc3QpLmZpbmQoJy52bGlzdF9fbGluZTpub3QoLnZsaXN0X19saW5lX2hlYWQpJykuZ2V0KHNob3cpO1xuXG5cdFx0JChsaW5lKS5oaWRlKCkubmV4dEFsbCgnOm5vdCgudmxpc3RfX2xpbmVfbW9yZSknKS5oaWRlKCk7XG5cdH0pO1xuXG5cdCQoJy52bGlzdF9fbW9yZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcykuY2xvc2VzdCgnLnZsaXN0JykudG9nZ2xlQ2xhc3MoJ3ZsaXN0X2FsbHNob3cnKTtcblx0fSk7XG5cblx0Ly8gTW9kYWxcblxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCQoJ1tkYXRhLW1vZGFsXScpLml6aU1vZGFsKHtcblx0XHRcdG9uQ2xvc2luZzogZnVuY3Rpb24ocil7XG5cdFx0XHRcdHZhciB2aWRlbyA9IHIuJGVsZW1lbnQuZmluZCgndmlkZW8nKS5nZXQoMCk7XG5cblx0XHRcdFx0aWYgKHZpZGVvKSB7XG5cdFx0XHRcdFx0dmlkZW8ucGF1c2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LCAxKVxuXG5cblx0JCgnW2RhdGEtb3Blbl0nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIG0gPSAkKHRoaXMpLmRhdGEoJ29wZW4nKTtcblx0XHQkKCdbZGF0YS1tb2RhbD0nK20rJ10nKS5pemlNb2RhbCgnb3BlbicpO1xuXHR9KTtcblxuXG5cdCQoJy5nYWxsZXJ5X192aWV3Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGltZyA9ICQodGhpcykuZmluZCgnaW1nJykuY2xvbmUoKTtcblxuXHRcdCQoJy5tb2RhbF96b29tIC5tb2RhbF9fY29udGVudCcpLmh0bWwoaW1nKVxuXG5cdFx0JCgnLm1vZGFsX3pvb20nKS5pemlNb2RhbCgnb3BlbicpO1xuXHR9KTtcblxuXG5cdCQoJy5maWx0ZXItdG9nZ2xlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0JCgnLmZpbHRlciAudG9nZ2xlOm5vdCgudG9nZ2xlX2Nsb3NlKScpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdFx0JCgnLmZpbHRlcicpLnRvZ2dsZSgpO1xuXHR9KTtcblxuXHQkKCcubS1tZW51X190b2dnbGUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHQkKCcubS1tZW51X19jb250ZW50JykudG9nZ2xlKCk7XG5cdH0pO1xuXG5cdCQoJy5tLW1lbnVfX2l0ZW1fZHJvcCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0dmFyIGRyb3AgPSAkKHRoaXMpLmZpbmQoJy5tLW1lbnVfX2Ryb3AnKS5maXJzdCgpO1xuXG5cblx0XHRpZiAoJChlLnRhcmdldCkucGFyZW50c1VudGlsKCcubS1tZW51X19pdGVtX2Ryb3AnKS5sZW5ndGggPD0gMSkge1xuXHRcdFx0JChkcm9wKS50b2dnbGVDbGFzcygnbS1tZW51X19kcm9wX3Nob3cnKTtcblx0XHR9XG5cblx0fSk7XG5cblx0JCgnLm0tbWVudV9fYmFjaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0JCh0aGlzKS5jbG9zZXN0KCcubS1tZW51X19kcm9wX3Nob3cnKS5yZW1vdmVDbGFzcygnbS1tZW51X19kcm9wX3Nob3cnKTtcblx0fSk7XG5cblx0JCgnW2RhdGEtdGFic10gPiAqJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHZhciBkYXRhID0gJCh0aGlzKS5wYXJlbnQoKS5kYXRhKCd0YWJzJyksXG5cdFx0XHRcdGluZGV4ID0gJCh0aGlzKS5pbmRleCgpLFxuXHRcdFx0XHRjb250ZW50ID0gJCgnW2RhdGEtdGFicy1jb250ZW50PScrZGF0YSsnXScpLmNoaWxkcmVuKCkuZ2V0KGluZGV4KTtcblxuXHRcdCQoY29udGVudCkuc2hvdygpLnNpYmxpbmdzKCkuaGlkZSgpO1xuXG5cdFx0aWYgKCFjb250ZW50KSB7XG5cdFx0XHQkKCdbZGF0YS10YWJzLWNvbnRlbnQ9JytkYXRhKyddJykuY2hpbGRyZW4oKS5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0JCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdH0pO1xuXG5cdC8vIGlmICgkKCcubW9kYWxfdmlkZW8nKS5nZXQoMCkpIHtcblx0Ly8gXHQkKFwiLm1vZGFsX3ZpZGVvXCIpLml6aU1vZGFsKHtcblx0Ly8gXHRcdGhpc3Rvcnk6IGZhbHNlLFxuXHQvLyBcdFx0aWZyYW1lIDogdHJ1ZSxcblx0Ly8gXHRcdGZ1bGxzY3JlZW46IHRydWUsXG5cdC8vIFx0XHRoZWFkZXJDb2xvcjogJyMwMDAwMDAnLFxuXHQvLyBcdFx0Z3JvdXA6ICdncm91cDEnLFxuXHQvLyBcdFx0bG9vcDogdHJ1ZVxuXHQvLyBcdH0pO1xuXHQvLyB9XG5cblxuXHQkKCcudmlkZW8nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgaWQgPSAkKHRoaXMpLmRhdGEoJ2lkJyk7XG5cblx0XHQkKCcjJytpZCkuaXppTW9kYWwoJ29wZW4nKTtcblx0fSk7XG5cblx0JCgnLmNoZWNrYm94IGlucHV0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHQkKHRoaXMpLmNsb3Nlc3QoJy5jaGVja2JveCcpLnRvZ2dsZUNsYXNzKCdjaGVja2JveF9hY3RpdmUnKTtcblx0fSk7XG5cblx0dmFyIHNjcm9sbGluZyxcblx0XHRcdHRvVG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvLXRvcCcpO1xuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uKGUpIHtcblx0XHQgc2Nyb2xsaW5nID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG5cblx0XHQgaWYgKCQoZS50YXJnZXQpLmNsb3Nlc3QoJy5yZXN1bHRzJykuZ2V0KDApKSByZXR1cm47XG5cblx0XHQgaWYgKHNjcm9sbGluZyA+PSAyMDApIHtcblx0XHRcdCAkKCcuaGVhZGVyX19maXgnKS5hZGRDbGFzcygnaGVhZGVyX19maXhfc2hvdycpO1xuXHRcdFx0ICQoJy5yZXN1bHRzJykuYXBwZW5kVG8oJy5oZWFkZXJfX2ZpeCAuc2VhcmNoJyk7XG5cdFx0IH0gZWxzZSBpZiAoJCgnLmhlYWRlcl9fZml4JykuaGFzQ2xhc3MoJ2hlYWRlcl9fZml4X3Nob3cnKSkge1xuXHRcdFx0ICQoJy5oZWFkZXJfX2ZpeCcpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2ZpeF9zaG93Jyk7XG5cdFx0XHQgJCgnLnJlc3VsdHMnKS5hcHBlbmRUbygnLmhlYWRlcl9fYm9keSAuc2VhcmNoJyk7XG5cdFx0IH1cblxuXHRcdCBpZiAoc2Nyb2xsaW5nID49IDEwMDAgJiYgd2luZG93V2lkdGggPiA5NjApIHtcblx0XHRcdCB0b1RvcC5jbGFzc0xpc3QuYWRkKCd0by10b3Bfc2hvdycpO1xuXHRcdCB9IGVsc2Uge1xuXHRcdFx0IHRvVG9wLmNsYXNzTGlzdC5yZW1vdmUoJ3RvLXRvcF9zaG93Jyk7XG5cdFx0IH1cblx0fSwgdHJ1ZSk7XG5cblx0JCgnLnRvLXRvcCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHtzY3JvbGxUb3A6MH0sIDUwMCwgJ3N3aW5nJyk7XG5cdH0pO1xuXG5cdCQoJy5jb3VudGVyX19idG5fcGx1cycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHQkKCcudGlwX19oaWRlY29udGVudCcpLmhpZGUoKTtcblx0XHQkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy50aXBfX2hpZGVjb250ZW50JykuZmlyc3QoKS5zaG93KCk7XG5cdH0pO1xuXG5cdC8vIHNlYXJjaFxuXHQkKCcuc2VhcmNoX19maWVsZCBpbnB1dCcpLmZvY3VzKGZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcykuY2xvc2VzdCgnLnNlYXJjaCcpLmFkZENsYXNzKCdzZWFyY2hfZm9jdXMnKTtcblx0fSk7XG5cblx0JCgnLnNlYXJjaF9fZmllbGQgaW5wdXQnKS5mb2N1c291dChmdW5jdGlvbigpIHtcblx0XHQkKHRoaXMpLmNsb3Nlc3QoJy5zZWFyY2gnKS5yZW1vdmVDbGFzcygnc2VhcmNoX2ZvY3VzJyk7XG5cdH0pO1xuXG5cdGluaXQoKTtcblxuXHQkKCdidXR0b24uYnRuLCAuY291bnRlcl9fYnRuLCAuY2xvc2UnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9KVxuXG59KSh3aW5kb3cpO1xuIl19
