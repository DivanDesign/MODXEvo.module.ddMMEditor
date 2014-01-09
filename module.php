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
	$site_url = $modx->config['site_url'];
	if (strncasecmp($site_url, $_SERVER['HTTP_REFERER'], strlen($site_url)) != 0){
		return;
	}
}

$version = '1.4.2';

//Полный адрес файла
$fileName = MODX_BASE_PATH.'assets/plugins/managermanager/mm_rules.inc.php';
//Сохраняем пост в массив
if (isset($_POST['rules'])) $saveMas = $_POST['rules'];

//Если массив с постом не пустой, то запускаем сохранение
if (isset($saveMas)){
	//Добавляем в массив открытие и закрытие php кода
	array_unshift($saveMas,'<?php');
	array_push($saveMas, '?>');

	//Открываем файл
	if(!$file = fopen($fileName, 'w')){
		echo "Can't open file ".$fileName;
		return;
	}
	
	//Перебираем массив со строками
	foreach ($saveMas as $value){
		//Записываем строку в файл
		if (fwrite($file, $value."\n") === false){
			echo "Can't write string to file ".$fileName;
			return;
		}
	}
	//Закрываем файл
	fclose($file);
	echo "Write success";
	return;
}

//Если файла нет
if (!file_exists($fileName)){
	//Создадим его
	fclose(fopen($fileName, 'w'));
}

//Считываем файл
$config = file($fileName);
$site_url = $modx->config['site_url'];
$rules = array();
$group = '';
//Перебираем файл по строкам
foreach ($config as $line){
	$line = trim($line);
	
	if ($line == '<?php' || $line == '?>' || $line == '') continue;
	
	//Создаём группу
	if (strncasecmp($line, '//group', 7) == 0){
		$group = substr($line, 8);
		if (!isset($rules[$group])) $rules[$group] = array();
		continue;
	}
	
	switch ($group){
		case 'comment_top':
		case 'comment_bottom':
			$rules[$group][] = $line."\n";
// 			$rules[$group][] = str_replace(array('"', "'"), '\"', $line)."\n";
		break;
		
		default:
			$temp = array();
			
			//Если это кастомная строка правила
			if (strncasecmp($line, '/*ddCustomRule*/', 16) == 0){
				$temp['name'] = 'ddCustomRule';
				$temp['param'] = str_replace('/*ddCustomRule*/', '', $line);
				$temp['param'] = str_replace(array('"', "'"), '&#34;', $temp['param']);
			//Если это нормальное правило
			}else{
				$sepF = strpos($line, '(');
				$sepL = strrpos($line, ')');
				
				$temp['name'] = substr($line, 0, $sepF);
				$temp['param'] = substr($line, $sepF + 1, ($sepL - $sepF - 1));
				$temp['param'] = str_replace('"', "&#34;", $temp['param']);
			}
			
			$rules[$group][] = $temp;
	}
}

if (isset($rules['comment_top'])){$rules['comment_top'] = implode('', $rules['comment_top']);}
if (isset($rules['comment_bottom'])){$rules['comment_bottom'] = implode('', $rules['comment_bottom']);}

//Преобразуем в JSON, экранируем \'
$rules = json_encode($rules);

//Создаём объект ролей
$roles = json_encode($modx->db->makeArray($modx->db->select("id, name", $modx->getFullTableName('user_roles'), "", "id ASC")));
//Создаём объект шаблонов
$templates = $modx->db->makeArray($modx->db->select("`id` AS `value`, CONCAT(`templatename`, ' (', `id`, ')') AS label", $modx->getFullTableName('site_templates'), "", "templatename ASC"));
array_unshift($templates, array('value' => 0, 'label' => 'blank (0)'));
$templates = json_encode($templates);

//Получаем все используемые tv
$sql = "SELECT `name` FROM {$modx->getFullTableName('site_tmplvars')} GROUP BY `name` ASC";
$temp = $modx->db->makeArray($modx->db->query($sql));
$fields = array();

foreach($temp as $value){$fields[] = $value['name'];}

