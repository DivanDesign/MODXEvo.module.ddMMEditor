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

$moduleDir = MODX_BASE_PATH.'assets/modules/ddmmeditor/';

//Подключаем класс модуля
require_once $moduleDir.'ddmmeditor.class.php';
//ddTools
require_once $moduleDir.'modx.ddtools.class.php';

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
echo ddTools::parseText(file_get_contents($moduleDir.'template.html'), array(
	'site_url' => $modx->config['site_url'],
	'manager_theme' => MODX_MANAGER_URL.'media/style/'.$modx->config['manager_theme'].'/style.css',
	'inline_js' => $outputJs,
	'version' => $version
), '[+', '+]', false);
//?>