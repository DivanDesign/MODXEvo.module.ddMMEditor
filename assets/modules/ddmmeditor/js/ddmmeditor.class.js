/**
 * ddmmeditor.class.js
 * @version 1.5 (2014-01-23)
 * 
 * @desc Описание класса для работы с правилами.
 * 
 * @copyright 2014, DivanDesign
 * http://www.DivanDesign.biz
 **/

/**start*****Глобальный объект управления правилами*/
var Rules = {
	//Шаблоны
	tpls: {
		//Группа правил
		$group: $('<div class="group"><div class="title"><span>New group</span> <a href="#Edit" class="false editButton"></a></div><div class="titleButtons"><a href="#Hide" class="false hideButton"><span>+</span><span>&minus;</span></a> <a class="false deleteButton" href="#Remove">×</a></div></div>'),
		//Форма правила
		ruleForm: '<form action="javascript:void(0);" class="ruleForm [+className+]"><div>[+content+]<input type="button" class="del" value="x" /><div class="clear"></div></div></form>'
	},
	
	//Данные извне
	data: {
		//Непосредственно правила
		rules: {},
		//Список ролей
		roles: {},
		//Список шаблонов
		templates: {},
		//Список полей документа (и TV)
		fields: new Array()
	},
	
	//Массив всех правил
	rulesMas: new Array(),
	//Индекс последнего созданного объекта
	indexParam: 0,
	//Контейнер, содержащий группы с правилами
	$rulesCont: $(),
	
	//Создаём правила из всего объекта
	constructorRules: function(){
		var _this = this;
		
		for (var i = 0, len = _this.data.templates.length; i < len; i++){
			_this.data.templates.push({
				value: '!' + _this.data.templates[i].value,
				label: '!' + _this.data.templates[i].label
			});
		}
		
		for (var i = 0, len = _this.data.roles.length; i < len; i++){
			_this.data.roles.push({
				value: '!' + _this.data.roles[i].value,
				label: '!' + _this.data.roles[i].label
			});
		}
		
		//Перебираем объект
		$.each(_this.data.rules, function(groupName, elem){
			if (groupName == 'comment_top' || groupName == 'comment_bottom'){
				_this.newComment(elem, groupName);
			}else{
				var $group = _this.newGroup(groupName);
				$.each(elem, function(key, val){
					_this.newRule(val.name, val.param, $group);
				});
			}
		});
		
		_this.$rulesCont.find('.group').addClass('closed');
	},
	
	//Создаёт новую группу
	newGroup: function(groupName){
		var _this = this,
			$group = _this.tpls.$group.clone();
		
		$group.find('.title span').text(groupName);
		$group.appendTo(_this.$rulesCont);
		
		return $group;
	},
	
	//Создаёт новое правило
	newRule: function(ruleName, ruleParam, $group){
		var	_this = this,
			masParam = new Array();
		
		//Если это катсомное правило
		if (ruleName == 'ddCustomRule'){
			//Просто запишем строку
			masParam.push(ruleParam || '');
		}else{
			//Проверяем переданны ли параметры, если нет, то создаём пустой массив с параметрами
			if(ruleParam){
				ruleParam = ruleParam.substr(1, ruleParam.length - 2);
				masParam = ruleParam.split("','");
			}
		}		
		
		//Берём имя параметра и создаём определённый класс
		switch(ruleName){
			case 'mm_hideFields':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_hideFields(masParam);
			break;
			case 'mm_renameField':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_renameField(masParam);
			break;
			case 'mm_requireFields':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_requireFields(masParam);
			break;
			case 'mm_default':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_default(masParam);
			break;
			case 'mm_changeFieldHelp':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_changeFieldHelp(masParam);
			break;
			case 'mm_hideTemplates':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_hideTemplates(masParam);
			break;
			case 'mm_inherit':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_inherit(masParam);
			break;
			case 'mm_synch_fields':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_synch_fields(masParam);
			break;
			case 'mm_renameTab':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_renameTab(masParam);
			break;
			case 'mm_hideTabs':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_hideTabs(masParam);
			break;
			case 'mm_createTab':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_createTab(masParam);
			break;
			case 'mm_moveFieldsToTab':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_moveFieldsToTab(masParam);
			break;
			case 'mm_widget_tags':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_widget_tags(masParam);
			break;
			case 'mm_widget_showimagetvs':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_widget_showimagetvs(masParam);
			break;
			case 'mm_widget_colors':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_widget_colors(masParam);
			break;
			case 'mm_widget_accessdenied':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_widget_accessdenied(masParam);
			break;
			case 'mm_ddHTMLCleaner':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_ddHTMLCleaner(masParam);
			break;
			case 'mm_ddMaxLength':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_ddMaxLength(masParam);
			break;
			case 'mm_ddMultipleFields':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_ddMultipleFields(masParam);
			break;
//			case 'mm_ddPatternField':
//				_this.rulesMas[_this.indexParam] = new ddPatternField(masParam);
//			break;
			case 'mm_ddGMap':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_ddGMap(masParam);
			break;
			case 'mm_ddYMap':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_ddYMap(masParam);
			break;
			case 'mm_ddSetFieldValue':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_ddSetFieldValue(masParam);
			break;
			case 'mm_ddResizeImage':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_ddResizeImage(masParam);
			break;
			case 'mm_ddAutoFolders':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_ddAutoFolders(masParam);
			break;
			case 'mm_ddFillMenuindex':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_ddFillMenuindex(masParam);
			break;
			case 'mm_ddNumericFields':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_ddNumericFields(masParam);
			break;
			case 'ddCustomRule':
				_this.rulesMas[_this.indexParam] = new ddRule_customRule(masParam);
			break;
			case 'mm_ddReadonly':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_ddReadonly(masParam);
			break;
			case 'mm_ddSelectDocuments':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_ddSelectDocuments(masParam);
			break;
			
			case 'mm_ddCreateSection':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_ddCreateSection(masParam);
			break;
			case 'mm_ddMoveFieldsToSection':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_ddMoveFieldsToSection(masParam);
			break;
			case 'mm_hideSections':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_hideSections(masParam);
			break;
			case 'mm_renameSection':
				_this.rulesMas[_this.indexParam] = new ddRule_mm_renameSection(masParam);
			break;
		}
		
		_this.render(_this.indexParam, $group);

		_this.indexParam++;
	},
	
	makeAutocomplete: function($inputs, source){
		$inputs.each(function(){
			var $this = $(this);
			
			$this.next('.autocomplete_show').on('click', function(){
				if ($this.data('ddMultipleInput').autocomplete('widget').is(':visible')){
					$this.trigger('ddMIclose');
				}else{
					$this.trigger('ddMIopen');
				
				}
			});
		});
		
		$inputs.ddMultipleInput({source: source});
	},
	
	//Выводим правила
	render: function(indexRender, $group){
		var _this = this,
			//Формируем html-элемент правила
			$elem = $(_this.rulesMas[indexRender].render()),
			$elemCont = $elem.find('> div'),
			elemWidth = 0;
		
		//Запомним ссылку объект правила
		$elem.data('ddRuleIndex', indexRender);
		//Запомним ссылку на html-элемент правила
		_this.rulesMas[indexRender].html = $elem;

		//Проверяем на наличие группы
//		if (!$group.length){
//			$group = $('.group.default');
//			if ($group.length == 0){
//				$('#new_group').trigger('click', ['default']);
//				$group = $('.group.default');
//			}
//		}
		//Выводим правило
		$elem.appendTo($group);
		
		$elemCont.find('> *:not(".clear")').each(function(){
			elemWidth += $(this).outerWidth(true); 
		});
		
		$elemCont.css({'width': elemWidth});
		
		//TODO: Подумать о переносе нижеследующего куда-то в более общее место, чтобы не вызывалось каждый раз (проблема с newRule, который может вызываться как в цикле при создании, так и при ручном создании)
		//Автозаполнение полей для всех параметров-полей
		_this.makeAutocomplete($elem.find('.input_field'), _this.data.fields);
		//Автозаполнение шаблонов
		_this.makeAutocomplete($elem.find('.select_template'), _this.data.templates);
		//Автозаполнение ролей
		_this.makeAutocomplete($elem.find('.select_role'), _this.data.roles);
		//Ввод только чисел в числовые поля
		$elem.find('.ddParam_integer').ddNumeric({allowFloat: false});
		$elem.find('.ddParam_integerEmpty').ddNumeric({allowFloat: false, allowEmpty: true});
	},
	
	//Сохранение
	save: function(){
		var _this = this,
			//Создаём массив для вывода сохранённых данных
			rulesSave = new Array();
		
		//Перебираем все группы
		$('.group').each(function(){
			var $group = $(this),
				groupName = $group.find('.title span').text();
			
			rulesSave.push('//group ' + groupName);
			
			//Перебираем все формы в текущей группе
			$group.find('form.ruleForm').each(function(){
				var $form = $(this),
					//Запоминаем индекс формы
					indexSave = $form.data('ddRuleIndex');
				
				//Вызываем фукнция сохранения формы 
				rulesSave.push(_this.rulesMas[indexSave].save());
			});
		});
		
		rulesSave.unshift("//group comment_top\n" + $('#comment_top').val());
		rulesSave.push("//group comment_bottom\n" + $('#comment_bottom').val());
		
		return rulesSave;
	},
	
	//Добавляем коментарии в поле
	newComment: function(str, field){
		$('#' + field).val(str);
	}
};
/**end*****Глобальный объект управления правилами*/

