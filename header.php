<?
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
use Bitrix\Main\Page\Asset as Asset;
use Bitrix\Main\Localization\Loc as Loc;
Loc::loadLanguageFile(FILE);
IncludeTemplateLangFile(__FILE__);
CModule::IncludeModule("iblock");
CModule::IncludeModule("catalog");
CModule::IncludeModule("sale");
$curPage = $APPLICATION->GetCurPage();

global $APPLICATION, $TEMPLATE_OPTIONS, $arSite, $USER;

	if($USER->GetID()==4 && $curPage!='/basket/') {
		$basketO =  \Bitrix\Sale\Basket::loadItemsForFUser( \Bitrix\Sale\Fuser::getId(), Bitrix\Main\Context::getCurrent()->getSite());
		$USER->Logout();
		$basket = \Bitrix\Sale\Basket::loadItemsForFUser(\Bitrix\Sale\Fuser::getIdByUserId(4), 's1');
		$basketItems = $basketO->getBasketItems();
		foreach ($basketItems as $item) {
			$itemO = $basket->createItem('catalog',$item->getProductId());
			$itemO->setFields(array(
				'QUANTITY' => $item->getQuantity(),
				"PRICE" => $item->getPrice(),
				"NAME" => $item->getField('NAME'),
				'CURRENCY' => 'RUB',
				'LID' => 's1',
			));
		}
	}
	if(!$USER->IsAuthorized() && $curPage=='/basket/' && isset($_POST['confirmorder']) && $_POST['confirmorder']=='Y') {
		$basket = \Bitrix\Sale\Basket::loadItemsForFUser(\Bitrix\Sale\Fuser::getIdByUserId(4), 's1');
		$basketItems = $basket->getBasketItems();
		foreach ($basketItems as $item) {
			$item->delete();
		}
		$basket->save();
		$USER->Authorize(4);
	}
