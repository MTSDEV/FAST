function loadServerData(){
	$.ajax({
		url:"http://192.168.99.33/fleetApp/server/webApp_iniFL.php",
		type:"GET",
		success:function fireDBLoad(data){
			makeTables();
			loadDB(data);
		
		},
		failure:function firefailMessage(e){
			console.log(e);
		}
	});
}

function makeTables(){
	fleetDB = openDatabase('xfleet', '1.0', "Fleet Customer Details", 5*1024*1024);
	fleetDB.transaction(function(trx){
		trx.executeSql('DROP TABLE IF EXISTS customer',[]);
	});
	fleetDB.transaction(function(trx){
		trx.executeSql('DROP TABLE IF EXISTS custDepot',[]);
	})
	fleetDB.transaction(function(trx){
		trx.executeSql('DROP TABLE IF EXISTS wheelPos'),[];
	})
	fleetDB.transaction(function(trx){
		trx.executeSql('DROP TABLE IF EXISTS axleLayout',[]);
	})
	fleetDB.transaction(function(trx){
		trx.executeSql('DROP TABLE IF EXISTS defects',[]);
	})
	fleetDB.transaction(function(trx){
		trx.executeSql('DROP TABLE IF EXISTS fleetList',[]);
	})
	fleetDB.transaction(function(trx){
		trx.executeSql('DROP TABLE IF EXISTS tyreManfac',[]);
	})
	fleetDB.transaction(function(trx){
		trx.executeSql('DROP TABLE IF EXISTS transac',[]);
	})
	fleetDB.transaction(function(ct){
		ct.executeSql('CREATE TABLE customer(id text primary key, custName text)',[]);
	})
	fleetDB.transaction(function(ct){
		ct.executeSql('CREATE TABLE custDepot(id text primary key, custID text, depotName text, addr1 text, pcode text, priMail text, autoup integer)',[]);
	})
	fleetDB.transaction(function(ct){	
		ct.executeSql('CREATE TABLE wheelPos(id text primary key, wpName text)',[]);
	})
	fleetDB.transaction(function(ct){	
		ct.executeSql('CREATE TABLE axleLayout(id integer primary key, layout text)',[]);
	})
	fleetDB.transaction(function(ct){	
		ct.executeSql('CREATE TABLE defects(id integer primary key, defCat text, defName text)',[]);
	})
	fleetDB.transaction(function(ct){	
		ct.executeSql('CREATE TABLE tyreManfac(id text primary key, mfName text)',[]);
	})
	fleetDB.transaction(function(ct){	
		ct.executeSql('CREATE TABLE fleetList(id integer primary key, custID, fleetID, reg, checkWeeks, manufact text, typ, mod, tyreS, axID, department, depotID integer)',[]);
	})
	fleetDB.transaction(function(ct){
		ct.executeSql('CREATE TABLE transac(id integer primary key, vID integer, wpID text, lastCheck text, tyreS text, tyreManfac text, tyreSN text, TD1 integer, TD2 integer, TD3 integer, PSI integer, isRemould bit, regrooved bit, defID integer, comment text)',[]);
	});

}

