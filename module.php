//<?php
/**
 * ddMMEditor module
 * @version 1.4.2 (2013-08-09)
 *
 * User-friendly module for the ManagerManager configuration file editing.
 * 
 * @link http://code.divandesign.biz/modx/ddmmeditor/1.4.2
 * 
 * @copyright 2013, DivanDesign
 * http://www.DivanDesign.biz
 */

//Защищаем файл
if(!$modx){
	return;
}else if($modx->getLoginUserType() != 'manager'){
	return;
}else{
	//Сравниваем url сайта из конфига с реальным (в качестве длины берём длину из конфига, чтобы лишнее не смотреть)
	if (strncasecmp($modx->config['site_url'], $_SERVER['HTTP_REFERER'], strlen($modx->config['site_url'])) != 0){
		return;
	}
}

$version = '1.4.2';

//Подключаем класс модуля
require_once MODX_BASE_PATH.'assets/modules/ddmmeditor/ddmmeditor.class.php';

//Если переданы правила для сохранения
if (isset($_POST['rules'])){
	//Сохраняем
	$msg = ddMMEditor::saveRules($_POST['rules']);
	
	if ($msg !== false){return $msg;}
}

$autocompleteData = ddMMEditor::getAutocompleteData();

//Считываем правила из файла
$outputJs = 'Rules.data.rules = '.ddMMEditor::readRules().';';
$outputJs .= 'Rules.data.roles = '.$autocompleteData['roles'].';';
$outputJs .= 'Rules.data.templates = '.$autocompleteData['templates'].';';
$outputJs .= 'Rules.data.fields = '.$autocompleteData['fields'].';';

//Если чанк в конфиге MM задан
if (!ddMMEditor::checkMMConfig()){
	//Громко ругаемся
	$outputJs .= 'alert("The \'Configuration Chunk\' parameter in the configuration of ManagerManager plugin was defined!\r\nThe rules created here won\'t be applied!");';
}

//Формируем вывод
$output = '<html>
<head>';
$output .= '<base href="'.$modx->config['site_url'].'" />';
$output .= '
<link rel="stylesheet" type="text/css" href="'.MODX_MANAGER_URL.'media/style/'.$modx->config['manager_theme'].'/style.css" />
<link rel="stylesheet" type="text/css" href="'.$modx->config['site_url'].'/assets/modules/ddmmeditor/css/general.css" />
<script src="'.$modx->config['site_url'].'assets/modules/ddmmeditor/js/jquery-1.10.1.min.js" type="text/javascript"></script>
<script src="'.$modx->config['site_url'].'assets/modules/ddmmeditor/js/jquery-ui-1.10.3.custom.min.js" type="text/javascript"></script>
<script src="'.$modx->config['site_url'].'assets/modules/ddmmeditor/js/jquery.ddTools-1.8.5.min.js" type="text/javascript"></script>
<script src="'.$modx->config['site_url'].'assets/modules/ddmmeditor/js/jquery.ddMultipleInput-1.2.1.min.js" type="text/javascript"></script>
<script src="'.$modx->config['site_url'].'assets/modules/ddmmeditor/js/ddmmeditor.class.js" type="text/javascript"></script>
<script type="text/javascript">'.$outputJs.'</script>
<script src="'.$modx->config['site_url'].'assets/modules/ddmmeditor/js/ddmmeditor.js" type="text/javascript"></script>
</head>
<body>
	<h1>ddMMEditor<span id="ver"> '.$version.'</span></h1>
	<div id="actions">
		<ul class="actionButtons">
			<li id="new_rule"><a href="#">New rule</a></li>
			<li id="new_group"><a href="#">New group</a></li>
			<li id="save_rules"><a href="#">Save</a></li>
		</ul>
	</div>
	<div class="sectionBody">
		<div id="tabs" class="dynamic-tab-pane-control">
			<ul class="tab_cont tab-row">
				<li class="tab"><a href="#">Rules</a></li>
				<li class="tab"><a href="#">Manual input</a></li>
			</ul>
			<div id="ui-tabs-1" class="tab-page">
				<div id="rules_cont">
				</div>
			</div>
			<div id="ui-tabs-2" class="tab-page">
				<h3>Top</h3>
				<p>This code will be inserted before all rules.</p>
				<textarea id="comment_top"></textarea>
				<h3>Bottom</h3>
				<p>This code will be inserted after all rules.</p>
				<textarea id="comment_bottom"></textarea>
			</div>
		</div>
		<div class="ajaxLoader"></div>
	</div>
	<div class="ddFooter">
		<div style="float: left;"><a href="http://code.divandesign.biz/modx/ddmmeditor/'.$version.'" target="_blank">Documentation</a></div>
		<address>Created by <a href="http://www.DivanDesign.biz" target="_blank">DivanDesign</a></address>
	</div>
	<div class="clear"></div>
</body>
</html>';
echo $output;
//?>