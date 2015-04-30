$(document).ready(function renderPage(){
if(typeof fleetDB != 'object'){
	dateString = newDateString();
	loadServerData();
}
});

function renderCustomerForm(){
	$('#customer').remove();
	loadCustomer(function catchCustCallback(cust){
		$('<select>').attr({'name':'customer','id':'customer','data-native-menu':'false'}).appendTo('#custForm-a');
    	$('<option>').html('Choose Customer...').appendTo('#customer');
		var len = cust.length;
		for ( var i = 0; i < len; i++){
			$('<option>').attr({'value':cust.item(i).id}).html(cust.item(i).custName).appendTo('#customer')
		}
		
		$('select').selectmenu();
		$('#customer').change(function custBlurEvt(){renderLocation()});
	})
}

function renderLocation(){
	$('#location').remove();
	loadLocation(function catchLocCallback(local){
	    $('<select>').attr({'name':'location','id':'location','data-native-menu':'false'}).appendTo('#custForm-b');
	    $('<option>').html('Chose Location...').appendTo('#location');
		var len = local.length;
		for ( var i = 0; i < len; i++ ){
			$('<option>').attr({'value':local.item(i).id}).html(local.item(i).depotName).appendTo('#location');
		}
		$('select').selectmenu();
		$('#location').change(function custBlurEvt(){renderReg()});
	})
}

function renderReg(){
	$('#reg').remove();
	loadReg(function catchRegCallback(fleet){
		$('<select>').attr({'name':'reg','id':'reg','data-native-menu':'false'}).appendTo('#custForm-c');
	    $('<option>').html('Choose Vehicle...').appendTo('#reg');
		var len = fleet.length;
		for ( var i = 0; i < len; i++){
			$('<option>').attr({'value':fleet.item(i).id}).html(fleet.item(i).reg).appendTo('#reg');
		}
		$('select').selectmenu();
		$('#reg').change(function custBlurEvt(){renderInfo()});
	});
}

function renderInfo(){
	$('#layout').remove();
	$('#wheelPos').remove();
	loadVehicle(function catchVehicleCallback(v){
		$('#detail').html(v.typ+" - "+v.manufact+" "+v.mod+" :- Check Every "+v.checkWeeks+" Weeks")
		loadAxleLayout(function catchAxleCallback(layout){
			$('<select>').attr({'name':'layout','id':'layout','data-native-menu':'false'}).appendTo('#axleCont');
			$('<option>').html('Axle Layout...').appendTo('#layout');
			var len = layout.length;
			for ( var i = 0; i < len; i++){
				$('<option>').attr({'value':layout.item(i).id}).html(layout.item(i).layout).appendTo('#layout');
			}
			$('#axleCont select').val(v.axID);
			$('select').selectmenu();
		});//close  loadAxleLayout()
		loadWheelPos(function catchWheelPosCallback(pos){
			$('<select>').attr({'name':'wheelPos','id':'wheelPos','data-native-menu':'false'}).appendTo('#posCont');
			$('<option>').html('Wheel Position...').appendTo('#wheelPos');
			var len = pos.length;
			for ( var i = 0; i < len; i++){
				$('<option>').attr({'value':pos.item(i).id}).html(pos.item(i).wpName).appendTo('#wheelPos');
			}
			$('select').selectmenu();
			$('#wheelPos').change(function custChangeEvt(){startWheel();});
		});//close loadWheelPos()
	}); //close  loadVehicle()
	  $('#wheelPos').change(function custChangeEvt(){startWheel();});
};