function loadDB(data){
	var d = JSON.parse(data);
	cust = d.customer;
	depots = d.custDepot;
	positions = d.wheelPos;
	layouts = d.layouts;
	defects = d.defects;
	brands = d.brands;
	fleet = d.fleetVehicles

	fleetDB.transaction(function(tr){		
		$.each(cust, function(idx, val){
			tr.executeSql('INSERT INTO customer (id, custName) VALUES (?,?)',[val.custID, val.cName]);
		})
		$.each(depots, function(idx, val){
			tr.executeSql('INSERT INTO custDepot (id, custID, depotName, addr1, pcode, priMail, autoup) VALUES (?,?,?,?,?,?,?)',[val.depotID, val.custID, val.depotName, val.addr1, val.pcode, val.priMail, val.autoUpdate]);
		})
		$.each(positions, function(idx, val){
			tr.executeSql('INSERT INTO wheelPos (id, wpName) VALUES (?,?)',[val.wpID, val.wpName]);
		})
		$.each(layouts, function(idx, val){
			tr.executeSql('INSERT INTO axleLayout (id, layout) VALUES (?,?)',[val.axID, val.layout]);
		})
		$.each(defects, function(idx, val){
			tr.executeSql('INSERT INTO defects (id, defCat, defName) VALUES (?,?,?)',[val.defID, val.catagory, val.defect]);
		})
		$.each(brands, function(idx, val){
			tr.executeSql('INSERT INTO tyreManfac (id, mfName) VALUES (?,?)',[val.mfID, val.mfName]);
		})
		$.each(fleet, function(idx, val){
			tr.executeSql('INSERT INTO fleetList (id, custID, fleetID, reg, checkWeeks, manufact, typ, mod, tyreS, axID, department, depotID) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',[val.vID, val.cID, val.fleetID, val.regNo, val.checkWeeks, val.vManfact, val.vType, val.vModel, val.tyreSize, val.axID, val.department, val.depotID]);
		})
	})
}

function loadCustomer(callback){
	fleetDB.transaction(function selCustData(tx){
		tx.executeSql('SELECT * FROM customer',[], function selectCustomers(tx, rs){
			callback(rs.rows);
		})
	})
}

function loadLocation(callback){
	var customer = $('#customer').val();
	fleetDB.transaction(function selLocData(tx){
		tx.executeSql('Select id, depotName FROM custDepot WHERE custID = ? GROUP BY depotName',[customer], function selectCustomers(tx, rs){
			callback(rs.rows);
		})
	})
}

function loadReg(callback){
	var ls= 'Select id, reg FROM fleetList WHERE depotID IN ('+$('#location').val()+')';
	fleetDB.transaction(function selRegData(tx){
		tx.executeSql(ls,[], function selectCustomers(tx, rs){
			callback(rs.rows);
		})
	})
}

function loadVehicle(callback){
	fleetDB.transaction(function selVehicleData(tx){
		tx.executeSql('SELECT id, typ, manufact,mod,checkWeeks,axID FROM fleetList WHERE id = ? ',[$('#reg').val()], function selectCustomers(tx, rs){
			callback(rs.rows.item(0));
		})
	})
}

function loadAxleLayout(callback){
	fleetDB.transaction(function selCustData(tx){
		tx.executeSql('SELECT * FROM axleLayout',[], function selectCustomers(tx, rs){
			callback(rs.rows);
		})
	})
}

function loadWheelPos(callback){
	fleetDB.transaction(function selCustData(tx){
		tx.executeSql('SELECT * FROM wheelPos',[], function selectCustomers(tx, rs){
			callback(rs.rows);
		})
	})
}

function loadDefectList(callback){
	fleetDB.transaction(function selCustData(tx){
		tx.executeSql('SELECT * FROM defects',[], function selectDefects(tx, rs){
			callback(rs.rows);
		})
	})
}

function checkTranCount(callback){
	fleetDB.transaction(function countTran(tx){
		tx.executeSql('Select Count(*) tranCount FROM transac',[],function getTrnCount(tx, rs){
			callback(rs.rows.item(0).tranCount);
		},
		function catchError(tx, e){
		})
	})
}

function lookupTrn(callback){
	fleetDB.transaction(function lookupTrn(tx){
		var reg = $('#reg').val();
		var pos = $('#wheelPos').val();
		tx.executeSql('SELECT vID, tyreS, tyreManfac, tyreSN, TD1, TD2, TD3, PSI, isRemould, regrooved, defID, comment FROM transac WHERE vID = ? and wpID = ?', [reg, pos], function getLookupVals(tx, rs){
			callback(rs.rows);
		})
	})
}

