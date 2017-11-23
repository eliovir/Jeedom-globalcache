$("#table_cmd").sortable({axis: "y", cursor: "move", items: ".cmd", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});
/*$('body').on('keyup','.cmdAttr[data-l1key=configuration][data-l2key=value]',function(){
	var codage=$('.cmdAttr[data-l1key=configuration][data-l2key=codage]').val();
	switch(codage){
		case 'HEXA':
			var valeur=$(this).val();  
			valeur=valeur.replace("  ", " ");
			if(valeur.substr(-1,1) != " " && valeur.substr(-2,1) != " ")
				valeur=valeur + " ";
			$(this).val(valeur);
		break;
	}
});*/
 $('.changeIncludeState').on('click', function () {
	var mode = $(this).attr('data-mode');
	var state = $(this).attr('data-state');
	changeIncludeState(state, mode);
});
$('body').on('globalcache::includeState', function (_event,_options) {
	if (_options['mode'] == 'learn') {
		if (_options['state'] == 1) {
			if($('.include').attr('data-state') != 0){
				$.hideAlert();
				$('.include:not(.card)').removeClass('btn-default').addClass('btn-success');
				$('.include').attr('data-state', 0);
				$('.include.card').css('background-color','#8000FF');
				$('.include.card span center').text('{{Arrêter le scan}}');
				$('.includeicon').empty().append('<i class="fa fa-spinner fa-pulse" style="font-size : 6em;color:#94ca02;"></i>');
				$('#div_inclusionAlert').showAlert({message: '{{Vous êtes en mode scan. Recliquez sur le bouton scan pour sortir de ce mode (sinon le mode restera actif une minute)}}', level: 'warning'});
			}
		} else {
			if($('.include').attr('data-state') != 1){
				$.hideAlert();
				$('.include:not(.card)').addClass('btn-default').removeClass('btn-success btn-danger');
				$('.include').attr('data-state', 1);
				$('.includeicon').empty().append('<i class="fa fa-bullseye" style="font-size : 6em;color:#94ca02;"></i>');
				$('.include.card span center').text('{{Lancer Scan}}');
				$('.include.card').css('background-color','#ffffff');
			}
		}
	}
});

$('body').on('globalcache::includeDevice', function (_event,_options) {
    if (modifyWithoutSave) {
        $('#div_inclusionAlert').showAlert({message: '{{Un périphérique vient d\'être inclu/exclu. Veuillez réactualiser la page}}', level: 'warning'});
    } else {
        if (_options == '') {
            window.location.reload();
        } else {
            window.location.href = 'index.php?v=d&p=globalcache&m=globalcache&id=' + _options;
        }
    }
});


