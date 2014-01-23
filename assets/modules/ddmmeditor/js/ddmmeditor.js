/**
 * ddmmeditor.js
 * @version 1.5 (2014-01-23)
 * 
 * @desc Описание класса для работы с правилами.
 * 
 * @copyright 2014, DivanDesign
 * http://www.DivanDesign.biz
 **/

$(function(){
	//Шаблон поля для выбора новых правил
	var newRuleTpl = '<select id="new_role_select" size="25">[+options+]</select>';

	//Спивок создаваемых правил
	var newRuleSelect = new Array(
		{
			label: 'Input restriction',
			values: new Array(
				'mm_ddMaxLength',
				'mm_ddNumericFields',
				'mm_hideTemplates',
				'mm_requireFields',
				'mm_hideFields',
				'mm_ddReadonly'
			)
		},
		{
			label: 'Setting values',
			values: new Array(
				'mm_inherit',
				'mm_default',
				'mm_ddSetFieldValue',
				'mm_synch_fields'
			)
		},
		{
			label: 'Changing of names and help',
			values: new Array(
				'mm_renameField',
				'mm_changeFieldHelp'
			)
		},
		{
			label: 'Input enhancement',
			values: new Array(
				'mm_ddMultipleFields',
				'mm_ddSelectDocuments',
				'mm_widget_tags',
				'mm_widget_colors'
			)
		},
		{
			label: 'Sections',
			values: new Array(
				'mm_ddCreateSection',
				'mm_ddMoveFieldsToSection',
				'mm_hideSections',
				'mm_renameSection'
			)
		},
		{
			label: 'Tabs',
			values: new Array(
				'mm_createTab',
				'mm_moveFieldsToTab',
				'mm_hideTabs',
				'mm_renameTab'
			)
		},
		{
			label: 'Maps',
			values: new Array(
				'mm_ddGMap',
				'mm_ddYMap'
			)
		},
		{
			label: 'Miscellaneous',
			values: new Array(
				'mm_widget_showimagetvs',
				'mm_ddResizeImage',
				'mm_ddAutoFolders',
				'mm_ddFillMenuindex',
				'mm_widget_accessdenied',
				'mm_ddHTMLCleaner',
				'ddCustomRule'
			)
		}
	);

	var newRuleSelectOut = '';

	for (var i = 0, len = newRuleSelect.length; i < len; i++){
		newRuleSelectOut += '<optgroup label="' + newRuleSelect[i].label + '">';
		
		for (var j = 0, jlen = newRuleSelect[i].values.length; j < jlen; j++){
			newRuleSelectOut += '<option>' + newRuleSelect[i].values[j] + '</option>';
		}
		
		newRuleSelectOut += '</optgroup>';
	}
	
	//Блокируем переход по псевдо ссылкам
	$.ddTools.$body.on('click.false', 'a.false', function(event){event.preventDefault();});
	
	//Контейнер, содержащий группы с правилами
	Rules.$rulesCont = $('#rules_cont');
	
	//Создаем массив с правилами
	Rules.constructorRules();
	
	var $ajaxLoader = $('.ajaxLoader'),
		//Добавляем список с правилами
		$newRoleSelect = $($.ddTools.parseChunkAssoc(newRuleTpl, {options: newRuleSelectOut}));
	
	$newRoleSelect.insertAfter('.actionButtons').hide();
	
	//При клике в списке с правилами создаём форму с выбранным правилом
	$newRoleSelect.on('click', function(){
		var $this = $(this);
		
		if ($('.group.default').length == 0){
			$('#new_group').trigger('click', ['default']);
		}
		
		//Создаём в массиве правило
		Rules.newRule($this.find('option:selected').text(), '', $('.group.default'));
		
		//Скрываем список с правилами
		$this.hide();
	}).on('keypress', function(event){
		//Если нажали энтер или пробел
		if (event.keyCode == 13 || event.keyCode == 32){
			$(this).trigger('click');
		}
	});
	
	//Создаём список с новыми правилами
	$('#new_rule a').on('click', function(){
		//Если список ещё не создан, то создаём его
		if($newRoleSelect.is(':hidden')){
			$newRoleSelect.show().trigger('focus');
		}else{
			$newRoleSelect.hide();
		}
		return false;
	});

	//Удаляем форму
	$.ddTools.$body.on('click', 'input.del', function(){
		$(this).parents('form.ruleForm:first').remove();
	});

	//Сохранение файла 
	$('#save_rules a').on('click', function(){
		$ajaxLoader.show();
		
		//Отправляем массив на сервер
		$.ajax({
			url: document.location.href,
			type: 'POST',
			//Подготавливаем массив
			data: {rules: Rules.save()},
			success: function(data){
				$ajaxLoader.hide();
				alert(data);
			}
		});
		
		return false;
	});
	
	var groupSortableOpt = {
		//То, за что мы таскаем
		handle: 'span.fieldName',
		cancel: '.title span',
		//Чтобы между группамиы
		connectWith: '.group',
		cursor: 'n-resize',
		axis: 'y',
		placeholder: "ui-state-highlight",
		//Скорость, с которой элемент встаёт на место после дропа
		revert: 50,
		start: function(event, ui){
			$('.ui-state-highlight').css('height', ui.item.height());
		}
	};
	
	//Создание группы правил
	$('#new_group').on('click', function(event, groupClass){
		var $group = Rules.tpls.$group.clone();
		 
		if (!groupClass){groupClass = '';}
		
		$group.addClass(groupClass);
		$group.appendTo(Rules.$rulesCont);
		
		$group.sortable(groupSortableOpt);
		
		return false;
	});
	
	//Сворачивание группы
	$.ddTools.$body.on('click', '.group:not(.default) .hideButton', function(){
		var $this = $(this),
			$group = $this.parents('.group:first'),
			$forms = $group.find('form');
		
		$forms.animate({
			opacity: 'toggle',
			height: 'toggle'
		});
		
		$forms.promise().done(function(){
			$group.toggleClass('closed');
			$forms.css('display', '');
		});
	});

	//При дабл-клике по имени группы тоже обеспечиваем сворачивание-разворачивание
	$.ddTools.$body.on('dblclick', '.group:not(.default) .title span', function(){
		$(this).parents('.group:first').find('.hideButton').trigger('click');
	});
	
	//Переименование группы
	$.ddTools.$body.on('click', '.group .title .editButton', function(){
		var $title = $(this).siblings('span'),
			name = prompt('Enter the group name', $title.text());
		
		if (name != '' && name != null){
			$title.text(name);
			$title.parents('.group:first').removeClass('default');
		}
		
		return false;
	});
	
	//Удаление группы
	$.ddTools.$body.on('click', '.group .deleteButton', function(){
		var $group = $(this).parents('.group:first');
		
		if (confirm('Do you want delete «' + $group.find('.title span').text() + '» group?')){
			$group.remove();
		}
	});
	
	//Создаём вкладки
	$('#tabs').tabs({
		beforeLoad: function(){return false;},
		load: function(){return false;},
		activate: function(event, ui){
			ui.oldTab.removeClass('selected');
			ui.newTab.addClass('selected');
		}
	});
	
	$('#tabs').find('.tab-row li.tab').on('click', function(){
		$(this).find('a').trigger('click');
	});
	
	//Сортировка групп
	Rules.$rulesCont.sortable({
		handle: 'div.title span',
		cursor: 'n-resize',
		axis: 'y',
		placeholder: "ui-state-highlight",
		start: function(event, ui){
			$('.ui-state-highlight').css('height', ui.item.height());
		}
	});
	
	//Сортировка внутри групп
	Rules.$rulesCont.find('.group').sortable(groupSortableOpt);
});