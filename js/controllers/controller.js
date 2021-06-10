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

const publicPages = ["profile", "change-password", "error", "dashboard"];
//var serverURL = "http://212.71.245.25:8080/services/api/";
// var serverURL = "http://127.0.0.1:8000/";
var serverURL = "https://coseke-emeeting-backend.herokuapp.com/"
// var serverUIURL = "http://172.104.150.137:8080/kephis-ui/#app/";


var setupObj = [];
var allFormObj = [];
var SelectedData = [];
var toBeApprovedActivity = [];
var ids = [];
// var userObj = JSON.parse(localStorage.getItem("userObj"));
var controller = {
    init: function(formObj) {

        //Get form Obj
        this.myFormObj = formObj;
        //relation objects    	   	
        console.log("Controller Init");
        var winObj = controller.getWindowURLObject();
        this.windowId = winObj[winObj.length - 1];
        this.pageName = winObj[winObj.length - 2];

        //Check to see if window ID is empty
        if (!isNaN(this.windowId)) {

            //load all related setup before loading form
            controller.getRelationObjects(this.myFormObj.formName, true);

        } else {

            //new form
            controller.getRelationObjects(this.myFormObj.formName, false);
        }
    },

    index: function(ctx) {

        formData2 = {};
        //load company information

        /* var url2 = serverURL + "validateuser";
        		 controller.postRequestWithUserObj(url2, formData2, true, localStorage.getItem("userObj"), function(data, status) {
        			 var jsonObj2 = JSON.stringify(newData);
        			 console.log(jsonObj2);
        			 localStorage.setItem("companyObj", jsonObj2);
        			 companyObj = jsonObj2;
        		 });*/

        console.log(ctx.canonicalPath);
        var url = ctx.canonicalPath;
        var page = controller.getSecondPart(url);
        // if (page == false) {
        //     $(".content-wrapper").load("/html/shared/error.html");
        // } else {
        //     if (page == 'default') {
        //         page_2 = 'all_tenders';
        //     } else {
                page_2 = controller.getThirdPart(url);
            // }

            // alert("page2",page_2)
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
            // console.log("Has Rights>>" + controller.hasUserRights());

            // try {
            // 	var accessibleWindows = JSON.parse(localStorage.getItem("accessibleWindows"));
            // 	console.log("Check right", accessibleWindows);
            // 	var compareStr = "app/" + page_2;
            // 	console.log(compareStr);
            // 	if (accessibleWindows.includes(compareStr)) {

            // 	} else {
            // 		console.log("No rights");
            // 		$(".content-wrapper").html("<h3 style='padding-top:50px;padding-left:20px;'>No rights to access this window</h3>");
            // 		return false;
            // 	}
            // } catch (e) {
            // 	$(".content-wrapper").html("<h3 style='padding-top:50px;padding-left:20px;'>No rights to access this window</h3>");
            // 	console.log("No rights");
            // 	return false;
            // }


            // try {
            // 	recordID = controller.getFourthPart(url);

            // } catch (e) {
            // 	recordID = "";
            // }

            // if (!isNaN(recordID)) {
            // 	console.log("Its a number");
            // } else {
            // 	console.log("Its not a number");
            // }

            var http = new XMLHttpRequest();

            http.open('HEAD', "html/app/main.html", false);
            http.send();
            if (http.status != 404) {
                $(".content-wrapper").load("html/app/main.html", function() {
                    // var userObj = JSON.parse(localStorage.getItem("userObj"));
                    // if (userObj) {
                        //$(".headerTitle").html(controller.getTitle(page, page_2));
                        controller.setMenu(page, page_2);
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
                        
                    // } else {
                    //     // alert("Kindly Login")
                    //     // location.reload();
                    //     // window.location.href = "#app/all_tenders";
                    //     // location.reload();
                    //     // $(".crud_section").load("html/shared/error.html");
                    //     $(".crud_section").html("Kindly Log In <a href='login.html'><u>HERE</u></a>");
                    //     // $(".headerTitle").html("Error");
                    // }

                });

            // } else {
            //     $(".content-wrapper").load("html/shared/error.html");
            //     $(".headerTitleSection").html("Error");
            //     $(".headerTitle").html("Error");
            // }
        }
    },
    initializeTabs: function() {

        //load data  	
        for (i in allFormObj) {
            var formObj_ = allFormObj[i];
            if (formObj_.url_id == "tab") {

            }
        }

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

            //loadDocumentsUploadStatus
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

                /*formLinkTo
                var tabPos = currentTabPos - 1;
				
                allFormObj["selected"][formLinkTo]
				
                allFormObj["tab_" + tabPos] = allFormObj["selected"];*/

                //*****************************************************//		    		
                console.log(formObj_);
                console.log(parentPosition);


                if (activeTab == "exporterMarketDestination") {
                    selectedObj = allFormObj["tab_" + formLinkToName];
                } else {
                    if (parentPosition == 0) {
                        selectedObj = allFormObj["parent_selected"];
                    } else {
                        selectedObj = allFormObj["tab_" + formLinkToName];
                    }
                }

                console.log("Selected Obj ", formLinkToName);
                console.log("Selected Obj ", selectedObj);

                //get selected parent id
                try {
                    console.log('activeTab', activeTab);
                    selectParentID = selectedObj[formLinkTo];
                    if (selectedObj['exporterConsignment'] && selectedObj['split_export_consignment_id'] && activeTab == 'exporterConsignmentVarietyDetails') {
                        selectParentID = allFormObj['selected'][formLinkTo];
                        console.log("entered");
                    } else if (activeTab == 'exporterMarketDestination') {
                        selectParentID = allFormObj['selected'][formLinkTo];
                    } else if (selectedObj['assign_inspection_id']) {
                        selectParentID = selectedObj['consignmentInspectionRequest']['consignmentInspectionRequestID'];
                    } else {

                        selectParentID = allFormObj["selected"][formLinkTo];
                        //selectParentID = selectedObj[formLinkTo];
                        console.log("get parent id");
                        console.log(selectedObj);
                        console.log(formLinkTo);
                        console.log("not entered");
                    }
                } catch (e) {

                }

                console.log("Parent ID", selectParentID);

                var staticData = false;
                var staticDataContent = "";

                if (formLinkTo == 'usedetails.roles') {
                    staticDataContent = selectedObj["usedetails"]["roles"];
                    try {
                        staticData = formObj_["staticData"];
                        if (staticData == undefined || staticData == "undefined") {
                            staticData = false;
                        } else {
                            staticData = true;
                        }
                        console.log("Static Data");
                        console.log(staticData);
                        console.log(staticDataContent);
                    } catch (e) {

                    }
                } else {

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
                }

                //Check to see if it is document
                if (activeTab == "attachment") {
                    // var prequalificationTender_id = allFormObj['parent_selected']['prequalificationTenderItem_id'];
                    console.log(targetId);
                    if (targetId == "prequalificationTender") {
                        var prequalificationTenderCollectionID = allFormObj['parent_selected']['prequalificationTenderCollection_id'];
                        controller.loadDocumentsUploadStatus('#attachment', formObj_["listUrl"] + selectParentID, prequalificationTenderCollectionID, function() {
                            console.log("Documents Listed");
                        });
                    } else if (targetId == "tendercollections") {
                        var prequalificationTenderCollectionID = allFormObj['parent_selected']['tender_collection_id'];
                        controller.loadDocumentsUploadStatus_Tender('#attachment', formObj_["listUrl"] + selectParentID, prequalificationTenderCollectionID, function() {
                            console.log("Documents Listed");
                        });
                    }
                    return;
                }


                //set url with param
                var listUrl = formObj_.listUrl;

                if ((selectParentID == "undefined" || selectParentID == undefined) && currentTabPos > previousTabPos) {

                    controller.renderNoDataFound(activeTab, formObj_, function() {});

                } else {

                    //if(currentTabPos > previousTabPos){// && highestAccessedTab < currentTabPos
                    //set parent id queries

                    console.log("Parent ID" + selectParentID);
                    console.log(selectedObj);
                    console.log(formLinkTo);
                    console.log("before" + listUrl);
                    if (selectedObj['assign_authorisation_id']) {
                        selectParentID = selectParentID['pipApplicationID'];
                    }

                    if (activeTab == "rfqLine") {
                        listUrl = formObj_.listUrl;
                    }
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

        //on add new

        //
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
        //htmlCrudForm +="<div class='col-md-6'>";
        //htmlCrudForm +="<button class='refresh-page-btn xcrud-action btn btn-info btn-sm' onclick='location.reload(true)'>Refresh Page</button>";
        //htmlCrudForm +="</div>";
        htmlCrudForm += "</div></div></div>";

        //var htmlCrudForm = "<div id='" + formName + "_form' form-name='" + formName + "' class='crud_form " + formName + " parsley-form'><div class='container'><div class='row'><div class='col-md-6'><h2 class='headerTitle'> "+tableTitle+"</h2></div><div class='col-md-6'><button class='xcrud-action btn btn-info btn-sm' style='margin-left: 295px;margin-top: 20px;visibility:"+visibility+";width: 200px;text-align: center' onclick='location.reload(true)'>Refresh Page</button></div></div></div></div></div>";

        htmlCrudForm += "<div class='xcrud-top-actions'>";
        htmlCrudForm += "<div class='btn-group pull-left'>";
        // htmlCrudForm +="<a href='javascript:;' data-task='print' class='btn btn-light xcrud-in-new-window xcrud-action'><i class='fa fa-print'></i> Print</a><a href='javascript:;' data-task='csv' class='btn btn-light xcrud-in-new-window xcrud-action'><i class='fa fa-file'></i> Export into CSV</a></div>";

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
            //setTimeout(function(){
            controller.loadTable(thisObj.listingsArr, thisObj['listUrl'], thisObj.buttonsArr, thisObj.formName, targetIdentifier, thisObj.groupBy, postType);
            // }, 1000);

        });
        //callback(thisObj);
    },
    renderCRUDFormByName: function(target, formName, callback, method = "GET") {

        var thisObj = allFormObj[formName];
        controller.init(thisObj);
        //check for add button
        var crudAdd = true;
        try {
            crudAdd = thisObj.crudAdd;
            if (crudAdd == undefined || crudAdd == "undefined") {
                crudAdd = true;
            }
        } catch (e) {

        }

        var tableTitle = thisObj.tableTitle;
        var htmlCrudForm = "<div id='" + formName + "_form' form-name='" + formName + "' class='crud_form " + formName + " parsley-form'><h2 class='headerTitle'> " + tableTitle + "</h2>";
        htmlCrudForm += "<div class='xcrud-top-actions'>";
        htmlCrudForm += "<div class='btn-group pull-left'>";
        // htmlCrudForm +="<a href='javascript:;' data-task='print' class='btn btn-light xcrud-in-new-window xcrud-action'><i class='fa fa-print'></i> Print</a><a href='javascript:;' data-task='csv' class='btn btn-light xcrud-in-new-window xcrud-action'><i class='fa fa-file'></i> Export into CSV</a></div>";

        if (crudAdd) {
            htmlCrudForm += "<div class='add_btn_section'><a href='javascript:;' form-name='" + formName + "' data-task='create' class='btn btn-success xcrud-action addRecord'><i class='fa fa-plus'></i> Add</a><div class='clearfix'></div></div>";
        }

        htmlCrudForm += "</div><div class='listings' id='listings_" + formName + "'></div><div class='listings_edit' id='listings_edit_" + formName + "' style='position: absolute; display: none;top: -1px'></div></div>";
        $('.' + target).html(htmlCrudForm).promise().done(function() {
            controller.initActions();
            var targetIdentifier = "#listings_" + formName;
            controller.show_progress();
            controller.loadTable(thisObj.listingsArr, thisObj['listUrl'], thisObj.buttonsArr, thisObj.formName, targetIdentifier, thisObj.groupBy, method);

        });
        callback();
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
        // htmlCrudForm +="<a href='javascript:;' data-task='print' class='btn btn-light xcrud-in-new-window xcrud-action'><i class='fa fa-print'></i> Print</a><a href='javascript:;' data-task='csv' class='btn btn-light xcrud-in-new-window xcrud-action'><i class='fa fa-file'></i> Export into CSV</a></div>";

        if (crudAdd) {
            htmlCrudForm += "<div class='add_btn_section'><a href='javascript:;' form-name='" + formName + "' data-task='create' class='btn btn-success xcrud-action' onclick='upload_document_modal()'><i class='fa fa-plus'></i> Add Documents</a><div class='clearfix'></div></div>";
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
            } else {
                console.log("load table 1");
                controller.loadTableStaticData(thisObj['listingsArr'], staticDataContent, thisObj.buttonsArr, thisObj.formName, targetIdentifier, thisObj.groupBy, postType);
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
    loadUserDetails: function() {

        var url = "";
        if (window.page == "adminNot used") {
            url = 'api/getUserDetailsAdmin.json';
        } else {
            url = 'api/getUserDetails.json';
        }

        $.ajax({
            url: url,
            method: 'get',
            async: false,
            success: function(data) {

                var dashboardHTML = "";
                var firstName = userObj.email;
                var lastName = "";
                var role = data.role;
                var windowAccess = data.windowAccess;
                var windowAccessAdmin = data.windowAccessAdmin;

                org = urlPage;

                if (org == "Admin") {
                    controller.loadToolBarMenu(windowAccessAdmin, org);
                } else {
                    controller.loadToolBarMenu(windowAccess, org);
                }

                $("#fullNames").html(firstName + " " + lastName);
                window.windowAccess = data.windowAccess;
                window.windowAccessAdmin = data.windowAccessAdmin;
                window.org = org;

            },
            fail: function() {

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    },
    getFile: function(url, handleData) {

        jQuery.ajax({
            url: url,
            headers: {
                'Authorization': userObj.tokenType + " " + userObj.accessToken,
            },
            cache: false,
            xhr: function() { // Seems like the only way to get access to the xhr object
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob'
                return xhr;
            },
            success: function(data) {
                //var img = document.getElementById('img');
                var url = window.URL || window.webkitURL;
                fileSRC = url.createObjectURL(data);
                handleData(fileSRC);

            },
            error: function() {

            }
        });
    },
    loadRoleSelect: function(rolesArr, selectedVal) {
        var option = "";
        for (var j = 0; j < rolesArr.length; j++) {
            var itemO = rolesArr[j];
            if (selectedVal == itemO.role_id) {
                option += '<option selected value=' + itemO.role_id + '>' + itemO.name + '</option>';
            } else {
                option += '<option value=' + itemO.role_id + '>' + itemO.name + '</option>';
            }
        }
        return option;
    },
    loadUserAccess: function() {
        //userObj

        var tmpUserObj = JSON.parse(localStorage.getItem("userObj"));

        rolesArr = tmpUserObj.roles;
        console.log(tmpUserObj);
        console.log(rolesArr);
        var count = 0;
        var tmpAccessArr = ["app/dashboard", "app/notifications"];
        console.log("BEFORE ACCESS ADD", tmpAccessArr);
        for (var j = 0; j < rolesArr.length; j++) {
            var itemO = rolesArr[j];

            if (itemO.role_id == 697) {
                //importer

                for (var j = 0; j < importerMenu.menu.length; j++) {

                    var itemO = importerMenu.menu[j];
                    for (var k = 0; k < itemO['child'].length; k++) {
                        try {
                            tmpAccessArr.push(itemO['child'][k]['url']);
                        } catch (e) {

                        }
                    }

                }

            } else if (itemO.role_id == 699) {
                //exporter

                for (var j = 0; j < exporterMenu.menu.length; j++) {

                    var itemO = exporterMenu.menu[j];
                    for (var k = 0; k < itemO['child'].length; k++) {
                        try {
                            tmpAccessArr.push(itemO['child'][k]['url']);
                        } catch (e) {

                        }
                    }

                }

            } else if (itemO.role_id == 703) {
                // content manager

                for (var j = 0; j < contentManagerMenu.menu.length; j++) {

                    var itemO = contentManagerMenu.menu[j];
                    for (var k = 0; k < itemO['child'].length; k++) {
                        try {
                            tmpAccessArr.push(itemO['child'][k]['url']);
                        } catch (e) {

                        }
                    }

                }

            } else if (itemO.role_id == 691) {
                //regional manager

                for (var j = 0; j < regionalManagerMenu.menu.length; j++) {

                    var itemO = regionalManagerMenu.menu[j];
                    for (var k = 0; k < itemO['child'].length; k++) {
                        try {
                            tmpAccessArr.push(itemO['child'][k]['url']);
                        } catch (e) {

                        }
                    }

                }


            } else if (itemO.role_id == 693) {
                // senior inspector

                for (var j = 0; j < seniorInspectorMenu.menu.length; j++) {

                    var itemO = seniorInspectorMenu.menu[j];
                    for (var k = 0; k < itemO['child'].length; k++) {
                        try {
                            tmpAccessArr.push(itemO['child'][k]['url']);
                        } catch (e) {

                        }
                    }

                }

            } else if (itemO.role_id == 1) {
                // admin
                for (var j = 0; j < adminMenu.menu.length; j++) {

                    var itemO = adminMenu.menu[j];
                    for (var k = 0; k < itemO['child'].length; k++) {

                        try {
                            tmpAccessArr.push(itemO['child'][k]['url']);
                        } catch (e) {

                        }
                    }

                }

            } else if (itemO.role_id == 695) {
                //inspector

                for (var j = 0; j < InspectorMenu.menu.length; j++) {

                    var itemO = InspectorMenu.menu[j];
                    for (var k = 0; k < itemO['child'].length; k++) {
                        try {
                            tmpAccessArr.push(itemO['child'][k]['url']);
                        } catch (e) {

                        }

                    }

                }

            } else if (itemO.role_id == 701) {
                //new registrations

                for (var j = 0; j < newRegistrations.menu.length; j++) {

                    var itemO = newRegistrations.menu[j];
                    for (var k = 0; k < itemO['child'].length; k++) {

                        try {
                            tmpAccessArr.push(itemO['child'][k]['url']);
                        } catch (e) {

                        }
                    }

                }

            } else if (itemO.role_id == 10405) {
                // lab technician
                for (var j = 0; j < labTechnicianMenu.menu.length; j++) {

                    var itemO = labTechnicianMenu.menu[j];
                    for (var k = 0; k < itemO['child'].length; k++) {

                        try {
                            tmpAccessArr.push(itemO['child'][k]['url']);
                        } catch (e) {

                        }
                    }

                }
            } else if (itemO.role_id == 19100) {
                // agent technician
                for (var j = 0; j < agentMenu.menu.length; j++) {

                    var itemO = agentMenu.menu[j];
                    for (var k = 0; k < itemO['child'].length; k++) {

                        try {
                            tmpAccessArr.push(itemO['child'][k]['url']);
                        } catch (e) {

                        }
                    }

                }
            } else if (itemO.role_id == 7879) {
                // lab technician
                for (var j = 0; j < exporterImporterMenu.menu.length; j++) {

                    var itemO = exporterImporterMenu.menu[j];
                    for (var k = 0; k < itemO['child'].length; k++) {

                        try {
                            tmpAccessArr.push(itemO['child'][k]['url']);
                        } catch (e) {

                        }
                    }

                }
            }
        }
        localStorage.setItem("accessibleWindows", JSON.stringify(tmpAccessArr));

    },
    //load menu on role change
    loadMenuOnRoleChange: function(roleSelected, selectText) {

        selectText = "app";


        // New Registrations side menu



        // importer side menu


        var option = "";
        var userDetails_sidebar = "";
        userDetails_sidebar += '<li class="nav-heading login-section">' +
            '<span data-localize="sidebar.heading.HEADER"> ' +
            'Welcome, <br>' + userObj.name + '' +
            '<br> ' + userObj.email + '' +
            '</span>' +
            '</li><input type="text" id="userInput" onkeyup="serchMenuFunction()" style="width: 99%;margin-bottom: 20px;" placeholder="Search.."><i style="position: relative;top: -43px;left: 198px;"class="fa fa-search"></i>' +
            '<em class="icon-note"></em>' +
            '<a href="#app/dashboard" style="font-size: 14px;margin-left: 14px;color: #14a451;letter-spacing: 0.025em;font-weight: 800;">Dashboard</a>';
        // '<em class="fa fa-chevron-down expand"></em>';
        //create an array to loop over the menu items based on role selected
        if (roleSelected == 697) {
            //importer
            for (var j = 0; j < importerMenu.menu.length; j++) {
                var itemO = importerMenu.menu[j];

                option += '<li class="mainheader"">' +

                    '<a href="#' + itemO['id'] + '" title="" data-toggle="collapse" aria-expanded="false" class="collapse visible">' +

                    '<em class="icon-folder"></em>	' +
                    '<span data-localize="sidebar.nav.DASHBOARD106">' + itemO['parent'] + '</span>' +
                    '<em class="fa fa-chevron-down expand"></em>' +

                    '</a>' +
                    '<ul style="margin-left: 17px; height: auto;" id="' + itemO['id'] + '" class="nav sidebar-subnav level3-menu collapse" aria-expanded="false">';

                for (var i in itemO['child']) {
                    var item1 = itemO['child'][i]
                    option +=
                        '<li class>' +
                        '<a style="padding-left: 10px;" href="#' + item1['url'] + '" title="' + item1['title'] + '"> ' +
                        '	<em class="icon-note"></em> ' + item1['title'] + '' +

                        '	</a>' +
                        '</li>'
                }

                option += '</ul></li>'

            }
            $('#userDetails_sidebar').html(userDetails_sidebar);
            $('#menu-ul').html(option);
        } else if (roleSelected == 699) {
            //exporter
            for (var j = 0; j < exporterMenu.menu.length; j++) {
                var itemO = exporterMenu.menu[j];

                option += '<li class="mainheader">' +

                    '<a href="#' + itemO['id'] + '" title="" data-toggle="collapse" aria-expanded="false" class="collapse visible">' +

                    '<em class="icon-folder"></em>	' +
                    '<span data-localize="sidebar.nav.DASHBOARD106">' + itemO['parent'] + '</span>' +
                    '<em class="fa fa-chevron-down expand"></em>' +

                    '</a>' +
                    '<ul style="margin-left: 17px; height: auto;" id="' + itemO['id'] + '" class="nav sidebar-subnav level3-menu collapse" aria-expanded="false">';

                for (var i in itemO['child']) {
                    var item1 = itemO['child'][i]
                    option +=
                        '<li class>' +
                        '<a style="padding-left: 10px;" href="#' + item1['url'] + '" title="' + item1['title'] + '"> ' +
                        '	<em class="icon-note"></em> ' + item1['title'] + '' +

                        '	</a>' +
                        '</li>'
                }

                option += '</ul></li>'

            }
            $('#userDetails_sidebar').html(userDetails_sidebar);
            $('#menu-ul').html(option);
        } else if (roleSelected == 703) {
            // content manager
            for (var j = 0; j < contentManagerMenu.menu.length; j++) {
                var itemO = contentManagerMenu.menu[j];

                option += '<li class="mainheader">' +

                    '<a href="#' + itemO['id'] + '" title="" data-toggle="collapse" aria-expanded="false" class="collapse visible">' +

                    '<em class="icon-folder"></em>	' +
                    '<span data-localize="sidebar.nav.DASHBOARD106">' + itemO['parent'] + '</span>' +
                    '<em class="fa fa-chevron-down expand"></em>' +

                    '</a>' +
                    '<ul style="margin-left: 17px; height: auto;" id="' + itemO['id'] + '" class="nav sidebar-subnav level3-menu collapse" aria-expanded="false">';

                for (var i in itemO['child']) {
                    var item1 = itemO['child'][i]
                    option +=
                        '<li class>' +
                        '<a style="padding-left: 10px;" href="#' + item1['url'] + '" title="' + item1['title'] + '"> ' +
                        '	<em class="icon-note"></em> ' + item1['title'] + '' +

                        '	</a>' +
                        '</li>'
                }

                option += '</ul></li>'

            }
            $('#userDetails_sidebar').html(userDetails_sidebar);
            $('#menu-ul').html(option);
        } else if (roleSelected == 691) {
            //regional manager
            for (var j = 0; j < regionalManagerMenu.menu.length; j++) {
                var itemO = regionalManagerMenu.menu[j];

                option += '<li class="mainheader">' +

                    '<a href="#' + itemO['id'] + '" title="" data-toggle="collapse" aria-expanded="false" class="collapse visible">' +

                    '<em class="icon-folder"></em>	' +
                    '<span data-localize="sidebar.nav.DASHBOARD106">' + itemO['parent'] + '</span>' +
                    '<em class="fa fa-chevron-down expand"></em>' +

                    '</a>' +
                    '<ul style="margin-left: 17px; height: auto;" id="' + itemO['id'] + '" class="nav sidebar-subnav level3-menu collapse" aria-expanded="false">';

                for (var i in itemO['child']) {
                    var item1 = itemO['child'][i]
                    option +=
                        '<li class>' +
                        '<a style="padding-left: 10px;" href="#' + item1['url'] + '" title="' + item1['title'] + '"> ' +
                        '	<em class="icon-note"></em> ' + item1['title'] + '' +

                        '	</a>' +
                        '</li>'
                }

                option += '</ul></li>';

            }
            $('#userDetails_sidebar').html(userDetails_sidebar);
            $('#menu-ul').html(option);
        } else if (roleSelected == 693) {
            // senior inspector
            for (var j = 0; j < seniorInspectorMenu.menu.length; j++) {
                var itemO = seniorInspectorMenu.menu[j];

                option += '<li class="mainheader">' +
                    '<a href="#' + itemO['id'] + '" title="" data-toggle="collapse" aria-expanded="false" class="collapse visible">' +

                    '<em class="icon-folder"></em>	' +
                    '<span data-localize="sidebar.nav.DASHBOARD106">' + itemO['parent'] + '</span>' +
                    '<em class="fa fa-chevron-down expand"></em>' +

                    '</a>' +
                    '<ul style="margin-left: 17px; height: auto;" id="' + itemO['id'] + '" class="nav sidebar-subnav level3-menu collapse" aria-expanded="false">';

                for (var i in itemO['child']) {
                    var item1 = itemO['child'][i];
                    option += '<li class><a style="padding-left: 10px;" href="#' + item1['url'] + '" title="' + item1['title'] + '"> ' +
                        '	<em class="icon-note"></em> ' + item1['title'] + '</a>' + '</li>';
                }
                option += '</ul></li>';

            }
            $('#userDetails_sidebar').html(userDetails_sidebar);
            $('#menu-ul').html(option);

        } else if (roleSelected == 7879) {
            // senior inspector
            for (var j = 0; j < exporterImporterMenu.menu.length; j++) {
                var itemO = exporterImporterMenu.menu[j];

                option += '<li class="mainheader">' +
                    '<a href="#' + itemO['id'] + '" title="" data-toggle="collapse" aria-expanded="false" class="collapse visible">' +

                    '<em class="icon-folder"></em>	' +
                    '<span data-localize="sidebar.nav.DASHBOARD106">' + itemO['parent'] + '</span>' +
                    '<em class="fa fa-chevron-down expand"></em>' +

                    '</a>' +
                    '<ul style="margin-left: 17px; height: auto;" id="' + itemO['id'] + '" class="nav sidebar-subnav level3-menu collapse" aria-expanded="false">';

                for (var i in itemO['child']) {
                    var item1 = itemO['child'][i];
                    option += '<li class><a style="padding-left: 10px;" href="#' + item1['url'] + '" title="' + item1['title'] + '"> ' +
                        '	<em class="icon-note"></em> ' + item1['title'] + '</a>' + '</li>';
                }
                option += '</ul></li>';

            }
            $('#userDetails_sidebar').html(userDetails_sidebar);
            $('#menu-ul').html(option);
        } else if (roleSelected == 1) {
            // admin
            for (var j = 0; j < adminMenu.menu.length; j++) {
                var itemO = adminMenu.menu[j];

                option += '<li class="mainheader">' +

                    '<a href="#' + itemO['id'] + '" title="" data-toggle="collapse" aria-expanded="false" class="collapse visible">' +

                    '<em class="icon-folder"></em>	' +
                    '<span data-localize="sidebar.nav.DASHBOARD106">' + itemO['parent'] + '</span>' +
                    '<em class="fa fa-chevron-down expand"></em>' +

                    '</a>' +
                    '<ul style="margin-left: 17px; height: auto;" id="' + itemO['id'] + '" class="nav sidebar-subnav level3-menu collapse" aria-expanded="false">';

                for (var i in itemO['child']) {
                    var item1 = itemO['child'][i]
                    option +=
                        '<li class>' +
                        '<a style="padding-left: 10px;" href="#' + item1['url'] + '" title="' + item1['title'] + '"> ' +
                        '	<em class="icon-note"></em> ' + item1['title'] + '' +

                        '	</a>' +
                        '</li>'
                }

                option += '</ul></li>'

            }
            $('#userDetails_sidebar').html(userDetails_sidebar);
            $('#menu-ul').html(option);
        } else if (roleSelected == 695) {
            //inspector
            for (var j = 0; j < InspectorMenu.menu.length; j++) {
                var itemO = InspectorMenu.menu[j];

                option += '<li class="mainheader">' +

                    '<a href="#' + itemO['id'] + '" title="" data-toggle="collapse" aria-expanded="false" class="collapse visible">' +

                    '<em class="icon-folder"></em>	' +
                    '<span data-localize="sidebar.nav.DASHBOARD106">' + itemO['parent'] + '</span>' +
                    '<em class="fa fa-chevron-down expand"></em>' +

                    '</a>' +
                    '<ul style="margin-left: 17px; height: auto;" id="' + itemO['id'] + '" class="nav sidebar-subnav level3-menu collapse" aria-expanded="false">';

                for (var i in itemO['child']) {
                    var item1 = itemO['child'][i];
                    option +=
                        '<li class>' +
                        '<a style="padding-left: 10px;" href="#' + item1['url'] + '" title="' + item1['title'] + '"> ' +
                        '	<em class="icon-note"></em> ' + item1['title'] + '' +
                        '	</a>' +
                        '</li>';
                }
                option += '</ul></li>';
            }
            $('#userDetails_sidebar').html(userDetails_sidebar);
            $('#menu-ul').html(option);
        } else if (roleSelected == 701) {
            //new registrations
            for (var j = 0; j < newRegistrations.menu.length; j++) {
                var itemO = newRegistrations.menu[j];

                option += '<li class="mainheader">' +
                    '<a href="#' + itemO['id'] + '" title="" data-toggle="collapse" aria-expanded="false" class="collapse visible">' +
                    '<em class="icon-folder"></em>	' +
                    '<span data-localize="sidebar.nav.DASHBOARD106">' + itemO['parent'] + '</span>' +
                    '<em class="fa fa-chevron-down expand"></em>' +
                    '</a>' +
                    '<ul style="margin-left: 17px; height: auto;" id="' + itemO['id'] + '" class="nav sidebar-subnav level3-menu collapse" aria-expanded="false">';
                for (var i in itemO['child']) {
                    var item1 = itemO['child'][i];
                    option +=
                        '<li class>' +
                        '<a style="padding-left: 10px;" href="#' + item1['url'] + '" title="' + item1['title'] + '"> ' +
                        '	<em class="icon-note"></em> ' + item1['title'] + '' +
                        '	</a>' +
                        '</li>';
                }
                option += '</ul></li>';
            }
            $('#userDetails_sidebar').html(userDetails_sidebar);
            $('#menu-ul').html(option);
        } else if (roleSelected == 10405) {
            //lab technician
            for (var j = 0; j < labTechnicianMenu.menu.length; j++) {
                var itemO = labTechnicianMenu.menu[j];

                option += '<li class="mainheader">' +
                    '<a href="#' + itemO['id'] + '" title="" data-toggle="collapse" aria-expanded="false" class="collapse visible">' +
                    '<em class="icon-folder"></em>	' +
                    '<span data-localize="sidebar.nav.DASHBOARD106">' + itemO['parent'] + '</span>' +
                    '<em class="fa fa-chevron-down expand"></em>' +
                    '</a>' +
                    '<ul style="margin-left: 17px; height: auto;" id="' + itemO['id'] + '" class="nav sidebar-subnav level3-menu collapse" aria-expanded="false">';

                for (var i in itemO['child']) {
                    var item1 = itemO['child'][i];
                    option +=
                        '<li class>' +
                        '<a style="padding-left: 10px;" href="#' + item1['url'] + '" title="' + item1['title'] + '"> ' +
                        '	<em class="icon-note"></em> ' + item1['title'] + '' +
                        '	</a>' +
                        '</li>';
                }
                option += '</ul></li>';
            }
            $('#userDetails_sidebar').html(userDetails_sidebar);
            $('#menu-ul').html(option);
        } else if (roleSelected == 19100) {
            //agent technician
            for (var j = 0; j < agentMenu.menu.length; j++) {
                var itemO = agentMenu.menu[j];

                option += '<li class="mainheader">' +
                    '<a href="#' + itemO['id'] + '" title="" data-toggle="collapse" aria-expanded="false" class="collapse visible">' +
                    '<em class="icon-folder"></em>	' +
                    '<span data-localize="sidebar.nav.DASHBOARD106">' + itemO['parent'] + '</span>' +
                    '<em class="fa fa-chevron-down expand"></em>' +
                    '</a>' +
                    '<ul style="margin-left: 17px; height: auto;" id="' + itemO['id'] + '" class="nav sidebar-subnav level3-menu collapse" aria-expanded="false">';

                for (var i in itemO['child']) {
                    var item1 = itemO['child'][i];
                    option +=
                        '<li class>' +
                        '<a style="padding-left: 10px;" href="#' + item1['url'] + '" title="' + item1['title'] + '"> ' +
                        '	<em class="icon-note"></em> ' + item1['title'] + '' +
                        '	</a>' +
                        '</li>';
                }
                option += '</ul></li>';
            }
            $('#userDetails_sidebar').html(userDetails_sidebar);
            $('#menu-ul').html(option);
        }
    },
    preloadmenu: function() {
        var selectVal = document.getElementById("selectRoleVal").value;
        var selectText = document.getElementById("selectRoleVal").innerText;
        controller.loadMenuOnRoleChange(selectVal, selectText);
    },
    loadSelect: function(selectArr, id, name, selectedVal) {
        var option = "";
        for (var j = 0; j < selectArr.length; j++) {
            var itemO = selectArr[j];
            if (selectedVal == itemO[id]) {
                option += '<option selected value=' + itemO[id] + '>' + itemO[name] + '</option>';
            } else {
                option += '<option value=' + itemO[id] + '>' + itemO[name] + '</option>';
            }
        }
        return option;
    },
    UrlExists: function(url) {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status != 404;
    },
    about: function(ctx) {
        console.log('viewing about ' + (ctx.params.contactName || ''));
    },
    error: function(ctx) {
        window.location = "index.html";
    },
    contact: function(ctx) {
        console.log('viewing contact ' + (ctx.params.contactName || ''));
    },
    getSecondPart: function(str) {
        if (str === "/eProcurementUI/") {
            return "default";
        } else {
            hashArray = str.split('#');
            str = hashArray[1];

            if (str != undefined) {
                var res = str.split("/");
                return res[0];
            } else {

                return false;
            }
        }
    },
    getThirdPart: function(str) {
        str = str.split('#')[1];
        var res = str.split("/");
        return res[1];
    },
    getFourthPart: function(str) {
        str = str.split('#')[2];
        var res = str.split("/");
        return res[2];
    },
    loadToolBarMenu: function(accessArr, org) {

        var toolBarMenu = "";
        var sideMenu = "";
        var count = 0;

        toolBarMenu += "<div class='column' style='width:33%!important;'><h4 class='ui header'>Section</h4><div class='ui link list'>";

        for (key in accessArr) {

            count++;

            if (count == 9) {
                count = 0;
                toolBarMenu += "</div></div><div class='column' style='width:33%!important;'><h4 class='ui header'>Section</h4><div class='ui link list'>";
            }

            if (org == "Admin") {
                toolBarMenu += "<a style='color:#333!important;word-wrap: break-word;white-space: initial' class='item' href='./#" + org + "/" + accessArr[key].identifier + "'></i>" + accessArr[key].windowName + "</a>";
            } else {
                toolBarMenu += "<a style='color:#333!important;word-wrap: break-word;white-space: initial' class='item' href='./#" + org + "/" + accessArr[key].identifier + "-listing'></i>" + accessArr[key].windowName + "</a>";
            }
        }
        $(".menu-dropdown").html(toolBarMenu);

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
            // controller.editRow(data, this);
            var modal =
            '<div class="modal edit_meeting_modal" id="edit_meeting_modal" tabindex="-1" role="dialog">'+
            ' <div class="modal-dialog" role="document">'+
            ' <div class="modal-content">'+
            '  <div class="modal-header">'+
            '   <h5 class="modal-title">Edit Meeting Details</h5>'+
            ' <button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
            '   <button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
            '       <span aria-hidden="true">&times;</span>'+
            '    </button>'+
            '   </div>'+
            '   <div class="modal-body">'+
            '       <form method="POST" id="meeting_update_form">'+
            '                   <div class="form-group">'+
            '                       <label for="meeting_name">Meeting Name</label>'+
            '                       <input type="text" class="form-control" id="meeting_name"'+
            '                       placeholder="Enter Meeting Name" name="meeting_name" value='+data.meeting_name+' required>'+
            '                   </div>'+
            '                   <div class="form-row">'+
            '                       <div class="form-group col-md-6">'+
            '                           <label for="start_date_time">Start Date & Time</label>'+
            '                           <input type="date" class="form-control" id="start_date_time"'+
            '                           placeholder="Enter Start Date & Time" name="start_date_time" value='+data.start_date_time+' required>'+
            '                       </div>'+
            '                       <div class="form-group col-md-6">'+
            '                           <label for="end_date_time">End Date & Time</label>'+
            '                           <input type="date" class="form-control" id="end_date_time"'+
            '                               placeholder="Enter End Date & Time" name="end_date_time"  value='+data.end_date_time+' required>'+
            '                       </div>'+
            '                   </div>'+
            '                   <div class="form-group">'+
            '                       <label for="meeting_agenda"> Meeting Agenda</label>'+
            '                       <textarea cols="100" rows="4" class="form-control" id="meeting_agenda"'+
            '                           name="meeting_agenda" placeholder="Enter Meeting Agenda"'+
            '                           required>'+data.meeting_agenda+'</textarea>'+
            '<input type="hidden"  name="meeting_id" id="meeting_id" value='+data.meeting_id+'></>'+
            '           </div>'+
            '   </div>'+
            '    <div class="modal-footer">'+
            '        <button type="button" id="edit_meeting_form_button" onclick="updateMeeting()" class="btn btn-primary" style="float: right;'+
            '        font-size: 14px;" >Save'+
            '            changes</button>'+
            '      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
            '    </form>'+
            '    </div>'+
            '  </div>'+
            '</div>'+
            '</div>';
 
             $("#view_modal").html(modal);
            
             $('.modal.edit_meeting_modal').modal({backdrop: 'static', keyboard: false}); 
 

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


        buttonDelete = document.createElement("button");
        buttonDelete.innerHTML = "<i class='fa fa-view'></i> Delete"; //xcrud-action btn btn-warning btn-sm
        buttonDelete.classList.add("xcrud-action");
        buttonDelete.classList.add("btn");
        buttonDelete.classList.add("btn-danger");
        buttonDelete.classList.add("btn-sm");

        var listFormName = "";
        if (formName == "") {
            listFormName = this.myFormObj.formName;
        } else {
            listFormName = formName;
        }

        buttonDelete.setAttribute("form-name", listFormName);
        buttonDelete.setAttribute("type", "button");

        buttonDelete.addEventListener("click", function() {
            console.log("DELETE PRESSED", data);
            // allFormObj["highestAccessedTab"] = 0;
            controller.deleteRecord(data);
            // controller.viewRow(data, this);

        }, false);

        /*submit application*/
        var displaylogic = false;
        buttonSubmit = document.createElement("button");
        buttonSubmit.setAttribute("type", "button");
        buttonSubmit.innerHTML = "<i class='icon-arrow-right'></i> Submit Application"; //xcrud-action btn btn-warning btn-sm
        buttonSubmit.classList.add("xcrud-action");
        buttonSubmit.classList.add("btn");
        buttonSubmit.classList.add("btn-success");
        buttonSubmit.classList.add("btn-sm");
        buttonSubmit.addEventListener("click", function(event) {
            event.stopPropagation();
            if (!event.detail || event.detail == 1) {
                console.log("Participate", data);
                // var userObj = localStorage.getItem('userObj');
                if (userObj) {
                    console.log("user is logged in proceed");
                    console.log("form name", formName);
                    /*tender items submission with attachments*/
                    if (formName == "prequalificationTenderCollection") {
                        controller.submitPrequalificationsItem(data.prequalificationTenderCollection_id, function() {
                            location.reload();
                        });
                        //location.reload();
                    } else if (formName == "tendercollections") {
                        controller.submitTenderItemApplication(data.tender_collection_id, function() {
                            location.reload();
                        });
                    }
                }


            }
        });

        buttonAddQuantity = document.createElement("button");
        buttonAddQuantity.setAttribute("type", "button");
        buttonAddQuantity.innerHTML = "<i class='icon-arrow-right'></i> Update Response"; //xcrud-action btn btn-warning btn-sm
        buttonAddQuantity.classList.add("xcrud-action");
        buttonAddQuantity.classList.add("btn");
        buttonAddQuantity.classList.add("btn-success");
        buttonAddQuantity.classList.add("btn-sm");
        buttonAddQuantity.addEventListener("click", function(event) {
            //event.stopPropagation();
            if (!event.detail || event.detail == 1) {
                // var userObj = localStorage.getItem('userObj');
                if (userObj) {
                    console.log("user is logged in proceed");
                    console.log("form name", formName);
                    /*tender items submission with attachments*/
                    if (formName == "rfqResponseLine") {

                        controller.submitQuntityButton(data.c_rfqresponseLine_id)

                        console.log("ddd", data.c_rfqresponseLine_id);
                        //location.reload();
                    } else {
                        console.log("user is NOT logged in kindly show login form as modal");
                        $('.modal.fade.login').modal('show');
                        $("#rfline").val(data.c_rfqresponseLine_id)
                    }
                }


            }
        });

        /*submit rfq response*/
        buttonRfqResponsd = document.createElement("button");
        buttonRfqResponsd.setAttribute("type", "button");
        buttonRfqResponsd.innerHTML = "<i class='icon-arrow-right'></i> Submit Response"; //xcrud-action btn btn-warning btn-sm
        buttonRfqResponsd.classList.add("xcrud-action");
        buttonRfqResponsd.classList.add("btn");
        buttonRfqResponsd.classList.add("btn-success");
        buttonRfqResponsd.classList.add("btn-sm");
        buttonRfqResponsd.addEventListener("click", function(event) {
            //event.stopPropagation();
            if (!event.detail || event.detail == 1) {
                // var userObj = localStorage.getItem('userObj');
                if (userObj) {
                    console.log("user is logged in proceed");
                    console.log("form name", formName);
                    /*tender items submission with attachments*/
                    if (formName == "rfqResponseLine") {

                        console.log("ffff", formName);
                        controller.submitMyRfqTenderResponse(data.c_rfqresponseLine_id)


                        console.log("ddd", data.c_rfqresponseLine_id);
                        //location.reload();
                    } else {
                        console.log("user is NOT logged in kindly show login form as modal");
                        $('.modal.fade.login').modal('show');
                        //$("#rfline").val(data.c_rfqresponseLine_id)
                    }
                }


            }
        });

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
                    var url = serverURL + "get_participant_info/"+data.meeting_issues_id+"/"+userObj.users_id;
                    controller.getRequest(url,true,function(data, status) {
                        if(data){
                            controller.showToastMsg("You Have Already Voted On This Issue","#ff6666")
                        }else{
                            var url2 = serverURL + "upvote/"+data.meeting_issues_id+"/"+userObj.users_id;
                            console.log(url)
                            controller.request(url2, '', true,function(data, status) {
                                controller.showToastMsg("Voted Successfuly","#1a5589")
                                console.log(status);
                                console.log(data);
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
                    var url = serverURL + "get_participant_info/"+data.meeting_issues_id+"/"+userObj.users_id;
                    controller.getRequest(url,true,function(data, status) {
                        if(data){
                            controller.showToastMsg("You Have Already Voted On This Issue","#ff6666")
                        }else{
                            var url2 = serverURL + "downvote/"+data.meeting_issues_id+"/"+userObj.users_id;
                            console.log(url)
                            controller.request(url2, '', true,function(data, status) {
                                controller.showToastMsg("Voted Successfuly","#1a5589")
                                console.log(status);
                                console.log(data);
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
            var url = serverURL+"download/"+filename
            $.ajax({
                cache: false,
                type: 'GET',
                url: url,
                contentType: false,
                processData: false,
                xhrFields: {
                    responseType: 'blob'
                },
                success: function (response, status, xhr) {
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

        var crudDeleteRecord = false;
        try {
            crudDeleteRecord = currentObj.crudDeleteRecord;
            if (crudDeleteRecord == undefined || crudDeleteRecord == "undefined") {
                crudDeleteRecord = false;
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

        if (crudDeleteRecord) {
            buttonHolder.appendChild(buttonDelete);
        }


        if (crudUpvote) {
            buttonHolder.appendChild(buttonUpvote);
        }


        if (crudDownvote) {
            buttonHolder.appendChild(buttonDownvote);
        }


        return buttonHolder; //return button list
    },
    convertToPdf: function(base64,name){
            var bufferArray = base64ToArrayBuffer(base64);
            var blobStore = new Blob([bufferArray], { type: "application/pdf" });
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blobStore);
                return;
            }
            var data = window.URL.createObjectURL(blobStore);
            var link = document.createElement('a');
            document.body.appendChild(link);
            link.href = data;
            link.download = ""+name+".pdf";
            link.click();
            window.URL.revokeObjectURL(data);
            link.remove();
        
        function base64ToArrayBuffer(data) {
            var bString = window.atob(data);
            var bLength = bString.length;
            var bytes = new Uint8Array(bLength);
            for (var i = 0; i < bLength; i++) {
                var ascii = bString.charCodeAt(i);
                bytes[i] = ascii;
            }
            return bytes;
        };
    },
    participate_in_item: function(prequalificationTenderItem_id, callback) {
        console.log(prequalificationTenderItem_id);
        var url = serverURL + "prequalification/participate";
        var formData = {
            "prequalificationTenderCollection_id": 0,
            "prequalificationTenderItem_id": prequalificationTenderItem_id
        }
        var formData2 = JSON.stringify(formData);
        console.log(formData2)
        var userObj = JSON.parse(localStorage.getItem("userObj"));
        controller.request(url, formData2, true, userObj.token, function(data, status) {
            console.log(status);
            console.log(data);
            console.log(data.message);

            if (status == "error") {
                controller.showToastMsg(data.responseJSON.message);
                return true;
            }

            if (data.status) {

                controller.showToastMsg("Item Selected for participation, Select My Active Prequalification to Proceed", "#008300");
                // setTimeout(() => { location.reload(true) }, 2000);
            } else {
                controller.showToastMsg(data.message, "#008300");
                controller.showToastMsg("Item Not Selected", "#ff6666");
                // setTimeout(() => { location.reload(true) }, 2000);

            }

        })
    },

    /*add quantity button*/
    submitQuntityButton: function(c_rfqresponseLine_id) {
        console.log("responselineid", c_rfqresponseLine_id);
        $('.modal.fade.quanty').modal('show');
        $('#updateAmount').click(function() {
            var url = serverURL + "rfq/updateRfqResponse";
            var formData = {
                "c_rfqresponseLine_id": c_rfqresponseLine_id,
                "price": $('#line_price').val(),
                "quantity": $('#line_quantity').val(),
                "discount": $('#line_discount').val()
            }
            var formData = JSON.stringify(formData);
            console.log(formData)
            var userObj = JSON.parse(localStorage.getItem("userObj"));
            controller.request(url, formData, true, userObj.token, function(data, status) {
                console.log(data);
                if (data.status) {
                    controller.showToastMsg("Response Updated Successfully!!!", "#008300");
                    // setTimeout(() => { location.reload(true) }, 2000);
                } else {
                    controller.showToastMsg("Item Not Updated", "#ff6666");
                    // setTimeout(() => { location.reload(true) }, 2000);
                }
            })
        })

    },

    participate_in_item_tender: function(tenderItem_id, callback) {
        console.log(tenderItem_id);
        var url = serverURL + "tender/tenderParticipate";
        var formData = {
            "tender_collection_id": 0,
            "tender_item_id": tenderItem_id
        }
        var formData2 = JSON.stringify(formData);
        console.log(formData2)
        var userObj = JSON.parse(localStorage.getItem("userObj"));
        controller.request(url, formData2, true, userObj.token, function(data, status) {
            console.log(data);
            if (status == "error") {
                controller.showToastMsg(data.responseJSON.message);
                return true;
            }

            if (data.status) {
                controller.showToastMsg("Item Selected for participation, Select My Tender to Proceed", "#008300");
                // controller.showToastMsg(data.message, "#008300");
                // setTimeout(() => { location.reload(true) }, 2000);
            } else {
                controller.showToastMsg("Item Not Selected", "#ff6666");
                // setTimeout(() => { location.reload(true) }, 2000);
            }
        })
    },
    participate_in_item_rfq: function(rfqItem_id, callback) {
        console.log(rfqItem_id);
        var url = serverURL + "tender/tenderParticipate";
        var formData = {
            "tender_collection_id": 0,
            "tender_item_id": rfqItem_id
        }
        var formData2 = JSON.stringify(formData);
        console.log(formData2)
        var userObj = JSON.parse(localStorage.getItem("userObj"));
        controller.request(url, formData2, true, userObj.token, function(data, status) {
            console.log(data);
            if (data.status) {
                controller.showToastMsg("Item Selected for participation, Select My RFQ to Proceed", "#008300");
                // setTimeout(() => { location.reload(true) }, 2000);
            } else {
                controller.showToastMsg("Item Not Selected", "#ff6666");
                // setTimeout(() => { location.reload(true) }, 2000);
            }
        })
    },


    /*tender item submission button here with form data*/
    submitTenderItemApplication: function(tender_collection_id, callback) {
        console.log(tender_collection_id);
        var url = serverURL + "tender/submitTenderCollection/" + tender_collection_id;
        var formData = {
            "tender_collection_id": 0,
            "tender_item_id": tender_collection_id
        }
        var formData2 = JSON.stringify(formData);
        console.log(formData2)
        var userObj = JSON.parse(localStorage.getItem("userObj"));
        controller.request(url, "", true, userObj.token, function(data, status) {
            console.log(data);
            if (data.status) {
                controller.showToastMsg("Tender Item Submitted Successfully!!!", "#008300");
                callback();
                // setTimeout(() => { location.reload(true) }, 2000);
            } else {
                controller.showToastMsg("Item Not Submitted", "#ff6666");
                callback();
                // setTimeout(() => { location.reload(true) }, 2000);
            }
        })
    },


    /*prequalification tender submit button*/
    submitPrequalificationsItem: function(prequalificationTenderItem_id, callback) {
        console.log(prequalificationTenderItem_id);
        var url = serverURL + "prequalification/submitCollection/" + prequalificationTenderItem_id;
        var formData = {
            "tender_collection_id": 0,
            "tender_item_id": prequalificationTenderItem_id
        }
        var formData2 = JSON.stringify(formData);
        console.log(formData2)
        var userObj = JSON.parse(localStorage.getItem("userObj"));
        controller.request(url, "", true, userObj.token, function(data, status) {
            console.log(data);
            if (data.status) {
                controller.showToastMsg("Tender Item Submitted Successfully!!!", "#008300");
                callback();
                // setTimeout(() => { location.reload(true) }, 2000);
            } else {
                controller.showToastMsg("Item Not Submitted", "#ff6666");
                callback();
                // setTimeout(() => { location.reload(true) }, 2000);
            }
        })
    },

    /*my rfqs response submission*/
    submitMyRfqTenderResponse: function(c_rfqresponseLine_id, callback) {
        console.log(c_rfqresponseLine_id);
        var url = serverURL + "rfq/submitResponseLine/" + c_rfqresponseLine_id;
        // var formData = {
        //     "c_rfqresponse_id": 0,
        //     "c_rfqresponseLine_id": c_rfqresponseLine_id
        // }
        var formData = JSON.stringify(formData);
        console.log(formData2)
        var userObj = JSON.parse(localStorage.getItem("userObj"));
        controller.request(url, " ", true, userObj.token, function(data, status) {
            console.log(data);
            if (data.status) {
                controller.showToastMsg("Respond Submitted Successfully!!!", "#008300");
                callback();
                // setTimeout(() => { location.reload(true) }, 2000);
            } else {
                controller.showToastMsg("Item Not Submitted", "#ff6666");
                callback();
                // setTimeout(() => { location.reload(true) }, 2000);
            }
        })
    },


    AskQuestions: function(data,question, callback) {
        console.log(data);
        var url = serverURL + "tender/questionAnswer";
        if(data.tender_item_id){
            var formData = {
                "questionAnswer_id": 0,
                "tenderLine_id": data.tender_item_id,
                "prequalificationTenderItem_id": 0,
                "question": question
            }
        }else{
            var formData = {
                "questionAnswer_id": 0,
                "tenderLine_id": 0,
                "prequalificationTenderItem_id": data.prequalificationTenderItem_id,
                "question": question
            }
        }
        var formData2 = JSON.stringify(formData);
        console.log(formData2)
        var userObj = JSON.parse(localStorage.getItem("userObj"));
        controller.request(url, formData2, true, userObj.token, function(data, status) {
            console.log(data);
            if (status == "error") {
                controller.showToastMsg(data.responseJSON.message);
                return true;
            }

            if (data.status) {
                $('.modal.fade.askquestions').modal('hide');
                controller.showToastMsg("Question Submitted", "#008300");
                // controller.showToastMsg(data.message, "#008300");
                // setTimeout(() => { location.reload(true) }, 2000);
            } else {
                controller.showToastMsg("Kindly Try Again", "#ff6666");
                // setTimeout(() => { location.reload(true) }, 2000);
            }
        })
    },
    uploadContract : function(data){
        console.log(data);
        var url = serverURL + "contract/contractAwardAttachment";
        var formData = {
            "contractAwardAttachment_id": 0,
            "contractAward_id": data.contractAward_id,
            "name": "Contract Upload",
            "description": "string",
            "attachment": "string"
        }
        var formData2 = JSON.stringify(formData);
        console.log(formData2)
        var userObj = JSON.parse(localStorage.getItem("userObj"));
        controller.request(url, formData2, true, userObj.token, function(data, status) {
            console.log(data);
            if (status == "error") {
                controller.showToastMsg(data.responseJSON.message);
                return true;
            }

            if (data.status) {
                $('.modal.fade.UploadContracts').modal('hide');
                controller.showToastMsg("Contract Submitted", "#008300");
                // controller.showToastMsg(data.message, "#008300");
                // setTimeout(() => { location.reload(true) }, 2000);
            } else {
                controller.showToastMsg("Kindly Try Again", "#ff6666");
                // setTimeout(() => { location.reload(true) }, 2000);
            }
        })
    },
    update_auction_bid : function(data,updateamount){
        console.log(data);
        var url = serverURL + "reverseAuction/bid";
        var formData = {
            "auctionBidder_id": 0,
            "auctionLine_id": data.auctionLine_id,
            "bidderAmount": updateamount,
            "bidderRank": 0
        }
        var formData2 = JSON.stringify(formData);
        console.log(formData2)
        var userObj = JSON.parse(localStorage.getItem("userObj"));
        controller.request(url, formData2, true, userObj.token, function(data, status) {
            console.log(data);
            if (status == "error") {
                controller.showToastMsg(data.responseJSON.message);
                return true;
            }

            if (data.status) {
                $('.modal.fade.RaiseBids').modal('hide');
                controller.showToastMsg("Your Bid has been submitted", "#008300");
                // controller.showToastMsg(data.message, "#008300");
                // setTimeout(() => { location.reload(true) }, 2000);
            } else {
                controller.showToastMsg("Kindly Try Again", "#ff6666");
                // setTimeout(() => { location.reload(true) }, 2000);
            }
        })
    },
    deleteRecord: function(data) {
        if (data.exporterFirmID) {
            var url = serverURL + "exporterFirm/deleteExporterFirm?exporterFirmID=" + data.exporterFirmID + "";
            var formData = {
                "exporterFirmID": data.exporterFirmID,
            };
            var async_status = true;
            controller.allPostRequest(url, formData, async_status, function(datam, status) {
                console.log("Delete Data>>>>>>>>>>>>", datam);
                controller.showToastMsg(datam.data, "#1a5589");
                controller.refreshCrudTables();
                // updatenotificationval(notification_id);
            });
        } else if (data.exporterFarmID) {
            var url = serverURL + "exporterFirm/deleteExporterFirm?exporterFirmID=" + data.exporterFirmID + "";
            var formData = {
                "exporterFirmID": data.exporterFirmID,
            };
            var async_status = true;
            controller.allPostRequest(url, formData, async_status, function(datam, status) {
                console.log("Delete Data>>>>>>>>>>>>", datam);
                controller.showToastMsg(datam.data, "#1a5589");
                controller.refreshCrudTables();
                // updatenotificationval(notification_id);
            });

        }
    },
    loadSideMenu: function(page, callbackF) {

        var sideMenu = "<div class='ui accordion'>";
        org = window.org;

        if (org == "Admin") {
            accessArr = window.windowAccessAdmin;
            var isOpen = "";
            var tmpTopMenu = "";
            var tmpSideMenu = "";
            var tmpMenu = "";
            var parentCnt = 0;
            var childCnt = 0;
            var t = 0;
            for (key in accessArr) {
                t++;
                if (accessArr[key].identifier == "main_menu") {
                    if (parentCnt > 0) {

                        var tmpTopMenu = "<div class='title " + isOpen + "'><i class='dropdown icon'></i>" + tmpMenu + "</div><div class='content " + isOpen + "'>";

                        sideMenu += tmpTopMenu + tmpSideMenu + "</div>";

                        tmpMenu = accessArr[key].windowName;
                        tmpSideMenu = "";

                    } else {
                        tmpMenu = accessArr[key].windowName;
                        //tmpTopMenu = "<div class='title " + isOpen + "'><i class='dropdown icon'></i>" + accessArr[key].windowName + "</div><div class='content'>";
                        //sideMenu = tmpTopMenu + sideMenu;
                    }
                    parentCnt++;
                    isOpen = "";

                } else if (accessArr[key].identifier == page) {

                    if (accessArr[key].identifier == "activity") {
                        tmpSideMenu += "<a class='item active mission-arrival-notice-menu ' href='./#" + org + "/" + accessArr[key].identifier + "'><i class='" + accessArr[key].icon + "'></i><span class='alertNo'></span>" + accessArr[key].windowName + "</a>";
                    } else {
                        tmpSideMenu += "<a class='item active mission-arrival-notice-menu' href='./#" + org + "/" + accessArr[key].identifier + "'><i class='" + accessArr[key].icon + "'></i>" + accessArr[key].windowName + "</a>";
                        isOpen = "active";
                    }

                } else {
                    if (accessArr[key].identifier == "activity") {
                        tmpSideMenu += "<a class='item mission-arrival-notice-menu' href='./#" + org + "/" + accessArr[key].identifier + "'><i class='" + accessArr[key].icon + "'></i><span class='alertNo'></span>" + accessArr[key].windowName + "</a>";
                    } else {
                        tmpSideMenu += "<a class='item mission-arrival-notice-menu' href='./#" + org + "/" + accessArr[key].identifier + "'><i class='" + accessArr[key].icon + "'></i>" + accessArr[key].windowName + "</a>";
                    }
                }

            }
        } else {

            var isOpen = "active";
            var tmpTopMenu = "";
            var tmpSideMenu = "";
            var tmpMenu = "";
            accessArr = window.windowAccess;
            var parentCnt = 0;
            var childCnt = 0;
            var t = 0;
            var x = 0;
            for (key in accessArr) {
                t++;
                if (accessArr[key].identifier == "main_menu") {
                    if (parentCnt > 0) {

                        x++;
                        if (x == 1) {
                            //isOpen = "active";
                        }
                        var tmpTopMenu = "<div class='title " + isOpen + "'><i class='dropdown icon'></i>" + tmpMenu + "</div><div class='content " + isOpen + "'>";

                        sideMenu += tmpTopMenu + tmpSideMenu + "</div>";

                        tmpMenu = accessArr[key].windowName;
                        tmpSideMenu = "";

                    } else {

                        tmpMenu = accessArr[key].windowName;
                        //tmpTopMenu = "<div class='title " + isOpen + "'><i class='dropdown icon'></i>" + accessArr[key].windowName + "</div><div class='content'>";
                        //sideMenu = tmpTopMenu + sideMenu;
                    }
                    parentCnt++;
                    isOpen = "";

                } else if (accessArr[key].identifier + "-listing" == page) {

                    if (accessArr[key].identifier == "activity") {

                        if (org == accessArr[key].rights || accessArr[key].rights == "all") {
                            tmpSideMenu += "<a class='item active mission-arrival-notice-menu' href='./#" + org + "/" + accessArr[key].identifier + "-listing'><i class='" + accessArr[key].icon + "'></i><span class='alertNo'></span>" + accessArr[key].windowName + "</a>";
                        }

                    } else {

                        if (org == accessArr[key].rights || accessArr[key].rights == "all") {
                            tmpSideMenu += "<a class='item active mission-arrival-notice-menu' href='./#" + org + "/" + accessArr[key].identifier + "-listing'><i class='" + accessArr[key].icon + "'></i>" + accessArr[key].windowName + "</a>";
                        }

                    }
                    isOpen = "active";

                } else {

                    if (accessArr[key].identifier == "activity") {

                        if (org == accessArr[key].rights || accessArr[key].rights == "all") {
                            tmpSideMenu += "<a class='item mission-arrival-notice-menu' href='./#" + org + "/" + accessArr[key].identifier + "-listing'><i class='" + accessArr[key].icon + "'></i><span class='alertNo'></span>" + accessArr[key].windowName + "</a>";
                        }

                    } else {

                        if (org == accessArr[key].rights || accessArr[key].rights == "all") {
                            tmpSideMenu += "<a class='item mission-arrival-notice-menu' href='./#" + org + "/" + accessArr[key].identifier + "-listing'><i class='" + accessArr[key].icon + "'></i>" + accessArr[key].windowName + "</a>";
                        }
                    }
                }
            }
        }

        sideMenu += "</div>";
        $(".sidemenu").html(sideMenu);
        callbackF();

    },
    setMenu: function(page, page2) {

        if (page != "Admin") {
            $(".dashboardmenu").html("<a href='./#" + page + "/dashboard' class='header'> <i class='dashboard icon'></i> Dashboard </a>");
            $(".sharedLinks").html("<a class='item profileLink' href='./#" + page + "/profile'><i class='user icon'></i>Profile</a>" +
                "<a class='item changePassLink' href='javascript:controller.showMyPassForm();'><i class='edit icon'></i>Change Password</a>" +
                "<div class='divider'></div>" +
                "<a class='item' href='javascript:controller.logout();'><i class='sign out icon'></i>Logout</a>");

            controller.loadSideMenu(page2, function() {
                $('.ui.accordion').accordion();
            });

        } else if (page == "Admin") {
            $(".dashboardmenu").html("<a href='./#Admin/dashboard' class='header'> <i class='dashboard icon'></i> Dashboard </a>");
            $(".sharedLinks").html("<a class='item profileLink' href='./#" + page + "/profile'><i class='user icon'></i>Profile</a>" +
                "<a class='item changePassLink' href='javascript:controller.showMyPassForm();'><i class='edit icon'></i>Change Password</a>" +
                "<div class='divider'></div>" +
                "<a class='item' href='javascript:controller.logout();'><i class='sign out icon'></i>Logout</a>");
            controller.loadSideMenu(page2, function() {
                $('.ui.accordion').accordion();
            });
        }

        if (localStorage.getItem("alertNo") != "" || localStorage.getItem("alertNo") != undefined || localStorage.getItem("alertNo") != null || localStorage.getItem("alertNo") != "null") {
            var alertHtml = "<span class='alertNoMsg'>" + localStorage.getItem("alertNo") + "</span>"
            $(".alertNo").html(alertHtml);
        }

    },
    logout: function() {


        var logoutURL = serverURL + "api/auth/oauth/token";
        $.ajax({
            url: logoutURL,
            headers: {
                'Authorization': userObj.tokenType + " " + userObj.accessToken,
            },
            method: 'delete',
            async: true,
            success: function(data) {



            },
            fail: function() {

                $("#blinder").hide();

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {

                $("#blinder").hide();

            }
        });

        localStorage.setItem("userObj", "");
        window.location = "login.html";

    },
    hasAdminRights: function() {
        rolesArr = userObj.roles;
        var count = 0;

        for (var j = 0; j < rolesArr.length; j++) {
            var itemO = rolesArr[j];
            if (itemO.name == "ROLE_ADMIN") {
                count++;
            }
        }

        return count;

    },
    hasUserRights: function() {
        rolesArr = userObj.roles;
        var count = 0;

        for (var j = 0; j < rolesArr.length; j++) {
            var itemO = rolesArr[j];
            if (itemO.name == "ROLE_USER") {
                count++;
            }

        }

        return count;

    },
    hasModeratorRights: function() {
        rolesArr = userObj.roles;
        var count = 0;

        for (var j = 0; j < rolesArr.length; j++) {
            var itemO = rolesArr[j];

            if (itemO.name == "ROLE_MODERATOR") {
                count++;
            }
        }

        return count;

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

    getAuthRequest: function(url, async_status, handleData) {
        $.ajax({
            url: url,
            type: 'GET',
            async: async_status,
            headers: {
                'Authorization': userObj.tokenType + " " + userObj.accessToken,
            },
            success: function(data) {
                handleData(data, true);

            },
            fail: function(xhr) {
                handleData(xhr, false);


            },
            error: function(xhr, textStatus) {
                handleData(xhr, false);
            }
        });
    },
    allPostRequest: function(url, formData, async_status, token, handleData) {
        console.log("POST DATA", formData);
        var formData = JSON.stringify(formData);
        $.ajax({
            url: url,
            headers: {
                'Authorization': "Bearer " + token,
            },
            async: async_status,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: formData,
            success: function(data) {
                console.log(data);
                // var jsonData = data;
                handleData(data);

            },
            fail: function(e) {
                console.log(e);
                handleData(e);
                $("#blinder").hide();


            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                handleData(XMLHttpRequest);
                $("#blinder").hide();

            }
        });
    },
    postRequest: function(url, formData, async_status, handleData) {
        console.log("PRINT FDATA", formData);
        $.ajax({
            url: url,
            async: async_status,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: formData,
            success: function(data) {
                console.log(data);
                var jsonData = data;
                //controller.showToastMsg(data.data ,"#1a5589");
                handleData(data);

            },
            fail: function(e) {
                console.log(e);
                handleData(e);
                $("#blinder").hide();
                // controller.showToastMsg("Record not forwarded. Workflow Configuration or Record has an issue" ,"#ff6666");

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                handleData(XMLHttpRequest);
                $("#blinder").hide();
                // controller.showToastMsg("Record not forwarded. Workflow Configuration or Record has an issue" ,"#ff6666");

            }
        });
    },
    formatDate: function(myDate) {

        try {
            var months = Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
            var dayMonthYear = myDate.split(",");

            var dayMonth = dayMonthYear[0];
            var year = dayMonthYear[1];

            year = year.substring(1, 5);

            var dayMonthArr = dayMonth.split(" ");
            var month = dayMonthArr[0];
            var monthIndex = months.indexOf(month);
            var formatedMonth = monthIndex + 1;

            console.log("CCC", formatedMonth);
            console.log("CCCL", formatedMonth.toString().length);

            if (formatedMonth.toString().length == 1) {
                formatedMonth = "0" + formatedMonth;
            }

            var day = dayMonthArr[1];
            if (day.toString().length == 1) {
                day = "0" + day;
            }

            return year + "-" + formatedMonth + "-" + day;

        } catch (e) {

            return myDate;

        }
    },
    formatDateTime: function(myDate) {
        console.log("DATE BEING PASSED",myDate)
        var months = Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
        var dayMonthYear = myDate.split(",");

        var dayMonth = dayMonthYear[0];
        var secondPart = dayMonthYear[1];
        var year = secondPart.substring(1, 5);

        var time_ = secondPart.substring(6, 11);

        console.log("Time", time_);


        var dayMonthArr = dayMonth.split(" ");
        var month = dayMonthArr[0];
        var monthIndex = months.indexOf(month);
        var formatedMonth = monthIndex + 1;

        console.log("CCC", formatedMonth);
        console.log("CCCL", formatedMonth.toString().length);

        if (formatedMonth.toString().length == 1) {
            formatedMonth = "0" + formatedMonth;
        }

        var day = dayMonthArr[1];
        if (day.toString().length == 1) {
            day = "0" + day;
        }

        return year + "-" + formatedMonth + "-" + day + " " + time_;
    },
    postRequestWithUserObj: function(url, formData, async_status, userObj, handleData) {

        console.log(userObj);
        console.log("PRINT FDATA", formData);
        $.ajax({
            url: url,
            contentType: true,
            encoding: null,
            headers: {
                'Authorization': userObj.tokenType + " " + userObj.accessToken,
            },
            async: async_status,
            type: 'post',
            contentType: "application/json",
            success: function(data) {
                console.log(data);
                handleData(data);

            },
            fail: function(e) {
                console.log(e);
                handleData(e);
                $("#blinder").hide();
                // controller.showToastMsg("Record not forwarded. Workflow Configuration or Record has an issue" ,"#ff6666");

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                handleData(XMLHttpRequest);
                $("#blinder").hide();
                // controller.showToastMsg("Record not forwarded. Workflow Configuration or Record has an issue" ,"#ff6666");

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


    save: function(e) {

        var url = "";
        console.log(e);
        var action = $(e).attr("data_task");

        var form = $(e).attr("form-name");
        var form_identifier = form;

        //validate using parsley 
        var valid = false;
        var valid_count = 0;
        try {
            //valid = $('#'+ form_identifier + "_form").parsley().validate();
            //if(form_identifier == "exporter"){
            //valid_count = 2;
            //}else{
            console.log("cxxx", form_identifier);
            //form[name="foo"]
            //console.log($('form[form_identifier="' + form_identifier + '"]:input:not(:button)'));
            console.log($('form[form_identifier="' + form_identifier + '"] input:not(:button)'));
            //console.log($('#' + form_identifier + '_form :input:not(:button)'));
            $('form[form_identifier="' + form_identifier + '"] input:not(:button)').each(function(index, value) {
                //$('#' + form_identifier + '_form :input:not(:button)').each(function (index, value) { 
                console.log("xstart", value);
                valid = $(this).parsley().validate();
                console.log(valid + " " + value);
                if (valid != true) {
                    valid_count++;
                }
            });
            //}

        } catch (e) {
            console.log(e);
        }

        if (valid_count > 0) {
            return;
        }
        //---------------------------------------

        var primaryName = form_identifier;

        var url = "";
        console.log(e);
        var action = $(e).attr("data_task");

        var form = $(e).attr("form-name");
        var form_identifier = form;

        //validate using parsley 
        var valid = false;
        var valid_count = 0;
        try {
            //valid = $('#'+ form_identifier + "_form").parsley().validate();
            //if(form_identifier == "exporter"){
            //valid_count = 2;
            //}else{
            $('#' + form_identifier + '_form :input:not(:button)').each(function(index, value) {
                valid = $(this).parsley().validate();
                console.log(valid + " " + value);
                if (valid != true) {
                    valid_count++;
                }
            });
            //}

        } catch (e) {

        }

        if (valid_count > 0) {
            return;
        }
        //---------------------------------------

        var primaryName = form_identifier;

        var currentFormObj = allFormObj[form_identifier];

        var idType = currentFormObj.idType;
        if (idType == 2) {
            console.log("form kind", form);
            var identifier = form_identifier + "ID";
        } else {
            var identifier = form_identifier + "_id";
        }

        if (form == "exporterMarketDestination") {
            identifier = "exporter_farm_market_destination_id";
        }
        if (form == 'consolidatedPhyto') {
            identifier = "exporterConsignmentID";
        }

        if (form == 'quarantineFacilityInspection' || form == 'exporterFarmInspection' || form == 'exporterFirmInspection' || form == 'exporterLowRiskInspection') {
            identifier = "exporterInspectionRequestID";
        }

        var formID = "#" + primaryName + "_form";
        var urlID = currentFormObj.url_id;

        var formJson = $("." + form_identifier).serializeObject();
        for (var key of Object.keys(formJson)) {
            console.log(key + " -> " + formJson[key]);
            var n = key.includes(".");
            if (n) {
                delete formJson[key];
            }
        }

        var formJsonOld = $(formID).serializeObject();
        //arrivalNotice_id	    

        //logic for special fields
        if (form_identifier == "exporterProduct") {
            if (allFormObj['parent_selected']) {
                formJson["exporterID"] = allFormObj['parent_selected']['exporterID'];
            } else {
                formJson["exporterID"] = setupObj['exporter']['exporterID'];
            }

        }
        if (form_identifier == "exporterFarm") {
            if (allFormObj['parent_selected']) {
                formJson["exporterID"] = allFormObj['parent_selected']['exporterID'];
            } else {
                formJson["exporterID"] = setupObj['exporter']['exporterID'];
            }
        }
        if (form_identifier == "exporterFirm") {
            if (allFormObj['parent_selected']) {
                formJson["exporterID"] = allFormObj['parent_selected']['exporterID'];
            } else {
                formJson["exporterID"] = setupObj['exporter']['exporterID'];
            }
        }
        if (form_identifier == "exporterLowRiskCommodity") {
            if (allFormObj['parent_selected']) {
                formJson["exporterID"] = allFormObj['parent_selected']['exporterID'];
            } else {
                formJson["exporterID"] = setupObj['exporter']['exporterID'];
            }
        }

        //alert(form_identifier);
        if (form_identifier == "exporterConsignmentVarietyDetails") {
            formJson["exporterConsignmentID"] = allFormObj['parent_selected']['exporterConsignmentID'];
        }

        if (form_identifier == "quarantineFacilityInspection") {
            console.log("quarantineFacilityInspection");
            formJson["inspectionTypeID"] = 5;
        }

        if (form_identifier == "exporterFarmInspection") {
            console.log("exporter farm");
            formJson["inspectionTypeID"] = 1;
        }

        if (form_identifier == "exporterFirmInspection") {
            console.log("exporter firm");
            formJson["inspectionTypeID"] = 2;
        }

        if (form_identifier == "exporterLowRiskInspection") {
            console.log("exporter low risk");
            formJson["inspectionTypeID"] = 3;
        }


        // if(allFormObj['parent_selected']['exporterConsignment'] && allFormObj['parent_selected']['split_export_consignment_id'] && form_identifier == "exporterConsignmentVarietyDetails"){
        // 	formJson["exporterConsignmentID"] = allFormObj['selected']['exporterConsignmentID'];
        // 	console.log("entered");
        // }else{
        // 	console.log("not entered");
        // }

        //alert(form_identifier);
        //if(form_identifier == "exporterMarketDestination"){
        //formJson["exporterFarmID"] = allFormObj['parent_selected']['exporterConsignmentID'];
        //}


        if (form_identifier == "pipApplicationVariety") {
            console.log("pip application variety");
            formJson["pipApplicationID"] = allFormObj['parent_selected']['pipApplicationID'];
        }

        if (form_identifier == "importer_product") {
            console.log(" on save if");
            formJson["importer_id"] = allFormObj['parent_selected']['importerID'];
        }

        if (form_identifier == "onetime_export_variety_details") {
            console.log("onetime_export_variety_details");
            formJson["oneTimeExportID"] = allFormObj['parent_selected']['onetime_export_id'];
        }


        if (form_identifier == "onetime_import_variety_details") {
            console.log("onetime_import_variety_details");
            formJson["onetimeImportID"] = allFormObj['parent_selected']['onetime_import_id'];
        }

        if (form_identifier == "consolidatedExportConsignmentLines") {
            console.log("consolidatedExportConsignmentLines");
            formJson["exporterConsignmentID"] = allFormObj['parent_selected']['exporterConsignmentID'];
        }


        if (form_identifier == "exporterMarketDestination") {
            formJson["exporterFarmID"] = allFormObj['selected']['exporterFarm']['exporterFarmID'];
            formJson["exporterID"] = allFormObj['parent_selected']['exporterID'];
            console.log("formJson", formJson);
        }


        if (form_identifier == "exporterConsignmentVarietyDetails" && allFormObj['parent_selected']['split_export_consignment_id']) {
            formJson["exporterConsignmentID"] = allFormObj['selected']['exporterConsignmentID'];
            console.log("formJson on split consignment", formJson);
        }

        if (form_identifier == "exporterConsignmentVarietyDetails" && setupObj['agent_mgt']) {
            formJson["exporterID"] = allFormObj['parent_selected']['exporter']['exporterID'];
            console.log("formJson on sexporterID agent variety", formJson);
        }

        if (form_identifier == "pipApplicationVariety" && setupObj['agent_mgt']) {
            formJson["importerID"] = allFormObj['parent_selected']['importer']['importerID'];
            console.log("formJson on sexporterID agent variety", formJson);
        }

        // if(form_identifier == "exporterInspectionRequest"){
        // 	if(formJson["exporterFarmID"]>0){
        // 		formJson["exporterFirmID"]= '';
        // 		formJson["exporterLowRiskCommodityID"]='';
        // 	}else if(formJson["exporterFirmID"]>0){
        // 		formJson["exporterLowRiskCommodityID"]='';
        // 		formJson["exporterFarmID"]='';
        // 	}else if(formJson["exporterLowRiskCommodityID"]>0){
        // 		formJson["exporterFirmID"]= '';
        // 		formJson["exporterFarmID"]='';
        // 	}
        // }

        if (form_identifier == "users") {

            console.log("Posting Role", formJson["roleName"]);
            console.log("Roles", userObj.roles[0]["roleName"]);

            if (formJson["roleName"] == undefined || formJson["roleName"] == "undefined") {
                formJson["roleName"] = [userObj.roles[0]["roleName"]];
            } else {

                if (!Array.isArray(formJson["roleName"])) {
                    formJson["roleName"] = [formJson["roleName"]];
                }
            }

        }

        primaryVal = formJson[identifier];
        console.log(primaryVal);



        if (primaryVal == '') { //On New record
            console.log("Empty" + primaryVal);
            delete formJson[identifier];
            addURL = "addUrl";

            url = currentFormObj[addURL];
            console.log("Add URL" + url);
        } else { //on edit record

            if (form_identifier == "exporter") {

                formJson["users_id"] = 0;
            }


            if (form_identifier == "consolidatedPhyto") {
                formJson["consigneeID"] = formJson["consignee_id"];
                delete formJson["consignee_id"];
            }
            if (form_identifier == "importer_product") {
                console.log(" on save if", allFormObj['parent_selected']['importer']['importerID']);
                formJson["importer_id"] = allFormObj['parent_selected']['importer']['importerID'];
            }


            if (form_identifier == "onetime_export_variety_details") {
                console.log("onetime_export_variety_details");
                formJson["oneTimeExportID"] = allFormObj['parent_selected']['onetime_export_id'];
            }

            if (form_identifier == "consignmentInspectionRequest" && setupObj['agent_mgt']) {
                formJson["importerID"] = allFormObj['parent_selected']['importer']['importerID'];
                console.log("formJson on sexporterID agent variety", formJson);
            }

            editURL = "editUrl";
            console.log("Edit URL" + editURL);
            url = currentFormObj[editURL];
        }

        formJson["active"] = true;
        if (form_identifier == "exporterConsignment") {
            formJson["consigneeID"] = formJson["consignee_id"];
            delete formJson["consignee_id"];

            var ucrnumber = $("#ucrNumber").val();
            console.log("UCR NUMBER", ucrnumber);
            var url = serverURL + 'exporterConsignment/validateUCR?ucrNo=' + ucrnumber + '';
            controller.getAuthRequest(url, true, function(data, status) {
                console.log("UCR NUMBER data status", data);
                console.log("UCR NUMBER data status", data.responseText);
                if (data.responseText == undefined) {
                    var formData = JSON.stringify(formJson);
                    controller.saveFormDetails(formData, url,
                        function(output) {

                            console.log("save response ..");
                            console.log(currentFormObj);
                            console.log(output);

                            if (action == "save_return") {

                                console.log("Save Return..", form_identifier);

                                if (form_identifier == 'exporter') {

                                    // location.reload();
                                    controller.refreshCrudTables(form_identifier);
                                    showPaymentTable();

                                } else if (form_identifier == 'exporterConsignmentVarietyDetails') {

                                    //alert("H");
                                    var m = "";
                                    try {
                                        m = JSON.parse(output);
                                    } catch (e) {
                                        //controller.refreshCrudTables(form_identifier);
                                    }

                                    try {
                                        if (output.message == "FAILED" || m.message == "FAILED") {

                                        } else {
                                            controller.refreshCrudTables(form_identifier);
                                        }
                                    } catch (e) {
                                        controller.refreshCrudTables(form_identifier);
                                    }


                                    //controller.refreshCrudTables(form_identifier);
                                    // location.reload();
                                    //controller.refreshCrudTables(form_identifier);

                                } else {
                                    controller.refreshCrudTables(form_identifier);
                                    //window.location = "./#" + urlPage + "/" + urlID;
                                    // controller.renderCRUDTable(currentFormObj,currentFormObj.postType);
                                }

                            } else if (action == "save_new") {
                                controller.clearForm(formID);
                                controller.refreshCrudTables(form_identifier);
                                //window.location = "./#" + urlPage + "/" + urlID + "/0";
                                // controller.renderCRUDTable(currentFormObj,currentFormObj.postType);	    		
                            } else if (action == "save_edit") {
                                controller.refreshCrudTables(form_identifier);
                                // controller.renderCRUDTable(currentFormObj,currentFormObj.postType);
                                //window.location = "./#" + urlPage + "/" + urlID + "/" + recordID;
                            } else {
                                controller.refreshCrudTables(form_identifier);
                                // controller.renderCRUDTable(currentFormObj,currentFormObj.postType);
                                //window.location = "./#" + urlPage + "/" + urlID;
                            }

                        }, 'save', currentFormObj.saveMessage);
                } else {
                    responseJSON = JSON.parse(data.responseText);
                    console.log(responseJSON);
                    controller.showToastMsg(responseJSON.data, "#ff6666");
                }
            });
        } else {
            var formData = JSON.stringify(formJson);
            controller.saveFormDetails(formData, url,
                function(output) {

                    console.log("save response ..");
                    console.log(currentFormObj);
                    console.log(output);

                    if (action == "save_return") {

                        console.log("Save Return..", form_identifier);

                        if (form_identifier == 'exporter') {

                            // location.reload();
                            controller.refreshCrudTables(form_identifier);
                            showPaymentTable();

                        } else if (form_identifier == 'exporterConsignmentVarietyDetails') {

                            //alert("H");
                            var m = "";
                            try {
                                m = JSON.parse(output);
                            } catch (e) {
                                //controller.refreshCrudTables(form_identifier);
                            }

                            try {
                                if (output.message == "FAILED" || m.message == "FAILED") {

                                } else {
                                    controller.refreshCrudTables(form_identifier);
                                }
                            } catch (e) {
                                controller.refreshCrudTables(form_identifier);
                            }


                            //controller.refreshCrudTables(form_identifier);
                            // location.reload();
                            //controller.refreshCrudTables(form_identifier);

                        } else {
                            controller.refreshCrudTables(form_identifier);
                            //window.location = "./#" + urlPage + "/" + urlID;
                            // controller.renderCRUDTable(currentFormObj,currentFormObj.postType);
                        }

                    } else if (action == "save_new") {
                        controller.clearForm(formID);
                        controller.refreshCrudTables(form_identifier);
                        //window.location = "./#" + urlPage + "/" + urlID + "/0";
                        // controller.renderCRUDTable(currentFormObj,currentFormObj.postType);	    		
                    } else if (action == "save_edit") {
                        controller.refreshCrudTables(form_identifier);
                        // controller.renderCRUDTable(currentFormObj,currentFormObj.postType);
                        //window.location = "./#" + urlPage + "/" + urlID + "/" + recordID;
                    } else {
                        controller.refreshCrudTables(form_identifier);
                        // controller.renderCRUDTable(currentFormObj,currentFormObj.postType);
                        //window.location = "./#" + urlPage + "/" + urlID;
                    }

                }, 'save', currentFormObj.saveMessage);
        }

    },
    getWindowURLObject: function() {

        var windowURL = window.location.href;
        var res = windowURL.split("/");
        return res;

    },
    loadComboObj: function(url, item, reponseObj, method = "GET", obj = "") {

        $.ajax({
            url: url,
            type: method,
            headers: {
                'Authorization': userObj.tokenType + " " + userObj.accessToken,
            },
            async: false,
            success: function(data) {

                console.log(url);
                console.log(item);
                reponseObj(data, item, obj);

            },
            fail: function() {

                $("#blinder").hide();

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {

                $("#blinder").hide();

            }
        });
    },
    getRelationObjects: function(formName, exists) {

        console.log("getRelationObjects..");
        var currentObj = allFormObj[formName];
        var relationObj = currentObj.relationObjects;
        var idType = currentObj.idType;

        getRelationObjects_(relationObj, formName, exists);

        async function getRelationObjects_(relationObj, formName, exists) {

            console.log(relationObj);

            for (x in relationObj) {
                var url = serverURL + relationObjectsMap[relationObj[x]];
                await controller.loadComboObj(url, relationObj[x], function(response, item, obj) {
                    setupObj[item] = response;
                });
            }

            //load form
            if (exists) { //existing form
                controller.getFormData(formName);
            } else { //new form
                for (var key in setupObj) {
                    controller.setRelationValue(key, setupObj, true, idType);
                }
            }

            controller.initializeDateFields(formName);
            console.log(this.windowId);
            afterLoad(this.myFormObj);

            console.log('End');
        }

    },
    setUpObjInitializeSpecificOne: function(url, item1, returnCall) {
        console.log("setUpObjInitializeSpecificOne");
        controller.loadComboObj(url, item1, function(response, item, obj) {
            console.log("resp_ini", response);
            console.log("resp_item", item);
            setupObj[item] = response;
            returnCall(response);
        });
    },
    setUpObjInitializeSpecificOneWithCallBack: function(url, item1, returnCall) {
        console.log("setUpObjInitializeSpecificOne");
        controller.loadComboObj(url, item1, function(response, item, obj) {
            console.log("resp_ini", response);
            console.log("resp_item", item);
            setupObj[item] = response;

            returnCall(response);
        });
    },
    getRelationObjectsByParam: function(data, e) {
        console.log("getRelationObjectsByParam");
        var divElem = $(e).closest('.listings');
        console.log(e);
        console.log(divElem);

        var formName = divElem.attr("id");
        console.log(formName);
        var formNameArr = formName.split("_");
        formName = formNameArr[1];
        console.log(formName);

        var currentObj = allFormObj[formName];
        var idType = currentObj.idType;
        if (idType == 2) {
            var identifier = formName + "ID";
        } else {
            var identifier = formName + "_id";
        }

        console.log(data);
        console.log(identifier);
        if (formName == "assignConsignmentInspection") {
            var selectParentID = data['consignmentInspectionRequest'].identifier;
            console.log('consignmentInspectionRequest', selectParentID);
        } else {
            var selectParentID = data[identifier];
        }
        console.log(selectParentID);

        var relationObj = currentObj.relationObjects;
        var postType = currentObj.postType;

        getRelationObjectsParam_(relationObj, identifier, selectParentID, formName);
        async function getRelationObjectsParam_(relationObj, identifier, selectParentID, formName) {

            console.log("getRelationObjectsByParam");
            console.log(relationObj);
            console.log('Start');

            try {
                for (x in relationObjectsMapParam) {
                    var relObj = relationObjectsMapParam[x];
                    console.log(relObj);

                    if (relObj.name == identifier) {
                        console.log(relObj.name + " " + identifier);
                        var url_last_part = relObj.url;
                        var postType = relObj.postType;
                        var url = serverURL + url_last_part;
                        console.log(url_last_part);
                        console.log(relObj);
                        if (url_last_part == "undefined" || url_last_part == undefined) {

                        } else {

                            url = url.replace('parentID', selectParentID);
                            console.log(url);
                            await controller.loadComboObj(url, relObj.entity, function(response, item, relObj_) {

                                console.log(relObj_);
                                console.log(response);
                                console.log(item);

                                if (!Array.isArray(response)) {
                                    setupObj[item] = [response];
                                } else {
                                    setupObj[item] = response;
                                }


                                try {
                                    var childObj = relObj_.includeChild;
                                    setupObj[childObj] = response[childObj];
                                    //allFormObj[childObj] = response[childObj];
                                    console.log("Added Child Obj " + childObj);
                                    console.log(response[childObj]);
                                } catch (e) {


                                }

                                console.log("Done");
                                console.log(response);

                            }, postType, relObj);
                        }
                    }
                }
            } catch (e) {

            }

            console.log('Relation Objects Reloaded');
        }
    },
    setRelationValue: function(key, obj, isnew, idType, option_id = "", formName, listEntityName = "") {


        console.log("setRelationValue..");
        console.log(obj);
        console.log(key);

        //set options
        var selectHTML = "";
        var b = "";
        var c = "";

        //if mission field then set only current mission
        if (key == "docStatus") {

            if (isnew) {
                $("#" + key + "_name").val('DRAFT');
                $("#" + key + "_id").val(24);
                controller.effectWindowRights(24);
            } else {
                $("#" + key + "_name").val(obj[key].name);
                $("#" + key + "_id").val(obj[key].docStatus_id);
                $("." + key + "_id").val(obj[key].docStatus_id);
                controller.effectWindowRights(obj[key].docStatus_id);
            }

        } else { //the rest

            try {
                $("#" + key + "_name").val(obj[key].name);
            } catch (e) {

            }

            var setUpObj_ = setupObj[key];

            var displayName = "";
            if (key == "tableRegister") {
                displayName = "tableName";
            } else if (key == "exporter") {
                displayName = "name";
            } else if (key == "users") {
                displayName = "username";
            } else if (key == "consignmentInspectionRequest") {
                displayName = "consignmentInspectionRequestID";
            } else if (key == "exporterMarketDestination") {
                displayName = "farmName";
            } else {
                displayName = "name";
            }

            try {
                var optionDisplayName = this.myFormObj.relationObjectsFields;
                for (var displayNameKey in optionDisplayName) {
                    var displayNameJson = optionDisplayName[displayNameKey];
                    try {
                        var tmpDisplayName = displayNameJson[key];
                        if (tmpDisplayName != undefined) {
                            displayName = tmpDisplayName;
                        }
                    } catch (e) {
                        console.log("nah");
                    }
                }
            } catch (e) {

                if (key == "tableRegister") {
                    displayName = "tableName";
                } else if (key == "exporterMarketDestination") {
                    displayName = "farmName";
                } else {
                    displayName = "name";
                }
            }

            var selectedV = false;
            var optionsCount = 0;
            console.log();
            for (var option in setUpObj_) {

                optionObj = setUpObj_[option];
                var option_val = "";
                var option_key = "";

                var myID = "";

                try {
                    var hasOwnProp = optionObj.hasOwnProperty(key + "ID");
                } catch (e) {

                }
                if (hasOwnProp) {
                    myID = key + "ID";
                } else {
                    myID = key + "_id";
                }

                console.log(formName + ", option id.." + myID);
                if (option_id == "") { //check to see if option identifier is set
                    option_val = optionObj[myID];
                    option_key = myID;
                } else {
                    option_val = optionObj[option_id];
                    option_key = option_id;
                }

                if (key == "roles") {

                    option_key = "role_id";
                    var hasRole = false;
                    //loop through to check if user has that role
                    if (Array.isArray(obj[key])) {
                        for (x in obj[key]) {
                            if (optionObj[option_key] == obj[key][x][option_key]) {
                                hasRole = true;
                            }
                        }
                    }

                    var objDisplay = optionObj[displayName];
                    var optionDisplay = "";
                    if (objDisplay.hasOwnProperty('name')) {
                        optionDisplay = optionObj[displayName].name;
                    } else {
                        optionDisplay = optionObj[displayName];
                    }

                    //if(optionObj[option_key] == obj[key][x][option_key]){
                    if (hasRole) {
                        selectHTML += "<option selected value=" + option_val + ">" + optionDisplay + "</option>";
                        selectedV = true;
                    } else {
                        selectHTML += "<option value=" + option_val + ">" + optionDisplay + "</option>";
                    }

                } else {

                    //we have to define specific tables since not all entities have a property name				    
                    if (key == "exporter") {
                        var objDisplay = optionObj['company'];
                        var optionDisplay = "";
                        if (objDisplay.hasOwnProperty('name')) {
                            optionDisplay = objDisplay.name;
                        } else {
                            optionDisplay = objDisplay;
                        }
                    } else if (key == "tableRegister") {

                        var objDisplay = optionObj;
                        var optionDisplay = "";
                        optionDisplay = objDisplay.tableName;

                    } else if (key == "pipApplication") {

                        var objDisplay = optionObj;
                        var optionDisplay = "";
                        optionDisplay = objDisplay.documentNumber;

                    } else if (key == "importer") {

                        var objDisplay = optionObj;
                        var optionDisplay = "";
                        optionDisplay = objDisplay.company.name;

                    } else if (key == "wFDepartment") {
                        var objDisplay = optionObj['department'];
                        var optionDisplay = "";
                        if (objDisplay.hasOwnProperty('name')) {
                            optionDisplay = objDisplay.name;
                        } else {
                            optionDisplay = objDisplay;
                        }
                    } else if (key == "agents") {
                        console.log("agent displayName", displayName)
                        console.log("agent optionOBJ", optionObj)
                        var objDisplay = optionObj['company'];
                        var optionDisplay = "";
                        optionDisplay = objDisplay.name;
                    } else if (key == "exporterConsignment") {

                        optionDisplay = optionObj["documentNumber"];

                    } else if (key == "consolidatedPhyto") {

                        optionDisplay = optionObj["documentNumber"];

                    } else if (key == "exporterFarm") {

                        console.log("crazy1", optionObj);
                        optionDisplay = optionObj.farmName;

                    } else if (key == 'agent_mgt') {
                        optionDisplay = optionObj['company'].name;
                        option_val = optionObj['company'].company_id;

                        selectOptIdentity = obj['agent'][option_key]

                        console.log("jsjsaks", optionObj['company'].name);
                        console.log("jsjsaks", optionObj['company']['name']);
                    } else if (key == "exporterFirm") {
                        optionDisplay = optionObj['fullName'];
                    } else if (key == "exporterLowRiskCommodity") {
                        optionDisplay = optionObj["farmName"];
                    } else if (key == "productss") {
                        optionDisplay = optionObj['products'].name;
                        option_val = optionObj['products'].products_id;
                    } else {
                        console.log("crazy2 " + key, optionObj);
                        var objDisplay = optionObj[displayName];
                        var optionDisplay = "";

                        try {
                            objDisplay.hasOwnProperty('name');
                            if (objDisplay.hasOwnProperty('name')) {
                                optionDisplay = optionObj[displayName].name;
                            } else {
                                optionDisplay = optionObj[displayName];
                            }
                        } catch (e) {
                            console.log("No display for field " + key);
                            console.log(optionObj);
                        }

                    }

                    var selectOptIdentity = "";
                    // console.log("obj",obj);
                    // console.log("key",key);
                    // console.log("obj[key]",obj[key]);
                    // console.log("obj[key][option_key]",obj[key][option_key]);
                    // console.log("obj[key][option_key]",obj[key][0].option_key);
                    try {
                        selectOptIdentity = obj[key][option_key];
                    } catch (e) {

                    }

                    //if(key == "consignee"){
                    // console.log("sbc",obj);
                    // console.log("sbc",key);
                    // console.log("sbc",optionObj);
                    // console.log("sbc",optionObj[option_key]);
                    // console.log("sbc",selectOptIdentity);
                    // console.log("sbc",option_key);
                    //}		
                    // if(key == "agents"){
                    // 	console.log("sbc",obj);
                    // 	console.log("sbc",key);
                    // 	console.log("sbc",optionObj);
                    // 	console.log("sbc option key",option_key);
                    // 	console.log("sbc selected value",optionObj[option_key]);
                    // 	console.log("sbcc",obj['agent']);
                    // 	console.log("sbccc",obj['agent'][option_key])
                    // 	console.log("sbc",selectOptIdentity);
                    // }		
                    if (optionObj[option_key] == selectOptIdentity) {
                        optionsCount++;
                        selectHTML += "<option selected value=" + option_val + ">" + optionDisplay + "</option>";
                        selectedV = true;
                    } else {
                        console.log("SELECT", key)
                        optionsCount++;
                        selectHTML += "<option value=" + option_val + ">" + optionDisplay + "</option>";
                    }

                }
            }

            if (selectedV) {
                selectHTML += "<option value=''>-- Select Option --</option>";
            } else {

                //This is for the case where there is only one option listed so no need to place 'select option'
                if (optionsCount == 1) {
                    // if(key == "pipApplication"){
                    // 	// var importer_exporterid = $('#importer_exporterid').val();
                    // 	console.log("value exporter",option_val);
                    // 	controller.getImporter_exporterCountry(option_val);
                    // }

                    if (key == "importerExporter") {
                        // var importer_exporterid = $('#importer_exporterid').val();
                        console.log("value exporter", option_val);
                        controller.getImporter_exporterCountry(option_val);
                    }
                } else {
                    console.log("COUNTRY OF ORIGIN", key)
                    if (key == "countryOfOrigin") {
                        if (key == "pipApplication") {
                            selectHTML += "<option selected value=1>Kenya</option>";
                        } else {
                            selectHTML += "<option selected value=''>-- Select Option --</option>";
                        }
                    } else {
                        selectHTML += "<option selected value=''>-- Select Option --</option>";
                    }

                }

            }

            $("." + key + 'ID').html(selectHTML);
        }
        console.log("End setRelationValue");
        return selectHTML;

    },
    effectWindowRights: function(docStatus) {

        $(".controls").html("");
        console.log(draftID);
        console.log(urlPage);
        if (docStatus == draftID) { //Draft	        
            if (urlPage == "mission") {
                $(".controls").append("<button type='button' class='ui button save mission_only'><i class='save icon'></i>Save</button>");
                $(".controls").append("<button type='button' class='ui button teal mofa_only start_approve'>Submit for User/Mission <i class='arrow right icon'></i></button>");
            }
            if (urlPage == "mofa") {
                $(".controls").append("<button type='button' style='display:none;' class='ui button teal mofa_only forward'>Approve <i class='arrow right icon'></i></button>");
            }

        } else if (docStatus == completedID) { //Completed

            controller.disableForm(true);
            if (urlPage == "mission") {

            }
            if (urlPage == "mofa") {

                $(".controls").append("<button type='button' style='display:none;' class='ui button print_note blue mofa_only'><i class='print icon'></i> Print Note </button>");
                $(".controls").append("<button type='button' style='display:none;' class='ui button print_form blue mofa_only'><i class='print icon'></i> Print Form </button>");
            }

        } else if (docStatus == inProgressID) { //In Progress

            controller.disableForm(true);
            if (urlPage == "mission") {

            }
            if (urlPage == "mofa") {

                $(".controls").append("<button type='button' style='display:none;' class='ui button teal mofa_only'>Approve <i class='arrow right icon'></i></button>");
            }
            disableForm(true);

        } else if (docStatus == rejectedID) { //In Progress

            disableForm(true);

        } else if (docStatus == ammendID) { //In Progress

            $(".print").hide();

        }

        // $(".save").on("click", function() {
        // 	console.log("hey");
        // 	setTimeout(() => { 
        // 		controller.save(this);
        // 	}, 310)
        // });

        // $("#start_approve").on("click", function() {
        // 	controller.startWorkflowEntity(this);
        // });

        $(".print_note").on("click", function() {
            controller.printNote(this);
        });

        $(".print_form").on("click", function() {
            controller.printEntity(this);
        });

        $("#isDualCitizen").on("click", function() {
            //console.log(">>>>");
            if ($("#isDualCitizen").prop("checked") == true) {
                $(".otherCountry").show();
            } else {
                $(".otherCountry").hide();
            }
        });

    },
    loadDocumentsUploadDefaultList: function(tableID, url, prequalificationTender_id) {

        //get required document array
        listings.getRequiredDocument(prequalificationTender_id, function(response) {

            console.log(response);
            var requiredDocJSON = response;

            var documentTypesUploaded = [];
            var tableHTML = $(tableID);

            html = html + "<tr><td>Document Type</td><td>Document</td><td>Status</td></tr>";
            for (var i = 0; i < requiredDocJSON.length; i++) {
                var selectVal = requiredDocJSON[i];
                //html = html + "<tr><td>" + requiredDocJSON[i]["documentUploadType"]["name"] + "</td><td><input type='file' data-id='" + requiredDocJSON[i]["documentUploadType"]["documentUploadType_id"] + "' name='upload document' class='file_upload_doc'><input type='button' id='add-document-row' class='upload_btn ui button' onclick='addDocument(" + requiredDocJSON[i]["documentUploadType"]["documentUploadType_id"] + ");' value='Upload Document'></td><td><i style='color:red;' class='exclamation circle icon'></i> Pending Upload</td></tr>";					    									    					    														

                html = html + "<tr><td>" + requiredDocJSON[i]["documentUploadType"]["name"] + "</td><td><form id='document-setup_' enctype='multipart/form-data'>";
                html = html + "<input type='hidden' name='primaryDoc_id' class='diplomatDocument_id'>";
                html = html + "<input type='hidden' name='document_parent_id' class='document_parent_id'>";
                html = html + "<input type='hidden' name='documentUploadType_id' class='documentUploadType_id'>";
                html = html + "<input type='hidden' class='docStatus_id documentDocStatus_id' name='documentDocStatus_id' id='documentDocStatus_id'>";
                html = html + "<input type='file' class='doc_file_input' name='file' id='file' placeholder='File' accept='image/*,application/pdf'><br><input type='button' id='add-document-row' class='upload_btn ui button' onclick='controller.saveDocument(" + requiredDocJSON[i]["documentUploadType"]["documentUploadType_id"] + ",this);' value='Save Document'></form></td><td><i style='color:red;' class='exclamation circle icon'></i> Pending Upload</td></tr>";
            }


            //console.log(html);
            tableHTML.html(html);
        });
        //get uploaded document    		
        var html = "";

    },
    getPrimaryValue: function(e) {

        // Ensure if it is a tab child table, dont overwrite selected
        // var form = $(e).closest(".form").not('.document-setup_');
        var form = $(e).closest(".form");
        console.log(form);
        var form_identifier = form.attr("form_identifier");
        console.log(form_identifier);
        var currentFormObj = allFormObj["selected"];

        var identifier = form_identifier + "ID";
        if (identifier in currentFormObj) {

        } else {
            identifier = form_identifier + "_id";
        }

        console.log(identifier);
        var value = currentFormObj[identifier];
        console.log(value);
        return value;

    },
    getPrimaryValueByName: function(name) {

        // Ensure if it is a tab child table, dont overwrite selected
        var form_identifier = name;
        console.log(form_identifier);
        var currentFormObj = allFormObj["selected"];

        var identifier = form_identifier + "ID";
        if (identifier in currentFormObj) {

        } else {
            identifier = form_identifier + "_id";
        }

        console.log(identifier);
        var value = currentFormObj[identifier];
        console.log(value);
        return value;

    },
    getFormObj: function(e) {
        var form = $(e).closest(".form");
        var form_identifier = form.attr("form_identifier");
        var formObj_ = allFormObj[form_identifier];
        return formObj_;
    },
    saveDocument: function(typeId, e, saveObj) {

        //Get params and place form in documents required	        
        var primaryId = controller.getPrimaryValue(e);
        var docStatus_id = 24;
        console.log(typeId);
        console.log(docStatus_id);
        console.log(primaryId);

        $(".documentUploadType_id").val(typeId);
        $(".documentDocStatus_id").val(docStatus_id);
        $(".document_parent_id").val(primaryId);

        $("#primaryDoc_id").val("");

        if (primaryId == "") {
            alert("First Save Main Document");
        } else {
            event.stopPropagation();
            $('#myfile').html("");
            $(e).addClass('loading');
            controller.saveDocumentEntity("document-setup", function(status) {
                $(e).removeClass('loading');
            }, e, saveObj);
        }
    },
    openFile: function(file) {
        var extension = file.substr((file.lastIndexOf('.') + 1));
        switch (extension) {
            case 'jpg':
            case 'png':
            case 'gif':
            case 'tiff':
                return true;
                break;
            case 'pdf':
                return true;
                break;
            default:
                return false;
        }
    },
    saveDocumentEntity: function(formDocumentID, callback, e, saveObj) {

        var formObj = controller.getFormObj(e);
        var documentFormObj_ = allFormObj['documents'];
        var selectParentID = controller.getPrimaryValue(e); //get parent form child primary ID  
        console.log(formObj);
        console.log(formDocumentID);
        console.log(saveObj);

        var url = "";
        var formJson = $("#" + formDocumentID + "_").serializeObject();

        var fileName = "";
        var fileObj = "";
        $('input[name="file"]').each(function() {
            if (!isNaN(this.value)) {
                console.log(this.value);
                //fileName = this.value;
            } else {
                console.log(this.value);
                fileName = this.value;
                fileObj = this;
            }

        });
        console.log(fileName);

        if (!controller.openFile(fileName)) {
            controller.showToastMsg("Invalid File Type!", "#ff6666");
            callback();
            return false;
        }

        console.log(formJson);

        delete formJson.documentDocStatus_id;
        formJson["docStatus_id"] = $(".documentDocStatus_id").val();

        delete formJson.document_parent_id;
        formJson[formObj.formName + "_id"] = $(".document_parent_id").val();

        var file_data = fileObj;
        formJson["file"] = fileName;

        //if (formJson['primaryDoc_id'] == '' || formJson['primaryDoc_id'] == undefined || formJson['primaryDoc_id'] == 'undefined') {
        //if (saveObj[formObj.formName + "_id="]) {
        if (typeof saveObj == 'undefined') {
            delete formJson['primaryDoc_id'];
            url = documentFormObj_.addUrl;
            url = url + "?docStatus_id=" + $(".documentDocStatus_id").val() + "&" + formObj.formName + "_id=" + $(".document_parent_id").val() + "&documentUploadType_id=" + $(".documentUploadType_id").val();
        } else {
            url = documentFormObj_.editUrl;
            if (formObj.formName == "exporter") {
                url = url + "?" + formObj.formName + "_id=" + formJson[formObj.formName + "_id"] + "&docStatus_id=" + saveObj["docStatus"]["docStatus_id"] + "&" + formObj.formName + "Document_id=" + saveObj[formObj.formName + "Document_id"] + "&documentUploadType_id=" + saveObj['documentUploadType']['documentUploadType_id'];
            } else if (formObj.formName == "importer") {
                url = url + "?" + formObj.formName + "ID=" + formJson[formObj.formName + "_id"] + "&docStatus_id=" + saveObj["docStatus"]["docStatus_id"] + "&" + formObj.formName + "DocumentID=" + saveObj[formObj.formName + "DocumentID"] + "&documentUploadType_id=" + saveObj['documentUploadType']['documentUploadType_id'];
            } else if (formObj.formName == "agents") {
                console.log("saveObj", saveObj["agent_document_id"]);
                url = url + "?" + "agent_id=" + formJson[formObj.formName + "_id"] + "&docStatus_id=" + saveObj["docStatus"]["docStatus_id"] + "&" + "agentDocument_id=" + saveObj["agent_document_id"] + "&documentUploadType_id=" + saveObj['documentUploadType']['documentUploadType_id'];
            }
        }
        //var formData = JSON.stringify(formJson);   

        console.log(formJson);

        var data = new FormData();
        var form_data = $('#' + formDocumentID).serializeArray();

        //File data
        //var file_data = $('input[name="file"]')[0].files;
        //for (var i = 0; i < file_data.length; i++) {
        //data.append("file", file_data[i]);
        //}

        var file_data = fileObj.files;
        console.log(file_data[0]);
        data.append("file", file_data[0]);
        controller.saveFormUploadDetails(data, url,
            function(output) {

                callback();
                $('.modal.fade.document').modal('hide');
                //listings.loadTableDocuments('document-table',columnsDocArr, listDocUrl, viewButtonsArr,"diplomatID=" + windowId);
                var select = $(".documentUploadStatus");
                var table = $(".documentUploadStatus");

                var formObj_ = allFormObj['documents'];
                var selectParentID = controller.getPrimaryValueByName(formObj_["parentTable"]);
                controller.loadDocumentsUploadStatus('#Attachments', formObj_["listUrl"] + selectParentID, formObj_["formType_id"], function() {
                    console.log("Documents Listed");
                });

            }, 'save', 'Document has been Saved Successfully');
    },
    saveFormUploadDetails: function(formData, url, handleData) {

        $(".save").addClass("loading");
        $.ajax({
            url: url,
            headers: {
                'Authorization': userObj.tokenType + " " + userObj.accessToken,
            },
            async: true,
            type: 'post',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data, textStatus, xhr) {
                console.log(xhr.status);
                handleData(data);

                if (xhr.status == 200) {
                    controller.showToastMsg("Updated Successfully", "#1a5589");
                } else if (xhr.status == 201) {
                    controller.showToastMsg("Error! Created", "#ff6666");
                } else if (xhr.status == 400) {
                    controller.showToastMsg("Error! Fields are empty", "#ff6666");
                } else if (xhr.status == 401) {
                    controller.showToastMsg("Error! Unauthorized", "#ff6666");
                } else if (xhr.status == 403) {
                    controller.showToastMsg("Error! Forbidden", "#ff6666");
                } else if (xhr.status == 404) {
                    controller.showToastMsg("Error! Not found", "#ff6666");
                } else if (xhr.status == 500) {
                    controller.showToastMsg("Error! Duplicate, Record Exists", "#ff6666");
                }

                $(".save").removeClass("loading");
            },
            fail: function(xhr, textStatus) {

                console.log(xhr.status);
                if (xhr.status == 200) {
                    controller.showToastMsg("Updated Successfully", "#1a5589");
                } else if (xhr.status == 201) {

                    controller.showToastMsg("Error! Created" + errorMsg, "#ff6666");
                } else if (xhr.status == 400) {
                    var t = xhr.responseText;
                    var obj = JSON.parse(t);
                    console.log(obj.errors);
                    var errorArr = obj.errors;
                    var errorMsg = "";
                    for (var i in errorArr) {
                        errorMsg = errorMsg + "</br>" + errorArr[i].defaultMessage;
                    }

                    console.log(errorMsg);
                    controller.showToastMsg("Error! Fields are empty" + errorMsg, "#ff6666");
                } else if (xhr.status == 401) {
                    controller.showToastMsg("Error! Unauthorized" + errorMsg, "#ff6666");
                } else if (xhr.status == 403) {
                    controller.showToastMsg("Error! Forbidden" + errorMsg, "#ff6666");
                } else if (xhr.status == 404) {
                    controller.showToastMsg("Error! Not found" + errorMsg, "#ff6666");
                } else if (xhr.status == 500) {
                    var errorMsg = xhr.responseJSON.message;
                    controller.showToastMsg("Error!" + errorMsg, "#ff6666");
                }

                $(".save").removeClass("loading");

            },
            error: function(xhr, textStatus) {

                //console.log(xhr.status);
                if (xhr.status == 200) {
                    controller.showToastMsg("Updated Successfully", "#1a5589");
                } else if (xhr.status == 201) {

                    controller.showToastMsg("Error! Created" + errorMsg, "#ff6666");
                } else if (xhr.status == 400) {
                    var t = xhr.responseText;
                    var obj = JSON.parse(t);
                    console.log(obj.errors);
                    var errorArr = obj.errors;
                    var errorMsg = "";
                    for (var i in errorArr) {
                        errorMsg = errorMsg + "</br>" + errorArr[i].defaultMessage;
                    }

                    console.log(errorMsg);
                    controller.showToastMsg("Error! Fields are empty" + errorMsg, "#ff6666");
                } else if (xhr.status == 401) {
                    controller.showToastMsg("Error! Unauthorized" + errorMsg, "#ff6666");
                } else if (xhr.status == 403) {
                    controller.showToastMsg("Error! Forbidden" + errorMsg, "#ff6666");
                } else if (xhr.status == 404) {
                    controller.showToastMsg("Error! Not found" + errorMsg, "#ff6666");
                } else if (xhr.status == 500) {
                    //console.log(xhr);
                    var errorMsg = xhr.responseJSON.message;
                    controller.showToastMsg("Error!" + errorMsg, "#ff6666");
                }
                $(".save").removeClass("loading");
            }
        });
    },
    openFile: function(str){
        var tmp = str.split(",");
        var prefix = tmp[0];
        var contentType = prefix.split(/[:;]+/)[1];
        var byteCharacters = atob(tmp[1]);

        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], {type: contentType});
        var blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "popup","width=1000,height=500,scrollbars=1,resizable=no," +
            "toolbar=no,directories=no,location=no,menubar=no,status=no,left=0,top=0");
    },
    loadDocumentsUploadStatus: function(tableID, url, prequalificationTenderCollectionID, reponseObj) {
        //get required document array
        controller.getRequiredDocument(prequalificationTenderCollectionID, function(response) {
            console.log("Required docs", response);
            var requiredDocJSON = response;
            $.ajax({
                url: url,
                headers: {
                    'Authorization': userObj.tokenType + " " + userObj.accessToken,
                },
                async: true,
                success: function(data) {

                    var jsonData = data;
                    var visible = '';
                    var documentTypesUploaded = [];
                    var tableHTML = $(tableID);
                    console.log("testcrudedit", formObj.crudEdit);


                    var upload_entry = ''

                    for (let i = 0; i < requiredDocJSON.length; i++) {
                        const element = requiredDocJSON[i];
                        console.log(element);
                        console.log(requiredDocJSON[i].prequalificationTender_id)

                        //     upload_entry += 
                        //     '<td>'+
                        //     ' <div class="row" style="padding: 23px;font-size: 16px;">'+
                        //     '<div class="col-md-3">'+
                        //     ' <input placeholder="Enter File name"></input> '+
                        //     '</div>'+
                        //     '<div class="col-md-5">'+
                        //        '<div class="custom-file">'+
                        //                '<input type="file" class="custom-file-input" id="customFile">'+
                        //                 '<label class="custom-file-label" for="customFile" style="width:265px">Choose file</label>'+
                        //         '</div> '+
                        //     ' </div>'+
                        //     '<div class="col-md-3">'+
                        //        '<button type="button" class="xcrud-action btn btn-info btn-sm" id="save_file" onclick=controller.uploadDoc()>Save Document</button>'+
                        //     ' </div>'+
                        //  ' </div>'+
                        //  '</td>';
                        var j = i + 1;


                        // var signatures = {
                        //     "J": "application/pdf",
                        //     "i": "image/gif",
                        //     "R": "image/gif",
                        //     "U": "image/png",
                        //     "/": "image/jpeg"
                        //   };
                          
                        //   function detectMimeType(b64) {
                        //     for (var s in signatures) {
                        //       if (b64.indexOf(s) === 0) {
                        //         return signatures[s];
                        //       }
                        //     }
                        //   }
                        //   console.log(detectMimeType(element.downloadUri));
                        //   console.log("MIME TYPE");
                        // try {
                        //     var extension = "";
                        //     var bin = atob(element.downloadUri);
                        //     var lowerCase = bin.toLowerCase();
                        //     if (lowerCase.indexOf("png") !== -1)
                        //         extension = "png"
                        //     else if (lowerCase.indexOf("jpg") !== -1) {
                        //         extension = "jpg"
                        //     } else if (lowerCase.indexOf("jpeg") !== -1) {
                        //         extension = "jpeg"
                        //     } else extension = "jpeg";
                        //     console.log(extension)
                        // } catch (e) {

                        // }
                        var extension = "JPEG";
                        console.log(extension);
                        //var a = document.createElement("a"); //Create <a>

                        //var extension = "jpeg";
                        var downloadLink = '<a href = javascript:controller.openFile("' + element.downloadUri + '")>Download File</a>'; //Image Base64 Goes here

                        upload_entry +=
                            '<div class="row" style="padding: 23px;font-size: 16px;">' +
                            '<div class="col-md-4">' +
                            '<p><b>' + j + ' - </b>' +
                            // '<b> File ID : </b>' + element.prequalificationTenderCollection_id +
                            '<b>   File : </b>' + element.name + '</p>' +
                            downloadLink +
                            '</div>' +
                            // '<div class="col-md-5">'+
                            //    '<button type="button" class="xcrud-action btn btn-info btn-sm" id="save_file" onclick=controller.uploadModal()>Attach New Document</button>'+
                            // ' </div>'+
                            // '<div class="col-md-8">' +


                            //    '<button type="button" class="xcrud-action btn btn-info btn-sm" id="save_file" onclick=controller.uploadDoc()>Save Document</button>'+
                            //' </div>' +
                            ' </div>';

                    }
                    
                    if(allFormObj['parent_selected'].submitted == "NO"){
                        visible = "style='display:block'";
                    }else{
                        visible = "style='display:none'";
                    }
                    var html =
                        '<form class="md-form">' +
                        // '<table>'+
                        //     '<tr>'+
                        //     '<th></th>'+
                        //     '</tr>'+
                        //     '<tr>'+

                        // '</tr>'+
                        // '</table>'+
                        '<button type="button" class="xcrud-action btn btn-info btn-sm upload_file_save_file"  '+visible+' id="upload_file_save_file" onclick=controller.uploadModal()>Attach New Document</button>' +
                        upload_entry +
                        ' </div>' +
                        '</form>';
                    tableHTML.html(html);
                    reponseObj(html);
                    console.log(html);

                },
                fail: function() {

                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {

                }
            });
        });
        //get uploaded document       		 			
        var html = "";

    },
    loadDocumentsUploadStatus_Tender: function(tableID, url, prequalificationTenderCollectionID, reponseObj) {
        //get required document array
        controller.getRequiredDocument_Tender(prequalificationTenderCollectionID, function(response) {
            console.log("Required docs", response);
            var requiredDocJSON = response;
            $.ajax({
                url: url,
                headers: {
                    'Authorization': userObj.tokenType + " " + userObj.accessToken,
                },
                async: true,
                success: function(data) {

                    var jsonData = data;
                    var documentTypesUploaded = [];
                    var tableHTML = $(tableID);
                    console.log("testcrudedit", formObj.crudEdit);


                    var upload_entry = ''

                    for (let i = 0; i < requiredDocJSON.length; i++) {
                        const element = requiredDocJSON[i];
                        console.log(element);
                        console.log(requiredDocJSON[i].prequalificationTender_id)

                        //     upload_entry +=
                        //     '<td>'+
                        //     ' <div class="row" style="padding: 23px;font-size: 16px;">'+
                        //     '<div class="col-md-3">'+
                        //     ' <input placeholder="Enter File name"></input> '+
                        //     '</div>'+
                        //     '<div class="col-md-5">'+
                        //        '<div class="custom-file">'+
                        //                '<input type="file" class="custom-file-input" id="customFile">'+
                        //                 '<label class="custom-file-label" for="customFile" style="width:265px">Choose file</label>'+
                        //         '</div> '+
                        //     ' </div>'+
                        //     '<div class="col-md-3">'+
                        //        '<button type="button" class="xcrud-action btn btn-info btn-sm" id="save_file" onclick=controller.uploadDoc()>Save Document</button>'+
                        //     ' </div>'+
                        //  ' </div>'+
                        //  '</td>';
                        var j = i + 1;

                        var extension = "";
                        try{

                            var bin = atob(element.downloadUri);
                            var lowerCase = bin.toLowerCase();
                            if (lowerCase.indexOf("png") !== -1)
                                extension = "png"
                            else if (lowerCase.indexOf("jpg") !== -1) {
                                extension = "jpg"
                            } else if (lowerCase.indexOf("jpeg") !== -1) {
                                extension = "jpeg"
                            } else if (lowerCase.indexOf("pdf") !== -1) {
                                extension = "pdf"
                            }else extension = "jpeg";
                            console.log(extension)
                        } catch (e) {

                        }
                        console.log(extension);
                        //var a = document.createElement("a"); //Create <a>

                        //var extension = "jpeg";
                        var downloadLink = '<a href = "' + element.downloadUri + '">Download File</a>'; //Image Base64 Goes here


                        upload_entry +=
                            '<div class="row" style="padding: 23px;font-size: 16px;">' +
                            '<div class="col-md-4">' +
                            '<p><b>' + j + ' - </b>' +
                            // '<b> File ID : </b>' + element.prequalificationTenderCollection_id +
                            '<b>   File : </b>' + element.name + '</p>' +
                            downloadLink +
                            '</div>' +
                            // '<div class="col-md-5">'+
                            //    '<button type="button" class="xcrud-action btn btn-info btn-sm" id="save_file" onclick=controller.uploadModal()>Attach New Document</button>'+
                            // ' </div>'+
                            // '<div class="col-md-8">' +


                            //    '<button type="button" class="xcrud-action btn btn-info btn-sm" id="save_file" onclick=controller.uploadDoc()>Save Document</button>'+
                            //' </div>' +
                            ' </div>';

                    }
                    var html =
                        '<form class="md-form">' +
                        // '<table>'+
                        //     '<tr>'+
                        //     '<th></th>'+
                        //     '</tr>'+
                        //     '<tr>'+

                        // '</tr>'+
                        // '</table>'+
                        '<button type="button" class="xcrud-action btn btn-info btn-sm" id="save_file" onclick=controller.uploadModal()>Attach New Document</button>' +
                        upload_entry +
                        ' </div>' +
                        '</form>';
                    tableHTML.html(html);
                    reponseObj(html);
                    console.log(html);

                },
                fail: function() {

                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {

                }
            });
        });
        //get uploaded document
        var html = "";

    },
    getRequiredDocument: function(prequalificationTenderCollectionID, callbackFunc) {
        var userObj = JSON.parse(localStorage.getItem("userObj"));
        var listUrl = serverURL + "prequalification/collectionDocuments/" + prequalificationTenderCollectionID;
        /*var formData = {
            "prequalificationTenderCollectionID": prequalificationTenderCollectionID
        }*/
        $.ajax({
            url: listUrl,
            headers: {
                'Authorization': "Bearer " + userObj.token,
            },
            async: true,
            type: "GET",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            //data: formData,
            success: function(data) {
                var jsonData = data;
                console.log("getRequiredDocument");
                console.log(jsonData);
                console.log(prequalificationTenderCollectionID);
                var arrayIds = [];
                console.log(jsonData.data.length)
                for (var i = 0; i < jsonData.data.length; i++) {
                    // if (jsonData[i].data["formType"]["formType_id"] == formType_id) {
                    arrayIds.push(jsonData.data[i]);
                    // }
                }
                callbackFunc(arrayIds);
            },
            fail: function() {

                $("#blinder").hide();

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {

                $("#blinder").hide();

            }
        });

    },
    getRequiredDocument_Tender: function(prequalificationTenderCollectionID, callbackFunc) {
        var userObj = JSON.parse(localStorage.getItem("userObj"));
        var listUrl = serverURL + "tender/tenderAttachments/" + prequalificationTenderCollectionID;
        /*var formData = {
            "prequalificationTenderCollectionID": prequalificationTenderCollectionID
        }*/
        $.ajax({
            url: listUrl,
            headers: {
                'Authorization': "Bearer " + userObj.token,
            },
            async: true,
            type: "GET",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            //data: formData,
            success: function(data) {
                var jsonData = data;
                console.log("getRequiredDocument");
                console.log(jsonData);
                console.log(prequalificationTenderCollectionID);
                var arrayIds = [];
                console.log(jsonData.data.length)
                for (var i = 0; i < jsonData.data.length; i++) {
                    // if (jsonData[i].data["formType"]["formType_id"] == formType_id) {
                    arrayIds.push(jsonData.data[i]);
                    // }
                }
                callbackFunc(arrayIds);
            },
            fail: function() {

                $("#blinder").hide();

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {

                $("#blinder").hide();

            }
        });

    },
    uploadModal: function() {
        $('.modal.fade.upload_pre_documents').modal('show');
    },
    respondModal: function() {
        $('.modal.fade.rfqresponse').modal('show');
    },
    uploadDoc: function() {
        if (formObj.formName == "prequalificationTenderCollection") {
            controller.uploadDocPrequalification();
        } else if (formObj.formName == "tendercollections") {
            controller.uploadDocTender();
        }

    },
    uploadDocPrequalification: function(attachment_id, prequalificationTenderCollection_id) {
        const random = Math.floor(Math.random() * 20);

        var name = $('#filename').val()
        var myFile = $('#upload-file').prop('files');

        //     const toBase64 = file => new Promise((resolve, reject) => {
        //         const reader = new FileReader();
        //         reader.readAsDataURL(file);
        //         reader.onload = () => resolve(reader.result);
        //         reader.onerror = error => reject(error);
        //     });

        // //    async function Main() {
        // //     //    const file = document.querySelector('#myfile').files[0];
        // //        console.log(await toBase64(myFile));
        // //     }
        // //     Main()

        async function f() {
            const input = document.querySelector('input[type="file"]');
            const file = input.files[0];

            const toBase64 = file => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });

            let result = await toBase64(file); // wait until the promise resolves (*)
            //result = "";
            var n = result.indexOf("base64,");
            result = result.substring(n+7,result.length);
            console.log(result);

            var url = serverURL + "prequalification/createPrequalificationTenderAttachmentCollection";
            var formData = {
                "attachmentCollection_id": 0,
                "prequalificationTenderCollection_id": allFormObj['parent_selected']['prequalificationTenderCollection_id'],
                "name": name,
                "downloadUri": result
            };
            var formData2 = JSON.stringify(formData);
            console.log(formData2)
            var userObj = JSON.parse(localStorage.getItem("userObj"));
            controller.request(url, formData2, true, userObj.token, function(data, status) {
                console.log(data);
                if (data.status) {
                    controller.showToastMsg(data.message, "#008300");
                    $(".attachment_tab_link").click();
                    $(".upload_pre_documents").modal("hide");
                    // document.getElementsByClassName('custom-file-label')[0].innerHTML=data.data.name
                    // document.getElementById('save_file').innerHTML="Change File";s
                    // setTimeout(() => { location.reload(true) }, 2000);
                } else {
                    controller.showToastMsg(data.message, "#ff6666");
                    // setTimeout(() => { location.reload(true) }, 2000);

                }

            })
        }

        f();
    },
    uploadDocTender: function(attachment_id, prequalificationTenderCollection_id) {
        const random = Math.floor(Math.random() * 20);

        var name = $('#filename').val()
        var myFile = $('#upload-file').prop('files');

        //     const toBase64 = file => new Promise((resolve, reject) => {
        //         const reader = new FileReader();
        //         reader.readAsDataURL(file);
        //         reader.onload = () => resolve(reader.result);
        //         reader.onerror = error => reject(error);
        //     });

        // //    async function Main() {
        // //     //    const file = document.querySelector('#myfile').files[0];
        // //        console.log(await toBase64(myFile));
        // //     }
        // //     Main()

        async function f() {
            const input = document.querySelector('input[type="file"]');
            const file = input.files[0];

            const toBase64 = file => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });

            let result = await toBase64(file); // wait until the promise resolves (*)
            var n = result.indexOf("base64,");
            result = result.substring(n+7,result.length);
            console.log(result);

            var url = serverURL + "tender/tenderAttachmentCollection";
            var formData = {
                    "attachmentCollection_id": 0,
                    "tender_collection_id": allFormObj['parent_selected']['tender_collection_id'],
                    "name": name,
                    "downloadUri": result
                };
            var formData2 = JSON.stringify(formData);
            console.log(formData2)
            var userObj = JSON.parse(localStorage.getItem("userObj"));
            controller.request(url, formData2, true, userObj.token, function(data, status) {
                console.log(data);
                if (data.status) {
                    controller.showToastMsg(data.message, "#008300");
                    $(".attachment_tab_link").click();
                    $(".upload_pre_documents").modal("hide");
                    // document.getElementsByClassName('custom-file-label')[0].innerHTML=data.data.name
                    // document.getElementById('save_file').innerHTML="Change File";s
                    // setTimeout(() => { location.reload(true) }, 2000);
                } else {
                    controller.showToastMsg(data.message, "#ff6666");
                    // setTimeout(() => { location.reload(true) }, 2000);

                }

            })
        }

        f();
    },
    postDocumentWithFormData: function() {
        var data = new FormData();
        var form_data = $('#' + formDocumentID).serializeArray();
        //File data
        var file_data = $('input[name="file"]')[0].files;
        for (var i = 0; i < file_data.length; i++) {
            data.append("file", file_data[i]);
        }
    },
    editDocumentRow: function(x, e) {

        $('#myfile').html("");
        console.log(x);

        $('.modal.fade.document').modal('show');
        for (var key in x) {
            if (x.hasOwnProperty(key)) {

                if (key == "docStatus") {
                    $("#" + key + "_name").val(x[key].name);
                }
                $("#" + key).val(x[key]);
            } else {

                $("#" + key).val(x[key]);
            }
        }

        var formObj_ = allFormObj['documents'];
        var selectParentID = controller.getPrimaryValueByName(formObj_["parentTable"]);

        $("#" + formObj_["parentTable"] + "Document_id").val(x[formObj_["parentTable"] + "Document_id"]);
        $("#documentUploadType_id").val(x.documentUploadType.documentUploadType_id);
        $("#documentDocStatus_id").val(x.docStatus.docStatus_id);
        var imageURL = formObj_["getDocImageUrl"] + "" + x.name;
        console.log(imageURL);
        $('#myfile').html("Attachment Preview Loading.. Please Wait");

        controller.getFile(imageURL,
            function(response) {

                var path = x.path;
                var ext = path.split('.').pop();

                if (ext == "pdf") {
                    PDFObject.embed(response, "#myfile");
                } else { //Images and other files
                    $('#myfile').html("<img style='width:100%;height:100%;' src='" + response + "'>");
                }

            });

        $(".delete").show();
    },
    getFile: function(url, handleData) {

        $(".print").removeClass("loading");
        jQuery.ajax({
            url: url,
            headers: {
                'Authorization': userObj.tokenType + " " + userObj.accessToken,
            },
            cache: false,
            xhr: function() { // Seems like the only way to get access to the xhr object
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob'
                return xhr;
            },
            success: function(data) {
                //var img = document.getElementById('img');
                var url = window.URL || window.webkitURL;
                fileSRC = url.createObjectURL(data);
                $(".print").removeClass("loading");
                handleData(fileSRC);

            },
            error: function() {

            }
        });
    },
    addDocument: function(typeId) {

        var identifier_ = $("#" + this.myFormObj.formIdentifierID).val();
        var identifier = this.myFormObj.formName;
        $("#documentUploadType_id").val(typeId);
        $("#" + identifier + "Document_id").val("");
        if (identifier_ == "") {
            alert("First Save Main Record to Proceed");
        } else {
            event.stopPropagation();
            $('.modal.fade.document').modal('show');
            $('#documentUploadType_id').css('pointer-events', 'none');
            $('#myfile').html("");
            $('#file').val("");
        }
    },
    closeModal: function() {
        $('.ui.basic.modal.relation').modal('hide');
        $('.modal.fade.document').modal('hide');
        $('.ui.basic.modal.document-relation').modal('hide');
        //$('body .modals').remove();
    },
    clearFields: function() {

        $('#' + this.myFormObj.htmlFormID)[0].reset();
        $(".delete").hide();
        $(".new").removeClass("disabled");

    },
    disableForm: function(status) {

        //$("#" + this.myFormObj.htmlFormID + " :input").prop("readonly", status);
        //$("#" + this.myFormObj.htmlFormRelationID + " :input").prop("readonly", status);
        //$("#" + this.myFormObj.htmlFormDocumentID + " :input").prop("readonly", status);

        $(".save").prop("disabled", status);
        $(".delete").prop("disabled", status);
        $(".row-button").prop("disabled", status);

        if (status == true) {

            $("input").css('pointer-events', 'none');
            $("select").css('pointer-events', 'none');

            $('#file').css('pointer-events', 'none');
            //$('#add-document-row').css('pointer-events','none');
            $('.upload_btn').prop('disabled', true);

        } else {
            $("input").css('pointer-events', 'all');
            $("select").css('pointer-events', 'all');
            $('#file').css('pointer-events', 'all');
            $('.upload_btn').prop('disabled', false);
            $('#staffRelationship_id').css('pointer-events', 'all');

        }
    },
    getFormData: function(formName) {
        var recId = this.windowId;
        var url = this.myFormObj["getRecUrl"] + "?id=" + recId;
        jsonData = { "id": recId };
        var dates = this.myFormObj.dateFields;
        var formData = JSON.stringify(jsonData);
        controller.getWindowDetails(formData, url,
            function(output) {
                console.log(output);

                //controller.loadFormData(output);			    			    	
                controller.renderEditForm(output, formName, "", "", function(response) {
                    controller.initActions();

                });

            });
    },
    getFormData: function(formName) {
        var recId = this.windowId;
        var url = this.myFormObj["getRecUrl"] + "?id=" + recId;
        jsonData = { "id": recId };
        var dates = this.myFormObj.dateFields;
        var formData = JSON.stringify(jsonData);
        controller.getWindowDetails(formData, url,
            function(output) {
                console.log(output);
                //controller.loadFormData(output);
                controller.renderEditForm(output, formName);
            });
    },
    getWindowDetails: function(formData, url, handleData) {

        $.ajax({
            url: url,
            headers: {
                'Authorization': userObj.tokenType + " " + userObj.accessToken,
            },
            async: false,
            type: 'post',
            data: formData,
            contentType: "application/json",
            success: function(data, textStatus, xhr) {
                console.log(xhr.status);
                handleData(data);

                if (xhr.status == 200) {
                    //controller.showToastMsg("Updated Successfully","#1a5589");
                } else if (xhr.status == 201) {
                    controller.showToastMsg("Error! Created", "#ff6666");
                } else if (xhr.status == 400) {
                    controller.showToastMsg("Error! Fields are empty", "#ff6666");
                } else if (xhr.status == 401) {
                    controller.showToastMsg("Error! Unauthorized", "#ff6666");
                } else if (xhr.status == 403) {
                    controller.showToastMsg("Error! Forbidden", "#ff6666");
                } else if (xhr.status == 404) {
                    controller.showToastMsg("Error! Not found", "#ff6666");
                } else if (xhr.status == 500) {
                    controller.showToastMsg("Error! Duplicate, Record Exists", "#ff6666");
                }

            },
            fail: function(xhr, textStatus) {

                console.log(xhr.status);
                if (xhr.status == 200) {
                    controller.showToastMsg("Updated Successfully", "#1a5589");
                } else if (xhr.status == 201) {

                    controller.showToastMsg("Error! Created" + errorMsg, "#ff6666");
                } else if (xhr.status == 400) {
                    var t = xhr.responseText;
                } else if (xhr.status == 401) {
                    controller.showToastMsg("Error! Unauthorized" + errorMsg, "#ff6666");
                } else if (xhr.status == 403) {
                    controller.showToastMsg("Error! Forbidden" + errorMsg, "#ff6666");
                } else if (xhr.status == 404) {
                    controller.showToastMsg("Error! Not found" + errorMsg, "#ff6666");
                } else if (xhr.status == 500) {
                    var errorMsg = xhr.responseJSON.message;
                    controller.showToastMsg("Error!" + errorMsg, "#ff6666");
                }

                $(".save").removeClass("loading");

            },
            error: function(xhr, textStatus) {

                //console.log(xhr.status);
                if (xhr.status == 200) {
                    controller.showToastMsg("Updated Successfully", "#1a5589");
                } else if (xhr.status == 201) {

                    controller.showToastMsg("Error! Created" + errorMsg, "#ff6666");
                } else if (xhr.status == 400) {
                    var t = xhr.responseText;
                    var obj = JSON.parse(t);
                    console.log(obj.errors);
                    var errorArr = obj.errors;
                    var errorMsg = "";
                    for (var i in errorArr) {
                        errorMsg = errorMsg + "</br>" + errorArr[i].defaultMessage;
                    }

                    console.log(errorMsg);
                    controller.showToastMsg("Error! Fields are empty" + errorMsg, "#ff6666");
                } else if (xhr.status == 401) {
                    controller.showToastMsg("Error! Unauthorized" + errorMsg, "#ff6666");
                } else if (xhr.status == 403) {
                    controller.showToastMsg("Error! Forbidden" + errorMsg, "#ff6666");
                } else if (xhr.status == 404) {
                    controller.showToastMsg("Error! Not found" + errorMsg, "#ff6666");
                } else if (xhr.status == 500) {
                    //console.log(xhr);
                    var errorMsg = xhr.responseJSON.message;
                    controller.showToastMsg("Error!" + errorMsg, "#ff6666");
                }
                $(".save").removeClass("loading");
            }
        });

    },
    deleteEntity: function(e) {

        var url = "";
        var form = $(e).closest("form");
        console.log(form);
        var form_identifier = form.attr("form_identifier");
        console.log(form_identifier);

        var primaryName = form_identifier;
        var identifier = form_identifier + "_id";
        var formID = "#" + primaryName + "_form";

        var formJson = $(formID).serializeObject();

        url = primaryName + "_" + deleteUrl;

        var formData = JSON.stringify(formJson);
        crud.saveFormDetails(formData, url,
            function(output) {


            });
    },
    saveFormDetails: function(formData, url, handleData, buttonClass = 'save', actionMsg = 'Updated Successfully') {



        $("." + buttonClass).addClass("loading");
        $.ajax({
            url: url,
            headers: {
                'Authorization': userObj.tokenType + " " + userObj.accessToken,
            },
            async: true,
            type: 'post',
            data: formData,
            contentType: "application/json",
            success: function(data, textStatus, xhr) {
                console.log(xhr.status);
                console.log(data);

                if (xhr.status == 200) {
                    controller.showToastMsg(actionMsg, "#1a5589");
                    //controller.refreshCrudTables();
                    handleData(data);
                    //controller.showToastMsg(actionMsg,"#1a5589");
                } else {
                    controller.showToastMsg(data, "#1a5589");
                }

                // if(xhr.status == 201){
                // 	controller.showToastMsg("Error! Created","#ff6666");
                // }else if(xhr.status == 400){				
                // 	//{"success":false,"message":"FAILED","data":"Country Does not Exists"}
                // 	controller.showToastMsg(data.message,"#ff6666");
                // }else if(xhr.status == 401){
                // 	controller.showToastMsg("Error! Unauthorized","#ff6666");
                // }else if(xhr.status == 403){
                // 	controller.showToastMsg("Error! Forbidden","#ff6666");
                // }else if(xhr.status == 404){
                // 	controller.showToastMsg("Error! Not found","#ff6666");
                // }else if(xhr.status == 500){
                // 	controller.showToastMsg("Error! Duplicate, Record Exists","#ff6666");
                // }
                $("." + buttonClass).removeClass("loading");
            },
            fail: function(xhr, textStatus) {

                console.log("FAIL..");
                console.log(xhr);
                controller.showToastMsg(xhr.responseJSON.data, "#ff6666");
                handleData(xhr.responseText);
                $(".save").removeClass("loading");
            },
            error: function(xhr, textStatus) {
                console.log("ERROR..", JSON.parse(xhr.responseText).data);
                console.log("SAVE DETAILS ERROR", xhr);
                controller.showToastMsg(xhr.responseJSON.data, "#ff6666");
                handleData(xhr.responseText);
                $(".save").removeClass("loading");
            }
        });

    },

    deactivateUserDetails: function(formData, url, handleData, buttonClass = 'save', actionMsg = 'Updated Successfully') {
        $("." + buttonClass).addClass("loading");
        $.ajax({
            url: url,
            headers: {
                'Authorization': userObj.tokenType + " " + userObj.accessToken,
            },
            async: true,
            type: 'post',
            data: formData,
            contentType: "application/json",
            success: function(data, textStatus, xhr) {
                console.log(xhr.status);
                console.log(data);

                if (xhr.status == 200) {
                    controller.showToastMsg(actionMsg, "#1a5589");
                    handleData(data);
                } else if (xhr.status == 201) {
                    controller.showToastMsg("Error! Created", "#ff6666");
                } else if (xhr.status == 400) {

                    controller.showToastMsg(data.message, "#ff6666");
                } else if (xhr.status == 401) {
                    controller.showToastMsg("Error! Unauthorized", "#ff6666");
                } else if (xhr.status == 403) {
                    controller.showToastMsg("Error! Forbidden", "#ff6666");
                } else if (xhr.status == 404) {
                    controller.showToastMsg("Error! Not found", "#ff6666");
                } else if (xhr.status == 500) {
                    controller.showToastMsg("Error! Duplicate, Record Exists", "#ff6666");
                }

                $("." + buttonClass).removeClass("loading");
            },
            fail: function(xhr, textStatus) {

                console.log(xhr.status);
                if (xhr.status == 200) {
                    controller.showToastMsg(actionMsg, "#1a5589");
                    handleData(xhr.responseText);
                } else if (xhr.status == 201) {

                    controller.showToastMsg("Error! Created" + errorMsg, "#ff6666");

                } else if (xhr.status == 400) {

                    var errorData = "";
                    try {
                        var errorData = xhr.responseJSON.data;
                    } catch (e) {

                    }
                    controller.showToastMsg("Error 400! - " + errorData, "#ff6666");

                } else if (xhr.status == 401) {
                    controller.showToastMsg("Error! Unauthorized" + errorMsg, "#ff6666");
                } else if (xhr.status == 403) {
                    controller.showToastMsg("Error! Forbidden" + errorMsg, "#ff6666");
                } else if (xhr.status == 404) {
                    controller.showToastMsg("Error! Not found" + errorMsg, "#ff6666");
                } else if (xhr.status == 500) {
                    var errorMsg = xhr.responseJSON.message;

                    try {
                        var error = errorMsg.substring(1, 9);
                        console.log(errorMsg);
                        if (errorMsg == "could not") {
                            controller.showToastMsg("Error! Duplicate record exists" + errorMsg, "#ff6666");
                        } else {
                            controller.showToastMsg("Error!" + errorMsg, "#ff6666");
                        }
                    } catch (e) {

                    }
                }

                $(".save").removeClass("loading");
            },
            error: function(xhr, textStatus) {

                if (xhr.status == 200) {

                    handleData(xhr.responseText);
                    controller.showToastMsg(actionMsg, "#1a5589");
                } else if (xhr.status == 201) {

                    controller.showToastMsg("Error! Created" + errorMsg, "#ff6666");
                } else if (xhr.status == 400) {

                    //console.log(xhr);
                    var errorData = "";
                    try {
                        var errorData = xhr.responseJSON.data;
                    } catch (e) {

                    }
                    controller.showToastMsg("Error 400! " + errorData, "#ff6666");

                } else if (xhr.status == 401) {
                    controller.showToastMsg("Error! Unauthorized" + errorMsg, "#ff6666");
                } else if (xhr.status == 403) {
                    controller.showToastMsg("Error! Forbidden" + errorMsg, "#ff6666");
                } else if (xhr.status == 404) {
                    controller.showToastMsg("Error! Not found" + errorMsg, "#ff6666");
                } else if (xhr.status == 500) {
                    //console.log(xhr);
                    var errorMsg = xhr.responseJSON.message;
                    controller.showToastMsg("Error!" + errorMsg, "#ff6666");
                }

                $(".save").removeClass("loading");
            }
        });

    },
    show_progress: function() {
        console.log("show progress");
        $(".xcrud-overlay").show();
    },
    hide_progress: function() {
        console.log("hide progress");
        $(".xcrud-overlay").hide();
    },
    editDocument: function(x) {

        $('#myfile').html("");
        console.log(x);
        $('.modal.fade.document').modal('show');
        $("#diplomatDocument_id").val(x[formIdentifierDocumentID]);
        $("#documentUploadType_id").val(x.documentUploadType.documentUploadType_id);
        $("#documentDocStatus_id").val(x.docStatus.docStatus_id);
        var imageURL = getDocImageUrl + "" + x.name;
        $('#myfile').html("Attachment Preview Loading.. Please Wait");

        controller.getFile(imageURL,
            function(response) {

                var path = x.path;
                var ext = path.split('.').pop();

                if (ext == "pdf") {
                    PDFObject.embed(response, "#myfile");
                } else { //Images and other files
                    $('#myfile').html("<img style='width:100%;height:100%;' src='" + response + "'>");
                }

            });

        $(".delete").show();
    },
    editRow: function(x, e) {

        console.log("editRow");

        var formName = $(e).attr("form-name");
        console.log(formName);
        console.log(x);
        var exclusionTab = [];

        if (formName == 'exporterConsignment' && setupObj['agent_mgt']) {
            console.log(x.agent.agents_id);
            var url = serverURL + 'agentManagement/getByAgent?agentID=' + x.agent.agents_id; //consignee/getConsigneeByExporter?exporterID=
            controller.setUpObjInitializeSpecificOneWithCallBack(url, 'agent_mgt', function(data) {

                console.log("agent phyto consignee", data);
                if (data.length == 1) {
                    console.log("COMPANY AGENT ID", data[0]['company']['company_id']);
                    var url = serverURL + "consignee/getConsigneeByCompany?companyID=" + x.company.company_id + "&pageNo=0&pageSize=100";
                    controller.setUpObjInitializeSpecificOne(url, 'consignee', function(data) {
                        controller.loadOptionsAfresh('consigneeID', 'consignee', 'consigneeID');
                    });
                } else {
                    // console.log("COMPANY AGENT ID",data[0]['company']['company_id']);
                    var url = serverURL + "consignee/getConsigneeByCompany?companyID=" + x.company.company_id + "&pageNo=0&pageSize=100";
                    controller.setUpObjInitializeSpecificOne(url, 'consignee', function(data) {
                        controller.loadOptionsAfresh('consigneeID', 'consignee', 'consigneeID');
                    });


                    var url = serverURL + "company/getCompanyByID?id=" + x.company.company_id + "&pageNo=0&pageSize=100";
                    controller.setUpObjInitializeSpecificOne(url, 'company', function(data) {
                        controller.loadOptionsAfresh('company_id', 'company', 'company_id');
                    });
                }

            });
        }

        if (formName == 'exporter' || formName == 'assignInspection' || formName == 'assignedInspection') {

            //exclusionTab.push("Product");			
            if (!x.isOwnFarmExporter) {
                exclusionTab.push("OwnFarms");
                exclusionTab.push("OwnFarmsDestination");

            }
            if (!x.isExportConsolidator) {
                exclusionTab.push("Firms");
            }
            if (!x.isDryCommodityExporter) {
                exclusionTab.push("LowRiskCommoditiesRegistration");
            }
        }

        if (allFormObj['pipApplicationVariety']) {
            allFormObj['pipApplicationVariety']['crudAdd'] = true;
            allFormObj['pipApplicationVariety']['crudEdit'] = true;
            // pipApplicationVariety
        }
        if (allFormObj['onetime_export_variety_details']) {
            allFormObj['onetime_export_variety_details']['crudAdd'] = true;
            allFormObj['onetime_export_variety_details']['crudEdit'] = true;
            // onetime_export_variety_details
        }


        if (allFormObj['onetime_import_variety_details']) {
            allFormObj['onetime_import_variety_details']['crudAdd'] = true;
            allFormObj['onetime_import_variety_details']['crudEdit'] = true;
            // onetime_export_variety_details
        }

        if (allFormObj['exporterConsignmentVarietyDetails']) {
            allFormObj['exporterConsignmentVarietyDetails']['crudAdd'] = true;
            allFormObj['exporterConsignmentVarietyDetails']['crudEdit'] = true;
            // onetime_export_variety_details
        }

        if (allFormObj['importer']) {
            allFormObj['importer_product']['crudAdd'] = true;
            allFormObj['importer_product']['crudEdit'] = true;
            // pipApplicationVariety
        }

        if (allFormObj['exporter']) {
            allFormObj['exporterFarm']['crudAdd'] = true;
            allFormObj['exporterFarm']['crudEdit'] = true;

            allFormObj['exporterFirm']['crudAdd'] = true;
            allFormObj['exporterFirm']['crudEdit'] = true;

            allFormObj['exporterLowRiskCommodity']['crudAdd'] = true;
            allFormObj['exporterLowRiskCommodity']['crudEdit'] = true;

            allFormObj['exporterMarketDestination']['crudAdd'] = true;
            allFormObj['exporterMarketDestination']['crudEdit'] = true;

            allFormObj['exporterProduct']['crudAdd'] = true;
            allFormObj['exporterProduct']['crudEdit'] = true;
        }

        if (allFormObj['consolidatedExportConsignmentLines']) {
            allFormObj['consolidatedExportConsignmentLines']['crudAdd'] = true;
            allFormObj['consolidatedExportConsignmentLines']['crudEdit'] = true;
            // onetime_export_variety_details
        }
        if (formName == 'lab_analysis_technician') {
            console.log("LAB ANALYSIS TECHNICIAN FORM", formName)
        }

        //var formHTML = controller.renderEditForm(x,formName,true,exclusionTab);

        controller.renderEditForm(x, formName, true, exclusionTab, function(response) {
            var formHTML = response;
            $("#listings_edit_" + formName).show();
            $("#listings_edit_" + formName).html(formHTML);
            controller.initActions();
            controller.initializeTabs();
            controller.initializeDateFields(formName);
            console.log("renderDate2");

            //validate fields
            controller.validateOnView_Edit(x, formName);
        });

    },
    validateOnAdd: function(formName) {

        console.log("Is seed logic", formName);
        if (formName == 'exporterConsignment') {
            $(".sr14_no_holder").hide();
        }

        // if(formName == 'exporterInspectionRequest'){	
        // 	console.log("HIDING FIELDS")	
        // 	$(".quarantineFacilityID_holder").hide();	
        // 	$(".exporterConsignmentID_holder").hide();
        // 	$(".proposedInspectionDate_holder").hide();	
        // 	// $(".exporterConsignmentProposedInspectionDate_holder").hide();
        // 	$(".exporterFarmID_holder").hide();			
        // 	// $(".exporterFarmProposedInspectionDate_holder").hide();
        // 	$(".exporterFirmID_holder").hide();
        // 	// $(".exporterFirmProposedInspectionDate_holder").hide();
        // 	$(".exporterID_holder").hide();
        // 	$(".exporterLowRiskCommodityID_holder").hide();
        // 	// $(".exporterLowRiskCommodityProposedInspectionDate_holder").hide();
        // 	$(".otherInfo_holder").hide();
        // 	$(".requestDate_holder").hide();
        // 	$(".requestDate_holder").hide();			
        // }
        if (formName == 'importerInspectionRequest') {
            $(".quarantineFacilityID_holder").hide();
            $(".quarantineFacilityProposedInspectionDate_holder").hide();
        }
        if (formName == 'onetime_import_variety_details') {
            $(".sr14Number_holder").hide();
        }

        if (formName == 'pip_application') {
            $(".sr14_number_holder").hide();
        }

        if (formName == 'consolidatedPhyto') {
            $(".sr14_no_holder").hide();
        }
        if (formName == 'exporter') {
            $(".researchInstituteID_holder").hide();
            $(".researcherCategoryID_holder").hide();
        }

        // if(formName == 'pip_application'){			
        // 	$(".sr14_no_holder").hide();			
        // }
    },
    validateOnView_Edit: function(x, formName) {
        console.log(formName);
        console.log(x)


    },
    viewRow: function(x, e) {

        console.log("viewRow");
        //var formNameObj = $(e).closest('.crud_form');
        //var formName = formNameObj.attr("form-name");
        //console.log(formNameObj);

        var formName = $(e).attr("form-name");
        console.log(formName);
        console.log(x);

        var exclusionTab = [];


        //validate on fields & hide/show logic
        controller.validateOnView_Edit(x, formName);

        //var formHTML = controller.renderEditForm(x,formName,false,exclusionTab);
        controller.renderEditForm(x, formName, false, exclusionTab, function(response) {
            console.log("EDIT FORMANAME" + formName)
            var formHTML = response;
            $("#listings_edit_" + formName).show();
            $("#listings_edit_" + formName).html(formHTML);
            controller.initActions();
            controller.initializeTabs();
            console.log("renderDate2");
            controller.initializeDateFields(formName);

        });


    },
    addRecord: function(e) {

        var formName = $(e).attr("form-name");
        var formHTML = "";
        var loadTableobj = "";
        console.log("Form Name" + formName);
        controller.renderAddForm(formName, function(response) {
            //var [formHTML,loadTableobj] = response;
            formHTML = response[0];
            loadTableobj = response[1];
            console.log("FormLoaded", response);

            $("#listings_edit_" + formName).show();
            $('.crud_form.' + formName).append($("#listings_edit_" + formName));
            $("#listings_edit_" + formName).html(formHTML);
            controller.initActions();
            controller.initializeDateFields(formName);
            controller.validateOnAdd(formName);

            //initialize select filters
            if (formName == "exporterFarm") {
                console.log("initiate select");
                var options = "";
                controller.requestWithToken(serverURL + 'exporter/getExporterByCompanyID', function(data1, status) {
                    var exporterID = data1[0].exporterID;
                    var url = serverURL + 'exporterProduct/getExporterProductByExporter?exporterID=' + exporterID; //consignee/getConsigneeByExporter?exporterID=
                    controller.setUpObjInitializeSpecificOne(url, 'productss', function() {
                        for (x in setupObj['productss']) {
                            console.log(pObj);
                            var pObj = setupObj['productss'];
                            options += "<option value='" + pObj[x]['products']['products_id'] + "'>" + pObj[x]['products']['name'] + "</option>";
                        }
                        $('#products_id').html(options);

                    });
                });


                var options = "";
                $("#products_id").click(function(e) {
                    var productId = $("#products_id").val();
                    console.log("Clicked-", productId);
                    var options = "";

                    for (x in setupObj['productss']) {
                        var pObj = setupObj['productss'];
                        if (pObj[x]['products']['products_id'] == productId) {
                            //$('#product_category_id').val(pObj[x]['products']['productCategory']['product_category_id']);
                            options += "<option value='" + pObj[x]['products']['productCategory']['product_category_id'] + "'>" + pObj[x]['products']['productCategory']['name'] + "</option>";
                        }
                        console.log(pObj[x]['products']['productCategory']);
                    }
                    $('#product_category_id').html(options);

                });

                var options = "";
                $("#county_id").click(function(e) {
                    var options = "";
                    var id = document.getElementById("county_id").value;
                    var countyid = id.split(",").splice(0, 1).join("");
                    var url = serverURL + "subCounty/subCountyListByCountyID?countyID=" + countyid + "&pageNo=0&pageSize=100";
                    var async_status = true;
                    controller.getRequest(url, async_status, function(data, status) {
                        options += "<option>-Select Sub County-</option>";
                        options += controller.loadSelect(data, 'subcounty_id', 'name', '');
                        $('#subcounty_id').html(options);
                    });
                });

                $("#subcounty_id").click(function(e) {
                    var options = "";
                    var id = document.getElementById("subcounty_id").value;
                    var subcountyid = id.split(",").splice(0, 1).join("");
                    var url = serverURL + "ward/wardListySubCountyID?pageNo=0&pageSize=100&subCountyID=" + subcountyid + "";
                    var async_status = true;
                    controller.getRequest(url, async_status, function(data, status) {
                        options += "<option>-Select Ward-</option>";
                        options += controller.loadSelect(data, 'ward_id', 'name', '');
                        $('#ward_id').html(options);
                    });

                });
            }

        });


    },
    initializeDateFields: function(formName) {

        console.log("initializeDateFields-1", formName);
        var currentObj = allFormObj[formName];
        var dates = currentObj.dateFields;
        console.log("initializeDateFields", dates);

        for (x in dates) {
            var dateInputID = "#" + dates[x];
            console.log("Date is - " + dateInputID);
            console.log(dates[x])

            if (dates[x] == "collectionDate") { //Those that require both date and time
                console.log("set time & date");
                try {
                    var formattedDate = controller.formatDateTime($(''+dateInputID+'').val());
                    $(dateInputID).val(formattedDate);
                } catch (e) {

                }

                //Waiting for BE 
                $(dateInputID).datetimepicker({ dateFormat: 'yy-mm-dd', timeFormat: "hh:mm", changeYear: true, yearRange: '1900:2099' });
                //$( dateInputID).datepicker({ dateFormat: 'yy-mm-dd',timeFormat: "hh:mm", changeYear: true,yearRange: '1900:2099' });	

            } else if (dates[x] == "company.registrationDate") {

                console.log("DDX", $(dateInputID).html());
                console.log("DDV", $(dateInputID).val());

                var dateInputID = "#" + dates[x];
                try {
                    var formattedDate = controller.formatDate($(dateInputID).html());
                    $(dateInputID).html(formattedDate);

                } catch (e) {

                }

                try {

                    var formattedDate = controller.formatDate($(dateInputID).val());
                    $(dateInputID).val(formattedDate);
                } catch (e) {

                }

            } else {
                try {
                    var formattedDate = controller.formatDate($(dateInputID).val());
                    $(dateInputID).val(formattedDate);
                } catch (e) {

                }

                $(dateInputID).datepicker({ dateFormat: 'yy-mm-dd', changeYear: true, yearRange: '1900:2099' });
            }
        }

    },
    initActions: function() {

        //$('.save').click(function(event) {		  	
        $('.save').off('click').on('click', function(event) {
            if (!event.detail || event.detail == 1) { //activate on first click only to avoid hiding again on multiple clicks
                // code here. // It will execute only once on multiple clicks			
                controller.save(this);
            }
        });

        $(".addRecord").on("click", function() {
            var formName = $(this).attr("form-name");
            console.log("add form anme", formName)
            if (formName == 'exporterFarm') {
                document.getElementsByClassName("crud_section_lines")[0].style.display = "none";
                // document.getElementsByClassName('approve_btn_inspection')[0].style.display="block";
            }
            controller.addRecord(this);
        });

        $(".addChildRecord").on("click", function() {
            controller.addChildRecord(this);
        });

        $(".return").on("click", function() {
            var formName = $(this).attr("form-name");

            $("#listings_edit_" + formName).hide();

            //hide crud section_lines
            //logic to show and hide inspections tab and button based on the current view
            if (formName == 'assignedInspection' || formName == "assignedConsignmentInspection" || formName == "assignConsignmentInspection" || formName == "assignedConsignmentInspectionRequest" || formName == "assignConsignmentInspectionRequest" || formName == 'assignInspection' || formName == 'assignPhytoInspections' || formName == 'assignedPhytoInspections') {
                document.getElementsByClassName("crud_section_lines")[0].style.display = "none";
                document.getElementsByClassName('approve_btn_inspection')[0].style.display = "block";
            } else if (formName == 'assignInspection') {
                document.getElementsByClassName("crud_section_lines")[0].style.display = "none";
                document.getElementsByClassName('approve_btn_inspection')[0].style.display = "block";
            } else if (formName == 'assignExporterFirm') {
                document.getElementsByClassName("crud_section_lines")[0].style.display = "none";
                document.getElementsByClassName('approve_btn_inspection')[0].style.display = "block";
            } else if (formName == 'assignedExporterFirm') {
                document.getElementsByClassName("crud_section_lines")[0].style.display = "none";
                document.getElementsByClassName('approve_btn_inspection')[0].style.display = "block";
            } else if (formName == 'assignExporterFarm') {
                document.getElementsByClassName("crud_section_lines")[0].style.display = "none";
                document.getElementsByClassName('approve_btn_inspection')[0].style.display = "block";
            } else if (formName == 'assignedExporterFarm') {
                document.getElementsByClassName("crud_section_lines")[0].style.display = "none";
                document.getElementsByClassName('approve_btn_inspection')[0].style.display = "block";
            } else if (formName == 'assignedExporterLowRisk') {
                document.getElementsByClassName("crud_section_lines")[0].style.display = "none";
                document.getElementsByClassName('approve_btn_inspection')[0].style.display = "block";
            } else if (formName == 'assignExporterLowRisk') {
                document.getElementsByClassName("crud_section_lines")[0].style.display = "none";
                document.getElementsByClassName('approve_btn_inspection')[0].style.display = "block";
            } else if (formName == 'assignedPhytoInspection') {
                document.getElementsByClassName("crud_section_lines")[0].style.display = "none";
                document.getElementsByClassName('approve_btn_inspection')[0].style.display = "block";
            } else if (formName == 'assignPhytoInspection') {
                document.getElementsByClassName("crud_section_lines")[0].style.display = "none";
                document.getElementsByClassName('approve_btn_inspection')[0].style.display = "block";
            } else if (formName == 'onetime_import') {
                document.getElementsByClassName("crud_section_lines")[0].style.display = "none";
                document.getElementsByClassName('approve_btn_inspection')[0].style.display = "block";
            } else if (formName == 'onetime_export') {
                document.getElementsByClassName("crud_section_lines")[0].style.display = "none";
                document.getElementsByClassName('approve_btn_inspection')[0].style.display = "block";
            } else if (formName == 'exporter') {
                document.getElementsByClassName("crud_section_lines")[0].style.display = "none";
                // document.getElementsByClassName('approve_btn_inspection')[0].style.display="block";
            } else if (formName == 'assignQuarantineFacility' || formName == 'assignedQuarantineFacility') {
                document.getElementsByClassName("crud_section_lines")[0].style.display = "none";
                // document.getElementsByClassName('approve_btn_inspection')[0].style.display="block";
            } else if (formName == 'assignConsignmentInspection') {
                document.getElementsByClassName("crud_section_lines")[0].style.display = "none";
                // document.getElementsByClassName('approve_btn_inspection')[0].style.display="block";
            } else if (formName == 'assignInspectionRequest') {
                document.getElementsByClassName("crud_section_lines")[0].style.display = "none";
                // document.getElementsByClassName('approve_btn_inspection')[0].style.display="block";
            }
        });


        $(".print_note").on("click", function() {
            controller.printNote(this);
        });

        $(".print_form").on("click", function() {
            controller.printEntity(this);
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
    renderAddForm: function(formName, callback) {

        editable = true;
        console.log("{ renderAddForm");
        //another logic Again TRY
        var tabHeaders = "";
        var mainFormHTML = "";
        var tabsFormHTML = "";
        var subTabHeaders = "";
        var mainSubFormHTML = "";

        var currentObj = allFormObj[formName];
        var tab = currentObj.Mytabs;
        // var MyChildTables = this.myFormObj.MyChildTables;
        var fields = currentObj.fields;
        var idType = currentObj.idType;
        var formName = currentObj.formName;
        //var exportTable = currentObj.exporterLowRiskCommodity;

        var loadTableobj = [];

        var dates = currentObj.dateFields;

        if (tab.length) {


            console.log("Adding Form with tabs");
            for (i = 0; i < 1; i++) {
                //tabHeaders = "";
                var isActive = "";
                if (i == 0) {
                    isActive = "active in";
                } else {
                    isActive = "";
                }

                tabHeaders += '<li class="' + isActive + '"><a data-toggle="tab" href="#' + tab[i]['tabName'] + '">' + tab[i]['tabTitle'] + '</a></li>';
                console.log(tab[i] + "<br>");

                //get group fields
                let uniqueGroupNames = [...new Set(fields.map(item => item.groupName))];
                console.log(uniqueGroupNames);

                for (groupIndex in uniqueGroupNames) {

                    var displayGroupName = uniqueGroupNames[groupIndex];
                    console.log(displayGroupName);
                    if (displayGroupName == undefined || displayGroupName == "undefined") {
                        displayGroupName = "";
                    }

                    subTabHeaders += "<div class='form-group col-md-12' style='float: left;'><h4>" + displayGroupName + "</h4></div>";

                    for (a = 0; a < fields.length; a++) { //loop through fields

                        var fieldGroupName = fields[a]['groupName'];

                        if (uniqueGroupNames[groupIndex] == fieldGroupName || (displayGroupName == "" && uniqueGroupNames.length == 1)) {
                            console.log("fields being passed", fields[a]);
                            var fieldName = fields[a]['field'];
                            var fieldTitle = fields[a]['title'];
                            var fieldType = fields[a]['type'];
                            var fieldRelation = fields[a]['relation'];
                            var fieldOptionID = fields[a]['option_id'];
                            try {
                                var select_type = fields[a]['select_type'];
                            } catch (error) {
                                console.log(error);
                            }

                            if (fieldOptionID == undefined || fieldOptionID == "undefined") {
                                fieldOptionID = "";
                            }

                            // var fieldTab = fields[a]['tab'];
                            if (fields[a]['tab'] == tab[i]['tabName']) {

                                var s_type = '';
                                if (fieldType == 'select') { //Field type is select

                                    //check if it depends on another field
                                    //'dependants' : [{'link_id':'subcounty_id','link_table':'subcounty'}]

                                    var options = "";
                                    var depends = fields[a]['depends'];
                                    console.log(depends);

                                    if (depends == true) {

                                    } else {
                                        if (select_type == 'multiple') {
                                            s_type = 'multiple';
                                        }
                                        try {
                                            console.log("object");
                                            options = controller.setRelationValue(fieldRelation, setupObj, false, idType, fieldOptionID);
                                        } catch (e) {

                                        }
                                    }

                                    try {
                                        var fieldObjTemp = fields[a];
                                        fieldObjTemp.value = options;
                                        fieldObjTemp.s_type = s_type;
                                        subTabHeaders += controller.renderField(fieldObjTemp, currentObj.formName, editable);
                                    } catch (e) {

                                    }

                                } else {
                                    try {
                                        if (fields[a] != undefined && fields[a] != 'undefined') {
                                            if (dates != undefined && dates != 'undefined') {
                                                subTabHeaders += controller.renderField(fields[a], currentObj.formName, editable, true);
                                            } else {
                                                if (fieldType == 'boolean') {

                                                    subTabHeaders += controller.renderField(fields[a], currentObj.formName, editable, true);

                                                } else {
                                                    subTabHeaders += controller.renderField(fields[a], currentObj.formName, editable, true);
                                                }
                                            }
                                        } else {
                                            console.log("Field was not rendered");
                                            console.log(fields[a]);
                                        }
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }
                            }

                        }
                    }
                }

                tabsFormHTML +=
                    '<div id="' + tab[i]['tabName'] + '" class="tab-pane fade ' + isActive + '" >' +
                    subTabHeaders +
                    '</div>';
                subTabHeaders = "";

            }

            var actionButton = controller.renderFormActions(formName);

            mainSubFormHTML = "<form id='" + currentObj.formName + "_form'  form_identifier='" + currentObj.formName + "' class='form parsley-form'>" + actionButton + "</br>" +
                '<ul class="nav nav-tabs">' +
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
            //console.log(mainFormHTML);
            callback([mainFormHTML, loadTableobj]);
            //return [mainFormHTML,loadTableobj];

        } else {

            console.log("Adding Form with no tabs");
            //get group fields
            let uniqueGroupNames = [...new Set(fields.map(item => item.groupName))];
            console.log(uniqueGroupNames);

            for (groupIndex in uniqueGroupNames) {

                var displayGroupName = uniqueGroupNames[groupIndex];
                console.log("Group Loop");
                console.log(displayGroupName);
                console.log(fields);
                if (displayGroupName == undefined || displayGroupName == "undefined") {
                    displayGroupName = "";
                }

                tabsFormHTML += "<div class='form-group col-md-12' style='float: left;'><h4>" + displayGroupName + "</h4></div>";

                for (a = 0; a < fields.length; a++) { //loop through fields

                    var fieldGroupName = fields[a]['groupName'];
                    console.log("compare groups" + fieldGroupName + "--" + uniqueGroupNames[groupIndex] + "--" + fields[a]['field']);
                    if (uniqueGroupNames[groupIndex] == fieldGroupName || (displayGroupName == "" && uniqueGroupNames.length == 1)) {
                        console.log("Entered" + fields[a]['field']);
                        var fieldName = fields[a]['field'];
                        var fieldTitle = fields[a]['title'];
                        var fieldType = fields[a]['type'];
                        var fieldRelation = fields[a]['relation'];
                        var fieldOptionID = fields[a]['option_id'];

                        if (fieldOptionID == undefined || fieldOptionID == "undefined") {
                            fieldOptionID = "";
                        }

                        var fieldDefault = "";
                        try {
                            fieldDefault = fields[a]['default'];
                        } catch (e) {

                        }

                        var fieldDisabled = false;
                        try {
                            fieldDisabled = fields[a]['disabled'];
                        } catch (e) {

                        }

                        var select_type = "";
                        try {
                            select_type = fields[a]['select_type'];
                        } catch (e) {

                        }

                        var s_type = '';
                        if (fieldType == 'select') {

                            if (select_type == 'multiple') {
                                s_type = 'multiple';
                            } else {
                                s_type = '';
                            }

                            try {

                                console.log("Add Form Field " + fieldName);
                                if (fields[a]['relation'] == "roles") {
                                    console.log("roles::");

                                    var options = controller.setRelationValue("roles", setupObj, false, idType, 'roleName', formName);
                                    var fieldObjTemp = fields[a];
                                    fieldObjTemp.value = options;
                                    fieldObjTemp.s_type = s_type;
                                    var idType = 1;

                                    console.log("Add Form : Select Field Roles");
                                    console.log(fieldObjTemp);
                                    //options = controller.setRelationValue("roles",setupObj,false,idType,'roleName');										        
                                    tabsFormHTML += controller.renderField(fieldObjTemp, formName, editable);

                                } else {
                                    var options = controller.setRelationValue(fieldRelation, setupObj, false, idType, fieldOptionID);
                                    var fieldObjTemp = fields[a];
                                    fieldObjTemp.value = options;
                                    fieldObjTemp.s_type = s_type;

                                    console.log("Add Form : Select Field");
                                    console.log("Select Options = ", options);

                                    console.log(fieldObjTemp);

                                    tabsFormHTML += controller.renderField(fieldObjTemp, currentObj.formName, editable);
                                }

                            } catch (e) {

                            }
                        } else {
                            try {
                                if (fields[a] != undefined && fields[a] != 'undefined') {
                                    if (dates != undefined && dates != 'undefined') {
                                        tabsFormHTML += controller.renderField(fields[a], currentObj.formName, editable);
                                    } else {
                                        tabsFormHTML += controller.renderField(fields[a], currentObj.formName, editable);
                                    }
                                }
                            } catch (e) {
                                console.log(e);
                            }
                            console.log(tabsFormHTML);
                            console.log("finished");
                        }
                        try {
                            var select_type = fields[a]['select_type'];
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }

            }

            var actionButton = controller.renderFormActions(formName);
            mainFormHTML = "<form id='" + currentObj.formName + "_form'  form_identifier='" + currentObj.formName + "' class='form parsley-form'>" + actionButton + "</br>" + tabsFormHTML + "</form>";
            mainFormHTML = "<div class='main-form'>" + mainFormHTML + "</div>";
            console.log(mainFormHTML);
            callback([mainFormHTML, loadTableobj]);
            //return [mainFormHTML,loadTableobj];		 
        }
    },
    renderChildAddForm: function() {
        var tabHeaders = "";
        var mainFormHTML = "";
        var tabsFormHTML = "";
        var subTabHeaders = "";
        var mainSubFormHTML = "";
        var tab = this.myFormObj.Mytabs;
        var dates = this.myFormObj.dateFields;
        var fields = this.myFormObj.fields;
        var idType = this.myFormObj.idType;

        for (a = 0; a < fields.length; a++) {
            // tabsFormHTML += controller.renderField(fields[a]['title'],fields[a]['field'],'',fields[a]['type']);		
            var fieldName = fields[a]['field'];
            var fieldTitle = fields[a]['title'];
            var fieldType = fields[a]['type'];
            var fieldRelation = fields[a]['relation'];
            // var fieldTab = fields[a]['tab'];
            // if(fields[a]['tab'] == tab[i]){
            // subTabHeaders += fields[a]['tab'];
            var s_type = '';
            if (fieldType == 'select') {

                if (select_type == 'multiple') {
                    s_type = 'multiple';
                }
                try {
                    console.log("object");
                    //var options = controller.setRelationValue('',setupObj,false);

                    var options = controller.setRelationValue(fieldRelation, setupObj, false, idType);
                    tabsFormHTML += controller.renderField(fields[a], '', editable);

                } catch (e) {

                }
            } else {
                try {
                    if (fields[a] != undefined && fields[a] != 'undefined') {
                        console.log(dates);
                        if (dates != undefined && dates != 'undefined') {
                            console.log(dates);
                            // if(dates.includes(a)){//check if its a date field
                            // 	//$("#" + key).val(controller.formatDate(obj[key]));
                            // 	subTabHeaders += controller.renderField(fieldTitle,fieldName,'',fieldType);


                            // }else{					    			
                            tabsFormHTML += controller.renderField(fields[a], '', editable);
                            // }
                        } else {
                            tabsFormHTML += controller.renderField(fields[a], '', editable);
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
                console.log(tabsFormHTML);
                console.log("finished");
            }
            try {
                var select_type = fields[a]['select_type'];
            } catch (error) {
                console.log(error);
            }
        }

        var actionButton = controller.renderFormActions();

        mainFormHTML = "<form id='" + this.myFormObj.formName + "_form'  form_identifier='" + this.myFormObj.formName + "' class='form parsley-form'>" + actionButton + "</br>" + tabsFormHTML + "</form>";
        mainFormHTML = "<div class='main-form'>" + mainFormHTML + "</div>";
        console.log(mainFormHTML);
        return mainFormHTML;
    },
    childTable: function(loadTableobj) {
        for (var key in loadTableobj) {
            controller.loadTable(loadTableobj[key][0].listings, loadTableobj[key][0].listUrl, loadTableobj[key][0].buttonsArr, loadTableobj[key][0].formName, loadTableobj[key][0].list, loadTableobj[key][0].group);
        }
        loadTableobj = "";
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
        // var tmpTab = "";		
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

                        if (key == "roles") {

                            console.log(obj);
                            var idType = 1;

                            var listEntityName = returnField['listEntityName'];
                            if (listEntityName == "undefined" || listEntityName == undefined) {
                                listEntityName = "";
                            }

                            options = controller.setRelationValue("roles", obj, false, idType, 'roleName', "", listEntityName);
                            var renderObj = {
                                'title': returnField['title'],
                                'field': originalFieldName,
                                'value': options,
                                'type': returnField['type'],
                                'disabled': returnField['disabled'],
                                's_type': returnField['select_type'],
                                'validations': returnField['validations'],
                                'postField': returnField['postField']
                            };

                            tabsFormHTML += controller.renderField(renderObj, formName, editable);
                            //country options	

                        } else {
                            console.log("special..", option_id);
                            var listEntityName = returnField['listEntityName'];
                            if (listEntityName == "undefined" || listEntityName == undefined) {
                                listEntityName = "";
                            }

                            options = controller.setRelationValue(key, obj, false, idType, option_id, "", listEntityName);
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

                        }

                    } catch (e) {

                    }
                }

            } else {

                //key = controller.sanitize(key);						    		
                if (fieldName == key) { //check if fields is in defined list
                    try {

                        if (obj[key] != undefined && obj[key] != 'undefined') {
                            console.log(dates);
                            //const exists = formFields.myJSONArrayObject.some(o => myIntegerKey in o)
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

            //console.log(currentObj.fields);
            //fieldName
            console.log("drop down");
            console.log(fieldDefinedObj);


            try {
                var listEntityName = fieldDefinedObj['listEntityName'];
            } catch (e) {

            }

            if (fieldDefinedObj['type'] == "select") {
                options = controller.setRelationValue(key, obj, false, idType, option_id, "", listEntityName);

                //fieldDefinedObj.value = options;		
                console.log(options);
                fieldDefinedObj.value = options;
                tabsFormHTML += controller.renderField(fieldDefinedObj, currentObj.formName, editable);
            } else {

                console.log(returnField);

                options = controller.setRelationValue(key, obj, false, idType, option_id, "", listEntityName);

                //fieldDefinedObj.value = options;
                console.log(options);
                fieldDefinedObj.value = options;
                tabsFormHTML += controller.renderField(fieldDefinedObj, currentObj.formName, editable);
            }

            return tabsFormHTML;
            console.log("xx no property ", key);
            console.log("xx no property ", obj);
            //return tabsFormHTML += "<br><b>Field Name " + key + " not found in edit object</b><br>";

        }
    },
    renderFormActions: function(formName, editable = true) {
        console.log("form name", formName);
        if (formName == "assignedInspection") {

            var formActionsHTML = "";
            formActionsHTML = "<div class='xcrud-top-actions btn-group'>";
            formActionsHTML += "<a href='javascript:;' form-name='" + formName + "' data_task='return' class='btn btn-warning xcrud-action return'>Return</a>";
            formActionsHTML += "</div>";
            return formActionsHTML;
        } else if (formName == "assignInspection") {
            var formActionsHTML = "";
            formActionsHTML = "<div class='xcrud-top-actions btn-group'>";
            // formActionsHTML += "<a href='javascript:;' form-name='" + formName + "'  data_task='save_return' data-after='list' class='btn btn-primary xcrud-action save'>Save &amp; Return</a>";
            //formActionsHTML += "<a href='javascript:;' form-name='" + formName + "' data_task='save_new' data-after='create' class='btn btn btn-light xcrud-action save'>Save &amp; New</a>";
            //formActionsHTML += "<a href='javascript:;' form-name='" + formName + "' data_task='save_edit' data-after='edit' class='btn btn-light xcrud-action save'>Save &amp; Edit</a>";
            formActionsHTML += "<a href='javascript:;' form-name='" + formName + "' data_task='return' class='btn btn-warning xcrud-action return'>Return</a>";
            formActionsHTML += "</div>";
            return formActionsHTML;
        } else {
            var formActionsHTML = "";
            formActionsHTML = "<div class='xcrud-top-actions btn-group'>";
            if (editable) {
                formActionsHTML += "<a href='javascript:;' form-name='" + formName + "'  data_task='save_return' data-after='list' class='btn btn-primary xcrud-action save'>Save &amp; Return</a>";
            }
            formActionsHTML += "<a href='javascript:;' form-name='" + formName + "' data_task='return' class='btn btn-warning xcrud-action return'>Return</a>";
            formActionsHTML += "</div>";
            return formActionsHTML;
        }

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

            if (!visible) {
                //visbleHTML = " style='display:none;' ";
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

        if (id == "company.registrationDate") {
            value = controller.formatDate(value);
        }

        // if(formName == "lab_analysis_technician"){
        // 	console.log("fieldObj in lab",fieldObj);
        // 	if(fieldType =="file"){
        // 	 formHTML += "<div class='form-group col-md-6'><label class='control-label col-sm-5'>" + title + "</label>"; 
        // 	 formHTML += "<div class='col-md-7'>";

        // 	 if(editable){
        // 		  formHTML += "<input " + htmlDisabled + " title='" + fieldTitle + "' placeholder='" + fieldPlaceholder + "' class='"+ formName +"' type='file'  id='" + id + "' name='" + id + "'>";				    							    			
        // 	 }else{
        // 		  formHTML += "<div class='control-label-plain'>" + value + "</div>";
        // 	 }

        // 	 formHTML += "</div></div>";
        // 	}
        //  }
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
                formHTML += "<select onchange=controller.onChangeLogicForSelect('" + id + "','" + formName + "') " + validations + " " + htmlDisabled + " title='" + fieldTitle + "' " + s_type + " class='xcrud-input form-control " + formName + " " + id + "' data-type='text' id='" + id + "' name='" + id + "' maxlength='50'> " + value + "</select>";
            } else {
                formHTML += "<select style='pointer-events:none;border:none;background:transparent;'" + htmlDisabled + " title='" + fieldTitle + "' " + s_type + " class='xcrud-input form-control " + formName + " " + id + "' data-type='text' id='" + id + "' name='" + id + "' maxlength='50'> " + value + "</select>";
            }
            formHTML += "</div></div>";
        } else if (fieldType == "date") {
            formHTML += "<div class='form-group col-md-6'><label class='control-label col-sm-5'>" + title + "</label>";
            formHTML += "<div class='col-md-7'>";

            var formattedDate = controller.formatDate(value);
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

                    formHTML += "<select onchange=controller.onChangeLogicForSelect('" + id + "','" + formName + "') " + htmlDisabled + "   " + validations + "  title='" + fieldTitle + "' class='xcrud-input form-control " + formName + "' data-type='text' id='" + id + "' name='" + id + "' maxlength='50'> " + value;
                    formHTML += "<option selected value=''>-- Select Option --</option>";
                    formHTML += "<option value='true'>Yes</option>";
                    formHTML += "<option value='false'>No</option>";
                    formHTML += "</select>";

                } else {

                    formHTML += "<select onchange=controller.onChangeLogicForSelect('" + id + "','" + formName + "') " + htmlDisabled + "   " + validations + "  title='" + fieldTitle + "' class='xcrud-input form-control " + formName + "' data-type='text' id='" + id + "' name='" + id + "' maxlength='50'> " + value;

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

                formHTML += "<select onchange=controller.onChangeLogicForSelect('" + id + "','" + formName + "') " + validations + " style='pointer-events:none;border:none;background:transparent;' " + htmlDisabled + " title='" + fieldTitle + "' class='xcrud-input form-control " + formName + "' data-type='text' id='" + id + "' name='" + id + "' maxlength='50'> " + value;

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
    loadFormData: function(obj) {
        var dates = this.myFormObj.dateFields;
        var idType = this.myFormObj.idType;
        for (var key in obj) {

            console.log("start");
            if (obj.hasOwnProperty(key)) {
                console.log(key + " -> " + obj[key]);

                if (typeof obj[key] === 'object' && obj[key] !== null && obj[key] != undefined && obj[key] != 'undefined') {
                    try {
                        console.log("object");
                        controller.setRelationValue(key, obj, false, idType);
                    } catch (e) {

                    }


                } else {
                    console.log("object2");
                    try {
                        console.log("object2.2");
                        if (obj[key] != undefined && obj[key] != 'undefined') {
                            console.log("object3");
                            if (dates.includes(key)) { //check if its a date field
                                $("#" + key).val(controller.formatDate(obj[key]));
                            } else {
                                $("#" + key).val(obj[key]);
                            }
                        }

                    } catch (e) {
                        console.log(e);
                    }

                    console.log("finished");
                }
            }
        }
    },
    sanitizeErrorMessage: function(output) {
        var outputMsg = "";
        try {
            outputMsg = output.message;
        } catch (e) {
            try {
                outputMsg = output.responseJSON.message;
            } catch (e) {
                outputMsg = "Error:";
            }
        }

        if (outputMsg == undefined || outputMsg == "undefined") {
            try {
                outputMsg = output.responseJSON.message;
            } catch (e) {
                outputMsg = "Error:";
            }
        }

        if (outputMsg == undefined || outputMsg == "undefined") {
            outputMsg = "Error: Kindly Contact Admin";
        }

        console.log(outputMsg);
        return outputMsg;
    },
    sanitizeErrorData: function(output) {
        var outputData = "";
        try {
            outputData = output.data;
        } catch (e) {

            try {
                outputData = output.responseJSON.data;
            } catch (e) {
                outputData = "Error:";
            }
        }

        if (outputData == undefined || outputData == "undefined") {
            try {
                outputData = output.responseJSON.data;
            } catch (e) {
                outputData = "Error:";
            }
        }

        if (outputData == undefined || outputData == "undefined") {
            outputData = "Error: Kindly Contact Admin";
        }

        return outputData;
    },
    requestWithToken: function(url, reponseObj) {

        $.ajax({
            url: url,
            headers: {
                'Authorization': userObj.tokenType + " " + userObj.accessToken,
            },
            async: false,
            success: function(data) {
                reponseObj(data);
            },
            fail: function(e) {
                console.log(e)
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest)
            }
        });
    },
    requestWithTokenPOST: function(url, formData, reponseObj) {

        $.ajax({
            url: url,
            headers: {
                'Authorization': userObj.tokenType + " " + userObj.accessToken,
            },
            async: false,
            type: 'post',
            data: formData,
            success: function(data) {
                reponseObj(data);
            },
            fail: function(e) {
                console.log(e)
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest)
            }
        });
    },
    loadTableWithCallBack: function(columnsArr, listUrl, buttonsArr, tableName, tableId, groupby, method, callback) {
        console.log("load table method", method);
        var table = new Tabulator(tableId, {
            pagination: "local", //enable local pagination.
            paginationSize: 5, // this option can take any positive integer value (default = 10)
            placeholder: "No Data Available", //display message to user on empty table
            // selectable: true,
            selectablePersistence: true, // disable rolling selection
            layout: "fitColumns",
            addRowPos: "top",
            groupBy: groupby,
            columns: columnsArr,
            rowSelectionChanged: function(data, rows) {
                //update selected row counter on selection change
                console.log(data);
                SelectedData.push(data);
                console.log(rows);

            },
            columns: columnsArr,
            rowFormatter: function(row) {
                //row - row component

                var data = row.getData();
                console.log(data);
                if (tableName == "payment") {
                    if (data.description == "Total Payment For Exporter Registration") {
                        row.getElement().style.fontWeight = "900";
                    }
                }
            },
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

                /*try{
                	var divElemT = $(element).closest('.item');
                	var tabPos = divElemT.attr("tab-position");
                	console.log(tabPos);
                	allFormObj["tab_" + tabPos] = data;
                }catch(e){
                	console.log(e);
                }*/

                // Ensure if it is a tab child table, dont overwrite selected
                var divElem = $(element).closest('.listings');
                console.log(element);
                console.log(divElem);

                var formName = divElem.attr("id");

                console.log(formName);
                if (formName == "listings_onetime_export") {
                    console.log("one time export");
                    formName = "onetime_export";
                } else if (formName == "listings_onetime_import") {
                    formName = "onetime_import";
                } else if (formName == "listings_pip_application") {
                    formName = "pip_application";
                } else {
                    var formNameArr = formName.split("_");
                    formName = formNameArr[1];
                }
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

                //activateRow(data);
                try {
                    console.log("form name for rowclick", formName);
                    console.log("form name  data for rowclick", data);
                    if (formName == "exporterConsignment") {
                        console.log("payemnt form", data.exporterConsignmentID);
                        getPaymentByConsigment(data.exporterConsignmentID);
                    }
                    if (formName == "consolidatedPhyto") {
                        console.log("payemnt form", data.exporterConsignmentID);
                        getPaymentByConsigment(data.exporterConsignmentID);
                    } else if (formName == "inspectionHeader") {
                        getLineByHeader(data.inspectionHeaderID, data);
                    } else if (formName == "exporterFarm") {
                        getDestinationByFarm(data.exporterFarmID, data);
                    } else if (formName == "exporterFarm") {
                        console.log("payemnt form", data.exporterFarmID);
                        getPaymentByFarm(data.exporterFarmID);
                    } else if (formName == "exporterFirm") {
                        console.log("payemnt form", data.exporterFirmID);
                        getPaymentByFirm(data.exporterFirmID)
                    } else if (formName == "exporterLowRiskCommodity") {
                        console.log("payemnt form", data.exportLowRiskCommodityID);
                        getPaymentByLowRisk(data.exportLowRiskCommodityID);
                    } else if (formName == "onetime_export") {
                        console.log("payemnt form", data.onetime_export_id);
                        getPaymentByonetime_exporter(data.onetime_export_id, data);
                    } else if (formName == "onetime_import") {
                        console.log("payemnt form", data.onetime_import_id);
                        getPaymentByonetime_importer(data.onetime_import_id, data);
                    } else if (formName == "printout_replacement") {
                        getPaymentByPIPreplacement(data.printout_replacement_id)
                    } else if (formName == "pip_application") {
                        getPaymentByPIP(data.pipApplicationID)
                    } else if (formName == "exporterInspectionRequest") {
                        console.log("record data", data);
                        getPaymentByInspectionRequest(data);
                    }
                } catch (e) {

                }

                try {
                    controller.getRelationObjectsByParam(data, element);
                } catch (e) {

                }
            }
        });
        console.log(tableName);
        if (tableName == "payment") {
            console.log("PAYMENTS TABLE INITIAL RENDER");
            table.setSort([
                { column: "amount", dir: "asc" }, //sort by this first
                { column: "invoiceDate", dir: "desc" }, //then sort by this second
            ]);
        }

        var tmpData = [];
        console.log(listUrl);
        controller.show_progress();

        /*if(typeof userObj === 'object'){
        	console.log("Is object");
        }else{
        	console.log("Is Not object");
        	userObj = JSON.stringify(userObj);
        }*/

        // console.log(userObj);
        // console.log(userObj.tokenType);
        // console.log(userObj['tokenType']);
        console.log("A load table method", method);
        var userObj = JSON.parse(localStorage.getItem("userObj"));
        if (userObj) {
            token = userObj.token;
        } else {
            token = "";
        }
        $.ajax({
            url: listUrl,
            headers: {
                'Authorization': "Bearer " + token,
            },
            type: method,
            async: true,
            success: function(data) {
                controller.hide_progress();
                console.log(data);
                var jsonData = data.data;

                if (!Array.isArray(jsonData)) {
                    jsonData = [jsonData];
                }
                //var jsonData = data[0];
                for (var i in jsonData) {
                    var counter = jsonData[i];
                    if (tableName == 'payment') {
                        console.log("Payment List", counter);

                        if (counter.isPaid) {
                            counter.isPaid = "Paid";
                        } else {
                            counter.isPaid = "Pending Payment";
                        }

                    } else {
                        console.log("Payment List", tableName);
                    }

                    tmpData.push(counter);
                }

                //console.log(tmpData);
                table.setData(tmpData).then(function() {
                    //run code after table has been successfuly updated
                }).catch(function(error) {
                    //handle error loading data
                });
            },
            fail: function() {

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {

                console.log(XMLHttpRequest);
                controller.hide_progress();
                //console.log(data);
                var jsonData = XMLHttpRequest.responseText;
                console.log(jsonData);
                // controller.showToastMsg(XMLHttpRequest.responseJSON.data, "#ff6666");
                if (!Array.isArray(jsonData)) {
                    jsonData = [jsonData];
                }
                //var jsonData = data[0];
                for (var i in jsonData) {
                    var counter = jsonData[i];
                    if (tableName == 'payment') {
                        console.log("Payment List", counter);

                        if (counter.isPaid) {
                            counter.isPaid = "Paid";
                        } else {
                            counter.isPaid = "Pending Payment";
                        }

                    } else {
                        console.log("Payment List", tableName);
                    }

                    tmpData.push(counter);
                }

                //console.log(tmpData);
                table.setData(tmpData).then(function() {

                    //run code after table has been successfuly updated
                }).catch(function(error) {
                    //handle error loading data
                });

            }
        });

        var the_Function = function(cell, formatterParams, onRendered) { //plain text value
            return "<i class='fa fa-print'>function_trigger</i>";
        };
    },
    loadTable: function(columnsArr, listUrl, buttonsArr, tableName, tableId, groupby, method) {
        console.log("load table method", method);
        var table = new Tabulator(tableId, {
            pagination: "local", //enable local pagination.
            paginationSize: 4, // this option can take any positive integer value (default = 10)
            placeholder: "No Data Available", //display message to user on empty table
            selectablePersistence: true, // disable rolling selection
            layout: "fitColumns",
            addRowPos: "top",
            groupBy: groupby,
            columns: columnsArr,
            rowSelectionChanged: function(data, rows) {

                SelectedData.push(data);

            },
            columns: columnsArr,
            rowFormatter: function(row) {
                //row - row component

                var data = row.getData();
                console.log(data);
            },
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
                try {
                    controller.getRelationObjectsByParam(data, element);
                } catch (e) {

                }
            }
        });
        console.log(tableName);
        getdata = null

        if (tableName == "all_meetings") {
            table.setSort([
                { column: "end_date_time", dir: "desc" }, //sort by this first
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
                //var jsonData = data[0];
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
            fail: function() {
            },
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
    loadTableStaticData: function(columnsArr, data, buttonsArr, tableName, tableId, groupby, method="GET") {
        console.log("load table method", method);
        var table = new Tabulator(tableId, {
            pagination: "local", //enable local pagination.
            paginationSize: 5, // this option can take any positive integer value (default = 10)
            placeholder: "No Data Available", //display message to user on empty table
            selectable: true,
            selectablePersistence: true, // disable rolling selection
            layout: "fitColumns",
            addRowPos: "top",
            groupBy: groupby,
            columns: columnsArr,
            rowSelectionChanged: function(data, rows) {
                //update selected row counter on selection change
                console.log(data);
                SelectedData.push(data);
                console.log(rows);

            },
            columns: columnsArr,
            rowClick: function(e, row) {

                var element = row.getElement(),
                    data = row.getData();
                console.log("Row Clicked");
                console.log(data);
                allFormObj["selected"] = "";
                allFormObj["selected"] = data;

                controller.getRelationObjectsByParam(data, element);
                //activateRow(data);             

            }
        });

        var tmpData = [];
        controller.show_progress();

        console.log(data);
        var jsonData = data;

        if (!Array.isArray(jsonData)) {
            jsonData = [jsonData];
        }
        //var jsonData = data[0];
        for (var i in jsonData) {
            var counter = jsonData[i];
            tmpData.push(counter);
        }

        setTimeout(() => {
            //console.log(tmpData);				
            table.setData(tmpData).then(function() {
                //run code after table has been successfuly updated

                console.log("Table Rendered::");
                table.redraw(true);
            }).catch(function(error) {
                //handle error loading data
            });
        }, 1000);


        table.redraw(true);

        var the_Function = function(cell, formatterParams, onRendered) { //plain text value
            return "<i class='fa fa-print'>function_trigger</i>";
        };
    },
    onChangeLogicForSelect: function(val, formName) {
        // console.log(document.getElementById("products id").value);	
        if (formName == "exporter") {

            if (val == 'isOwnFarmExporter') {
                console.log(val);
                console.log($('#isOwnFarmExporter').val());

                if ($('#isOwnFarmExporter').val() == "true") {
                    console.log("true opt");
                    $(".OwnFarms_tab_link").show();
                    $(".OwnFarmsDestination_tab_link").show();
                } else {
                    console.log("false opt");
                    $(".OwnFarms_tab_link").hide();
                    $(".OwnFarmsDestination_tab_link").hide();
                }

            }

            if (val == 'isDryCommodityExporter') {
                if ($('#isDryCommodityExporter').val() == "true") {
                    console.log("true opt");
                    $(".LowRiskCommoditiesRegistration_tab_link").show();
                } else {
                    console.log("false opt");
                    $(".LowRiskCommoditiesRegistration_tab_link").hide();
                }

            }

            if (val == 'isExportConsolidator') {

                if ($('#isExportConsolidator').val() == "true") {
                    console.log("true opt");
                    $(".Firms_tab_link").show();
                } else {
                    console.log("false opt");
                    $(".Firms_tab_link").hide();
                }
            }

            if (val == 'seedApplication') {
                if ($('#seedApplication').val() == "true") {
                    // document.getElementsByClassName("researchInstituteID_holder")[0].style.display = 'block';
                    // document.getElementById("sr14_no_holder").style.display = "block";
                    document.getElementsByClassName("sr14_no_holder")[0].style.display = 'block';
                } else {
                    document.getElementsByClassName("sr14_no_holder")[0].style.display = 'none';
                    // document.getElementById("sr14_no_holder").style.display = "none";
                }

            };
            if (val == 'isResearcher') {

                if ($('#isResearcher').val() == "true") {

                    console.log("true opt");
                    try {
                        document.getElementsByClassName("researchInstituteID_holder")[0].style.display = 'block';
                        document.getElementsByClassName("researcherCategoryID_holder")[0].style.display = 'block';
                    } catch (e) {

                    }

                    try {
                        $(".researchInstituteID_holder").show();
                        $(".researcherCategoryID_holder").show();
                    } catch (e) {

                    }

                    try {
                        $(".researchInstitute_id_holder").show();
                        $(".researcherCategory_id_holder").show();
                    } catch (e) {

                    }

                } else {

                    console.log("false opt");
                    try {
                        document.getElementsByClassName("researchInstituteID_holder")[0].style.display = 'none';
                        document.getElementsByClassName("researcherCategoryID_holder")[0].style.display = 'none';
                    } catch (e) {

                    }

                    try {
                        $(".researchInstituteID_holder").hide();
                        $(".researcherCategoryID_holder").hide();
                    } catch (e) {

                    }

                    try {
                        $(".researchInstitute_id_holder").hide();
                        $(".researcherCategory_id_holder").hide();
                    } catch (e) {

                    }


                    $('.researcherCategoryID_holder').on('change', function() {
                        console.log("THIS IS A CATEGORY CLICK");
                        // ocument.getElementsByClassName("researchInstituteID_holder")[0].style.display = 'none';
                    });
                }
            }

            if (val == 'researcherCategoryID') {

                if ($('#researcherCategoryID').val() == "Research Teo") {
                    console.log("true opt");

                } else {
                    console.log("false opt");

                }
            }
        }
        if (formName == "exporterConsignment") {
            if (val == "consigneeID") {
                var consigneeID = $('#' + val).val();
                controller.getConsigneeCountry(consigneeID);
            }
            if (val == "seedApplication") {
                if ($('#seedApplication').val() == "true") {
                    document.getElementById('sr14_no').setAttribute("data-parsley-required", "true");
                    // document.getElementsByClassName("sr14_no_holder")[0].setAttribute("data-parsley-required","true");	
                    $(".sr14_no_holder").show();
                } else {
                    console.log("false opt");
                    document.getElementById('sr14_no').setAttribute("data-parsley-required", "false");
                    // document.getElementsByClassName("sr14_no_holder")[0].setAttribute("data-parsley-required","false");	
                    $(".sr14_no_holder").hide();
                }
            }
            if (val == "countryOfOrigin_id") {
                if ($('#countryOfOrigin_id').val() == 1) {
                    $(".originalIssuingCountry_id_holder").hide();
                    $(".certificateNumber_holder").hide();
                } else {
                    $(".originalIssuingCountry_id_holder").show();
                    $(".certificateNumber_holder").show();
                }
            }
        }
        if (formName == "consolidatedPhyto") {
            if ($('#seedApplication').val() == "true") {
                document.getElementsByClassName("sr14_no_holder")[0].setAttribute("data-parsley-required", "true");
                $(".sr14_no_holder").show();
            } else {
                console.log("false opt");
                document.getElementsByClassName("sr14_no_holder")[0].setAttribute("data-parsley-required", "false");
                $(".sr14_no_holder").hide();
            }
            if ($('#countryOfOrigin_id').val() == 1) {
                $(".originalIssuingCountry_id_holder").hide();
                $(".certificateNumber_holder").hide();
            } else {
                $(".originalIssuingCountry_id_holder").show();
                $(".certificateNumber_holder").show();
            }
            if (val == "consigneeID") {
                var consigneeID = $('#' + val).val();
                controller.getConsigneeCountry(consigneeID);
            }
        }

        if (formName == "exporterConsignmentVarietyDetails") {
            if (val == "products_id") {
                // console.log(document.getElementById("products id").value);
                var productID = $('#' + val).val();
                console.log("products id", productID);
                controller.getBotanicalName(productID, formName);
            }
        }
        if (formName == "exporterFarm") {
            if (val == "county_id") {
                var county_id = $('#' + val).val();
                console.log("county id", county_id);
                controller.getSubCountyByID(county_id, formName);
            }
            if (val == "subcounty_id") {
                var subcounty_id = $('#' + val).val();
                console.log("subcounty_id id", subcounty_id);
                controller.getwardBySubCounty(subcounty_id, formName);
            }
        }
        if (formName == "pipApplicationVariety") {
            if (val == "products_id") {
                var productID = $('#' + val).val();
                console.log("products id", productID);
                controller.getBotanicalName(productID, formName);
            }
        }
        if (formName == "pip_application") {
            if (val == "product_category_id") {
                var productCategoryID = $('#' + val).val();
                controller.getProductByCategory(productCategoryID);
                controller.getProductFormByCategory(productCategoryID);

            }
            if (val == "products_id") {
                var productID = $('#' + val).val();
                controller.getBotanicalName(productID, formName);
            }
            if (val == "importer_exporterid") {
                var importer_exporterid = $('#' + val).val();
                controller.getImporter_exporterCountry(importer_exporterid);
            }
            if (formName == "pip_application" && setupObj['agent_mgt']) {
                console.log("agent management")
                if (val == "company_id") {
                    var company_id = $('#' + val).val();
                    controller.getImpExpByCompany(company_id);
                }
            }
        }


        if (formName == "exporterConsignment" && setupObj['agent_mgt']) {
            console.log("agent management")
            if (val == "company_id") {
                var company_id = $('#' + val).val();
                controller.getConsigneeByCompany(company_id);
            }
        }

        if (formName == "consignmentInspectionRequest" && setupObj['agent_mgt']) {
            console.log("agent management")
            if (val == "company_id") {
                var company_id = $('#' + val).val();
                controller.getpipByCompany(company_id);
            }
        }

        if (formName == "pip_application") {
            console.log("pipapplication is seed", val);
            if (val == 'is_seed') {
                if ($('#is_seed').val() == "true") {
                    // document.getElementsByClassName("researchInstituteID_holder")[0].style.display = 'block';
                    // document.getElementById("sr14_no_holder").style.display = "block";
                    document.getElementsByClassName("sr14_number_holder")[0].setAttribute("data-parsley-required", "true");
                    document.getElementsByClassName("sr14_number_holder")[0].style.display = 'block';
                } else {
                    document.getElementsByClassName("sr14_number_holder")[0].setAttribute("data-parsley-required", "false");
                    document.getElementsByClassName("sr14_number_holder")[0].style.display = 'none';
                    // document.getElementById("sr14_no_holder").style.display = "none";
                }

            };
        };


        if (formName == "onetime_import_variety_details") {
            console.log("onetime_import_variety_details is seed", val);
            if (val == 'seed') {
                if ($('#seed').val() == "true") {
                    document.getElementById('sr14Number').setAttribute("data-parsley-required", "true");
                    // document.getElementsByClassName("sr14Number_holder")[0].setAttribute("data-parsley-required","true");
                    document.getElementsByClassName("sr14Number_holder")[0].style.display = 'block';
                } else {
                    // document.getElementsByClassName("sr14Number_holder")[0].setAttribute("data-parsley-required","false");
                    document.getElementById('sr14Number').setAttribute("data-parsley-required", "false");
                    document.getElementsByClassName("sr14Number_holder")[0].style.display = 'none';
                    // document.getElementById("sr14_no_holder").style.display = "none";
                }

            };
        };

        // if(formName == "exporterInspectionRequest"){
        // 	if(val == "inspectionTypeID"){
        // 		var inspectionType = $('#' + val).val();
        // 		console.log("inspectionType",inspectionType);
        // 		if(inspectionType==1){
        // 			$(".exporterLowRiskCommodityID_holder").hide();
        // 			$(".proposedInspectionDate_holder").show();
        // 			$(".exporterFirmID_holder").hide();
        // 			// $(".exporterFirmProposedInspectionDate_holder").hide();
        // 			$(".exporterFarmID_holder").show();			
        // 			// $(".exporterFarmProposedInspectionDate_holder").show();
        // 			$(".otherInfo_holder").show();
        // 			$(".quarantineFacilityID_holder").hide();
        // 		}else if(inspectionType ==2){
        // 			$(".exporterFarmID_holder").hide();	
        // 			$(".proposedInspectionDate_holder").show();		
        // 			// $(".exporterFarmProposedInspectionDate_holder").hide();
        // 			$(".exporterLowRiskCommodityID_holder").hide();
        // 			// $(".exporterLowRiskCommodityProposedInspectionDate_holder").hide();
        // 			$(".exporterFirmID_holder").show();
        // 			// $(".exporterFirmProposedInspectionDate_holder").show();
        // 			$(".otherInfo_holder").show();
        // 			$(".quarantineFacilityID_holder").hide();
        // 		}else if(inspectionType == 3){
        // 			$(".exporterFarmID_holder").hide();	
        // 			$(".proposedInspectionDate_holder").show();			
        // 			// $(".exporterFarmProposedInspectionDate_holder").hide();
        // 			$(".exporterFirmID_holder").hide();
        // 			// $(".exporterFirmProposedInspectionDate_holder").hide();
        // 			$(".exporterLowRiskCommodityID_holder").show();
        // 			// $(".exporterLowRiskCommodityProposedInspectionDate_holder").show();
        // 			$(".otherInfo_holder").show();
        // 			$(".quarantineFacilityID_holder").hide();
        // 		}else if(inspectionType==5){
        // 			$(".quarantineFacilityID_holder").show();
        // 			$(".otherInfo_holder").show();
        // 			$(".proposedInspectionDate_holder").show();
        // 			$(".exporterFirmID_holder").hide();
        // 			$(".exporterLowRiskCommodityID_holder").hide();
        // 			$(".exporterFarmID_holder").hide();	
        // 		}else{
        // 			$(".exporterLowRiskCommodityID_holder").hide();
        // 			$(".proposedInspectionDate_holder").show();	
        // 			// $(".exporterLowRiskCommodityProposedInspectionDate_holder").hide();
        // 			$(".exporterFirmID_holder").hide();
        // 			// $(".exporterFirmProposedInspectionDate_holder").hide();
        // 			$(".exporterFarmID_holder").hide();			
        // 			// $(".exporterFarmProposedInspectionDate_holder").hide();
        // 			$(".otherInfo_holder").hide();
        // 			$(".quarantineFacilityID_holder").hide();
        // 		}
        // 		// $(".exporterConsignmentID_holder").hide();	
        // 		// $(".exporterConsignmentProposedInspectionDate_holder").hide();
        // 		// $(".exporterFarmID_holder").hide();			
        // 		// $(".exporterFarmProposedInspectionDate_holder").hide();
        // 		// $(".exporterFirmID_holder").hide();
        // 		// $(".exporterFirmProposedInspectionDate_holder").hide();
        // 		// $(".exporterID_holder").hide();
        // 		// $(".exporterLowRiskCommodityID_holder").hide();
        // 		// $(".exporterLowRiskCommodityProposedInspectionDate_holder").hide();
        // 		// $(".otherInfo_holder").hide();
        // 		// $(".requestDate_holder").hide();
        // 		// $(".requestDate_holder").hide();
        // 	}
        // };

    },
    loadOptionsAfresh: function(selectID, obj_name, val_name) {
        ///
        var options = "";
        console.log("setup obj on change", setupObj[obj_name]);
        console.log(setupObj[obj_name].length);
        if (setupObj[obj_name].length == 0) {
            options += "<option>No Value</option>";
        } else {
            for (i in setupObj[obj_name]) {
                console.log("setupObj[obj_name]", setupObj[obj_name]);
                console.log("setupObj[obj_name][i]", setupObj[obj_name][i]);
                if (setupObj[obj_name][i]['name']) {
                    options += "<option value='" + setupObj[obj_name][i][val_name] + "'>'" + setupObj[obj_name][i]['name'] + "'</option>";
                } else if (setupObj[obj_name][i]['documentNumber']) {
                    options += "<option value='" + setupObj[obj_name][i][val_name] + "'>'" + setupObj[obj_name][i]['documentNumber'] + "'</option>";
                }

            }
        }

        $("#" + selectID + "").html(options);
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

var linePrice = 100000000;
$('#line_price').keydown(function(e) {
    if ($(this).val().length >= linePrice) {
        $(this).val($(this).val().substr(0, linePrice));
    }
});

$('#line_price').keyup(function(e) {
    if ($(this).val().length >= linePrice) {
        $(this).val($(this).val().substr(0, linePrice));
    }
});