function changeIncludeState(_state,_mode,_type='') {
    $.ajax({// fonction permettant de faire de l'ajax
        type: "POST", // methode de transmission des données au fichier php
        url: "plugins/globalcache/core/ajax/globalcache.ajax.php", // url du fichier php
        data: {
            action: "changeIncludeState",
            state: _state,
            mode: _mode,
        },
        dataType: 'json',
        error: function (request, status, error) {
            handleAjaxError(request, status, error);
        },
        success: function (data) { // si l'appel a bien fonctionné
        if (data.state != 'ok') {
            $('#div_alert').showAlert({message: data.result, level: 'danger'});
            return;
        }
    }
});
}
$('body').on('change','.eqLogicAttr[data-l1key=configuration][data-l2key=type]',function(){
	//Ajout des parametre de configuration spécific a chaque type
	var paramerter=$(this).closest('.form-horizontal').find('.EquipementParameter');
	$('.cmdAttr[data-l1key=configuration][data-l2key=codage]').show(); 
	$('.cmdAttr[data-l1key=configuration][data-l2key=CR]').parent().show(); 
	$('.cmdAttr[data-l1key=configuration][data-l2key=LF]').parent().show(); 
	$('.cmdAttr[data-l1key=configuration][data-l2key=reponse]').parent().show(); 
	paramerter.html('');
	switch($(this).val()){
	       case 'ir':
			paramerter.append($('<div class="form-group">')
				.append($('<label class="col-sm-2 control-label" >')
					.text('{{Mode de transmission}}')
					.append($('<sup>')
						.append($('<i class="fa fa-question-circle tooltips" title="Séléctionner le mode de transmission infro-rouge" style="font-size :1em;color:grey;">'))))
				.append($('<div class="col-sm-9">')
					.append($('<select class="eqLogicAttr form-control input-sm" data-l1key="configuration" data-l2key="mode">')
						.append($('<option>').attr('value','IR').text('IR'))
						.append($('<option>').attr('value','SENSOR').text('SENSOR'))
						.append($('<option>').attr('value','SENSOR_NOTIFY').text('SENSOR_NOTIFY'))
						.append($('<option>').attr('value','IR_NOCARRIER').text('IR_NOCARRIER')))));
			$('.cmdAttr[data-l1key=configuration][data-l2key=codage]').val('DEC').hide(); 
			$('.cmdAttr[data-l1key=configuration][data-l2key=CR]').parent().hide(); 
			$('.cmdAttr[data-l1key=configuration][data-l2key=LF]').parent().hide(); 
			$('.cmdAttr[data-l1key=configuration][data-l2key=reponse]').parent().hide(); 
		break;
		case 'serial':
			paramerter.append($('<div class="form-group">')
				.append($('<label class="col-sm-2 control-label" >')
					.text('{{Baudrate}}')
					.append($('<sup>')
						.append($('<i class="fa fa-question-circle tooltips" title="Séléctionner le baudrate de la connexion" style="font-size :1em;color:grey;">'))))
				.append($('<div class="col-sm-9">')
					.append($('<select class="eqLogicAttr form-control input-sm" data-l1key="configuration" data-l2key="baudrate">')
						.append($('<option>').attr('value','1200').text('1200'))
						.append($('<option>').attr('value','2400').text('2400'))
						.append($('<option>').attr('value','4800').text('4800'))
						.append($('<option>').attr('value','9600').text('9600'))
						.append($('<option>').attr('value','19200').text('19200'))
						.append($('<option>').attr('value','38400').text('38400'))
						.append($('<option>').attr('value','57600').text('57600')))));	
			paramerter.append($('<div class="form-group">')
				.append($('<label class="col-sm-2 control-label" >')
					.text('{{Type de control de flux}}')
					.append($('<sup>')
						.append($('<i class="fa fa-question-circle tooltips" title="Séléctionner le type de control de flux de la connexion" style="font-size :1em;color:grey;">'))))
				.append($('<div class="col-sm-9">')
				.append($('<select class="eqLogicAttr form-control input-sm" data-l1key="configuration" data-l2key="flowcontrol">')
					.append($('<option>').attr('value','FLOW_HARDWARE').text('FLOW_HARDWARE'))
					.append($('<option>').attr('value','FLOW_NONE').text('FLOW_NONE')))));
			paramerter.append($('<div class="form-group">')
				.append($('<label class="col-sm-2 control-label" >')
					.text('{{Parité}}')
					.append($('<sup>')
						.append($('<i class="fa fa-question-circle tooltips" title="Séléctionner la parité de la connexion" style="font-size :1em;color:grey;">'))))
				.append($('<div class="col-sm-9">')
					.append($('<select class="eqLogicAttr form-control input-sm" data-l1key="configuration" data-l2key="parity">')
						.append($('<option>').attr('value','PARITY_NO').text('PARITY_NO'))
						.append($('<option>').attr('value','PARITY_ODD').text('PARITY_ODD'))
						.append($('<option>').attr('value','PARITY_EVEN').text('PARITY_EVEN')))));
		break;
	}
});
function addCmdToTable(_cmd) {
	if (!isset(_cmd)) {
		var _cmd = {configuration: {}};
	}
	var tr =$('<tr class="cmd" data-cmd_id="' + init(_cmd.id) + '">');
  	tr.append($('<td>')
		.append($('<i class="fa fa-minus-circle pull-right cmdAction cursor" data-action="remove">'))
		.append($('<i class="fa fa-arrows-v pull-left cursor bt_sortable" style="margin-top: 9px;">')));
	tr.append($('<td>')
			.append($('<input type="hidden" class="cmdAttr form-control input-sm" data-l1key="id">'))
			.append($('<input class="cmdAttr form-control input-sm" data-l1key="name" value="' + init(_cmd.name) + '" placeholder="{{Name}}" title="Name">')));
	var td=$('<td>');
	if($('.eqLogicAttr[data-l1key=configuration][data-l2key=type]').val() != 'ir'){			
		td.append($('<div>')
			.append($('<label>')
				.text('{{Codage}}')
				.append($('<sup>')
					.append($('<i class="fa fa-question-circle tooltips" title="Séléctionner le type de codage" style="font-size :1em;color:grey;">'))))
			.append($('<div>')
				.append($('<select class="cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="codage">')
				.append($('<option>').attr('value','ASCII').text('ASCII'))
				.append($('<option>').attr('value','DEC').text('DEC'))
					.append($('<option>').attr('value','HEXA').text('HEXA')))));
	}
	td.append($('<div>')
		.append($('<label >')
			.text('{{Valeur}}')
			.append($('<sup>')
				.append($('<i class="fa fa-question-circle tooltips" style="font-size : 1em;color:grey;">')
				.attr('title','Saisisser la valeur par defaut de votre commande'))))
		.append($('<div>')
			.append($('<textarea class="cmdAttr" data-l1key="configuration" data-l2key="value" style="margin: 0px; width: 500px; height: 95px;">'))));
	td.append($('<div>')
		.append($('<label class="checkbox-inline">')
			.append($('<input type="checkbox" class="cmdAttr" data-l1key="configuration" data-l2key="CR" checked>'))
			.append('{{Retour à la ligne}}'))
		.append($('<label class="checkbox-inline">')
			.append($('<input type="checkbox" class="cmdAttr" data-l1key="configuration" data-l2key="LF" checked>'))
			.append('{{Fin de ligne}}')));
	tr.append(td);	
	tr.append($('<td>')	
		.append($('<div class="parametre">')
			.append($('<span class="type" type="' + init(_cmd.type) + '">')
				.append(jeedom.cmd.availableType()))
			.append($('<span class="subType" subType="'+init(_cmd.subType)+'">'))));
	var parmetre=$('<td>');
	parmetre.append($('<label class="checkbox-inline">')
	      .append($('<input type="checkbox" class="cmdAttr" data-l1key="configuration" data-l2key="reponse">'))
	      .append('{{Attendre la réponse}}'));
	if (is_numeric(_cmd.id)) {
		parmetre.append($('<a class="btn btn-default btn-xs cmdAction" data-action="test">')
			.append($('<i class="fa fa-rss">')
				.text('{{Tester}}')));
	}
	parmetre.append($('<a class="btn btn-default btn-xs cmdAction tooltips" data-action="configure">')
		.append($('<i class="fa fa-cogs">')));
	parmetre.append($('<a class="btn btn-default btn-xs cmdAction tooltips" data-action="copy" title="{{Dupliquer}}">')
		.append($('<i class="fa fa-files-o">')));
	parmetre.append($('<div>')
		.append($('<span>')
			.append($('<label class="checkbox-inline">')
				.append($('<input type="checkbox" class="cmdAttr checkbox-inline" data-size="mini" data-label-text="{{Historiser}}" data-l1key="isHistorized" checked/>'))
				.append('{{Historiser}}')
				.append($('<sup>')
					.append($('<i class="fa fa-question-circle tooltips" style="font-size : 1em;color:grey;">')
					.attr('title','Souhaitez vous Historiser les changements de valeur'))))));
	parmetre.append($('<span>')
			.append($('<label class="checkbox-inline">')
				.append($('<input type="checkbox" class="cmdAttr checkbox-inline" data-size="mini" data-label-text="{{Afficher}}" data-l1key="isVisible" checked/>'))
				.append('{{Afficher}}')
				.append($('<sup>')
					.append($('<i class="fa fa-question-circle tooltips" style="font-size : 1em;color:grey;">')
					.attr('title','Souhaitez vous afficher cette commande sur le dashboard')))));
	tr.append(parmetre);
	$('#table_cmd tbody').append(tr);
	$('#table_cmd tbody tr:last').setValues(_cmd, '.cmdAttr');
	jeedom.cmd.changeType($('#table_cmd tbody tr:last'), init(_cmd.subType));
 	$('.eqLogicAttr[data-l1key=configuration][data-l2key=type]').trigger('change');
 	getMonitor($('.eqLogicAttr[data-l1key=id]').val());
}
function getMonitor(id) {
	$.ajax({
		type: 'POST',
	async: false,
	url: 'plugins/globalcache/core/ajax/globalcache.ajax.php',
		data: {
			action: 'getCacheMonitor',
			id:id
		},
		dataType: 'json',
		global: false,
		error: function(request, status, error) {
			setTimeout(function() {
				getMonitor(id)
			}, 100);
		},
		success: function(data) {
			if (data.state != 'ok') {
				$('#div_alert').showAlert({message: data.result, level: 'danger'});
				return;
			}
			$('#table_Monitor tbody').html('');
			if(data.result != false){
			var monitors=jQuery.parseJSON(data.result);
			jQuery.each(monitors.reverse(),function(key, value) {
			  $('#table_Monitor tbody').append($("<tr>")
					.append($("<td>").text(value.datetime))
					.append($("<td>").text(value.sense))
					.append($("<td>").text(value.monitor)));
			});				
			$('#table_Monitor').trigger('update');
            }
			if ($('#md_modal').dialog('isOpen') === true) {
				setTimeout(function() {
					getMonitor(id)
				}, 100);
			}
		}
	});
}		   
