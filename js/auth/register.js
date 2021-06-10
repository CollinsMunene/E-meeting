$(document).ready(function() {
jQuery(document).ready(function() {

    jQuery('#register-ui').submit(function() {
        document.getElementById('btn-register').innerHTML = "Loading ...";
        document.getElementById('btn-register').disabled = true;
        controller.show_progress();
        var formJson = $("#login-ui").serializeObject();
        var postData = {
            "email": formJson['email'],
            "password": formJson['password']
        }
        var formData = JSON.stringify(postData);
        var url = serverURL + "register";
        var async_status = true;

        controller.request(url, formData, async_status,function(data, status) {
            console.log(status);
            console.log(data);
            if(status = "error"){
                controller.showToastMsg("Something went wrong.","#ff6666")
                document.getElementById('btn-register').innerHTML = "Register";
                document.getElementById('btn-register').disabled = false;
            }else{
                controller.showToastMsg("Dear " + formJson['email']+" your account has been successfully created. Wait to be redirected", "#1a5589");
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