//Функция для расширения дочерних функций родительской
function extend(Child, Parent){
	var F = new Function();
	F.prototype = Parent.prototype;
	
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.superclass = Parent.prototype;
}

/**start*****Родительские конструкторы правил*/
//Конструктор родительского класса
function ddRule(name, params){
	//Имя
	this.name = (name && $.type(name) == 'string') ? name : '';
	//Массив с параметрами
	this.params = (params && $.isArray(params)) ? params : new Array();
}

//Рендеринг правила в html
ddRule.prototype.render = function(){
	var outMas = new Array();
	
	//Перебираем параметры, запускаем для них render()
	$.each(this.params, function(key, val){
		outMas[key] = val.render();
	});

	return $.ddTools.parseChunkAssoc(Rules.tpls.ruleForm, {
		className: this.name,
		content: '<span class="fieldName">' + this.name + ': </span>' + outMas.join('')
	});
};

//Сохранение правила в строку
ddRule.prototype.save = function(){
	//Создаем массив со значениями полей
	var outSaveMas = new Array(), html = this.html;
	
	//Вызываем сохранение объекта, передаём ему HTML элемент
	$.each(this.params, function(key, val){
		outSaveMas[key] = val.save(html);
	});
	
	//Формируем строку и возвращаем её
	return this.name + "('" + outSaveMas.join("','") + "');";
};
/**end*****Родительские конструкторы правил*/

