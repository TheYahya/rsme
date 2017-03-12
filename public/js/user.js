$(document).ready(function(){
	$('#add-number').on('click', function(){
		countNumbers++;
		$('#countNumbers').val(countNumbers);
		var html = '<div class="row" id="rowNumber-'+ countNumbers +'">'+
			'<div class="form-group col-sm-6">'+
			'<label for="numberTitle-'+ countNumbers +'" class="sub">Title</label>'+
			'<input type="text" id="numberTitle-'+ countNumbers +'" name="numberTitle-'+ countNumbers +'" placeholder="title" class="form-control">'+
			'</div><div class="form-group col-sm-6">'+
			'<label for="numberValue-'+ countNumbers +'" class="sub">Number</label>'+
			'<input type="text" id="numberValue-'+ countNumbers +'" name="numberValue-'+ countNumbers +'" placeholder="number" class="form-control">'+
			'</div></div>';
			$('.input-numbers').append(html);
			if(countNumbers >= 10){
				$(this).hide();
			}
	}); 
	$('#add-email').on('click', function(){
		countEmails++;
		$('#countEmails').val(countEmails);
		var html = '<div class="row" id="rowEmails-'+ countEmails +'">'+
			'<div class="form-group col-sm-6">'+
			'<label for="emailTitle-'+ countEmails +'" class="sub">Title</label>'+
			'<input type="text" id="emailTitle-'+ countEmails +'" name="emailTitle-'+ countEmails +'" placeholder="title" class="form-control">'+
			'</div><div class="form-group col-sm-6">'+
			'<label for="emailValue-'+ countEmails +'" class="sub">Email</label>'+
			'<input type="text" id="emailValue-'+ countEmails +'" name="emailValue-'+ countEmails +'" placeholder="email" class="form-control">'+
			'</div></div>';
			$('.input-emails').append(html);
			if(countEmails >= 10){
				$(this).hide();
			}
	}); 
	$('#add-skill').on('click', function(){ 
		countSkills++;
		$('#countSkills').val(countSkills);
		var html = '<div class="row">'+
		'<div class="form-group col-sm-6">'+
		'<label for="skillTitle-'+countSkills+'" class="sub">Title</label>'+
		'<input type="text" id="skillTitle-'+countSkills+'" name="skillTitle-'+countSkills+'" placeholder="title" class="form-control">'+
		'</div><div class="form-group col-sm-6">'+
		'<label for="skillLevel-'+countSkills+'" class="sub">Level</label>'+
		'<span style="color:#999"> (1 ... 10)</span>'+
		'<input type="number" id="skillLevel-'+countSkills+'" name="skillLevel-'+countSkills+'" placeholder="level" class="form-control">'+
		'</div></div>';
			$('.input-skills').append(html);
			if(countEmails >= 50){
				$(this).hide();
			}
	}); 

	$('#form-edit-resume').submit(function(e) {
		e.preventDefault();  
		$('#submiting-message').html('&nbsp;please wait...');
    var $inputs = $('#form-edit-resume :input'); 
    var values = {};
    $inputs.each(function() {
        values[this.name] = $(this).val();
    }); 
    console.log(values);

    var emails = [];
    for(var i=1; i<=countEmails;i++){ 
    	if(values['emailTitle-'+i]=="" && values['emailValue-'+i]==""){
    		continue;
    	}
    	emails.push({
    		title: values['emailTitle-'+i],
    		value: values['emailValue-'+i]
    	});
    }   


    var numbers = [];
    for(var i=1; i<=countNumbers;i++){ 
    	if(values['numberTitle-'+i]=="" && values['numberValue-'+i]==""){
    		continue;
    	}
    	numbers.push({
    		title: values['numberTitle-'+i],
    		value: values['numberValue-'+i]
    	});
    } 
  


    var skills = [];
    for(var i=1; i<=countSkills;i++){ 
    	if(values['skillTitle-'+i]=="" && values['skillLevel-'+i]==""){
    		continue;
    	}
    	skills.push({
    		title: values['skillTitle-'+i],
    		level: values['skillLevel-'+i]
    	});
    } 

    var data = {};
    data.email = values.email;
    data.username = values.username;
    data.fullname = values.fullname;
    data.age = values.age;
    data.bio = values.bio;
    data.websiteTitle = values.websiteTitle;
    data.websiteUrl = values.websiteUrl;
    data.emails = emails;
    data.numbers = numbers;
    data.skills = skills;


    var theUsername = data.username;

    $.ajax({
    	url: '/user/edit',
    	type: 'POST',
    	dataType: 'json',
	    contentType: "application/json",
	    processData: false,
    	data: JSON.stringify(data),
    })
    .done(function() {
    	console.log("success");
    })
    .fail(function() {
    	console.log("error");
    })
    .always(function(data) {
    	console.log("complete");
    	$('#submiting-message').html('&nbsp;&nbsp;&nbsp;&nbsp;<b style="color:green">done</b>. see resume: <a href="/'+theUsername+'">@'+theUsername+'</a>');

    	console.log(data);
    });
    
	});
 
});
 