$(document).ready(function() {
    jQuery(document).ready(function() {

        jQuery('#register-ui').submit(function() {
            document.getElementById('btn-register').innerHTML = "Loading ...";
            document.getElementById('btn-register').disabled = true;
            controller.show_progress();
            var formJson = $("#register-ui").serializeObject();
            var postData = {
                "email": formJson['email'],
                "password": formJson['password']
            }
            var formData = JSON.stringify(postData);
            $.ajax({
                url: serverURL + "register",
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                async: true,
                data: formData,
                success: function(data, textStatus, xhr) {
                    if (data == "error" || data == "undefined" || data == undefined) {
                        controller.showToastMsg("Something went wrong. Kindly Call 0715804742", "#ff6666")
                        document.getElementById('btn-register').innerHTML = "Register";
                        document.getElementById('btn-register').disabled = false;
                    } else {
                        controller.showToastMsg("Dear " + formJson['email'] + " your account has been successfully created. Wait to be redirected", "#1a5589");
                        setTimeout(function() {
                            $('body').fadeOut('slow', function() {
                                window.location = "login.html"; //redirect to user profile
                            });
                        }, 2000);
                        setTimeout(function() {
                            document.getElementById('btn-register').innerHTML = "Register";
                            document.getElementById('btn-register').disabled = false;
                        }, 4000);
                    }

                },
                fail: function(xhr, textStatus) {
                    controller.showToastMsg("Something went wrong.", "#ff6666")
                    document.getElementById('btn-register').innerHTML = "Register";
                    document.getElementById('btn-register').disabled = false;

                },
                error: function(xhr, textStatus) {
                    controller.showToastMsg("Something went wrong.", "#ff6666")
                    document.getElementById('btn-register').innerHTML = "Register";
                    document.getElementById('btn-register').disabled = false;

                }
            });

        });
    });
    $("#register-ui").submit(function(e) {
        return false;
    });

});

function afterLoad() {
    console.log("page loaded");
}