/**start*****Классы правил*/
/**start*****Поля*/
//Конструктор класса mm_hideFields 1.1.1
function ddRule_mm_hideFields(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_hideFields.superclass.constructor.apply(this, ['mm_hideFields']);
	
	//mm_hideFields($fields, $roles = '', $templates = '')
	this.params.push(new ddParam_fields(masParam[0]));
	this.params.push(new ddParam_roles(masParam[1]));
	this.params.push(new ddParam_templates(masParam[2]));
}
extend(ddRule_mm_hideFields, ddRule);

//Конструктор класса mm_renameField 1.2
function ddRule_mm_renameField(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_renameField.superclass.constructor.apply(this, ['mm_renameField']);

	//mm_renameField($fields, $newlabel, $roles = '', $templates = '', $newhelp = '')
	this.params.push(new ddParam_fields(masParam[0]));
	this.params.push(new ddParam_input('newLabel', masParam[1], 'New label', '', true));
	this.params.push(new ddParam_roles(masParam[2]));
	this.params.push(new ddParam_templates(masParam[3]));
	this.params.push(new ddParam_input('newHelp', masParam[4], 'New help'));
}
extend(ddRule_mm_renameField, ddRule);

//Конструктор класса mm_requireFields 1.2.2
function ddRule_mm_requireFields(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_requireFields.superclass.constructor.apply(this, ['mm_requireFields']);

	//mm_requireFields($fields, $roles, $templates)
	this.params.push(new ddParam_fields(masParam[0]));
	this.params.push(new ddParam_roles(masParam[1]));
	this.params.push(new ddParam_templates(masParam[2]));
}
extend(ddRule_mm_requireFields, ddRule);

//Конструктор класса mm_default 1.1
function ddRule_mm_default(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_default.superclass.constructor.apply(this, ['mm_default']);
	
	//mm_default($field, $value='', $roles='', $templates='', $eval = false)
	this.params.push(new ddParam_fields(masParam[0]));
	this.params.push(new ddParam_input('value', masParam[1], 'Value'));
	this.params.push(new ddParam_roles(masParam[2]));
	this.params.push(new ddParam_templates(masParam[3]));
	this.params.push(new ddParam_input('eval', masParam[4], 'Eval'));
}
extend(ddRule_mm_default, ddRule);

//Конструктор класса mm_changeFieldHelp 1.1.1
function ddRule_mm_changeFieldHelp(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_changeFieldHelp.superclass.constructor.apply(this, ['mm_changeFieldHelp']);
	
	//mm_changeFieldHelp($field, $helptext = '', $roles = '', $templates = '')
	this.params.push(new ddParam_fields(masParam[0]));
	this.params.push(new ddParam_input('helpText', masParam[1], 'Help text', '', true));
	this.params.push(new ddParam_roles(masParam[2]));
	this.params.push(new ddParam_templates(masParam[3]));
}
extend(ddRule_mm_changeFieldHelp, ddRule);

//Конструктор класса mm_hideTemplates 1.1
function ddRule_mm_hideTemplates(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_hideTemplates.superclass.constructor.apply(this, ['mm_hideTemplates']);

	//mm_hideTemplates($tplIds, $roles, $templates)
	this.params.push(new ddParam_templates(masParam[2], 'Templates Ids'));
	this.params.push(new ddParam_roles(masParam[1]));
	this.params.push(new ddParam_templates(masParam[2]));
}
extend(ddRule_mm_hideTemplates, ddRule);

//Конструктор класса mm_inherit 1.2
function ddRule_mm_inherit(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_inherit.superclass.constructor.apply(this, ['mm_inherit']);

	//mm_inherit($fields, $roles = '', $templates = '')
	this.params.push(new ddParam_fields(masParam[0]));
	this.params.push(new ddParam_roles(masParam[1]));
	this.params.push(new ddParam_templates(masParam[2]));
}
extend(ddRule_mm_inherit, ddRule);

//Конструктор класса mm_synch_fields 1.1
function ddRule_mm_synch_fields(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_synch_fields.superclass.constructor.apply(this, ['mm_synch_fields']);

	//mm_synch_fields($fields, $roles = '', $templates = '')
	this.params.push(new ddParam_fields(masParam[0]));
	this.params.push(new ddParam_roles(masParam[1]));
	this.params.push(new ddParam_templates(masParam[2]));
}
extend(ddRule_mm_synch_fields, ddRule);
/**end*****Поля*/

/**start*****Вкладки*/
//Конструктор класса mm_renameTab 1.1
function ddRule_mm_renameTab(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_renameTab.superclass.constructor.apply(this, ['mm_renameTab']);
	
	//mm_renameTab($tab, $newname, $roles = '', $templates = '')
	this.params.push(new ddParam_input('tab', masParam[0], 'Tab', '', true));
	this.params.push(new ddParam_input('newLabel', masParam[1], 'New label', '', true));
	this.params.push(new ddParam_roles(masParam[2]));
	this.params.push(new ddParam_templates(masParam[3]));
}
extend(ddRule_mm_renameTab, ddRule);

//Конструктор класса mm_hideTabs 1.1
function ddRule_mm_hideTabs(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_hideTabs.superclass.constructor.apply(this, ['mm_hideTabs']);

	//mm_hideTabs($tabs, $roles = '', $templates = '')
	this.params.push(new ddParam_input('tabs', masParam[0], 'Tabs', '', true));
	this.params.push(new ddParam_roles(masParam[1]));
	this.params.push(new ddParam_templates(masParam[2]));
}
extend(ddRule_mm_hideTabs, ddRule);

