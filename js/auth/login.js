//listen on page load
$(document).ready(function() {

    jQuery(document).ready(function() {

        jQuery('#login-ui').submit(function() {
            document.getElementById('btn-login').innerHTML = "Loading ...";
            document.getElementById('btn-login').disabled = true;
            controller.show_progress();
            var formJson = $("#login-ui").serializeObject();
            var postData = {
                "email": formJson['email'],
                "password": formJson['password']
            }
            var formData = JSON.stringify(postData);
            var url = serverURL + "login";
            var async_status = true;

            controller.request(url, formData, async_status,function(data, status) {
                console.log(status);
                console.log(data);
                var userobj = JSON.stringify(data); // stringify user data 

                var jsonObj = JSON.stringify(data); // stringify user data 
                localStorage.setItem("userObj", jsonObj); // add the json obj to the local storage

                console.log("Usersaved>>>>>>>>>>", localStorage.getItem("userObj"));


                setTimeout(function() {
                    $('body').fadeOut('slow', function() {
                        window.location = "./#app/all_meetings"; //redirect to user profile
                    });
                }, 2000);

                setTimeout(function() {
                    document.getElementById('btn-login').innerHTML = "Log In";
                    document.getElementById('btn-login').disabled = false;
                }, 3000);

            });
        });
    });
    $("#login-ui").submit(function(e) {
        return false;
    });
});
function afterLoad() {
    console.log("page loaded");
}