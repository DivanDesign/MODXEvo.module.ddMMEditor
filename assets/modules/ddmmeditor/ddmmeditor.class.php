<?php
/**
 * ddMMEditor class
 * @version: 1.0 (2014-01-20)
 * 
 * @copyright 2014, DivanDesign
 * http://www.DivanDesign.biz
 */

if (!class_exists('ddMMEditor')){
class ddMMEditor {
	//Полный адрес файла с правилами
	public static $rulesFile;
	
	/**
	 * readRules
	 * @version 1.0 (2014-01-20)
	 * 
	 * @desc Считывает правила из файла и подготавливает JSON для js.
	 * 
	 * @return {string: JSON} - Считанные правила.
	 */
	public static function readRules(){
		//Считываем файл
		$config = file(self::$rulesFile);
		$rules = array();
		$group = '';
		//Перебираем файл по строкам
		foreach ($config as $line){
			$line = trim($line);
			
			if ($line == '<?php' || $line == '?>' || $line == ''){continue;}
			
			//Создаём группу
			if (strncasecmp($line, '//group', 7) == 0){
				$group = substr($line, 8);
				if (!isset($rules[$group])){$rules[$group] = array();}
				continue;
			}
			
			switch ($group){
				case 'comment_top':
				case 'comment_bottom':
					$rules[$group][] = $line."\n";
// 					$rules[$group][] = str_replace(array('"', "'"), '\"', $line)."\n";
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
		
		//Преобразуем в JSON
		return json_encode($rules);
	}
	
	/**
	 * saveRules
	 * @version 1.0 (2014-01-20)
	 * 
	 * @desc Сохраняет переданные из js правила в файл.
	 * 
	 * @param $saveMas {string: JSON} - Правила для сохранения. @required
	 * 
	 * @return {string; false} - Статус.
	 */
	public static function saveRules($saveMas){
		//Если массив с постом не пустой, то запускаем сохранение
		if (!empty($saveMas)){
			//Добавляем в массив открытие и закрытие php кода
			array_unshift($saveMas, '<?php');
			array_push($saveMas, '?>');
			
			//Открываем файл
			if(!$file = fopen(self::$rulesFile, 'w')){
				return "Can't open file ".self::$rulesFile;
			}
			
			//Перебираем массив со строками
			foreach ($saveMas as $value){
				//Записываем строку в файл
				if (fwrite($file, $value."\n") === false){
					return "Can't write string to file ".self::$rulesFile;
				}
			}
			
			//Закрываем файл
			fclose($file);
			return "Write success";
		}else{
			return false;
		}
	}
	
	/**
	 * getAutocompleteData
	 * @version 1.0 (2014-01-20)
	 * 
	 * @desc Получает данные списков автозаполнения для js.
	 * 
	 * @return {array} - Считанные правила.
	 */
	public static function getAutocompleteData(){
		global $modx;
		
		$result = array();
		
		//Создаём объект ролей
		$result['roles'] = json_encode($modx->db->makeArray($modx->db->select("`id` AS `value`, CONCAT(`name`, ' (', `id`, ')') AS `label`", $modx->getFullTableName('user_roles'), "", "id ASC")));
		
		//Создаём объект шаблонов
		$result['templates'] = $modx->db->makeArray($modx->db->select("`id` AS `value`, CONCAT(`templatename`, ' (', `id`, ')') AS `label`", $modx->getFullTableName('site_templates'), "", "templatename ASC"));
		array_unshift($result['templates'], array('value' => 0, 'label' => 'blank (0)'));
		$result['templates'] = json_encode($result['templates']);
		
		$result['fields'] = array();
		//Получаем все используемые tv
		$temp = $modx->db->makeArray($modx->db->query("SELECT `name` FROM {$modx->getFullTableName('site_tmplvars')} GROUP BY `name` ASC"));
		
		foreach($temp as $value){$result['fields'][] = $value['name'];}
		
		//Добавим поля документа
		$result['fields'][] = 'pagetitle';
		$result['fields'][] = 'longtitle';
		$result['fields'][] = 'description';
		$result['fields'][] = 'alias';
		$result['fields'][] = 'link_attributes';
		$result['fields'][] = 'introtext';
		$result['fields'][] = 'template';
		$result['fields'][] = 'menutitle';
		$result['fields'][] = 'menuindex';
		$result['fields'][] = 'show_in_menu';
		$result['fields'][] = 'hide_menu';
		$result['fields'][] = 'parent';
		$result['fields'][] = 'is_folder';
		$result['fields'][] = 'is_richtext';
		$result['fields'][] = 'log';
		$result['fields'][] = 'published';
		$result['fields'][] = 'pub_date';
		$result['fields'][] = 'unpub_date';
		$result['fields'][] = 'searchable';
		$result['fields'][] = 'cacheable';
		$result['fields'][] = 'clear_cache';
		$result['fields'][] = 'content_type';
		$result['fields'][] = 'content_dispo';
		$result['fields'][] = 'keywords';
		$result['fields'][] = 'metatags';
		$result['fields'][] = 'content';
		$result['fields'][] = 'which_editor';
		$result['fields'][] = 'resource_type';
		$result['fields'][] = 'weblink';
		
		if (method_exists($modx, 'getVersionData')){
			//В новом MODX в метод можно просто передать 'version' и сразу получить нужный элемент, но не в старом
			$modxVersionData = $modx->getVersionData();
			
			//If version of MODX > 1.0.11
			if (version_compare($modxVersionData['version'], '1.0.11', '>')){
				$result['fields'][]  = 'alias_visible';
			}
		}
		
		$result['fields'] = json_encode($result['fields']);
		
		return $result;
	}
	
	/**
	 * checkMMConfig
	 * @version 1.0 (2014-01-20)
	 * 
	 * @desc Проверяет не задан ли случаем в конфиге MM чанк с правилами.
	 * 
	 * @return {boolean} - Всё ли хорошо?
	 */
	public static function checkMMConfig(){
		global $modx;
		
		//Получим конфиг MM
		if (isset($modx->pluginCache['ManagerManager'])){
			$mmProperties = $modx->pluginCache['ManagerManagerProps'];
		}else{
			$dbResult = $modx->db->query("SELECT `properties` FROM ".$modx->getFullTableName('site_plugins')." WHERE `name` = 'ManagerManager' AND `disabled` = 0;");
			
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
			//Ругаемся
			return false;
		}else{
			return true;
		}
	}
}

//Полный адрес файла с правилами
ddMMEditor::$rulesFile = MODX_BASE_PATH.'assets/plugins/managermanager/mm_rules.inc.php';

//Если файла нет
if (!file_exists(ddMMEditor::$rulesFile)){
	//Создадим его
	fclose(fopen(ddMMEditor::$rulesFile, 'w'));
}
}
?>