//Конструктор класса mm_createTab 1.1
function ddRule_mm_createTab(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_createTab.superclass.constructor.apply(this, ['mm_createTab']);
	
	//mm_createTab($name, $id, $roles = '', $templates = '', $intro = '', $width = '680')
	this.params.push(new ddParam_input('nametab', masParam[0], 'Name', '', true));
	this.params.push(new ddParam_input('id', masParam[1], 'Id', '', true));
	this.params.push(new ddParam_roles(masParam[2]));
	this.params.push(new ddParam_templates(masParam[3]));
	this.params.push(new ddParam_input('intro', masParam[4], 'Intro'));
	this.params.push(new ddParam_integer('mmwidth', masParam[5], 'Width', '680', false, true));
}
extend(ddRule_mm_createTab, ddRule);

//Конструктор класса mm_moveFieldsToTab 1.2
function ddRule_mm_moveFieldsToTab(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_moveFieldsToTab.superclass.constructor.apply(this, ['mm_moveFieldsToTab']);

	//mm_moveFieldsToTab($fields, $tabId, $roles = '', $templates = '')
	this.params.push(new ddParam_fields(masParam[0]));
	this.params.push(new ddParam_input('newtab_id', masParam[1], 'New tab id', '', true));
	this.params.push(new ddParam_roles(masParam[2]));
	this.params.push(new ddParam_templates(masParam[3]));
}
extend(ddRule_mm_moveFieldsToTab, ddRule);
/**end*****Вкладки*/

/**start*****Виджеты*/
//Конструктор класса mm_widget_tags 1.1
function ddRule_mm_widget_tags(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_widget_tags.superclass.constructor.apply(this, ['mm_widget_tags']);
	
	//mm_widget_tags($fields, $delimiter = ',', $source = '', $display_count = false, $roles = '', $templates = '')
	this.params.push(new ddParam_fields(masParam[0]));
	this.params.push(new ddParam_input('delimiter', masParam[1], 'Delimiter', ','));
	this.params.push(new ddParam_fields(masParam[0], 'Source', '', false));
	this.params.push(new ddParam_checkbox('display_count', masParam[3], 'Display count'));
	this.params.push(new ddParam_roles(masParam[4]));
	this.params.push(new ddParam_templates(masParam[5]));
}
extend(ddRule_mm_widget_tags, ddRule);

//Конструктор класса mm_widget_showimagetvs 1.1
function ddRule_mm_widget_showimagetvs(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_widget_showimagetvs.superclass.constructor.apply(this, ['mm_widget_showimagetvs']);
	
	//mm_widget_showimagetvs($tvs = '', $w = 300, $h = 100, $thumbnailerUrl = '', $roles = '', $templates = '')
	this.params.push(new ddParam_fields(masParam[0], 'TVs', '', false));
	this.params.push(new ddParam_integer('width', masParam[1], 'Width', '300'));
	this.params.push(new ddParam_integer('height', masParam[2], 'Height', '100'));
	this.params.push(new ddParam_input('thumbnailerUrl', masParam[3], 'Thumbnailer URL'));
	this.params.push(new ddParam_roles(masParam[4]));
	this.params.push(new ddParam_templates(masParam[5]));
}
extend(ddRule_mm_widget_showimagetvs, ddRule);

//Конструктор класса mm_widget_colors 1.1
function ddRule_mm_widget_colors(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_widget_colors.superclass.constructor.apply(this, ['mm_widget_colors']);

	//mm_widget_colors($fields, $default = '#ffffff', $roles = '', $templates = '')
	this.params.push(new ddParam_fields(masParam[0]));
	this.params.push(new ddParam_input('mmdefault', masParam[1], 'Default', '#ffffff', false, 'color'));
	this.params.push(new ddParam_roles(masParam[2]));
	this.params.push(new ddParam_templates(masParam[3]));
}
extend(ddRule_mm_widget_colors, ddRule);

//Конструктор класса mm_widget_accessdenied 1.1
function ddRule_mm_widget_accessdenied(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_widget_accessdenied.superclass.constructor.apply(this, ['mm_widget_accessdenied']);
	
	//mm_widget_accessdenied($ids = '', $message = '', $roles = '')
	this.params.push(new ddParam_input('ids', masParam[0], 'Ids', '', true));
	this.params.push(new ddParam_input('message', masParam[1], 'Message'));
	this.params.push(new ddParam_roles(masParam[2]));
}
extend(ddRule_mm_widget_accessdenied, ddRule);

//Конструктор класса mm_ddMaxLength v1.0.1
function ddRule_mm_ddMaxLength(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_ddMaxLength.superclass.constructor.apply(this, ['mm_ddMaxLength']);
	
	//mm_ddMaxLength($tvs, $roles, $templates, $length)
	this.params.push(new ddParam_fields(masParam[0], 'TVs'));
	this.params.push(new ddParam_roles(masParam[1]));
	this.params.push(new ddParam_templates(masParam[2]));
	this.params.push(new ddParam_integer('mmlength', masParam[3], 'Length', '150'));
}
extend(ddRule_mm_ddMaxLength, ddRule);

