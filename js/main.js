(function($) {

	"use strict";

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });

})(jQuery);

$(window).on('load', function() {
	setTimeout(function() {
		$('.preloader-backdrop').fadeOut(4000);
		$('body').addClass('has-animation');
	},0);
});
jQuery(document).ready(function() {

	jQuery('#patient_add_form').submit(function() {
		var userObj = JSON.parse(localStorage.getItem("userObj"));
		//serialize the register form data
		var postedFormData = $("#patient_add_form").serializeObject();

		//we create the main object that will store the form values for posting
		var mainDetails = new Object();

		mainDetails.patient_identifier_id = postedFormData.patient_identifier_id;
		mainDetails.patient_age = postedFormData.patient_age;
		mainDetails.patient_gender = postedFormData.patient_gender;
		mainDetails.diagnosis_description = postedFormData.diagnosis_description;
		mainDetails.diagnosis_prescribed_medicine = postedFormData.diagnosis_prescribed_medicine;
		mainDetails.diagnosis_lab_description = postedFormData.diagnosis_lab_description;
		mainDetails.diagnosis_cost= postedFormData.diagnosis_cost;
		mainDetails.diagnosis_date= new Date().toDateString();
		mainDetails.hospital_id = userObj.hospital_id;

		//Stringify the whole object
		var formData = JSON.stringify(mainDetails);

		console.log(formData);
        var url = serverURL +"register/patient";
        var async_status = true;

		$.ajax({
            url: url,
            type: 'POST',
			async: async_status,
            data: formData,
            success: function(data, textStatus, xhr) {
				console.log(data);
				if(data.status == "OK"){
					$('#user_add_modal').modal('hide');
					controller.showToastMsg("Patient Record Added Succesfully","#121288")
				}

            },
            fail: function(xhr, textStatus) {
				console.log(xhr);

            },
            error: function(xhr, textStatus) {
				console.log(xhr);
            }
        });

	})
	$("#patient_add_form").submit(function(e) {
        return false;
    });
})
    // $("#patient_add_form_button").click(function() {
    //     controller.show_progress();
    //     var formJson = $("#patient_add_form").serializeObject();
    //     var formData = JSON.stringify(formJson);
    //     var url = serverURL +"register";
    //     var async_status = true;

    //     controller.request(url, formData, async_status, function(data, status) {
	// 		alert(data);
	// 	})
	// });