function startWheel(){
	$('#tForm-a').empty()
	$('#tForm-b').empty()
	$('#tForm-c').empty()
	$('<input>').attr({"type":"text", "name":"TD1", "id":"TD1", "placeholder":"TreadDepth1", "tabindex":"1", 'onBlur':'storeDecision()'}).appendTo($('#tForm-a'));
	$('<input>').attr({"type":"text", "name":"TD2", "id":"TD2", "placeholder":"TreadDepth2", "tabindex":"2", 'onBlur':'storeDecision()'}).appendTo($('#tForm-b'));
	$('<input>').attr({"type":"text", "name":"TD3", "id":"TD3", "placeholder":"TreadDepth3", "tabindex":"3", 'onBlur':'storeDecision()'}).appendTo($('#tForm-c'));
	$('<input>').attr({"type":"text", "name":"PSI", "id":"PSI", "placeholder":"PSI", "tabindex":"4", 'onBlur':'storeDecision()'}).appendTo($('#tForm-a'));
	$('<input>').attr({"type":"text", "name":"tyreManfac", "id":"tyreManfac", "placeholder":"Tyre Brand", "tabindex":"5", 'onBlur':'storeDecision()'}).appendTo($('#tForm-b'));
	$('<input>').attr({"type":"text", "name":"tyreS", "id":"tyreS", "placeholder":"Tyre Size", "tabindex":"6", 'onBlur':'storeDecision()'}).appendTo($('#tForm-c'));
	$('<input>').attr({"type":"text", "name":"tyreSN", "id":"tyreSN", "placeholder":"Serial No", "tabindex":"7", 'onBlur':'storeDecision()'}).appendTo($('#tForm-a'));
	$('<div>').attr({'id':'rmWrapper'}).addClass("ui-grid-a").appendTo($('#tForm-b'));
	$('<label>').attr({'for':'isRemould', 'class':'ui-block-a'}).html("Is Remould?").css({'text-align':'center','margin-top':'6px'}).appendTo($('#rmWrapper'));
	$('<select>').attr({'name':'isRemould', 'id':'isRemould', 'data-role':'slider', 'class':'ui-block-b', 'onChange':'storeDecision()'}).appendTo($('#rmWrapper'));
	$('<option>').attr({'value':'1'}).html("Yes").appendTo($('#isRemould'));
	$('<option>').attr({'value':'0', 'selected':'selected'}).html("No").appendTo($('#isRemould'));
	$('<div>').attr({'id':'rgWrapper'}).addClass("ui-grid-a").appendTo($('#tForm-c'));
	$('<label>').attr({'for':'regrooved', 'class':'ui-block-a'}).html("Regrooved?").css({'text-align':'center','margin-top':'6px'}).appendTo($('#rgWrapper'));
	$('<select>').attr({'name':'regrooved', 'id':'regrooved', 'data-role':'slider', 'class':'iu-block-b', 'onChange':'storeDecision()'}).appendTo($('#rgWrapper'));
	$('<option>').attr({'value':'1'}).html("Yes").appendTo($('#regrooved'));
	$('<option>').attr({'value':'0', 'selected':'selected'}).html("No").appendTo($('#regrooved'));
	$('#tForm').trigger("create");
	renderDefectList();
}


function renderDefectList(){
	loadDefectList( function catchDefectListCallback(lst){
		$('#defForm-a').empty();
		$('#defForm-b').empty();
		$('#frmComment').empty();
		var len = lst.length;
		var pos = "a";
		for ( var i = 0; i < len; i++){
			$('#defForm-'+pos).append('<input type="checkbox" name="'+lst.item(i).id+'" id="'+lst.item(i).id+'" onChange="storeDecision()"><label for="'+lst.item(i).id+'">'+lst.item(i).defName+'</label>');
			(pos == "a") ? pos = "b" : pos = "a";
		} // END loop
		$('#frmComment').append('<label for="comment">Comments:</label><textarea name="comment" id="comment"></textarea>')
		$('#defectForm').trigger("create");
		$('#frmComment').trigger("create");
		checkTranCount(function catchCountCallback(val){
			if( val >= 1){
				lookupTrn(function catchLookupCallbback(res){
					if ( res.length >= 1){
						var r = res.item(0);
						$.each(r, function eachRecord(idx, val){
							if(val !== ''){
								if(idx != "defID"){
									if(idx == "isRemould" || idx == "regrooved"){
										$.each($('#'+idx+' option'), function (id, v){
											if($(v).attr("value") == val){
												$(v).attr({"selected":"selected"})
											}
											else{
												$(v).removeAttr("selected");
											}
											
										})
										$('#'+idx).slider("refresh");
									}
									$('#'+idx).val(val);
								} // END if(val !== ''){
								else{
									s = val.substring(1,val.length-1);
									x = s.split(',');
									$.each(x, function checkTheDefects(idx, val){
										$('#'+val).prop('checked', true).checkboxradio('refresh');;
									}) // end $.each >> defect populate
								} // END ELSE
							} // END if(val !== ''){ <<< Check if field content is empty
						}) // end $.each  >> field population
					} // END if ( res.length >= 1){ <<< Check if record exists
				}) // end lookupTrn()
			} // END if( val >= 1){ <<< Check if any records exist
		}) // end TranCount()
	}) // end loadDefectList();
}

function addTrn(){
	addTrnDetail(function(val){
		
	})
}