function addTrnDetail(callback){
	fleetDB.transaction(function newTrn(tx){
		dt = newDateString();
		var inVars={
			'vID':$('#reg').val(),
			'wpID':$('#wheelPos').val(),
			'tyreS':$('#tyreS').val(),
			'tyreManfac':$('#tyreManfac').val(),
			'tyreSN':$('#tyreSN').val(),
			'TD1':$('#TD1').val(),
			'TD2':$('#TD2').val(),
			'TD3':$('#TD3').val(),
			'PSI':$('#PSI').val(),
			'isRemould':$('#isRemould').val(),
			'regrooved':$('#regrooved').val(),
			'defID':grabActiveDefects(),
			'comment':$('#comment').val()
		};
		// (5,1,'2015-04-16','215/55r16','Bridgestone','bs25445',12,14,12,32,0,0,'[6,14,16]','TEST')
		tx.executeSql('INSERT INTO transac(vID, wpID, lastCheck, tyreS, tyreManfac, tyreSN, TD1, TD2, TD3, PSI, isRemould, regrooved, defID, comment) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
		[inVars.vID, inVars.wpID, dt, inVars.tyreS, inVars.tyreManfac, inVars.tyreSN, inVars.TD1, inVars.TD2, inVars.TD3, inVars.PSI, inVars.isRemould, inVars.regrooved, inVars.defID, inVars.comment],
		function reultNewTrn(tx, rs){
			callback(rs)
		})
	})
}

function updateTrnDetail(callback){
	fleetDB.transaction(function newTrn(tx){
		var inVars={
			'vID':$('#reg').val(),
			'wpID':$('#wheelPos').val(),
			'tyreS':$('#tyreS').val(),
			'tyreManfac':$('#tyreManfac').val(),
			'tyreSN':$('#tyreSN').val(),
			'TD1':$('#TD1').val(),
			'TD2':$('#TD2').val(),
			'TD3':$('#TD3').val(),
			'PSI':$('#PSI').val(),
			'isRemould':$('#isRemould').val(),
			'regrooved':$('#regrooved').val(),
			'defID':grabActiveDefects(),
			'comment':$('#comment').val()
		};
		tx.executeSql('UPDATE transac SET tyreS=?, tyreManfac=?, tyreSN=?, TD1=?, TD2=?, TD3=?, PSI=?, isRemould=?, regrooved=?, defID=?, comment=? WHERE vID = ? AND wpID = ?',
		[inVars.tyreS, inVars.tyreManfac, inVars.tyreSN, inVars.TD1, inVars.TD2, inVars.TD3, inVars.PSI, inVars.isRemould, inVars.regrooved, inVars.defID, inVars.comment, inVars.vID, inVars.wpID],
		function reultUpdTrn(tx, rs){
			callback(rs)
		},
		function onError(tx, e){
			console.log(e);
		})
	})
}

function storeDecision(){
	 checkTranCount(function getCount(i){
		if(i >= 1){
			lookupTrn(function checkRecord(row){
				if ( row.length >= 1){
					updateTrnDetail(function catchcallback(){
					});
				} // END if ( res.length >= 1){ <<< Check if record exists
				else{
					addTrnDetail(function catchCallbeck(){
					})
				}
			})
		}
		else{
			addTrnDetail(function catchCallback(){
			})
		}
	})
}



function grabActiveDefects(){
	var def = [];
	$.each($('#defectForm :checked'), function getDefVals(id, val){
		def.push(val.id)
	})
	var rDef = '[';
	rDef += def.join(',');
	rDef +=']';
	return rDef;
}



function newDateString(){
	var dt = new Date();
	var d = dt.getDate();
	(d.toString().length == 1) ? d = '0'+d.toString() : d = d.toString();
	var m = dt.getMonth();
	(m.toString().length == 1) ? m = '0'+m.toString() : m = m.toString();
	var y = dt.getFullYear();
	var dateString = y+"-"+m+"-"+d;
	return dateString;
}