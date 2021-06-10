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
            document.getElementById('btn-register').innerHTML = "Register";
            document.getElementById('btn-register').disabled = false;

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