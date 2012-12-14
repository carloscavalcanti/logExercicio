function isValidDate(txtDate) { 
  var currVal = txtDate;
  if(currVal == '')
    return false;

  var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
  var dtArray = currVal.match(rxDatePattern); // is format OK?
  if (dtArray == null)
     return false;

  dtDay= dtArray[1];
  dtMonth = dtArray[3];
  dtYear = dtArray[5];
   if (dtMonth < 1 || dtMonth > 12)
      return false;
  else if (dtDay < 1 || dtDay> 31)
      return false;
  else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
      return false;
  else if (dtMonth == 2) {
     var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
     if (dtDay> 29 || (dtDay ==29 && !isleap))
          return false;
  }
  return true;
}
	
function validFields(time, date, type) {
	if (time == "") {
		$('#message-error').css("display", "block");
		$('#message-error').html('Campo <strong>tempo</strong> obrigatorio.');
		return false;
	} if (parseFloat(time.substr(3,2)) >= 60) {
		$('#message-error').css("display", "block");
		$('#message-error').html('Campo <strong>tempo</strong> inválido. O valor dos minutos só poderá ser até "59".');
		return false;
	} else if (date == "") {
		$('#message-error').css("display", "block");
		$('#message-error').html('Campo <strong>data</strong> obrigatorio.');
		return false;
	} else if (!isValidDate(date)) {
		$('#message-error').css("display", "block");
		$('#message-error').html('<strong>Data inválida. Preencha-a corretamente! Formato correto: dd/mm/yyyy.</strong>');
		return false;
	} else {
		return true;
	}
}