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

var serverURL = "https://central-hospital-backend.herokuapp.com/";


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

        console.log(ctx.canonicalPath);
        var url = ctx.canonicalPath;
        var page = controller.getSecondPart(url);
        console.log(page);

        page_2 = controller.getThirdPart(url);
            
        console.log(page_2);
        urlPage = page;
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
                            if (page_2 == "search_patient") {

                            } else {
                                $(".headerTitle").html(formObj.title);
                            }
                        });

                });
        }
    },
    UrlExists: function(url) {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status != 404;
    },
    getSecondPart: function(str) {
        if(str === "/eProcurementUI/"){
            return "default";
        }else{
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
    // getFourthPart: function(str) {
    //     str = str.split('#')[2];
    //     var res = str.split("/");
    //     return res[2];
    // },
    getWindowURLObject: function() {

        var windowURL = window.location.href;
        var res = windowURL.split("/");
        return res;

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
        controller.show_progress();
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            async: async_status,
            data: formData,
            success: function(data, textStatus, xhr) {
                console.log(data);
                controller.hide_progress();
                callBack(data, true);

            },
            fail: function(xhr, textStatus) {
                controller.hide_progress();
                handleData(xhr.responseText);
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
                if (xhr.responseText == "Account not activated") {
                    callBack(xhr.responseText, true);
                } else if (xhr.responseText == "Success. Request accepted for processing") {
                    callBack(xhr, true);
                }
                callBack(xhr, false);
                $(".login").removeClass("loading");
                $(".save").removeClass("loading");

            }
        });

    },
    showToastMsg: function(message, color) {
        Toastify({
            text: message,
            duration: 2000,
            gravity: "bottom", // `top` or `bottom`
            position: 'right', // `left`, `center` or `right`
            backgroundColor: color,
        }).showToast();
    },
    renderCRUDForm: function(target, thisObj, callback) {

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

        var formName = thisObj.formName;
        var tableTitle = thisObj.tableTitle;

        var htmlCrudForm = "<div id='" + formName + "_form' form-name='" + formName + "' class='crud_form " + formName + " parsley-form'>";
        htmlCrudForm += "<div class=''>";
        htmlCrudForm += "<div class='row'><div class='col-md-12'><h2 class='headerTitle'> " + tableTitle + "</h2></div>";
        htmlCrudForm += "</div></div></div>";

        htmlCrudForm += "<div class='xcrud-top-actions'>";
        htmlCrudForm += "<div class='btn-group pull-left'>";
        if (crudAdd) {
            htmlCrudForm += "<div class='add_btn_section' style='margin-bottom: 9px;'><a href='javascript:;' form-name='" + formName + "' data-task='create' class='btn btn-success xcrud-action ' onclick='Create_Meeting_Modal()'><i class='fa fa-plus'></i> Add Meeting</a><div class='clearfix'></div></div>";
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
        callback(thisObj);
    },
    renderCRUDTable: function(thisObj, method = "GET") {

        console.log("renderCRUDTable", method);
        var targetIdentifier = "#listings_" + thisObj.formName;
        $("#listings_edit_" + thisObj.formName).hide();
        controller.loadTable(thisObj.listingsArr, thisObj['listUrl'], thisObj.buttonsArr, thisObj.formName, targetIdentifier, thisObj.groupBy, method);
    },
    renderListButtons: function(data, cell, row, formName) {

        console.log("FORM NAME", formName);
        var row = cell.getRow();
        var data = row.getData();

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
            '<div class="modal edit_meeting_modal" id="edit_meeting_modal" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
            '<div class="modal-content">'+
            ' <div class="modal-header">'+
            '    <h5 class="modal-title">Edit Meeting</h5>'+
            '   <button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
            '     <span aria-hidden="true">&times;</span>'+
            '   </button>'+
            ' </div>'+
            ' <div class="modal-body">'+
            '     <form method="POST" id="patient_add_form">'+
            '                 <div class="form-group">'+
            '                     <label for="meeting_name">Meeting Name</label>'+
            '                     <input type="text" class="form-control" id="meeting_name"'+
            '                     placeholder="Enter Meeting Name" name="meeting_name" value="'+data.meeting_name+'" required>'+
            '                 </div>'+
            '                 <div class="form-row">'+
            '                     <div class="form-group col-md-6">'+
            '                         <label for="start_date_time">Start Date & Time</label>'+
            '                         <input type="text" class="form-control" id="start_date_time"'+
            '                         placeholder="Enter Start Date & Time" name="start_date_time" value="'+data.start_date_time+'" required>'+
            '                     </div>'+
            '                     <div class="form-group col-md-6">'+
            '                         <label for="end_date_time">End Date & Time</label>'+
            '                         <input type="text" class="form-control" id="end_date_time"'+
            '                             placeholder="Enter End Date & Time" name="end_date_time" value="'+data.end_date_time+'" required>'+
            '                     </div>'+
            '                 </div>'+
            '                 <div class="form-group">'+
            '                     <label for="meeting_agenda"> Meeting Agenda</label>'+
            '                     <textarea cols="100" rows="4" class="form-control" id="meeting_agenda"'+
            '                         name="meeting_agenda" placeholder="Enter Meeting Agenda"'+
            '                         required>'+data.meeting_agenda+'</textarea>'+
            '         </div>'+
            ' </div>'+
            ' <div class="modal-footer">'+
            '     <button type="submit" id="meeting_add_form_button" class="btn btn-primary" style="float: right;'+
            '     font-size: 18px;" >Save</button>'+
            '   <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
            ' </form>'+
            ' </div>'+
            ' </div>'+
          '</div>'+
            '</div>';
 
             $("#view_modal").html(modal);
            
             $('.modal.edit_meeting_modal').modal({backdrop: 'static', keyboard: false});
            // controller.editRow(data, this);

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
            console.log(data)
            controller.viewRow(data, this);

        }, false);


        buttonDelete = document.createElement("button");
        buttonDelete.innerHTML = "<i class='fa fa-view'></i> Delete";
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
            controller.deleteRecord(data);
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


        if (crudView) {
            buttonHolder.appendChild(buttonView);
        }

        if (crudEdit) {
            buttonHolder.appendChild(buttonEdit);
        }

        if (crudDeleteRecord) {
            buttonHolder.appendChild(buttonDelete);
        }

        return buttonHolder; //return button list
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
                //update selected row counter on selection change
                console.log(data);
                console.log(rows);

            },
            columns: columnsArr,
            rowFormatter: function(row) {
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
                } catch (e) {

                }

                try {
                    controller.getRelationObjectsByParam(data, element);
                } catch (e) {

                }
            }
        });
        console.log(tableName);

        var tmpData = [];
        console.log(listUrl);
        controller.show_progress();

        console.log("A load table method", method);

        $.ajax({
            url: listUrl,
            type: method,
            async: true,
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
                var jsonData = XMLHttpRequest.responseText;
                console.log(jsonData);
                if (!Array.isArray(jsonData)) {
                    jsonData = [jsonData];
                }

                for (var i in jsonData) {
                    var counter = jsonData[i];
                    console.log("Payment List", tableName);

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

    },
    deleteRecord: function(data){
        
    },
    loadComboObj: function(url, item, reponseObj, method = "GET", obj = "") {

        $.ajax({
            url: url,
            type: method,

            async: false,
            success: function(data) {

                console.log(url);
                console.log(item);
                reponseObj(data, item, obj);

            },
            fail: function() {


            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {


            }
        });
    },
	getRelationObjects: function (formName, exists) {

		console.log("getRelationObjects..");
		var currentObj = allFormObj[formName];
		var relationObj = currentObj.relationObjects;
		var idType = currentObj.idType;

		getRelationObjects_(relationObj, formName, exists);

		async function getRelationObjects_(relationObj, formName, exists) {

			console.log(relationObj);

			for (x in relationObj) {
				var url = serverURL + relationObjectsMap[relationObj[x]];
				await controller.loadComboObj(url, relationObj[x], function (response, item, obj) {
					setupObj[item] = response;
				});
			}

			//load form
			if (exists) {//existing form
				controller.getFormData(formName);
			} else {//new form
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
	setRelationValue: function (key, obj, isnew, idType, option_id = "", formName, listEntityName = "") {


		console.log("setRelationValue..");
		console.log(obj);
		console.log(key);

		//set options
		var selectHTML = "";
		var b = "";
		var c = "";

			try {
                console.log("hey");
                console.log(obj[key])
				$("#" + key + "_name").val(obj[key].name);
			} catch (e) {

			}

            var setUpObj_ = setupObj[key];
            console.log(setUpObj_)

			var selectedV = false;
			var optionsCount = 0;
			console.log();
			for (var option in setUpObj_) {

                optionObj = setUpObj_[option];
                console.log("option obj")
                console.log(optionObj)
				var option_val = "";
				var option_key = "";

				var myID = "";

				try {
                    var hasOwnProp = optionObj.hasOwnProperty(key + "_id");
                    console.log(hasOwnProp)
				} catch (e) {

				}
				if (hasOwnProp) {
					myID = key + "_id";
				}

				console.log(formName + ", option id.." + myID);


                var selectOptIdentity = "";

					//we have to define specific tables since not all entities have a property name				    

                    console.log("crazy1", optionObj);
                    var optionDisplay = optionObj.hospital_name;
                    console.log("crazy2 " + key, optionObj);
                    		
					if (optionObj[option_key] == selectOptIdentity) {
						optionsCount++;
						selectHTML += "<option selected value=" + option_val + ">" + optionDisplay + "</option>";
						selectedV = false;
					} else {
                        
						optionsCount++;
                        selectHTML += "<option value=" + option_val + ">" + optionDisplay + "</option>";
                        console.log("SELECT",selectHTML,optionsCount)
					}

			}

			if (selectedV) {
				selectHTML += "<option value=''>-- Select Option --</option>";
			} else {

				//This is for the case where there is only one option listed so no need to place 'select option'
				if (optionsCount == 1) {

				} else {
					selectHTML += "<option selected value=''>-- Select Option --</option>";
                    console.log(selectHTML)
				}

			}

			// $("#hospital_id").html(selectHTML);
	
		console.log("End setRelationValue");
		return selectHTML;

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
    loadDocumentsUploadStatus: function(tableID, url, prequalificationTender_id, reponseObj) {
        //get required document array
        controller.getRequiredDocument(prequalificationTender_id, function(response) {
            console.log("Required docs",response);
            var requiredDocJSON = response;
            $.ajax({
                url: url,
                // headers: {
                //     'Authorization': userObj.tokenType + " " + userObj.accessToken,
                // },
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

                            upload_entry += 
                            '<div class="col-md-4">'+
                            '   <p>'+requiredDocJSON[i].name+'</p> '+
                            '</div>'+
                            '<div class="col-md-5">'+
                               '<div class="custom-file">'+
                                       '<input type="file" class="custom-file-input" data-id="'+requiredDocJSON[i].attachment_id+'" data-collection="'+allFormObj['parent_selected']['prequalificationTenderCollection_id']+'" id="customFile">'+
                                        '<label class="custom-file-label" for="customFile" style="width:265px">Choose file</label>'+
                                '</div> '+
                            ' </div>'+
                            '<div class="col-md-3">'+
                               '<button type="button" class="xcrud-action btn btn-info btn-sm" id="save_file" onclick=controller.uploadDoc('+requiredDocJSON[i].attachment_id+','+allFormObj['parent_selected']['prequalificationTenderCollection_id']+')>Save Document</button>'+
                            ' </div>';
                            
                        }
                        var html = 
                        '<form class="md-form">'+
                        '<table>'+
                            '<tr>'+
                            '<th></th>'+
                            '</tr>'+
                            '<tr>'+
                            '<td>'+
                            ' <div class="row" style="padding: 23px;font-size: 16px;">'+
                            upload_entry
                            ' </div>'+
                            '</td>'+
                            '</tr>'+
                            '</table>'+
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
    getRequiredDocument: function(prequalificationTender_id, callbackFunc) {

        var listUrl = serverURL + "prequalification/findPrequalificationTenderAttachmentRecordsByPrequalificationTender/"+prequalificationTender_id+"";
        $.ajax({
            url: listUrl,
            // headers: {
            //     'Authorization': userObj.tokenType + " " + userObj.accessToken,
            // },
            async: true,
            success: function(data) {
                var jsonData = data;
                console.log("getRequiredDocument");
                console.log(jsonData);
                console.log(prequalificationTender_id);
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
    uploadDoc: function(attachment_id,prequalificationTenderCollection_id){
        const random = Math.floor(Math.random() * 20);
        var url = serverURL + "prequalification/createPrequalificationTenderAttachmentCollection";
        var formData = {
            "attachmentCollection_id": 0,
            "prequalificationTenderCollection_id": prequalificationTenderCollection_id,
            "attachment_id": attachment_id,
            "name": "Test Attachment_"+random+"",
            "downloadUri": "testattachment_"+random+""
          }
        var formData2 = JSON.stringify(formData);
        console.log(formData2)
        //var userObj = JSON.parse(localStorage.getItem("userObj"));
        controller.request(url, formData2, true, function(data, status) {
            console.log(data);
            if (data.status) {
                controller.showToastMsg(data.message, "#008300");
                document.getElementsByClassName('custom-file-label')[0].innerHTML=data.data.name
                document.getElementById('save_file').innerHTML="Change File";
                // setTimeout(() => { location.reload(true) }, 2000);
            } else {
                controller.showToastMsg(data.message, "#ff6666");
                // setTimeout(() => { location.reload(true) }, 2000);

            }

        })
    },
    show_progress: function() {
        console.log("show progress");
        $(".xcrud-overlay").show();
    },
    hide_progress: function() {
        console.log("hide progress");
        $(".xcrud-overlay").hide();
    },
    editRow: function(x, e) {

        console.log("editRow");

        var formName = $(e).attr("form-name");
        console.log(formName);
        console.log(x);
        var exclusionTab = [];

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
    initializeDateFields: function(formName) {

        console.log("initializeDateFields-1", formName);
        var currentObj = allFormObj[formName];
        var dates = currentObj.dateFields;
        console.log("initializeDateFields", dates);

        for (x in dates) {
            var dateInputID = "#" + dates[x];
            console.log("Date is - " + dateInputID);

            if (dates[x] == "departureDate") { //Those that require both date and time
                console.log("set time & date");
                try {
                    var formattedDate = controller.formatDateTime($(dateInputID).val());
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
                                    var options = controller.setRelationValue(fieldRelation, setupObj, false, idType, fieldOptionID);
                                    console.log("a alert",options)
                                    var fieldObjTemp = fields[a];
                                    fieldObjTemp.value = options;
                                    fieldObjTemp.s_type = s_type;

                                    console.log("Add Form : Select Field");
                                    console.log("Select Options = ", options);

                                    console.log(fieldObjTemp);

                                    tabsFormHTML += controller.renderField(fieldObjTemp, currentObj.formName, editable);

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
    fieldExist: function(val, originalVal="", currentObj) {
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
                            console.log("a alert",options)
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
                console.log("else ststement",fieldName,key)
                //key = controller.sanitize(key);						    		
                if (fieldName == key) { //check if fields is in defined list
                    try {

                        if (obj[key] != undefined && obj[key] != 'undefined') {
                            console.log(dates);
                            //const exists = formFields.myJSONArrayObject.some(o => myIntegerKey in o)
                            console.log(key);
                            var returnField = controller.fieldExist(key, "", currentObj);
                            if (returnField != false) {
                                console.log("Field Exists||" + returnField['type'] + " " + obj[key]);
                                if(returnField['type']=="select"){
                                    options = controller.setRelationValue(key, obj, false, 1, "", "", "");
                                }else{
                                    options = obj[key];
                                }
                                
                                var renderObj = {
                                    'title': returnField['title'],
                                    'field': returnField['field'],
                                    'value': options,
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
            console.log("ALERT"+value)
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