//Добавим поля документа
$fields[] = 'pagetitle';
$fields[] = 'longtitle';
$fields[] = 'description';
$fields[] = 'alias';
$fields[] = 'link_attributes';
$fields[] = 'introtext';
$fields[] = 'template';
$fields[] = 'menutitle';
$fields[] = 'menuindex';
$fields[] = 'show_in_menu';
$fields[] = 'hide_menu';
$fields[] = 'parent';
$fields[] = 'is_folder';
$fields[] = 'is_richtext';
$fields[] = 'log';
$fields[] = 'published';
$fields[] = 'pub_date';
$fields[] = 'unpub_date'; 
$fields[] = 'searchable'; 
$fields[] = 'cacheable';
$fields[] = 'clear_cache';
$fields[] = 'content_type';
$fields[] = 'content_dispo'; 
$fields[] = 'keywords';
$fields[] = 'metatags';
$fields[] = 'content';
$fields[] = 'which_editor';
$fields[] = 'resource_type'; 
$fields[] = 'weblink';

if (method_exists($modx, 'getVersionData')){
	//В новом MODX в метод можно просто передать 'version' и сразу получить нужный элемент, но не в старом
	$modxVersionData = $modx->getVersionData();

	//If version of MODX > 1.0.11
	if (version_compare($modxVersionData['version'], '1.0.11', '>')){
		$fields[]  = 'alias_visible';
	}
}

$fields = json_encode($fields);

$outputJs = "var rulesJSON = ".$rules.";";
$outputJs .= "var rolesJSON = ".$roles.";";
$outputJs .= "var templatesJSON = ".$templates.";";
$outputJs .= "var tvsAutocomplite = ".$fields.";";

//Получим конфиг MM
if (isset($modx->pluginCache['ManagerManager'])){
	$mmProperties = $modx->pluginCache['ManagerManagerProps'];
}else{
	$sql = 'SELECT `properties` FROM '.$modx->getFullTableName('site_plugins').' WHERE `name` = "ManagerManager" AND `disabled` = 0;';
	$dbResult = $modx->db->query($sql);

	if ($modx->db->getRecordCount($dbResult) == 1){
		$row = $modx->db->getRow($dbResult);

		$mmProperties = $row['properties'];
	}else{
		$mmProperties = '';
	}
}

$mmProperties = $modx->parseProperties($mmProperties);

//Если чанк в конфиге MM задан
if (isset($mmProperties['config_chunk']) && $mmProperties['config_chunk'] != ''){
	//Громко ругаемся
	$outputJs .= 'alert("The \'Configuration Chunk\' parameter in the configuration of ManagerManager plugin was defined!\r\nThe rules created here won\'t be applied!");';
}

//Формируем вывод
$output = '<html>
<head>';
$output .= '<base href="'.$site_url.'" />';
$output .= '<script type=text/javascript>'.$outputJs.'</script>';
$output .= '
<link rel="stylesheet" type="text/css" href="'.MODX_MANAGER_URL.'media/style/'.$modx->config['manager_theme'].'/style.css" />
<link rel="stylesheet" type="text/css" href="'.$site_url.'/assets/modules/ddmmeditor/css/general.css" />
<script src="'.$site_url.'assets/modules/ddmmeditor/js/jquery-1.10.1.min.js" type="text/javascript"></script>
<script src="'.$site_url.'assets/modules/ddmmeditor/js/jquery-ui-1.10.3.custom.min.js" type="text/javascript"></script>
<script src="'.$site_url.'assets/modules/ddmmeditor/js/jquery.ddTools-1.8.5.min.js" type="text/javascript"></script>
<script src="'.$site_url.'assets/modules/ddmmeditor/js/jquery.ddMultipleInput-1.1.min.js" type="text/javascript"></script>
<script src="'.$site_url.'assets/modules/ddmmeditor/js/ddmmeditor.class.js" type="text/javascript"></script>
<script src="'.$site_url.'assets/modules/ddmmeditor/js/ddmmeditor.js" type="text/javascript"></script>
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