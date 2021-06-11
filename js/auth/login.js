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
            $.ajax({
                url: serverURL + "login",
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                async: true,
                data: formData,
                success: function(data, textStatus, xhr) {
                    if (data == "error" || data == "undefined" || data == undefined) {
                        controller.showToastMsg("Wrong Email/Password.", "#ff6666");
                        document.getElementById('btn-login').innerHTML = "Log In";
                        document.getElementById('btn-login').disabled = false;
                    } else {
                        var userobj = JSON.stringify(data); // stringify user data 

                        var jsonObj = JSON.stringify(data); // stringify user data 
                        localStorage.setItem("userObj", jsonObj); // add the json obj to the local storage

                        console.log("Usersaved>>>>>>>>>>", localStorage.getItem("userObj"));

                        controller.showToastMsg("Log In successful!, Wait to be redirected.", "#1a5589")
                        setTimeout(function() {
                            $('body').fadeOut('slow', function() {
                                window.location = "./#app/all_meetings"; //redirect to user profile
                            });
                        }, 2000);
                        setTimeout(function() {
                            document.getElementById('btn-login').innerHTML = "Log In";
                            document.getElementById('btn-login').disabled = false;
                        }, 3000);
                    }

                },
                fail: function(xhr, textStatus) {
                    controller.showToastMsg("Wrong Email/Password.", "#ff6666");
                    document.getElementById('btn-login').innerHTML = "Log In";
                    document.getElementById('btn-login').disabled = false;

                },
                error: function(xhr, textStatus) {
                    controller.showToastMsg("Wrong Email/Password.", "#ff6666");
                    document.getElementById('btn-login').innerHTML = "Log In";
                    document.getElementById('btn-login').disabled = false;

                }
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