$url = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$url = str_replace((isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]", "https://estel.m-cosmetica.ru", $url);
/*editUrl("301",$url);*/
?>
<!DOCTYPE html>
<html lang="ru" itemtype="https://schema.org/WebPage" itemscope="" prefix="ya: https://webmaster.yandex.ru/vocabularies/">
<head>
<meta charset="UTF-8">
<?
foreach ($_GET as $key => $value) {
	if(strpos('_s '.$key,'PAGEN_')){
		?>
		<link rel="canonical" href="<?=(isset($_SERVER['HTTPS'])?"https" : "http")."://$_SERVER[HTTP_HOST]".$curPage;?>">
		<meta name="robots" content="noindex, nofollow" />
		<?
	}
}
?>
<?$APPLICATION->ShowHead();?>
<title itemprop="name"><?$APPLICATION->ShowTitle()?></title>

<?$APPLICATION->ShowHead();?>
<?$APPLICATION->AddHeadScript();?>
<link rel="stylesheet" href="<?=SITE_TEMPLATE_PATH?>/css/style.css?v=2">
<link rel="preload" as="style" href="<?=SITE_TEMPLATE_PATH?>/css/lets.css" onload="this.rel='stylesheet'">
<link rel="preload" as="style" href="<?=SITE_TEMPLATE_PATH?>/css/style_loader.css" onload="this.rel='stylesheet'">
<link rel="icon" type="image/x-icon" href="<?=SITE_TEMPLATE_PATH?>/images/favicon.ico">
<script src="<?=SITE_TEMPLATE_PATH?>/js/libs.js"></script>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<script charset="UTF-8" src="//cdn.sendpulse.com/js/push/60b4dc2eb8282c1a0c6e0f34fc5d636f_1.js" async></script>
<script src='https://www.google.com/recaptcha/api.js' async></script>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KL2TSS');</script>
<!-- End Google Tag Manager -->

<!-- [BVG] dataLayer for track user -->
<?
    $uID=$USER->GetID();
    $uType=($uID)?'user':'guest';
		if($USER->IsAuthorized()){
    $uEmail=$USER->GetEmail();
		}else{
		$uEmail = '';
		}
    $uPath=$APPLICATION->GetCurDir();
		if($uPath=='/'){
    	$uPath='crto_homepage';
			?>
			<script type="text/javascript">
			dataLayer = dataLayer || [];
			dataLayer.push(
			    {
					'event': '<?=$uPath?>',
					'clientType': '<?=$uType?>',
					'clientId': '<?=$uID?>',
					crto: {'email': '<?=$uEmail?>'}
			    });
			</script>
			<?
		}elseif($uPath=='/categories/'){
			$uPath='crto_listingpage';
			?>
			<script type="text/javascript">
			$(document).ready(function(){
			var products = [];
			if($(document).find('.catalog__list').length > 0){
				$(document).find('.catalog__list').find('.item').each(function(i,elem){
					var ids = $(elem).find('.item__link').attr('id');
					var id = ids.split('_');
					products.push(id[1]);
				});
			}
			dataLayer = dataLayer || [];
			dataLayer.push(
			    {
					'event': '<?=$uPath?>',
					'clientType': '<?=$uType?>',
					'clientId': '<?=$uID?>',
					crto: {
						'email': '<?=$uEmail?>',
						'products':products
					}
			    });
			});
			</script>
			<?
		}elseif($uPath=='/products/'){
			$uPath='crto_productpage';
			?>
			<script type="text/javascript">
			$(document).ready(function(){
			var products = [];
			if($(document).find('.detail_page').length > 0){
				var ids = $(document).find('.detail_page').attr('id');
				var id = ids.split('_');
				products.push(id[1]);
			}
			dataLayer = dataLayer || [];
			dataLayer.push(
			    {
					'event': '<?=$uPath?>',
					'clientType': '<?=$uType?>',
					'clientId': '<?=$uID?>',
					crto: {
						'email': '<?=$uEmail?>',
						'products':products
					}
			    });
			});
			</script>
			<?
		}elseif($uPath=='/basket/'){
			$uPath='crto_basketpage';
		}
	//substr($uPath,1,strpos($uPath,'/',1)-1);
?>
<!-- [BVG] dataLayer -->
<?
/*		if($p != 'Y'):
?>


<?else:?>
<script type="text/javascript">
$(document).ready(function(){
var products = [];
if($(document).find('.catalog__list').length > 0){
	$(document).find('.catalog__list').find('.item').each(function(i,elem){
		var ids = $(elem).find('.item__link').attr('id');
		var id = ids.split('_');
		products.push(id[1]);
	});
}else if($(document).find('.detail_page').length > 0){
	var ids = $(document).find('.detail_page').attr('id');
	var id = ids.split('_');
	products.push(id[1]);
}else if($(document).find('.b-page').length > 0){
	$(document).find('.prods-hidden').each(function(i,elem){
		var id = $(elem).find('[name="id_hidden"]').val();
		var price = $(elem).find('[name="price_hidden"]').val();
		var quant = $(elem).find('[name="quantity_hidden"]').val();
		var masstov = {id:id,price:price,quantity:quant};
		products.push(masstov);
	});
}
dataLayer = dataLayer || [];
dataLayer.push(
    {
		'event': '<?=$uPath?>',
		'clientType': '<?=$uType?>',
		'clientId': '<?=$uID?>',
		crto: {
			'email': '<?=$uEmail?>',
			'products':products
		}
    });
});
</script>
<!-- [BVG] dataLayer -->
<?endif;*/?>
</head>

<body class="page">
	<!-- Google Tag Manager (noscript) -->
	<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KL2TSS"
	height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
	<!-- End Google Tag Manager (noscript) -->
<?$APPLICATION->ShowPanel()?>
<!-- <div class="topbanner">
								<?
								$APPLICATION->IncludeFile(
									"/include/top_baner.php",
									Array(),
									Array("MODE" => "html")
								);
								 ?>
</div> -->
<header class="header">
	<div class="container">
		<div class="header__links links">
			<?/*<span class="city">
				<a class="city__current variable_city"><?=$_SESSION["change"];?></a>
				<div class="city__drop">
				<?$APPLICATION->IncludeComponent("bitrix:sale.location.selector.search", "top", Array(
					"CACHE_TIME" => "36000000",	// Время кеширования (сек.)
						"CACHE_TYPE" => "A",	// Тип кеширования
						"CODE" => "",	// Символьный код местоположения
						"FILTER_BY_SITE" => "N",	// Фильтровать по сайту
						"ID" => "",	// ID местоположения
						"INITIALIZE_BY_GLOBAL_EVENT" => "",	// Инициализировать компонент только при наступлении указанного javascript-события на объекте window.document
						"INPUT_NAME" => "LOCATION",	// Имя поля ввода
						"JS_CALLBACK" => "",	// Javascript-функция обратного вызова
						"JS_CONTROL_GLOBAL_ID" => "",	// Идентификатор javascript-контрола
						"PROVIDE_LINK_BY" => "id",	// Сохранять связь через
						"SHOW_DEFAULT_LOCATIONS" => "N",	// Отображать местоположения по-умолчанию
						"SUPPRESS_ERRORS" => "N",	// Не показывать ошибки, если они возникли при загрузке компонента
					),
					false
				);?>
				</div>
				<span class="city__help" <?if($_SESSION["onchange"] == 'yes'):?>style="display:none;"<?endif;?>>
					<strong>Ваш город?</strong>
					<a class="onchange" href="#">Да</a><a class="variable_city" href="#">Другой город</a>
				</span>
			</span>
			*/?>
			<?$APPLICATION->IncludeComponent("bitrix:menu", "menu_top", Array(
					"ALLOW_MULTI_SELECT" => "N",	// Разрешить несколько активных пунктов одновременно
						"CHILD_MENU_TYPE" => "top",	// Тип меню для остальных уровней
						"DELAY" => "N",	// Откладывать выполнение шаблона меню
						"MAX_LEVEL" => "1",	// Уровень вложенности меню
						"MENU_CACHE_GET_VARS" => "",	// Значимые переменные запроса
						"MENU_CACHE_TIME" => "3600",	// Время кеширования (сек.)
						"MENU_CACHE_TYPE" => "A",	// Тип кеширования
						"MENU_CACHE_USE_GROUPS" => "Y",	// Учитывать права доступа
						"ROOT_MENU_TYPE" => "top",	// Тип меню для первого уровня
						"USE_EXT" => "N",	// Подключать файлы с именами вида .тип_меню.menu_ext.php
						"COMPONENT_TEMPLATE" => ".default"
					),
					false
			);?>
			<span class="links__tel" data-tip="Профконсультация"><a href="tel:88007757434">8·800·775·74·34</a></span>
		</div>
		<div class="header__main">
			<div class="header__block">
				<div class="logo">
					<a href="/">
						<img src="<?=SITE_TEMPLATE_PATH?>/img/logo.svg" alt="">
					</a>
				</div>
				<div class="slogan">
		<?if($APPLICATION->GetCurPage() == '/'):?><h1><?else:?><span class="logof"><?endif;?><strong>Интернет-магазин</strong><br>профессиональной косметики <span class="no-elem">M-Cosmetics</span><?if($APPLICATION->GetCurPage() == '/'):?></h1><?else:?></span><?endif;?>
				</div>
			</div>
			<div class="header__block">
				<!-- <div class="consult">
					<div class="consult__pic">
						<img src="img/common/call_to_mcosmetics.png" alt="">
					</div>
					<div class="consult__info">
						<p>Профессиональная консультация</p>
						<a href="tel:88007757434">8 800 775 74 34</a>
					</div>
				</div> -->
				<?$APPLICATION->IncludeComponent("bitrix:search.form", "formsearch", Array(
					"PAGE" => "#SITE_DIR#search/index.php",	// Страница выдачи результатов поиска (доступен макрос #SITE_DIR#)
						"USE_SUGGEST" => "N",	// Показывать подсказку с поисковыми фразами
					),
					false
				);?>
				<div class="on-search">
				</div>
			</div>
			<div class="header__block">
				<div class="auth">

								<?
								$APPLICATION->IncludeFile(
									"/include/count_favorit.php",
									Array(),
									Array("MODE" => "php")
								);

								 global $USER;
						if($_REQUEST['logout'] == 'yes'){
									$USER->Logout();
								}
						if ($USER->IsAuthorized() && $USER->GetID()!=4):
						?>
					<a href="/personal/">Личный кабинет</a>
					<a href="?logout=yes" class="logout"><img class="logout-icon" src="<?=SITE_TEMPLATE_PATH?>/img/logout.svg"></a>
						<?else:?>
					<a href="/auth/">Вход</a>
					<a href="/register/">Регистрация</a>
						<?endif;?>
				</div>
			</div>
		</div>
		<div class="header__bottom">
			<div class="header__nav">
			<?$APPLICATION->IncludeComponent("bitrix:menu", "raz_top", Array(
				"ALLOW_MULTI_SELECT" => "N",	// Разрешить несколько активных пунктов одновременно
					"CHILD_MENU_TYPE" => "top_raz",	// Тип меню для остальных уровней
					"DELAY" => "N",	// Откладывать выполнение шаблона меню
					"MAX_LEVEL" => "3",	// Уровень вложенности меню
					"MENU_CACHE_GET_VARS" => array(	// Значимые переменные запроса
						0 => "",
					),
					"MENU_CACHE_TIME" => "3600",	// Время кеширования (сек.)
					"MENU_CACHE_TYPE" => "A",	// Тип кеширования
					"MENU_CACHE_USE_GROUPS" => "Y",	// Учитывать права доступа
					"ROOT_MENU_TYPE" => "top_raz",	// Тип меню для первого уровня
					"USE_EXT" => "Y",	// Подключать файлы с именами вида .тип_меню.menu_ext.php
				),
				false
			);?>
				<a href="/basket/" class="basket">
				<?
								$APPLICATION->IncludeFile(
									"/include/count_bas.php",
									Array(),
									Array("MODE" => "php")
								);
				 ?>
				</a>
			</div>
			<div class="header__nav header__nav_brands">
			<?
								$APPLICATION->IncludeFile(
									"/include/menu_brands.php",
									Array(),
									Array("MODE" => "php")
								);
				 ?>
			<?/*$APPLICATION->IncludeComponent("bitrix:menu", "raz_brands_top", Array(
				"ALLOW_MULTI_SELECT" => "N",	// Разрешить несколько активных пунктов одновременно
					"CHILD_MENU_TYPE" => "top_raz",	// Тип меню для остальных уровней
					"DELAY" => "N",	// Откладывать выполнение шаблона меню
					"MAX_LEVEL" => "3",	// Уровень вложенности меню
					"MENU_CACHE_GET_VARS" => array(	// Значимые переменные запроса
						0 => "",
					),
					"MENU_CACHE_TIME" => "3600",	// Время кеширования (сек.)
					"MENU_CACHE_TYPE" => "N",	// Тип кеширования
					"MENU_CACHE_USE_GROUPS" => "Y",	// Учитывать права доступа
					"ROOT_MENU_TYPE" => "top_raz",	// Тип меню для первого уровня
					"USE_EXT" => "Y",	// Подключать файлы с именами вида .тип_меню.menu_ext.php
				),
				false
			);*/?>
			</div>
		</div>
		<button class="header__mobile"></button>
		<button class="header__search-mobile"></button>
		<a href="/personal/favorites/" class="header__fav-mobile">
		<?
		/*$APPLICATION->IncludeFile(
			"/include/count_favorit_mobi.php",
			Array(),
			Array("MODE" => "php")
		);*/
		?>
		</a>
		<a href="/basket/" class="header__basket-mobile">
			<?
							$APPLICATION->IncludeFile(
								"/include/count_bas_mobile.php",
								Array(),
								Array("MODE" => "php")
							);
			 ?>
		</a>
		<div class="m-menu">
		 <?/*<div class="m-menu__block">
		     <span class="m-menu__city" data-open="city"><?=$_REQUEST['changeCity']?$_REQUEST['changeCity']:$_SESSION["change"];?></span>
				 close==
		  </div>*/?>
		  <div class="m-menu__block">
		    <a href="/auth/" class="m-menu__btn">Вход</a>
		    <a href="/register/" class="m-menu__btn m-menu__btn_transparent">Регистрация</a>
				<button class="m-menu__close"></button>
		  </div>
		  <div class="m-menu__block m-menu__block_white">
		    <a href="tel:88007757434" class="telephone">
		      <span class="telephone__number">8 800  775 74 34</span>
		      <span class="telephone__text">Бесплатный звонок по России</span>
		    </a>
		  </div>
		  <a href="/categories/other-brands/" class="m-menu__link m-menu__link_single">БРЕНДЫ</a>
		<?$APPLICATION->IncludeComponent("bitrix:menu", "raz_top_mobi", Array(
			"ALLOW_MULTI_SELECT" => "N",	// Разрешить несколько активных пунктов одновременно
				"CHILD_MENU_TYPE" => "top_raz",	// Тип меню для остальных уровней
				"DELAY" => "N",	// Откладывать выполнение шаблона меню
				"MAX_LEVEL" => "3",	// Уровень вложенности меню
				"MENU_CACHE_GET_VARS" => array(	// Значимые переменные запроса
					0 => "",
				),
				"MENU_CACHE_TIME" => "3600",	// Время кеширования (сек.)
				"MENU_CACHE_TYPE" => "A",	// Тип кеширования
				"MENU_CACHE_USE_GROUPS" => "Y",	// Учитывать права доступа
				"ROOT_MENU_TYPE" => "top_raz",	// Тип меню для первого уровня
				"USE_EXT" => "Y",	// Подключать файлы с именами вида .тип_меню.menu_ext.php
			),
			false
		);?>
		</div>
	<?/*<div class="m-menu" style="display:none;">
			<div class="m-menu__block">
				<span class="m-menu__city" data-open="city">Москва</span>
				<button class="m-menu__close"></button>
			</div>
			<div class="m-menu__block">
				<a href="/auth/" class="m-menu__btn">Вход</a>
				<a href="/register/" class="m-menu__btn m-menu__btn_transparent">Регистрация</a>
			</div>
			<div class="m-menu__block m-menu__block_white">
				<a href="tel:88007757434" class="telephone">
					<span class="telephone__number">8 800  775 74 34</span>
					<span class="telephone__text">Бесплатный звонок по России</span>
				</a>
			</div>
			<a href="#" class="m-menu__link m-menu__link_single">БРЕНДЫ</a>
			<ul class="m-menu__list">
				<li class="m-menu__item m-menu__item_drop">
					<span class="m-menu__link">Волосы</span>
					<ul class="m-menu__drop">
						<li class="m-menu__item m-menu__item_back">
							<span class="m-menu__link">Волосы</span>
							<button class="m-menu__close"></button>
						</li>
						<li class="m-menu__item">
							<a href="#" class="m-menu__link">Перейти в раздел</a>
						</li>
						<li class="m-menu__item m-menu__item_drop">
							<span class="m-menu__link">Окрашивание</span>
							<ul class="m-menu__drop">
								<li class="m-menu__item m-menu__item_back">
									<span class="m-menu__link">Окрашивание</span>
									<button class="m-menu__close"></button>
								</li>
								<li class="m-menu__item">
									<a href="#" class="m-menu__link">Перейти в раздел</a>
								</li>
								<li class="m-menu__item m-menu__item_drop">
									<span class="m-menu__link">Краски для волос</span>
									<ul class="m-menu__drop">
										<li class="m-menu__item m-menu__item_back">
											<span class="m-menu__link">Краски для волос</span>
											<button class="m-menu__close"></button>
										</li>
										<li class="m-menu__item">
											<a href="#" class="m-menu__link">Перейти в раздел</a>
										</li>
										<li class="m-menu__item">
											<a href="#" class="m-menu__link">Стойкие краски</a>
										</li>
										<li class="m-menu__item">
											<a href="#" class="m-menu__link">Тонирование</a>
										</li>
										<li class="m-menu__item">
											<a href="#" class="m-menu__link">Краски прямого действия</a>
										</li>
										<li class="m-menu__item">
											<a href="#" class="m-menu__link">Краски без аммиака</a>
										</li>
									</ul>
								</li>
								<li class="m-menu__item">
									<a href="#" class="m-menu__link">Смывки</a>
								</li>
								<li class="m-menu__item m-menu__item_drop">
									<span class="m-menu__link">Активаторы</span>
									<ul class="m-menu__drop">
										<li class="m-menu__item m-menu__item_back">
											<span class="m-menu__link">Активаторы</span>
											<button class="m-menu__close"></button>
										</li>
										<li class="m-menu__item">
											<a href="#" class="m-menu__link">Estel</a>
										</li>
										<li class="m-menu__item">
											<a href="#" class="m-menu__link">Matrix</a>
										</li>
									</ul>
								</li>
								<li class="m-menu__item">
									<span class="m-menu__link">Окислители</span>
								</li>
								<li class="m-menu__item">
									<span class="m-menu__link">Осветление</span>
								</li>
								<li class="m-menu__item">
									<span class="m-menu__link">Краски для бровей</span>
								</li>
								<li class="m-menu__item">
									<span class="m-menu__link">Хна для ресниц и бровей</span>
								</li>
								<li class="m-menu__item">
									<span class="m-menu__link">Вспомагательные средства</span>
								</li>
							</ul>
						</li>
						<li class="m-menu__item m-menu__item_drop">
							<span class="m-menu__link">Уход</span>
							<ul class="m-menu__drop">
								<li class="m-menu__item m-menu__item_back">
									<span class="m-menu__link">Уход</span>
									<button class="m-menu__close"></button>
								</li>
								<li class="m-menu__item">
									<a href="#" class="m-menu__link">Перейти в раздел</a>
								</li>
								<li class="m-menu__item">
									<a href="#" class="m-menu__link">Шампуни</a>
								</li>
								<li class="m-menu__item">
									<a href="#" class="m-menu__link">Бальзамы</a>
								</li>
							</ul>
						</li>
					</ul>
				</li>
				<li class="m-menu__item">
					<span class="m-menu__link">Лицо</span>
					<ul class="m-menu__drop"></ul>
				</li>
				<li class="m-menu__item">
					<span class="m-menu__link">Тело</span>
					<ul class="m-menu__drop"></ul>
				</li>
				<li class="m-menu__item">
					<span class="m-menu__link">Ногти</span>
					<ul class="m-menu__drop"></ul>
				</li>
				<li class="m-menu__item">
					<span class="m-menu__link">Макияж</span>
					<ul class="m-menu__drop"></ul>
				</li>
				<li class="m-menu__item">
					<span class="m-menu__link">Техника</span>
					<ul class="m-menu__drop"></ul>
				</li>
				<li class="m-menu__item">
					<span class="m-menu__link">Аксессуары</span>
					<ul class="m-menu__drop"></ul>
				</li>
				<li class="m-menu__item">
					<span class="m-menu__link">Подарки</span>
					<ul class="m-menu__drop"></ul>
				</li>
				<li class="m-menu__item">
					<a href="#" class="m-menu__link">Organic</a>
				</li>
				<li class="m-menu__item m-menu__item_sale">
					<a href="#" class="m-menu__link">% Sale</a>
				</li>
				<li class="m-menu__item m-menu__item_action">
					<a href="#" class="m-menu__link">Акции</a>
				</li>
			</ul>
			<a href="#" class="m-menu__link">Контакты</a>
			<a href="#" class="m-menu__link">Бесплатная доставка</a>
			<a href="#" class="m-menu__link">Гарантированный подарок</a>
			<a href="#" class="m-menu__link">Для оптовых покупателей</a>
			<a href="#" class="m-menu__link">Клуб привелегий</a>
			<div class="m-menu__social">
				<div class="m-menu__btn m-menu__btn_ico">
					<img src="<?=SITE_TEMPLATE_PATH?>/images/vk.svg" alt="">
				</div>
				<div class="m-menu__btn m-menu__btn_ico">
					<img src="<?=SITE_TEMPLATE_PATH?>/images/insta.svg" alt="">
				</div>
				<div class="m-menu__btn m-menu__btn_ico">
					<img src="<?=SITE_TEMPLATE_PATH?>/images/fb.svg" alt="">
				</div>
				<div class="m-menu__btn m-menu__btn_ico">
					<img src="<?=SITE_TEMPLATE_PATH?>/images/ok.svg" alt="">
				</div>
			</div>
		</div>*/?>
	</div>
</header>

	<div class="page__wrapper">
	<?if(strpos($APPLICATION->GetCurPage(), 'categories') || strpos($APPLICATION->GetCurPage(), 'products') || strpos($APPLICATION->GetCurPage(), 'productlist')):?>
	<div class="tizers tizers_item">
			<div class="tizers__block tizers__block_left">
								<?
								$APPLICATION->IncludeFile(
									"/include/tizers_left.php",
									Array(),
									Array("MODE" => "php")
								);
								 ?>
			</div>
			<div class="tizers__block tizers__block_right">
								<?
								$APPLICATION->IncludeFile(
									"/include/tizers_right.php",
									Array(),
									Array("MODE" => "php")
								);
								 ?>
			</div>
	</div>
	<?endif;?>
	<div class="container">
	<?if(strpos($APPLICATION->GetCurPage(), 'feedback') || strpos($APPLICATION->GetCurPage(), 'auth') || strpos($APPLICATION->GetCurPage(), 'abuseform') || strpos($APPLICATION->GetCurPage(), 'register')):?>
	<div class="login">
	<h2 class="login__title"><?=$APPLICATION->ShowTitle(false);?></h2>
	<?endif;?>
	<?if(strpos($APPLICATION->GetCurPage(), 'search')):?>
	<div class="section">
	<?endif;?>
	<?if(!strpos($APPLICATION->GetCurPage(), 'products') && !strpos($APPLICATION->GetCurPage(), 'search') && !strpos($APPLICATION->GetCurPage(), 'register') && !strpos($APPLICATION->GetCurPage(), 'abuseform') && !strpos($APPLICATION->GetCurPage(), 'auth') && !strpos($APPLICATION->GetCurPage(), 'feedback') && $APPLICATION->GetCurPage()!= '/' && !strpos($APPLICATION->GetCurPage(), 'categories') && !strpos($APPLICATION->GetCurPage(), 'productlist') && !strpos($APPLICATION->GetCurPage(), 'basket') && !strpos($APPLICATION->GetCurPage(), 'personal')):?>
	<div class="section">
	<div class="section__block <?if(strpos($APPLICATION->GetCurPage(), 'blog') || strpos($APPLICATION->GetCurPage(), 'news')|| strpos($APPLICATION->GetCurPage(), 'reviews') || strpos($APPLICATION->GetCurPage(), 'warranty') || strpos($APPLICATION->GetCurPage(), 'questions')):?>section__block_main<?else:?>section__block_full<?endif;?>">
	<div class="section__title">
	<strong><?=$APPLICATION->ShowTitle(false);?></strong>
	</div>
	<?$APPLICATION->IncludeComponent("bitrix:breadcrumb", "bread", Array(
	"PATH" => "",	// Путь, для которого будет построена навигационная цепочка (по умолчанию, текущий путь)
		"SITE_ID" => "s1",	// Cайт (устанавливается в случае многосайтовой версии, когда DOCUMENT_ROOT у сайтов разный)
		"START_FROM" => "0",	// Номер пункта, начиная с которого будет построена навигационная цепочка
	),
	false
	);?>
	<?if(!strpos($APPLICATION->GetCurPage(), 'blog') && !strpos($APPLICATION->GetCurPage(), 'news') && !strpos($APPLICATION->GetCurPage(), 'reviews') && !strpos($APPLICATION->GetCurPage(), 'warranty') && !strpos($APPLICATION->GetCurPage(), 'questions') && !strpos($APPLICATION->GetCurPage(), 'opt')):?>
	<div class="content">
	<?endif;?>
	<?endif;?>
	<?if(strpos($APPLICATION->GetCurPage(), 'products')):?>
	<?$APPLICATION->IncludeComponent("bitrix:breadcrumb", "bread", Array(
	"PATH" => "",	// Путь, для которого будет построена навигационная цепочка (по умолчанию, текущий путь)
		"SITE_ID" => "s1",	// Cайт (устанавливается в случае многосайтовой версии, когда DOCUMENT_ROOT у сайтов разный)
		"START_FROM" => "0",	// Номер пункта, начиная с которого будет построена навигационная цепочка
	),
	false
	);?>
	<?endif;


	?>
