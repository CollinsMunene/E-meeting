$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

const publicPages = [];
var serverURL = "http://127.0.0.1:8000/";
// var serverURL = "https://coseke-emeeting-backend.herokuapp.com/"


var setupObj = [];
var allFormObj = [];
var controller = {
    init: function(formObj) {

        //Get form Obj
        this.myFormObj = formObj;
        //relation objects    	   	
        console.log("Controller Init");
        var winObj = controller.getWindowURLObject();
        this.windowId = winObj[winObj.length - 1];
        this.pageName = winObj[winObj.length - 2];
    },

    index: function(ctx) {
        console.log(ctx.canonicalPath);
        var url = ctx.canonicalPath;
        var page = controller.getSecondPart(url);
        page_2 = controller.getThirdPart(url);
        var n = publicPages.includes(page_2);
        console.log(n);
        if (n) {
            console.log("public page is " + n);
            urlPage = "shared";
        } else {
            console.log(page);
            urlPage = page;
        }
        window.page = page;
        var http = new XMLHttpRequest();

        http.open('HEAD', "html/app/main.html", false);
        http.send();
        if (http.status != 404) {
            $(".content-wrapper").load("html/app/main.html", function() {
                //load page js script
                jQuery.loadScript = function(url, callback) {
                    jQuery.ajax({
                        url: url,
                        dataType: 'script',
                        success: callback,
                        async: true
                    });
                };

                if (typeof someObject == 'undefined') $.loadScript("js/app/" + page_2 + ".js", function() {
                    //Stuff to do after someScript has loaded
                    $(".headerTitle").html(formObj.title);
                });
            });
        }
    },
    initializeTabs: function() {
        //attach click action to tab
        $('ul.nav li').click(function() {

            //hide lines
            $(".crud_section_lines").hide();

            var activeTab = $(this).attr("data-tab");
            var currentTabPos = $(this).attr("tab-position");

            var previousTabPos = 0;
            var highestAccessedTab = 0;
            var formObj_ = allFormObj[activeTab];

            console.log("Active tab", activeTab);
            console.log("Active tab", formObj_);

            //get previous tab position
            try {
                previousTabPos = allFormObj["previousTabPos"];
                if (previousTabPos == undefined || previousTabPos == "undefined") {
                    allFormObj["previousTabPos"] = 0;
                    previousTabPos = 0;
                }
            } catch (e) {
                allFormObj["previousTabPos"] = 0;
                previousTabPos = 0;
            }

            //get highest accessed tab	    			    		  
            try {
                highestAccessedTab = allFormObj["highestAccessedTab"];
            } catch (e) {

            }
            //check to see if clicked tab has child table

            if (formObj_.url_id == 'tab') {

                var formLinkToName = formObj_["parentName"];
                var formLinkTo = formObj_["parentID"];
                var formLinkFrom = formObj_["linkID"];
                var targetId = formObj_["targetId"];
                var parentPosition = 0;
                try {
                    parentPosition = formObj_.parentPosition;
                    if (parentPosition == "undefined" || parentPosition == undefined) {
                        parentPosition = 0;
                    }
                } catch (e) {

                }
                console.log(formObj_);
                console.log(parentPosition);
                if (parentPosition == 0) {
                    selectedObj = allFormObj["parent_selected"];
                } else {
                    selectedObj = allFormObj["tab_" + formLinkToName];
                }

                console.log("Selected Obj ", formLinkToName);
                console.log("Selected Obj ", selectedObj);

                //get selected parent id
                try {
                    console.log('activeTab', activeTab);
                    selectParentID = selectedObj[formLinkTo];

                    selectParentID = allFormObj["selected"][formLinkTo];
                    console.log("get parent id");
                    console.log(selectedObj);
                    console.log(formLinkTo);
                    console.log("not entered");
                } catch (e) {

                }

                console.log("Parent ID", selectParentID);

                var staticData = false;
                var staticDataContent = "";

                try {
                    console.log(formObj_)
                    staticData = formObj_["staticData"];
                    if (staticData == undefined || staticData == "undefined") {
                        staticData = false;
                    } else {
                        staticData = true;
                        staticDataContent = setupObj[activeTab];
                    }
                    console.log("Static Data");
                    console.log(staticData);
                } catch (e) {

                }

                //set url with param
                var listUrl = formObj_.listUrl;

                if ((selectParentID == "undefined" || selectParentID == undefined) && currentTabPos > previousTabPos) {

                    controller.renderNoDataFound(activeTab, formObj_, function() {});

                } else {


                    //set parent id queries

                    console.log("Parent ID" + selectParentID);
                    console.log(selectedObj);
                    console.log(formLinkTo);
                    console.log("before" + listUrl);
                    listUrl = listUrl.replace('parentID', selectParentID);
                    listUrl = listUrl.substring(0, listUrl.lastIndexOf('/') + 1);
                    listUrl = listUrl + selectParentID;
                    console.log("after" + listUrl);
                    formObj_.listUrl = listUrl;
                    console.log(formObj_);
                    console.log(listUrl);
                    controller.renderCRUDFormTabs(activeTab, formObj_, function() {}, staticData, staticDataContent);
                }

                if (currentTabPos > previousTabPos) {
                    allFormObj["highestAccessedTab"] = currentTabPos;
                }

            } else {

            }

            allFormObj["previousTabPos"] = currentTabPos;
        });
    },
    renderCRUDForm: function(target, thisObj, callback, method = "GET") {
        console.log(thisObj);
        controller.init(thisObj);
        var formName = thisObj.formName;
        postType = "GET";
        try {
            postType = thisObj.postType;
        } catch (e) {

        }
        //check for add button
        var crudAdd = true;
        try {
            crudAdd = thisObj.crudAdd;
            if (crudAdd == undefined || crudAdd == "undefined") {
                crudAdd = true;
            }
        } catch (e) {

        }

        //check for refresh button
        var refreshBtn = true;
        var visibility = "visible";
        try {
            refreshBtn = thisObj.refreshBtn;
            console.log("REFRESH STATUS", refreshBtn);
            if (refreshBtn == undefined || refreshBtn == "undefined") {
                refreshBtn = true;
            }
            if (refreshBtn == false) {
                visibility = "hidden";
            } else {
                visibility = "visible";
            }
        } catch (e) {

        }

        var formName = thisObj.formName;
        var tableTitle = thisObj.tableTitle;

        var htmlCrudForm = "<div id='" + formName + "_form' form-name='" + formName + "' class='crud_form " + formName + " parsley-form'>";
        htmlCrudForm += "<div class=''>";
        htmlCrudForm += "<div class='row'><div class='col-md-12'><h2 class='headerTitle'> " + tableTitle + "</h2></div>";
        htmlCrudForm += "</div></div></div>";

        htmlCrudForm += "<div class='xcrud-top-actions'>";
        htmlCrudForm += "<div class='btn-group pull-left'>";
        if (crudAdd) {
            htmlCrudForm += "<div class='add_btn_section'><a href='javascript:;' form-name='" + formName + "' data-task='create' class='btn btn-success xcrud-action' onclick='Create_Meeting_Modal()'><i class='fa fa-plus'></i> Add Meeting</a><div class='clearfix'></div></div>";
        }
        htmlCrudForm += "</div><div class='listings' id='listings_" + formName + "'></div><div class='listings_edit' id='listings_edit_" + formName + "' style='position: absolute; display: none;'></div></div>";
        console.log(htmlCrudForm)
        console.log(target)
        $('.' + target).html(htmlCrudForm).promise().done(function() {
            controller.initActions();
            var targetIdentifier = "#listings_" + formName;
            controller.show_progress();
            controller.loadTable(thisObj.listingsArr, thisObj['listUrl'], thisObj.buttonsArr, thisObj.formName, targetIdentifier, thisObj.groupBy, postType);

        });
    },
    renderNoDataFound: function(target, thisObj, callback) {
        var formName = thisObj.formName;
        var htmlCrudForm = "<div id='" + formName + "_form' form-name='" + formName + "' class='crud_form " + formName + " parsley-form'><h3 class='headerTitle'> Please select a record on previous tab to proceed..</h3></div>";
        $('.' + target).html(htmlCrudForm);
    },
    renderCRUDFormTabs: function(target, thisObj, callback, staticData = false, staticDataContent = "") {

        var formName = thisObj.formName;
        postType = "GET";
        try {
            postType = thisObj.postType;
        } catch (e) {

        }

        console.log("METHOD FOR FORM RENDER", thisObj.postType)

        //check for add button
        var crudAdd = true;
        try {
            crudAdd = thisObj.crudAdd;
            if (crudAdd == undefined || crudAdd == "undefined") {
                crudAdd = true;
            }
        } catch (e) {

        }

        var htmlCrudForm = "<div id='" + formName + "_form'   form-name='" + formName + "' class='crud_form parsley-form " + formName + "'><h2 class='headerTitle'></h2>";
        htmlCrudForm += "<div class='xcrud-top-actions'>";
        htmlCrudForm += "<div class='btn-group pull-left'>";
        if (crudAdd) {
            if (formName == "meeting_issues") {
                htmlCrudForm += "<div class='add_btn_section'><a href='javascript:;' form-name='" + formName + "' data-task='create' class='btn btn-success xcrud-action' onclick='add_issue_modal()'><i class='fa fa-plus'></i> Add Issue</a><div class='clearfix'></div></div>";
            } else {
                htmlCrudForm += "<div class='add_btn_section'><a href='javascript:;' form-name='" + formName + "' data-task='create' class='btn btn-success xcrud-action' onclick='upload_document_modal()'><i class='fa fa-plus'></i> Add Documents</a><div class='clearfix'></div></div>";
            }
        }

        htmlCrudForm += "</div><div class='listings' id='listings_" + formName + "'></div><div class='listings_edit' id='listings_edit_" + formName + "' style='display:none;position:absolute;top: -1px'></div></div>";
        console.log(target);
        $('.' + target).html(htmlCrudForm).promise().done(function() {
            controller.initActions();
            var targetIdentifier = "#listings_" + formName;
            $(targetIdentifier).html("loading");
            controller.show_progress();

            console.log(thisObj);
            if (!staticData) {
                console.log("load table 1");
                controller.loadTable(thisObj['listingsArr'], thisObj['listUrl'], thisObj.buttonsArr, thisObj.formName, targetIdentifier, thisObj.groupBy, postType);
            }

        });
        callback();
    },
    renderCRUDTable: function(thisObj, method = "GET") {

        console.log("renderCRUDTable", method);
        var targetIdentifier = "#listings_" + thisObj.formName;
        $("#listings_edit_" + thisObj.formName).hide();
        controller.loadTable(thisObj.listingsArr, thisObj['listUrl'], thisObj.buttonsArr, thisObj.formName, targetIdentifier, thisObj.groupBy, method);
    },
    getSecondPart: function(str) {
        hashArray = str.split('#');
        str = hashArray[1];

        if (str != undefined) {
            var res = str.split("/");
            return res[0];
        } else {

            return false;
        }
    },
    getThirdPart: function(str) {
        str = str.split('#')[1];
        var res = str.split("/");
        return res[1];
    },
    renderListButtons: function(data, cell, row, formName) {

        console.log("FORM NAME", formName);
        var btnType = 'edit';
        var btnText = 'Edit';
        var row = cell.getRow();
        var data = row.getData();
        var element = row.getElement();

        var btnTitle = "";

        if (btnType == 'edit') {
            btnTitle = "Edit";
        } else if (btnType == 'delete') {
            btnTitle = "Delete";
        } else if (btnType == 'activate') {
            btnTitle = "Activate";
        }

        buttonHolder = document.createElement("div");

        buttonEdit = document.createElement("button");
        buttonEdit.innerHTML = "<i class='fa fa-edit'></i>Edit"; //xcrud-action btn btn-warning btn-sm
        buttonEdit.classList.add("xcrud-action");
        buttonEdit.classList.add("btn");
        buttonEdit.classList.add("btn-warning");
        buttonEdit.classList.add("btn-sm");
        console.log(this)
        var listFormName = "";
        if (formName == "") {
            listFormName = this.myFormObj.formName;
        } else {
            listFormName = formName;
        }

        buttonEdit.setAttribute("form-name", listFormName);
        buttonEdit.setAttribute("type", "button");

        buttonEdit.addEventListener("click", function() {
            allFormObj["highestAccessedTab"] = 0;
            var modal =
                '<div class="modal edit_meeting_modal" id="edit_meeting_modal" tabindex="-1" role="dialog">' +
                ' <div class="modal-dialog" role="document">' +
                ' <div class="modal-content">' +
                '  <div class="modal-header">' +
                '   <h5 class="modal-title">Edit Meeting Details</h5>' +
                ' <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '   <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '       <span aria-hidden="true">&times;</span>' +
                '    </button>' +
                '   </div>' +
                '   <div class="modal-body">' +
                '       <form method="POST" autocomplete="off" id="meeting_update_form">' +
                '                   <div class="form-group">' +
                '                       <label for="meeting_name">Meeting Name</label>' +
                '                       <input type="text" class="form-control" id="meeting_name"' +
                '                       placeholder="Enter Meeting Name" name="meeting_name" value="' + data.meeting_name + '" required>' +
                '                   </div>' +
                '                   <div class="form-row">' +
                '                       <div class="form-group col-md-6">' +
                '                           <label for="start_date_time">Start Date & Time</label>' +
                '                           <input type="text" class="form-control" id="edit_start_date_time"' +
                '                           placeholder="Enter Start Date & Time" name="start_date_time" value="' + data.start_date_time + '" required>' +
                '                       </div>' +
                '                       <div class="form-group col-md-6">' +
                '                           <label for="end_date_time">End Date & Time</label>' +
                '                           <input type="text" class="form-control" id="edit_end_date_time"' +
                '                               placeholder="Enter End Date & Time" name="end_date_time"  value="' + data.end_date_time + '" required>' +
                '                       </div>' +
                '                   </div>' +
                '                   <div class="form-group">' +
                '                       <label for="meeting_agenda"> Meeting Agenda</label>' +
                '                       <textarea cols="100" rows="4" class="form-control" id="meeting_agenda"' +
                '                           name="meeting_agenda" placeholder="Enter Meeting Agenda"' +
                '                           required>' + data.meeting_agenda + '</textarea>' +
                '<input type="hidden"  name="meeting_id" id="meeting_id" value=' + data.meeting_id + '></>' +
                '           </div>' +
                '   </div>' +
                '    <div class="modal-footer">' +
                '        <button type="button" id="edit_meeting_form_button" onclick="updateMeeting()" class="btn btn-primary" style="float: right;' +
                '        font-size: 14px;" >Save' +
                '            changes</button>' +
                '      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>' +
                '    </form>' +
                '    </div>' +
                '  </div>' +
                '</div>' +
                '</div>';

            $("#view_modal").html(modal);

            $('.modal.edit_meeting_modal').modal({
                backdrop: 'static',
                keyboard: false
            });
            $("#edit_start_date_time").datetimepicker({
                dateFormat: 'yy-mm-dd',
                timeFormat: "hh:mm tt",
                changeYear: true,
                yearRange: '1900:2099'
            });
            $("#edit_end_date_time").datetimepicker({
                dateFormat: 'yy-mm-dd',
                timeFormat: "hh:mm tt",
                changeYear: true,
                yearRange: '1900:2099'
            });


        }, false);

        buttonView = document.createElement("button");
        buttonView.innerHTML = "<i class='fa fa-view'></i> View"; //xcrud-action btn btn-warning btn-sm
        buttonView.classList.add("xcrud-action");
        buttonView.classList.add("btn");
        buttonView.classList.add("btn-info");
        buttonView.classList.add("btn-sm");

        var listFormName = "";
        if (formName == "") {
            listFormName = this.myFormObj.formName;
        } else {
            listFormName = formName;
        }

        buttonView.setAttribute("form-name", listFormName);
        buttonView.setAttribute("type", "button");

        buttonView.addEventListener("click", function() {

            allFormObj["highestAccessedTab"] = 0;
            controller.viewRow(data, this);

        }, false);
        /*button participate*/
        buttonUpvote = document.createElement("button");
        buttonUpvote.setAttribute("type", "button");
        buttonUpvote.innerHTML = "<i class='icon-arrow-right'></i> Vote Yes"; //xcrud-action btn btn-warning btn-sm
        buttonUpvote.classList.add("xcrud-action");
        buttonUpvote.classList.add("btn");
        buttonUpvote.classList.add("btn-success");
        buttonUpvote.classList.add("btn-sm");
        buttonUpvote.addEventListener("click", function(event) {
            if (!event.detail || event.detail == 1) {
                console.log("data", data);
                var userObj = JSON.parse(localStorage.getItem('userObj'));
                if (userObj) {
                    var url = serverURL + "get_participant_info/" + userObj.users_id + "/" + data.meeting_issues_id;
                    controller.getRequest(url, true, function(data1, status) {
                        console.log(data1)
                        if (data1) {
                            controller.showToastMsg("You Have Already Voted On This Issue", "#ff6666")
                        } else {
                            var url2 = serverURL + "upvote/" + data.meeting_issues_id + "/" + userObj.users_id;
                            console.log(url)
                            controller.request(url2, '', true, function(data2, status) {
                                controller.showToastMsg("Voted Successfuly", "#1a5589")
                                console.log(status);
                                console.log(data2);
                                controller.refreshCrudTables('meeting_issues');
                            });
                        }
                    });

                }
            }
        }, false);

        buttonDownvote = document.createElement("button");
        buttonDownvote.setAttribute("type", "button");
        buttonDownvote.innerHTML = "<i class='icon-arrow-right'></i> Vote No"; //xcrud-action btn btn-warning btn-sm
        buttonDownvote.classList.add("xcrud-action");
        buttonDownvote.classList.add("btn");
        buttonDownvote.classList.add("btn-warning");
        buttonDownvote.classList.add("btn-sm");
        buttonDownvote.addEventListener("click", function(event) {
            if (!event.detail || event.detail == 1) {
                console.log("data", data);
                var userObj = JSON.parse(localStorage.getItem('userObj'));
                if (userObj) {
                    var url = serverURL + "get_participant_info/" + userObj.users_id + "/" + data.meeting_issues_id;
                    controller.getRequest(url, true, function(data1, status) {
                        console.log(data1)
                        if (data1) {
                            controller.showToastMsg("You Have Already Voted On This Issue", "#ff6666")
                        } else {
                            var url2 = serverURL + "downvote/" + data.meeting_issues_id + "/" + userObj.users_id;
                            console.log(url)
                            controller.request(url2, '', true, function(data2, status) {
                                controller.showToastMsg("Voted Successfuly", "#1a5589")
                                console.log(status);
                                console.log(data2);
                                controller.refreshCrudTables('meeting_issues');
                            });
                        }
                    });

                }
            }
        }, false);


        buttonDownloadFile = document.createElement("button");
        buttonDownloadFile.setAttribute("type", "button");
        buttonDownloadFile.innerHTML = "<i class='icon-arrow-right'></i> Download"; //xcrud-action btn btn-warning btn-sm
        buttonDownloadFile.classList.add("xcrud-action");
        buttonDownloadFile.classList.add("btn");
        buttonDownloadFile.classList.add("btn-success");
        buttonDownloadFile.classList.add("btn-sm");
        buttonDownloadFile.addEventListener("click", function(event) {
            console.log(data)
            filename = data.document_name
            console.log(filename)
            var url = serverURL + "download/" + filename
            $.ajax({
                cache: false,
                type: 'GET',
                url: url,
                contentType: false,
                processData: false,
                xhrFields: {
                    responseType: 'blob'
                },
                success: function(response, status, xhr) {
                    console.log(response)
                    var a = document.createElement("a");
                    a.download = data.document_name
                    a.href = window.URL.createObjectURL(response)
                    a.target = "_blank";
                    a.click()
                }
            });
        }, false);

        console.log("crud object");
        var currentObj = allFormObj[formName];
        console.log(currentObj);

        var crudView = true;
        try {
            crudView = currentObj.crudView;
            if (crudView == undefined || crudView == "undefined") {
                crudView = true;
            }
        } catch (e) {

        }

        var crudEdit = true;
        try {
            crudEdit = currentObj.crudEdit;
            if (crudEdit == undefined || crudEdit == "undefined") {
                crudEdit = true;
            }
        } catch (e) {

        }


        var crudDownloadAttachment = false;
        try {
            crudDownloadAttachment = currentObj.crudDownloadAttachment;
            if (crudDownloadAttachment == undefined || crudDownloadAttachment == "undefined") {
                crudDownloadAttachment = false;
            }
        } catch (e) {

        }


        var crudUpvote = false;
        try {
            crudUpvote = currentObj.crudUpvote;
            if (crudUpvote == undefined || crudUpvote == "undefined") {
                crudUpvote = false;
            }
        } catch (e) {

        }

        var crudDownvote = false;
        try {
            crudDownvote = currentObj.crudDownvote;
            if (crudDownvote == undefined || crudDownvote == "undefined") {
                crudDownvote = false;
            }
        } catch (e) {

        }

        if (crudDownloadAttachment) {
            buttonHolder.appendChild(buttonDownloadFile);
        }

        if (crudView) {
            buttonHolder.appendChild(buttonView);
        }

        if (crudEdit) {
            buttonHolder.appendChild(buttonEdit);
        }


        if (crudUpvote) {
            buttonHolder.appendChild(buttonUpvote);
        }


        if (crudDownvote) {
            buttonHolder.appendChild(buttonDownvote);
        }


        return buttonHolder; //return button list
    },
    getRequest: function(url, async_status, callBack) {
        $.ajax({
            url: url,
            type: 'GET',
            async: async_status,
            success: function(data, textStatus, xhr) {
                controller.hide_progress();
                callBack(data, true);

            },
            fail: function(xhr, textStatus) {
                controller.hide_progress();
                if (xhr.status == 200) {} else if (xhr.status == 201) {
                    callBack(errorMsg, false);
                    controller.showToastMsg("Error! Created" + errorMsg, "#ff6666");
                } else if (xhr.status == 400) {
                    var t = xhr.responseText;
                    var obj = JSON.parse(t);
                    var errorArr = obj.errors;
                    var errorMsg = "";
                    for (var i in errorArr) {
                        errorMsg = errorMsg + "</br>" + errorArr[i].defaultMessage;
                    }
                    callBack(errorMsg, false);
                    controller.showToastMsg("Error! Fields are empty" + errorMsg, "#ff6666");
                } else if (xhr.status == 401) {
                    callBack(xhr.status, false);
                    controller.showToastMsg("Error! Unauthorized" + errorMsg, "#ff6666");
                } else if (xhr.status == 403) {
                    callBack(xhr.status, false);
                    controller.showToastMsg("Error! Forbidden" + errorMsg, "#ff6666");
                } else if (xhr.status == 404) {
                    callBack(xhr.status, false);
                    controller.showToastMsg("Error! Not found" + errorMsg, "#ff6666");
                } else if (xhr.status == 500) {

                    var errorMsg = xhr.responseJSON.message;

                    try {
                        var error = errorMsg.substring(1, 9);
                        callBack(errorMsg, false);
                        if (errorMsg == "could not") {
                            controller.showToastMsg("Error! Duplicate record exists" + errorMsg, "#ff6666");
                        } else {
                            controller.showToastMsg("Error!" + errorMsg, "#ff6666");
                        }
                    } catch (e) {

                    }

                }

            },
            error: function(xhr, textStatus) {
                controller.hide_progress();
                callBack(xhr, false);
            }
        });
    },
    request: function(url, formData, async_status, callBack) {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            async: async_status,
            data: formData,
            success: function(data, textStatus, xhr) {
                console.log(data.data)
                callBack(data.data, true);

            },
            fail: function(xhr, textStatus) {
                callBack(xhr, textStatus);

            },
            error: function(xhr, textStatus) {
                callBack(xhr, textStatus);

            }
        });

    },
    showToastMsg: function(message, color) {
        Toastify({
            text: message,
            duration: 10000,
            gravity: "bottom", // `top` or `bottom`
            position: 'right', // `left`, `center` or `right`
            backgroundColor: color,
        }).showToast();
    },
    getWindowURLObject: function() {

        var windowURL = window.location.href;
        var res = windowURL.split("/");
        return res;

    },
    show_progress: function() {
        console.log("show progress");
        $(".xcrud-overlay").show();
    },
    hide_progress: function() {
        console.log("hide progress");
        $(".xcrud-overlay").hide();
    },
    validateOnView_Edit: function(x, formName) {
        console.log(formName);
        console.log(x)


    },
    viewRow: function(x, e) {

        console.log("viewRow");

        var formName = $(e).attr("form-name");
        console.log(formName);
        console.log(x);

        var exclusionTab = [];


        //validate on fields & hide/show logic
        controller.validateOnView_Edit(x, formName);

        controller.renderEditForm(x, formName, false, exclusionTab, function(response) {
            console.log("EDIT FORMANAME" + formName)
            var formHTML = response;
            $("#listings_edit_" + formName).show();
            $("#listings_edit_" + formName).html(formHTML);
            controller.initActions();
            controller.initializeTabs();
            console.log("renderDate2");
        });


    },
    initActions: function() {


        $(".return").on("click", function() {
            var formName = $(this).attr("form-name");

            $("#listings_edit_" + formName).hide();
        });

        var url = 'vendor/parsleyjs/parsley.js';
        jQuery.loadScript = function(url, callback) {
            jQuery.ajax({
                url: 'vendor/parsleyjs/parsley.js',
                dataType: 'script',
                success: callback,
                async: true
            });
        };

    },
    fieldExist: function(val, originalVal = "", currentObj) {
        var formFields = currentObj.fields;
        for (var key_ in formFields) {
            console.log(formFields[key_]['field'] + " " + val);
            if (originalVal == "") {
                if (formFields[key_]['field'] == val) {
                    return formFields[key_];
                }
            } else {
                if (formFields[key_]['field'] == originalVal) {
                    return formFields[key_];
                }
            }
        }
        return false;
    },
    renderEditForm: function(obj, formName, editable = true, tabExclusion = [], callback) {

        console.log("renderEditForm");
        console.log(obj);
        var currentObj = allFormObj[formName];
        //set selected object

        try {
            //check if table is a tab
            if (currentObj.url_id != "tab") {
                var tab_this = $("li.active.item");
                console.log(tab_this);
                var tabPos = tab_this.attr("data-tab");
                console.log(tabPos);
                allFormObj["tab_" + formName] = obj;

                try {
                    allFormObj["parent_selected"] = obj;
                    allFormObj["selected"] = obj;
                } catch (e) {

                }
            } else {
                try {
                    allFormObj["selected"] = "";
                    allFormObj["selected"] = obj;
                } catch (e) {

                }
            }
        } catch (e) {

        }

        var tabHeaders = "";
        var mainFormHTML = "";
        var tabsFormHTML = "";
        var subTabHeaders = "";
        var mainSubFormHTML = "";

        var tab = "";
        try {
            tab = currentObj.Mytabs;
        } catch (e) {

        }
        var fields = "";
        try {
            fields = currentObj.fields;
        } catch (e) {

        }
        var dates = "";
        try {
            dates = currentObj.dateFields;
        } catch (e) {

        }

        console.log(fields);
        console.log(tabExclusion);

        var tabLength = 0;
        try {
            tabLength = tab.length;
        } catch (e) {

        }

        console.log(tabLength.length);
        if (tabLength > 0) {
            for (i = 0; i < tab.length; i++) {

                //tabHeaders = ""; 				
                var isActive = "";
                if (i == 0) {
                    isActive = "active show";
                } else {
                    isActive = "";
                }

                console.log(tab[i]['tabName']);
                //check if tab is to be excluded
                var enabledElem = "";
                var n = tabExclusion.includes(tab[i]['tabName']);
                if (n) {
                    enabledElem = "style='display:none;'";
                    console.log("tabzz " + tab[i]['tabName'] + " to be excluded");
                }

                console.log(tab[i]['tabName']);
                tabHeaders += '<li ' + enabledElem + ' tab-position= "' + i + '" class="nav-item item ' + tab[i]['tabName'] + '_tab_link"' + isActive + '" data-tab="' + tab[i]['entityName'] + '" style="font-size: 16px;"><button  class="nav-link" data-toggle="tab" href="#' + tab[i]['tabName'] + '">' + tab[i]['tabTitle'] + '</button></li>';
                console.log(tab[i] + "<br>");

                //get group fields
                let uniqueGroupNames = [...new Set(fields.map(item => item.groupName))];
                console.log(uniqueGroupNames);
                console.log(uniqueGroupNames.length);

                for (groupIndex in uniqueGroupNames) {

                    var hasGroupField = false;
                    var displayGroupName = uniqueGroupNames[groupIndex];
                    console.log(displayGroupName);
                    if (displayGroupName == undefined || displayGroupName == "undefined") {
                        displayGroupName = "";
                    }

                    var subTabHeadersTmp = "";
                    for (a = 0; a < fields.length; a++) { //loop through fields

                        var fieldGroupName = fields[a]['groupName'];

                        if (uniqueGroupNames[groupIndex] == fieldGroupName || (displayGroupName == "" && uniqueGroupNames.length == 1)) {

                            console.log("Group Compare " + uniqueGroupNames[groupIndex] + " " + fieldGroupName + " " + fieldName);

                            var fieldName = fields[a]['field'];
                            var fieldTitle = fields[a]['title'];
                            var fieldType = fields[a]['type'];
                            var fieldRelation = fields[a]['relation'];
                            var fieldOptionID = fields[a]['option_id'];

                            if (fieldOptionID == undefined || fieldOptionID == "undefined") {
                                fieldOptionID = "";
                            }

                            if (fields[a]['tab'] == tab[i]['tabName']) { //if field is for that tab

                                hasGroupField = true;

                                if (fieldName in obj) { //check if fieldName exists in obj

                                    key = fieldName;
                                    console.log("tab exists in object >>" + fieldName + "--" + fieldRelation);
                                    subTabHeadersTmp += controller.renderFormField(obj, key, fieldName, "", currentObj, editable, fieldOptionID, fields[a]);

                                } else {

                                    key = fieldName;
                                    if (fieldRelation) { //use relation property since using fieldName cannot be found
                                        console.log("tabs relation render" + fieldName);
                                        subTabHeadersTmp += controller.renderFormField(obj, fieldRelation, fieldRelation, fieldName, currentObj, editable, fieldOptionID, fields[a]);
                                    }

                                    //Check if it has nested object
                                    fieldNameArray = fieldName.split('.');
                                    var identifier = "";
                                    var tmp = "";
                                    var pos = 0;

                                    console.log(obj);
                                    try {
                                        if (fieldNameArray.length == 1) {
                                            console.log(fieldNameArray[0]);
                                            tmp = obj[fieldNameArray[0]];
                                        }
                                        if (fieldNameArray.length == 2) {
                                            tmp = obj[fieldNameArray[0]][fieldNameArray[1]];
                                        }
                                        if (fieldNameArray.length == 3) {
                                            tmp = obj[fieldNameArray[0]][fieldNameArray[1]][fieldNameArray[2]];
                                        }

                                        if (fieldNameArray.length == 4) {
                                            tmp = obj[fieldNameArray[0]][fieldNameArray[1]][fieldNameArray[2]][fieldNameArray[3]];
                                        }

                                        if (fieldNameArray.length == 5) {
                                            tmp = obj[fieldNameArray[0]][fieldNameArray[1]][fieldNameArray[2]][fieldNameArray[3]][fieldNameArray[4]];
                                        }
                                    } catch (e) {

                                    }


                                    //ensure relation is false
                                    if (!fieldRelation) {
                                        subTabHeadersTmp += controller.renderFormFieldNested(obj, key, fieldRelation, tmp, currentObj, editable, fieldOptionID, fields[a]);
                                    }

                                }
                            }
                        }
                    } //end loop through fields
                    console.log("End loop", hasGroupField);
                    //check hasGroupField
                    if (hasGroupField) {
                        subTabHeadersTmp = "<div class='form-group col-md-12' style='float: left;'><h4>" + displayGroupName + "</h4></div>" + subTabHeadersTmp;
                    }
                    subTabHeaders += subTabHeadersTmp;

                }

                console.log(subTabHeaders);
                tabsFormHTML +=
                    '<div id="' + tab[i]['tabName'] + '" class="tab-pane fade ' + tab[i]['entityName'] + ' ' + isActive + '">' +
                    subTabHeaders +
                    '</div>';
                subTabHeaders = "";


            }

            var actionButton = controller.renderFormActions(formName, editable);

            mainSubFormHTML = "<form id='" + currentObj.formName + "_form'  form_identifier='" + currentObj.formName + "' class='form parsley-form'>" + actionButton + "</br>" +
                '<ul class="nav nav-tabs" id="myTab">' +
                tabHeaders +
                '</ul>' +
                '<div class="tab-content" style="border-style:none;">' +
                tabsFormHTML +
                '</div> ' +
                "</form>";

            mainFormHTML +=
                "<div class='main-form'>" +
                mainSubFormHTML +
                '</div>';

            console.log("renderDate1");
            callback(mainFormHTML);
            //return mainFormHTML;

        } else {

            console.log("Edit Obj");
            console.log(obj);

            let uniqueGroupNames = [...new Set(fields.map(item => item.groupName))];
            console.log(uniqueGroupNames);

            for (groupIndex in uniqueGroupNames) {

                var displayGroupName = uniqueGroupNames[groupIndex];
                console.log(displayGroupName);
                if (displayGroupName == undefined || displayGroupName == "undefined") {
                    displayGroupName = "";
                }

                tabsFormHTML += "<div class='form-group col-md-12' style='float: left;'><h4>" + displayGroupName + "</h4></div>";

                for (a = 0; a < fields.length; a++) { //loop through fields

                    var fieldGroupName = fields[a]['groupName'];

                    if (uniqueGroupNames[groupIndex] == fieldGroupName || (displayGroupName == "" && uniqueGroupNames.length == 1)) {

                        console.log("fields being passed", fields[a]);
                        var fieldName = fields[a]['field'];
                        var fieldTitle = fields[a]['title'];
                        var fieldType = fields[a]['type'];
                        var fieldRelation = fields[a]['relation'];
                        var fieldOptionID = fields[a]['option_id'];

                        if (fieldOptionID == undefined || fieldOptionID == "undefined") {
                            fieldOptionID = "";
                        }

                        if (fieldName in obj) { //check if fieldName exists in obj		        			        	

                            key = fieldName;
                            console.log("exists in object >>" + fieldName + "--" + fieldRelation);
                            tabsFormHTML += controller.renderFormField(obj, key, fieldName, "", currentObj, editable, fieldOptionID, fields[a]);

                        } else {

                            key = fieldName;
                            if (fieldRelation) { //use relation property since using fieldName cannot be found
                                console.log("relation render");
                                tabsFormHTML += controller.renderFormField(obj, fieldRelation, fieldRelation, fieldName, currentObj, editable, fieldOptionID, fields[a]);
                            }
                            console.log("does not exists in object >>" + fieldName + "--" + fieldRelation + "--" + key);
                        }
                    }
                }

            }

            var actionButton = controller.renderFormActions(formName, editable);

            mainFormHTML = "<form id='" + currentObj.formName + "_form'  form_identifier='" + currentObj.formName + "' class='form parsley-form'>" + actionButton + "</br>" + tabsFormHTML + "</form>";
            mainFormHTML = "<div class='main-form'>" + mainFormHTML + "</div>";
            console.log("renderDate1");
            callback(mainFormHTML);
            //return mainFormHTML;
        }
    },
    renderFormFieldNested: function(obj, key, fieldName, value, currentObj, editable, option_id = "") {
        console.log("renderFormFieldNested");
        var tabsFormHTMLTmp = "";

        var returnField = controller.fieldExist(key, "", currentObj);
        var formFields = currentObj.fields;

        console.log(returnField + " " + currentObj.formName);
        console.log(formFields);
        console.log(key);

        if (returnField != false) {
            var renderObj = {
                'title': returnField['title'],
                'field': returnField['field'],
                'value': value,
                'type': returnField['type'],
                'disabled': returnField['disabled'],
                'validations': returnField['validations'],
                's_type': "",
                'postField': returnField['postField']
            };

            tabsFormHTMLTmp += controller.renderField(renderObj, currentObj.formName, editable, option_id);
        } else {
            var renderObj = {
                'title': 'Field Not Found',
                'field': 'Not Found',
                'value': 'Not Found',
                'type': 'text',
                'disabled': returnField['disabled'],
                'validations': returnField['validations'],
                's_type': "",
                'postField': returnField['postField']
            };

            tabsFormHTMLTmp += controller.renderField(renderObj, currentObj.formName, editable, option_id);
        }

        return tabsFormHTMLTmp;
    },
    renderFormField: function(obj, key, fieldName, originalFieldName = "", currentObj, editable, option_id = "", fieldDefinedObj = "") {

        //logic		
        console.log("renderFormField");


        var dates = currentObj.dateFields;
        var formName = currentObj.formName;

        console.log("Render FN" + formName);

        var tabsFormHTML = "";
        if (obj.hasOwnProperty(key)) {

            console.log("Has Property " + key);
            console.log(key + " -> " + obj[key]);
            if (typeof obj[key] === 'object' && obj[key] !== null && obj[key] != undefined && obj[key] != 'undefined') {

                var comparekey = key + "_id";
                console.log(obj);
                var returnField = controller.fieldExist(comparekey, originalFieldName, currentObj);


                console.log("Main Key=" + fieldName + "  Next key=" + comparekey);
                if (fieldName == comparekey || fieldName == key) { //check if fields is in defined list
                    try {
                        console.log("object " + key);
                        console.log("original name " + originalFieldName);
                        var options = "";

                        console.log("special..", option_id);
                        var listEntityName = returnField['listEntityName'];
                        if (listEntityName == "undefined" || listEntityName == undefined) {
                            listEntityName = "";
                        }
                        var renderObj = {
                            'title': returnField['title'],
                            'field': comparekey,
                            'value': options,
                            'type': returnField['type'],
                            'disabled': returnField['disabled'],
                            's_type': returnField['select_type'],
                            'validations': returnField['validations'],
                            'postField': returnField['postField']
                        };

                        tabsFormHTML += controller.renderField(renderObj, currentObj.formName, editable);

                    } catch (e) {

                    }
                }

            } else {

                //key = controller.sanitize(key);						    		
                if (fieldName == key) { //check if fields is in defined list
                    try {

                        if (obj[key] != undefined && obj[key] != 'undefined') {
                            console.log(dates);
                            console.log(key);
                            var returnField = controller.fieldExist(key, "", currentObj);
                            if (returnField != false) {
                                console.log("Field Exists||" + returnField['type'] + " " + currentObj.formName);

                                var renderObj = {
                                    'title': returnField['title'],
                                    'field': returnField['field'],
                                    'value': obj[key],
                                    'type': returnField['type'],
                                    'disabled': returnField['disabled'],
                                    'validations': returnField['validations'],
                                    's_type': "",
                                    'postField': returnField['postField']
                                };

                                tabsFormHTML += controller.renderField(renderObj, currentObj.formName, editable);

                            } else {
                                console.log("Field Does Not Exists");
                                //mainFormHTML += controller.renderField(key,key,obj[key],"hidden");	
                            }

                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
                console.log(tabsFormHTML);
                console.log("finished");
            }
            return tabsFormHTML;
        } else {

            //fieldName
            console.log("drop down");
            console.log(fieldDefinedObj);


            try {
                var listEntityName = fieldDefinedObj['listEntityName'];
            } catch (e) {

            }


            console.log(returnField);
            console.log(options);
            fieldDefinedObj.value = options;
            tabsFormHTML += controller.renderField(fieldDefinedObj, currentObj.formName, editable);


            return tabsFormHTML;

        }
    },
    renderFormActions: function(formName, editable = true) {
        console.log("form name", formName);
        var formActionsHTML = "";
        formActionsHTML = "<div class='xcrud-top-actions btn-group'>";
        if (editable) {
            formActionsHTML += "<a href='javascript:;' form-name='" + formName + "'  data_task='save_return' data-after='list' class='btn btn-primary xcrud-action save'>Save &amp; Return</a>";
        }
        formActionsHTML += "<a href='javascript:;' form-name='" + formName + "' data_task='return' class='btn btn-warning xcrud-action return'>Return</a>";
        formActionsHTML += "</div>";
        return formActionsHTML;

    },
    renderField: function(fieldObj, formName, editable = true, isadd = false) {

        console.log("{ Render Field");
        console.log("FormName = " + formName);
        console.log(fieldObj);

        var id = fieldObj.field;
        var title = fieldObj.title;

        var fieldType = fieldObj.type;

        var fieldDefault = "";

        try {
            var value = fieldObj.value;
            if (value == undefined || value == "undefined") {
                value = "";
            }
        } catch (e) {

        }

        try {
            var s_type = fieldObj.s_type;
            if (s_type == undefined || s_type == "undefined") {
                s_type = "";
            }

        } catch (e) {

        }


        try {
            var visbleHTML = "";
            var visible = fieldObj.visible;
            if (visible == undefined || visible == "undefined") {
                visible = "";
            }




        } catch (e) {

        }

        try {
            var fieldDefault = fieldObj.default;
            if (fieldDefault == undefined || fieldDefault == "undefined") {

            } else {
                value = fieldDefault;
            }
        } catch (e) {

        }

        try {
            var fieldPlaceholder = fieldObj.placeholder;
            if (fieldPlaceholder == undefined || fieldPlaceholder == "undefined") {
                fieldPlaceholder = "";
            }
        } catch (e) {

        }


        try {
            var fieldDependants = fieldObj.dependants;
            if (fieldDependants == undefined || fieldDependants == "undefined") {
                fieldDependants = "";
            }
        } catch (e) {

        }

        try {
            var fieldDepends = fieldObj.depends;
            if (fieldDepends == undefined || fieldDepends == "undefined") {
                fieldDepends = "";
            }
        } catch (e) {

        }



        try {
            var fieldTooltip = fieldObj.tooltip;
            if (fieldTooltip == undefined || fieldTooltip == "undefined") {
                fieldTooltip = "";
            }
        } catch (e) {

        }

        try {
            var fieldTitle = fieldObj.title;
            if (fieldTitle == undefined || fieldTitle == "undefined") {
                fieldTitle = "";
            }
        } catch (e) {

        }

        var htmlDisabled = "";
        var fieldDisabled = false;
        try {
            fieldDisabled = fieldObj.disabled;
            if (fieldDisabled == undefined || fieldDisabled == "undefined") {
                fieldDisabled = "";
            }
        } catch (e) {

        }

        var postField = "";
        try {
            postField = fieldObj.postField;
            if (postField == undefined || postField == "undefined") {

            } else {
                console.log("postfields");
                id = postField;
            }
        } catch (e) {

        }

        var validations = "";
        var validations = "data-parsley-required='true'";
        try {
            validations = fieldObj.validations;
            if (validations == undefined || validations == "undefined") {
                validations = "data-parsley-required='true'";
            }

            if (formName == "users") {
                console.log("my profile", fieldObj.validations);
                console.log("my profile", fieldType);
                console.log("my profile", editable);
            }
        } catch (e) {

        }

        if (fieldDisabled) {
            validations = "data-parsley-excluded data-parsley-required='false'";
        }

        if (fieldDisabled) {
            htmlDisabled = "readonly=''  style='pointer-events:none';";
        }

        var formHTML = "";

        if (fieldType == "hidden") {
            formHTML += "<input  " + htmlDisabled + "  class='xcrud-input form-control " + formName + "' type='hidden' value='" + value + "' id='" + id + "' name='" + id + "' maxlength='50'>";
        } else if (fieldType == "text") {
            formHTML += "<div " + visbleHTML + " class='form-group col-md-6 " + id + "_holder'><label class='control-label col-sm-5'>" + title + "</label>";
            formHTML += "<div class='col-md-7'>";
            if (editable) {
                formHTML += "<input  " + validations + " " + htmlDisabled + " title='" + fieldTitle + "' placeholder='" + fieldPlaceholder + "' class='xcrud-input form-control " + formName + "' type='text' data-type='text' value='" + value + "' id='" + id + "' name='" + id + "' maxlength='50'>";
            } else {
                formHTML += "<div class='control-label-plain'>" + value + "</div>";
            }

            formHTML += "</div></div>";
        } else if (fieldType == "password") {
            formHTML += "<div class='form-group col-md-6'><label class='control-label col-sm-5'>" + title + "</label>";
            formHTML += "<div class='col-md-7'>";

            if (editable) {
                formHTML += "<input " + validations + " " + htmlDisabled + " title='" + fieldTitle + "' placeholder='" + fieldPlaceholder + "' class='xcrud-input form-control " + formName + "' type='password' data-type='text' value='" + value + "' id='" + id + "' name='" + id + "' maxlength='50'>";
            } else {
                formHTML += "<div class='control-label-plain'>" + value + "</div>";
            }
            formHTML += "</div></div>";
        } else if (fieldType == "select") {
            formHTML += "<div " + visbleHTML + " class='form-group col-md-6 " + id + "_holder'><label class='control-label col-sm-5'>" + title + "</label>";
            formHTML += "<div class='col-md-7'>";
            if (editable) {
                formHTML += "<select " + validations + " " + htmlDisabled + " title='" + fieldTitle + "' " + s_type + " class='xcrud-input form-control " + formName + " " + id + "' data-type='text' id='" + id + "' name='" + id + "' maxlength='50'> " + value + "</select>";
            } else {
                formHTML += "<select style='pointer-events:none;border:none;background:transparent;'" + htmlDisabled + " title='" + fieldTitle + "' " + s_type + " class='xcrud-input form-control " + formName + " " + id + "' data-type='text' id='" + id + "' name='" + id + "' maxlength='50'> " + value + "</select>";
            }
            formHTML += "</div></div>";
        } else if (fieldType == "date") {
            formHTML += "<div class='form-group col-md-6'><label class='control-label col-sm-5'>" + title + "</label>";
            formHTML += "<div class='col-md-7'>";

            console.log("Format Date", formattedDate);

            if (editable) {
                formHTML += "<input " + validations + " " + htmlDisabled + " title='" + fieldTitle + "' placeholder='" + fieldPlaceholder + "' class='xcrud-input form-control " + formName + "' type='text' data-type='text' value='" + formattedDate + "' id='" + id + "' name='" + id + "' maxlength='50'>";
            } else {
                formHTML += "<div class='control-label-plain'>" + formattedDate + "</div>";
            }

            formHTML += "</div></div>";

        } else if (fieldType == "file") {

            formHTML += "<div class='form-group col-md-6'><label class='control-label col-sm-5'>" + title + "</label>";
            formHTML += "<div class='col-md-7'>";

            if (editable) {
                formHTML += "<input " + htmlDisabled + " title='" + fieldTitle + "' placeholder='" + fieldPlaceholder + "' class='" + formName + "' type='file'  id='" + id + "' name='" + id + "'>";
            } else {
                formHTML += "<div class='control-label-plain'>" + value + "</div>";
            }

            formHTML += "</div></div>";

        } else if (fieldType == 'boolean') {

            console.log("editable");
            console.log("boolean", id + "-" + value);

            console.log(editable);

            formHTML += "<div class='form-group col-md-6'><label class='control-label col-sm-5'>" + title + "</label>";
            formHTML += "<div class='col-md-7'>";

            if (editable) {

                if (isadd) { //when its a new record being added

                    formHTML += "<select " + htmlDisabled + "   " + validations + "  title='" + fieldTitle + "' class='xcrud-input form-control " + formName + "' data-type='text' id='" + id + "' name='" + id + "' maxlength='50'> " + value;
                    formHTML += "<option selected value=''>-- Select Option --</option>";
                    formHTML += "<option value='true'>Yes</option>";
                    formHTML += "<option value='false'>No</option>";
                    formHTML += "</select>";

                } else {

                    formHTML += "<select " + htmlDisabled + "   " + validations + "  title='" + fieldTitle + "' class='xcrud-input form-control " + formName + "' data-type='text' id='" + id + "' name='" + id + "' maxlength='50'> " + value;

                    if (value == true || value == "true") {
                        formHTML += "<option  selected value='true'>Yes</option>";
                        formHTML += "<option value='false'>No</option>";
                    } else {
                        formHTML += "<option  value='true'>Yes</option>";
                        formHTML += "<option  selected value='false'>No</option>";
                    }
                    formHTML += "</select>";
                }



            } else {

                formHTML += "<select " + validations + " style='pointer-events:none;border:none;background:transparent;' " + htmlDisabled + " title='" + fieldTitle + "' class='xcrud-input form-control " + formName + "' data-type='text' id='" + id + "' name='" + id + "' maxlength='50'> " + value;

                if (value == true || value == "true") {

                    formHTML += "<option selected value='true'>Yes</option>";
                    formHTML += "<option value='false'>No</option>";
                } else {
                    formHTML += "<option  value='true'>Yes</option>";
                    formHTML += "<option  selected value='false'>No</option>";
                }
                formHTML += "</select>";
            }

            formHTML += "</div></div>";

        } else if (fieldType == "userid") {
            formHTML += "<input " + htmlDisabled + " class='xcrud-input form-control' type='hidden' value='" + userObj.id + "' id='" + id + "' name='" + id + "' maxlength='50'>";
        } else if (fieldType == "button") {
            formHTML += "<div class='form-group col-md-6 " + id + "_holder'>";
            formHTML += "<div class='col-md-7'>";

            formHTML += "<a class='btn btn-primary' onclick=controller.checkCondition('" + formName + "')>Check Condition</a>";

            formHTML += "</div></div>";
        } else if (fieldType == "buttonUCR") {
            formHTML += "<div class='form-group col-md-6 " + id + "_holder'>";
            formHTML += "<div class='col-md-7'>";

            formHTML += "<a class='btn btn-primary' onclick=controller.checkUCRvalidation()>Validate UCR</a>";

            formHTML += "</div></div>";
        }

        console.log("End Render Field}");
        return formHTML;
    },
    loadTable: function(columnsArr, listUrl, buttonsArr, tableName, tableId, groupby, method) {
        console.log("load table method", method);
        var table = new Tabulator(tableId, {
            pagination: "local", //enable local pagination.
            paginationSize: 10, // this option can take any positive integer value (default = 10)
            placeholder: "No Data Available", //display message to user on empty table
            selectablePersistence: true, // disable rolling selection
            layout: "fitColumns",
            addRowPos: "top",
            groupBy: groupby,
            columns: columnsArr,
            rowSelectionChanged: function(data, rows) {

            },
            columns: columnsArr,
            rowFormatter: function(row) {},
            rowClick: function(e, row) {

                var element = row.getElement(),
                    data = row.getData();
                console.log("Row Clicked");
                console.log(data);

                var tab_this = $("li.active.item");
                console.log(tab_this);
                var tabPos = tab_this.attr("data-tab");
                console.log(tabPos);
                allFormObj["tab_" + tabPos] = data;

                // Ensure if it is a tab child table, dont overwrite selected
                var divElem = $(element).closest('.listings');
                console.log(element);
                console.log(divElem);

                var formName = divElem.attr("id");

                console.log(formName);
                var formNameArr = formName.split("_");
                formName = formNameArr[1];
                console.log(formName);
                var currentObj = allFormObj[formName];
                console.log(currentObj);

                try {
                    //check if table is a tab
                    if (currentObj.url_id != "tab") {
                        try {
                            allFormObj["parent_selected"] = data;
                            allFormObj["selected"] = data;
                        } catch (e) {

                        }
                    } else {
                        try {
                            allFormObj["selected"] = "";
                            allFormObj["selected"] = data;
                        } catch (e) {

                        }
                    }
                } catch (e) {

                }
            }
        });
        console.log(tableName);
        getdata = null

        if (tableName == "all_meetings") {
            table.setSort([{
                    column: "end_date_time",
                    dir: "desc"
                }, //sort by this first
            ]);
        }
        var tmpData = [];
        console.log(listUrl);
        console.log("A load table method", method);
        console.log("A load table method", listUrl);
        $.ajax({
            url: listUrl,
            type: method,
            async: true,
            data: getdata,
            success: function(data) {
                controller.hide_progress();
                console.log(data);
                var jsonData = data;

                if (!Array.isArray(jsonData)) {
                    jsonData = [jsonData];
                }
                for (var i in jsonData) {
                    var counter = jsonData[i];
                    tmpData.push(counter);
                }

                console.log(tmpData);
                table.setData(tmpData).then(function() {
                    setTimeout(function() {

                        table.setData(tmpData).then(function() {}).catch(function(error) {});

                    }, 200);



                }).catch(function(error) {
                    //handle error loading data
                });


            },
            fail: function() {},
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                controller.hide_progress();
                var jsonData = XMLHttpRequest.responseText;
                console.log(jsonData);
                if (!Array.isArray(jsonData)) {
                    jsonData = [jsonData];
                }
                for (var i in jsonData) {
                    var counter = jsonData[i];
                    tmpData.push(counter);
                }
                table.setData(tmpData).then(function() {

                }).catch(function(error) {
                    //handle error loading data
                });
            }

        });

        var the_Function = function(cell, formatterParams, onRendered) { //plain text value
            return "<i class='fa fa-print'>function_trigger</i>";
        };
    },

    refreshCrudTables: function(formName = "") {

        if (formName == "") {
            for (i in allFormObj) {
                console.log("all form objects", allFormObj[i]);
                try {
                    controller.renderCRUDTable(allFormObj[i], 'GET');
                } catch (e) {
                    console.log("Object not found", allFormObj[i]);
                }
            }
        } else {
            controller.renderCRUDTable(allFormObj[formName], 'GET');
        }

    }
};

$(function() {

    controller.initActions();

});