//Конструктор класса mm_ddMultipleFields 4.4b
function ddRule_mm_ddMultipleFields(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_ddMultipleFields.superclass.constructor.apply(this, ['mm_ddMultipleFields']);
	
	//mm_ddMultipleFields($tvs = '', $roles = '', $templates = '', $coloumns = 'field', $coloumnsTitle = '', $colWidth = '180', $splY = '||', $splX = '::', $imgW = 300, $imgH = 100, $minRow = 0, $maxRow = 0, $coloumnsData = '')
	this.params.push(new ddParam_fields(masParam[0], 'TVs'));
	this.params.push(new ddParam_roles(masParam[1]));
	this.params.push(new ddParam_templates(masParam[2]));
	this.params.push(new ddParam_input('columns', masParam[3], 'Columns', 'field'));
	this.params.push(new ddParam_input('columnsTitle', masParam[4], 'Column titles'));
	this.params.push(new ddParam_input('colWidth', masParam[5], 'Column widths', '180'));
	this.params.push(new ddParam_input('splY', masParam[6], 'splY', '||', true));
	this.params.push(new ddParam_input('splX', masParam[7], 'splX', '::'));
	this.params.push(new ddParam_integer('imgW', masParam[8], 'imgW', '300'));
	this.params.push(new ddParam_integer('imgH', masParam[9], 'imgH', '100'));
	this.params.push(new ddParam_integer('minRow', masParam[10], 'minRow', '0'));
	this.params.push(new ddParam_integer('maxRow', masParam[11], 'maxRow', '0'));
	this.params.push(new ddParam_input('columnsData', masParam[12], 'СoloumnsData'));
}
extend(ddRule_mm_ddMultipleFields, ddRule);

/*	//Конструктор класса 'mm_ddPatternField'
function ddPatternField(masParam){
	//Запускаем конструктор родителя
	ddPatternField.superclass.constructor.apply(this, ['mm_ddPatternField']);
	
	//mm_ddPatternField($tvs, $roles, $templates, $column, $spl, $width, $splspl)
	this.params.push(new ddParam_fields(masParam[0], 'TVs'));
	this.params.push(new ddParam_roles(masParam[1]));
	this.params.push(new ddParam_templates(masParam[2]));
	this.params.push(new ddParam_input('coloumn', masParam[3], 'Coloumn', '2', true, 'number'));
	this.params.push(new ddParam_input('spl', masParam[4], 'Spl', '||'));
	this.params.push(new ddParam_input('width', masParam[5], 'Width', '100'));
	this.params.push(new ddParam_input('splspl', masParam[6], 'SplSpl', '++'));
}
extend(ddPatternField, ddRule);*/

//Конструктор класса mm_ddGMap 1.1.1
function ddRule_mm_ddGMap(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_ddGMap.superclass.constructor.apply(this, ['mm_ddGMap']);
	
	//mm_ddGMap($tvs, $roles = '', $templates = '', $w = 'auto', $h = '400', $hideField = true)
	this.params.push(new ddParam_fields(masParam[0], 'TVs'));
	this.params.push(new ddParam_roles(masParam[1]));
	this.params.push(new ddParam_templates(masParam[2]));
	this.params.push(new ddParam_input('width', masParam[3], 'Width', 'auto'));
	this.params.push(new ddParam_integer('height', masParam[4], 'Height', '400'));
	this.params.push(new ddParam_checkbox('hideField', masParam[5], 'Hide input', '1'));
}
extend(ddRule_mm_ddGMap, ddRule);

//Конструктор класса mm_ddYMap 1.3.1
function ddRule_mm_ddYMap(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_ddYMap.superclass.constructor.apply(this, ['mm_ddYMap']);
	
	//mm_ddYMap($tvs, $roles = '', $templates = '', $w = 'auto', $h = '400', $hideField = true)
	this.params.push(new ddParam_fields(masParam[0], 'TVs'));
	this.params.push(new ddParam_roles(masParam[1]));
	this.params.push(new ddParam_templates(masParam[2]));
	this.params.push(new ddParam_input('width', masParam[3], 'Width', 'auto'));
	this.params.push(new ddParam_integer('height', masParam[4], 'Height', '400'));
	this.params.push(new ddParam_checkbox('hideField', masParam[5], 'Hide input', '1'));
}
extend(ddRule_mm_ddYMap, ddRule);

//Конструктор класса mm_ddSetFieldValue 1.0.4
function ddRule_mm_ddSetFieldValue(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_ddSetFieldValue.superclass.constructor.apply(this, ['mm_ddSetFieldValue']);
	
	//mm_ddSetFieldValue($field, $value = '', $roles = '', $templates = '')
	this.params.push(new ddParam_fields(masParam[0]));
	this.params.push(new ddParam_input('value', masParam[1], 'Value'));
	this.params.push(new ddParam_roles(masParam[2]));
	this.params.push(new ddParam_templates(masParam[3]));
}
extend(ddRule_mm_ddSetFieldValue, ddRule);

//Конструктор класса mm_ddResizeImage 1.3
function ddRule_mm_ddResizeImage(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_ddResizeImage.superclass.constructor.apply(this, ['mm_ddResizeImage']);
	
	//mm_ddResizeImage($tvs = '', $roles = '', $templates = '', $width = '', $height = '', $cropping = 'crop_resized', $suffix = '_ddthumb', $replaceFieldVal = 0, $background = '#FFFFFF', $multipleField = 0, $colNum = 0, $splY = '||', $splX = '::', $num = 'all', $allowEnlargement = 1)
	this.params.push(new ddParam_fields(masParam[0], 'TVs'));
	this.params.push(new ddParam_roles(masParam[1]));
	this.params.push(new ddParam_templates(masParam[2]));
	this.params.push(new ddParam_integer('width', masParam[3], 'Width', '', false, true));
	this.params.push(new ddParam_integer('height', masParam[4], 'Height', '', false, true));
	this.params.push(new ddParam_select('cropping', masParam[5], 'Cropping', 'crop_resized', new Array({'id': '0', 'name': 'No'}, {'id': '1', 'name': 'Yes'}, {'id': 'crop_resized', 'name': 'Crop resized'}, {'id': 'fill_resized', 'name': 'Fill resized'})));
	this.params.push(new ddParam_input('suffix', masParam[6], 'Suffix', '_ddthumb'));
	this.params.push(new ddParam_checkbox('replaceFieldVal', masParam[7], 'ReplaceFieldVal'));
	this.params.push(new ddParam_input('background', masParam[8], 'Background', '#FFFFFF', false, 'color'));
	this.params.push(new ddParam_checkbox('multipleField', masParam[9], 'MultipleField'));
	this.params.push(new ddParam_integer('colNum', masParam[10], 'ColNum', '0'));
	this.params.push(new ddParam_input('splY', masParam[11], 'SplY', '||'));
	this.params.push(new ddParam_input('splX', masParam[12], 'SplX', '::'));
	this.params.push(new ddParam_input('num', masParam[13], 'Num', 'all'));
	this.params.push(new ddParam_checkbox('allowEnlargement', masParam[14], 'Allow enlargement', '1'));
}
extend(ddRule_mm_ddResizeImage, ddRule);

//Конструктор класса mm_ddAutoFolders 1.0.2
function ddRule_mm_ddAutoFolders(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_ddAutoFolders.superclass.constructor.apply(this, ['mm_ddAutoFolders']);
	
	//mm_ddAutoFolders($ddRoles = '', $ddTemplates = '', $ddParent = '', $ddDateSource = 'pub_date', $ddYearTpl = 0, $ddMonthTpl = 0, $ddYearPub = '0', $ddMonthPub = '0')
	this.params.push(new ddParam_roles(masParam[0]));
	this.params.push(new ddParam_templates(masParam[1]));
	this.params.push(new ddParam_integer('parent', masParam[2], 'Parent', '0', true));
	this.params.push(new ddParam_fields(masParam[3], 'dateSourse', 'pub_date'));
	this.params.push(new ddParam_templates(masParam[4], 'yearTpl', '0'));
	this.params.push(new ddParam_templates(masParam[5], 'monthTpl', '0'));
	this.params.push(new ddParam_checkbox('yearPub', masParam[6]));
	this.params.push(new ddParam_checkbox('monthPub', masParam[7]));
}
extend(ddRule_mm_ddAutoFolders, ddRule);

//Конструктор класса mm_ddFillMenuindex 1.0
function ddRule_mm_ddFillMenuindex(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_ddFillMenuindex.superclass.constructor.apply(this, ['mm_ddFillMenuindex']);
	
	//mm_ddFillMenuindex($parent = '')
	this.params.push(new ddParam_integer('parent', masParam[0], 'Parent', '', false, true));
}
extend(ddRule_mm_ddFillMenuindex, ddRule);

//Конструктор класса mm_ddNumericFields 1.1
function ddRule_mm_ddNumericFields(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_ddNumericFields.superclass.constructor.apply(this, ['mm_ddNumericFields']);
	
	//mm_ddNumericFields($tvs='', $roles='', $templates='', $allowFloat = 1, $decimals = 0)
	this.params.push(new ddParam_fields(masParam[0], 'TVs'));
	this.params.push(new ddParam_roles(masParam[1]));
	this.params.push(new ddParam_templates(masParam[2]));
	this.params.push(new ddParam_checkbox('allowFloat', masParam[3], 'Allow float', '1'));
	this.params.push(new ddParam_integer('decimals', masParam[4], 'Decimals', '0'));
	
}
extend(ddRule_mm_ddNumericFields, ddRule);

//Конструктор класса mm_ddReadonly 1.0
function ddRule_mm_ddReadonly(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_ddReadonly.superclass.constructor.apply(this, ['mm_ddReadonly']);
	
	//mm_ddReadonly($fields = '', $roles = '', $templates = '')
	this.params.push(new ddParam_fields(masParam[0]));
	this.params.push(new ddParam_roles(masParam[1]));
	this.params.push(new ddParam_templates(masParam[2]));
	
}
extend(ddRule_mm_ddReadonly, ddRule);

//Конструктор класса mm_ddSelectDocuments 1.2.1
function ddRule_mm_ddSelectDocuments(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_ddSelectDocuments.superclass.constructor.apply(this, ['mm_ddSelectDocuments']);
	
	//mm_ddSelectDocuments($tvs = '', $roles = '', $templates = '', $parentId, $depth = 1, $filter = '', $max = 0)
	this.params.push(new ddParam_fields(masParam[0], 'TVs'));
	this.params.push(new ddParam_roles(masParam[1]));
	this.params.push(new ddParam_templates(masParam[2]));
	this.params.push(new ddParam_input('parentIds', masParam[3], 'ParentIds', '0', true));
	this.params.push(new ddParam_integer('depth', masParam[4], 'Depth', '1'));
	this.params.push(new ddParam_input('filter', masParam[5], 'Filter'));
	this.params.push(new ddParam_integer('max', masParam[6], 'Max', '0'));
	this.params.push(new ddParam_input('labelMask', masParam[7], 'Label mask', '[+title+] ([+id+])'));
	
}
extend(ddRule_mm_ddSelectDocuments, ddRule);

//Конструктор класса mm_ddCreateSection 1.0
function ddRule_mm_ddCreateSection(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_ddCreateSection.superclass.constructor.apply(this, ['mm_ddCreateSection']);
	
	//mm_ddCreateSection($title, $id, $tabId = 'general', $roles = '', $templates = '')
	this.params.push(new ddParam_input('param_title', masParam[0], 'Title'));
	this.params.push(new ddParam_input('id', masParam[1], 'Id', '', true));
	this.params.push(new ddParam_input('tabId', masParam[2], 'tabId', 'general'));
	this.params.push(new ddParam_roles(masParam[3]));
	this.params.push(new ddParam_templates(masParam[4]));
}
extend(ddRule_mm_ddCreateSection, ddRule);

//Конструктор класса mm_ddMoveFieldsToSection 1.0
function ddRule_mm_ddMoveFieldsToSection(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_ddMoveFieldsToSection.superclass.constructor.apply(this, ['mm_ddMoveFieldsToSection']);
	
	//mm_ddMoveFieldsToSection($fields, $sectionId, $roles = '', $templates = '')
	this.params.push(new ddParam_fields(masParam[0]));
	this.params.push(new ddParam_input('sectionId', masParam[1], 'sectionId', '', true));
	this.params.push(new ddParam_roles(masParam[2]));
	this.params.push(new ddParam_templates(masParam[3]));
}
extend(ddRule_mm_ddMoveFieldsToSection, ddRule);

//Конструктор класса mm_hideSections 1.2
function ddRule_mm_hideSections(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_hideSections.superclass.constructor.apply(this, ['mm_hideSections']);
	
	//mm_hideSections($sections, $roles = '', $templates = '')
	this.params.push(new ddParam_input('sections', masParam[0], 'Sections', '', true));
	this.params.push(new ddParam_roles(masParam[1]));
	this.params.push(new ddParam_templates(masParam[2]));
}
extend(ddRule_mm_hideSections, ddRule);

//Конструктор класса mm_renameSection 1.2
function ddRule_mm_renameSection(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_renameSection.superclass.constructor.apply(this, ['mm_renameSection']);
	
	//mm_renameSection($section, $newname, $roles = '', $templates = '')
	this.params.push(new ddParam_input('section', masParam[0], 'Section', '', true));
	this.params.push(new ddParam_input('newname', masParam[1], 'NewName', '', true));
	this.params.push(new ddParam_roles(masParam[2]));
	this.params.push(new ddParam_templates(masParam[3]));
}
extend(ddRule_mm_renameSection, ddRule);

//Конструктор класса mm_ddHTMLCleaner 1.0.1
function ddRule_mm_ddHTMLCleaner(masParam){
	//Запускаем конструктор родителя
	ddRule_mm_ddHTMLCleaner.superclass.constructor.apply(this, ['mm_ddHTMLCleaner']);
	
	//mm_ddHTMLCleaner($fields, $roles = '', $templates = '', $validAttrsForAllTags = 'title,class', $validStyles = 'word-spacing', $validAttrs = '{"img":"src,alt,width,height","a":"href,target"}')
	this.params.push(new ddParam_fields(masParam[0]));
	this.params.push(new ddParam_roles(masParam[1]));
	this.params.push(new ddParam_templates(masParam[2]));
	this.params.push(new ddParam_input('validAttrsForAllTags', masParam[3], 'validAttrsForAllTags', 'title,class'));
	this.params.push(new ddParam_input('validStyles', masParam[4], 'validStyles', 'word-spacing'));
	this.params.push(new ddParam_input('validAttrs', masParam[5], 'validAttrs', '{&#34;img&#34;:&#34;src,alt,width,height&#34;,&#34;a&#34;:&#34;href,target&#34;}'));
}
extend(ddRule_mm_ddHTMLCleaner, ddRule);

//Конструктор класса ddRule_customRule
function ddRule_customRule(masParam){
	//Запускаем конструктор родителя
	ddRule_customRule.superclass.constructor.apply(this, ['customRule']);
	
	//
	this.params.push(new ddParam_input('ddRule_customRule', masParam[0], ' '));
}
extend(ddRule_customRule, ddRule);

//Сохранение правила в строку
ddRule_customRule.prototype.save = function(){
	//Формируем строку и возвращаем её
	return '/*ddCustomRule*/' + this.params[0].save(this.html);
};
/**end*****Виджеты*/
/**end*****Классы правил*/

/**start*****Классы параметров*/
//Общий класс для всех параметров
function ddParam(className, value, displayName, defaultValue){
	//Имя поля
	this.className = (className && $.type(className) == 'string') ? className : 'param';
	//Уникальный ID (пригодится для поиска и пр)
	this.id = this.className.replace(/\s/g, '') + parseInt(Math.random() * 100000);
	//Название поля
	this.displayName = (displayName && $.type(displayName) == 'string') ? displayName : this.className;
	//Значение по умолчанию
	this.defaultValue = ($.type(defaultValue) != 'undefined') ? defaultValue : '';
	//Значение поля
	this.value = ($.type(value) != 'undefined') ? value : this.defaultValue;
}

//Конструктор общего класса ddParam_input
function ddParam_input(className, value, displayName, defaultValue, required, type, htmlAfter){
	//Запускаем родительский конструктор с необходимыми параметрами
	ddParam_input.superclass.constructor.apply(this, [className, value, displayName, defaultValue]);
	
	if (required){
		this.required = true;
		this.displayName += '*';
	}else{
		//По умолчанию не обязательно для заполнения
		this.required = false;
	}
	
	this.type = (type && $.type(type) == 'string') ? type : 'text';
	this.htmlAfter = (htmlAfter && $.type(htmlAfter) == 'string') ? htmlAfter : '';
}
extend(ddParam_input, ddParam);

ddParam_input.prototype.render = function(){
	var required = this.required ? 'required' : '';
	
	return '<label for="' + this.id + '">' + this.displayName + ': </label><input id="' + this.id + '" class="' + this.className + '" type="' + this.type + '" value="' + this.value + '" ' + required + ' />' + this.htmlAfter;
};

ddParam_input.prototype.save = function(htmlObj){
	return $('#' + this.id, htmlObj).val();
};

//Конструктор общего класса ddParam_integer
function ddParam_integer(className, value, displayName, defaultValue, required, allowEmpty, htmlAfter){
	if (allowEmpty){
		className = (className.length > 0) ? className + ' ddParam_integerEmpty' : 'ddParam_integerEmpty';
	}else{
		className = (className.length > 0) ? className + ' ddParam_integer' : 'ddParam_integer';
	}
	
	//Запускаем родительский конструктор с необходимыми параметрами
	ddParam_integer.superclass.constructor.apply(this, [className, value, displayName, defaultValue, required, 'text', htmlAfter]);
}
extend(ddParam_integer, ddParam_input);

//Конструктор общего класса ddParam_checkbox
function ddParam_checkbox(name, value, displayName, defaultValue){
	//Значение по умолчанию, с ним всё просто
	defaultValue = (defaultValue == '1') ? true : false;
	
	//Если значение не задано, либо задано пустым
	if ($.type(value) == 'undefined' || $.trim(value) == ''){
		//Значит берём значение по умолчанию
		value = defaultValue;
	}else{
		//Если задано, то обрабатываем
		value = (value == '1') ? true : false;
	}
	
	//Запускаем родительский конструктор с необходимыми параметрами
	ddParam_checkbox.superclass.constructor.apply(this, arguments);
}
extend(ddParam_checkbox, ddParam);

ddParam_checkbox.prototype.render = function(){
	var checked = (this.value) ? 'checked' : '';
	
	return '<label for="' + this.id + '">' + this.displayName + ': </label><input id="' + this.id + '" class="' + this.className + '" type="checkbox" ' + checked + ' />';
};

ddParam_checkbox.prototype.save = function(htmlObj){
	return $("#" + this.id, htmlObj).is(':checked') ? '1' : '0';
};

//Конструктор общего класса ddParam_select
function ddParam_select(name, value, displayName, defaultValue, valObj, prefixArr){
	//Запускаем родительский конструктор с необходимыми параметрами
	ddParam_select.superclass.constructor.apply(this, [name, value, displayName, defaultValue]);
	
	//Объект со значениями
	this.valueObject = valObj;
	//Массив префиксов (если необходимо добавлять отрицания или ещё что)
	this.prefixArr = $.isArray(prefixArr) ? prefixArr : new Array('');
}
extend(ddParam_select, ddParam);

ddParam_select.prototype.render = function(){
	//Запоминаем выбранную роль
	var selectRole = this.value;
	//Префиксы для добавления к списку
	var prefixMas = this.prefixArr;
	var selectedRole = '';
	
	//Создаём список
	var outRender = '<label for="' + this.id + '">' + this.displayName + ': </label><select id="' + this.id + '" class="' + this.className + '">';
	//Добавим значение «Все»
	outRender += '<option value="-1">Все</option>';
	
	//Перебираем объект с ролями
	for (var prefix in prefixMas){
		$.each(this.valueObject, function(key, val){
			//Если выбранная роль совпадает с элементом объекта, то делаем роль текущей
			selectedRole = (selectRole == prefixMas[prefix] + val.id ? 'selected="selected"' : '');
			
			outRender += '<option ' + selectedRole + ' value="' + prefixMas[prefix] + val.id + '">' + prefixMas[prefix] + ' ' + val.name + ' (' + val.id + ')</option>';
		});
	}
	
	outRender += '</select>';
	
	return outRender;
};

ddParam_select.prototype.save = function(htmlObj){
	if($('#' + this.id, htmlObj).val() != '-1'){
		return $('#' + this.id, htmlObj).val();
	}else{
		return '';
	}
};

//Конструктор общего класса ddParam_multiple
function ddParam_multiple(className, value, displayName, defaultValue, required){
	
	//Запускаем родительский конструктор с необходимыми параметрами (по умолчанию не обязательно для заполнения)
	ddParam_multiple.superclass.constructor.apply(this, [className, value, displayName, defaultValue, ($.type(required) != 'undefined' && required) ? true : false, null, '<input type="button" value="+" class="autocomplete_show" />']);
}
extend(ddParam_multiple, ddParam_input);

//Конструктор класса Field
function ddParam_fields(value, displayName, defaultValue, required){
	displayName = (displayName && $.type(displayName) == 'string') ? displayName : 'Fields';
	
	//Запускаем родительский конструктор с необходимыми параметрами (по умолчанию обязательно для заполнения)
	ddParam_fields.superclass.constructor.apply(this, ['input_field', value, displayName, defaultValue, ($.type(required) != 'undefined' && !required) ? false : true]);
}
extend(ddParam_fields, ddParam_multiple);

//Конструктор класса ddParam_roles
function ddParam_roles(value, displayName, defaultValue){
	displayName = (displayName && $.type(displayName) == 'string') ? displayName : 'Roles';
	
	ddParam_roles.superclass.constructor.apply(this, ['select_role', value, displayName, defaultValue]);
}
extend(ddParam_roles, ddParam_multiple);

//Конструктор класса ddParam_templates
function ddParam_templates(value, displayName, defaultValue){
	displayName = (displayName && $.type(displayName) == 'string') ? displayName : 'Templates';
	
	ddParam_templates.superclass.constructor.apply(this, ['select_template', value, displayName, defaultValue]);
}
extend(ddParam_templates, ddParam_multiple);
/**end*****Классы параметров*/