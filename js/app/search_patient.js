

 var code = 
 '<div class="input-group" id="patient_search_bar">'+
 '<input type="number" id="search_patient_id" class="form-control rounded" placeholder="Search Patient by ID" aria-label="Search" style="margin-right: 28px;"'+
 'aria-describedby="search-addon"/>'+
 '<button type="button" onclick="setPatientID()" class="btn btn-outline-primary" id="search_btn">search</button>'+
'</div>';
 $(".crud_section").html(code);


function setPatientID(){
    document.getElementById("search_btn").innerHTML = "Syncing .......";
    document.getElementById("search_btn").disabled = true;
                setTimeout(function() {
                    var patient_id = document.getElementById('search_patient_id').value;
                    var url =serverURL +"get_user_by_id/"+patient_id+"";
                    if(patient_id){
                       controller.getRequest(url, true, function(data, status) {
                           console.log(data.status_code);
                           document.getElementById("search_btn").innerHTML = "SEARCH";
                           document.getElementById("search_btn").disabled = false;
                           if(data.status_code!==400){
                               controller.showToastMsg("Patient found","#1a5589")
                               setTimeout(function() {
                                   localStorage.setItem("selected_patient_id",patient_id);
                                   window.location="#app/searched_patient"
                               }, 1000);
                           }else{
                               controller.showToastMsg("No Patient found","#FF0000")
                           }
                       });
                    }else{
                       controller.showToastMsg("Fill in a value","#FF0000")
                    }
                }, 2000);
}

// var relationObjectsMap = {

// };

// var relationObjectsMapParam = [
//     { 'postType': 'GET', 'entity': 'prequalificationTenderCollection', 'name': 'prequalificationTenderCollection_id', 'url': 'prequalification/getPrequalificationTenderCollectionsBySupplier' },
//     { 'postType': 'GET', 'entity': 'attachment', 'name': 'attachment_id', 'url': 'prequalification/findPrequalificationTenderAttachmentRecordsByPrequalificationTender/parentID' },
// ];

// var formObj = {
//     url_id: 'prequalificationTenderCollection',
//     formType_id: 51,
//     formName: 'prequalificationTenderCollection',
//     title: "My Pre-qualifications",
//     tableTitle: "My Pre-qualifications",
//     crudView: true,
//     crudAdd: false,
//     crudEdit: false,
//     idType: 1, //1 = _id  or 2 = ID
//     dateFields: [],
//     Mytabs: [{ tabName: 'tenderCollection', tabTitle: 'Prequalification Tender Collection', entityName: 'prequalificationTenderCollection' },
//         { tabName: 'attachment', tabTitle: 'Attachment', entityName: 'attachment' },

//     ],
//     childTable: [],
//     fields: [
    
//         {
//             'field': 'tenderName',
//             'title': 'Tender Name',
//             'visible': true,
//             'primary': false,
//             'relation': false,
//             'type': 'text',
//             'tab': 'tenderCollection',
//         },
//         {
//             'field': 'prequalificationTenderItem_id',
//             'title': 'prequalificationTenderItem_id',
//             'visible': true,
//             'primary': false,
//             'relation': false,
//             'type': 'hidden',
//             'tab': 'tenderCollection',
//         },
//         {
//             'field': 'tenderItem',
//             'title': 'Tender Item',
//             'visible': true,
//             'primary': false,
//             'relation': false,
//             'type': 'text',
//             'tab': 'tenderCollection',
//         },
//         {
//             'field': 'supplier',
//             'title': 'Supplier',
//             'visible': true,
//             'primary': false,
//             'relation': false,
//             'type': 'text',
//             'tab': 'tenderCollection',
//         },
//         {
//             'field': 'collectionDate',
//             'title': 'Collection Date',
//             'visible': true,
//             'primary': false,
//             'relation': false,
//             'type': 'text',
//             'tab': 'tenderCollection',
//         },
//         {
//             'field': 'collectionTime',
//             'title': 'Collection Time',
//             'visible': true,
//             'primary': false,
//             'relation': false,
//             'type': 'text',
//             'tab': 'tenderCollection',
//         },
//         {
//             'field': 'prequalificationTenderCollection_id',
//             'title': '',
//             'visible': false,
//             'tooltip': '',
//             'primary': true,
//             'relation': false,
//             'type': 'hidden',
//             'disabled': true,
//         },
//     ],
//     relationObjects: [],
//     listUrl: serverURL + "prequalification/getPrequalificationTenderCollectionsBySupplier",
//     listingsArr: [
//         { title: "#", formatter: "rownum", headerSort: false, width: 40 },
//         { title: "Tender Name", field: "tenderName", width: 356, },
//         { title: "Tender Item", field: "tenderItem", width: 374, sorter: "date" },
//         { title: "Collection Date", field: "collectionDate", width: 160, sorter: "date" },
//         {
//             align: "center",
//             width: 200,
//             title: "Action",
//             headerSort: false,
//             formatter: function(cell, formatterParams) {

//                 var row = cell.getRow();
//                 var data = row.getData();
//                 var element = row.getElement();
//                 var btntype = ['edit', 'delete'];
//                 return controller.renderListButtons(data, cell, row, formObj.formName);
//             },
//         }
//     ],
//     buttonsArr: [{ "buttonName": "View", "buttonType": "edit", "redirectURL": "" }], //,{"buttonName": "Delete","buttonType": "delete","redirectURL": ""}
//     viewButtonsArr: [{ "buttonName": "View", "buttonType": "edit", "redirectURL": "" }] //,{"buttonName": "Delete","buttonType": "delete","redirectURL": ""}        
// };



// var formObj4 = {
//     url_id: 'tab',
//     formType_id: 322,
//     formName: 'attachment',
//     staticData: true, //used when you want to pick child object from a main object
//     title: "Pre-qualification Attachments",
//     parentID: 'prequalificationTenderCollection_id', //primary column for exporter
//     linkID: 'prequalificationTenderCollection_id', //link column in lowrisk
//     targetId: 'prequalificationTenderCollection', //id for target tab
//     childTable: [],
//     Mytabs: [],
//     fields: [

//     ],
//     groupBy: [],
//     idType: 1, //1 = _id  or 2 = ID
//     relationObjects: [],
//     listUrl: serverURL + "prequalification/findPrequalificationTenderAttachmentRecordsByPrequalificationTender/",
//     crudView: false,
//     crudAdd: false,
//     crudEdit: false,
//     saveMessage: "Saved Successfully",
//     nextDocApprovalMessage: "Record has been forwarded to EAC",
//     listingsArr: [
//         { title: "#", formatter: "rownum", width: 40 },
//         {
//             title: "Document Name",
//             field: "attachment.name",
//             align: "middle",
//             sorter: "number",
//             headerFilter: false
//         },

//         {
//             align: "center",
//             width: 200,
//             title: "Action",
//             headerSort: false,
//             formatter: function(cell, formatterParams) {

//                 var row = cell.getRow();
//                 var data = row.getData();
//                 var element = row.getElement();
//                 var btntype = ['edit', 'delete'];
//                 return controller.renderListButtons(data, cell, row, formObj4.formObj);

//             }
//         }
//     ],
//     buttonsArr: [{ "buttonName": "View", "buttonType": "edit", "redirectURL": "" }], //,{"buttonName": "Delete","buttonType": "delete","redirectURL": ""}
//     viewButtonsArr: [{ "buttonName": "View", "buttonType": "edit", "redirectURL": "" }] //,{"buttonName": "Delete","buttonType": "delete","redirectURL": ""}        
// };

// function saveReturn() {
//     window.location = "./#" + urlPage + "/" + formObj.url_id;
// }

// //After page load
// function afterLoad(myFormObj) {

//     var winObj = controller.getWindowURLObject();
//     windowId = winObj[winObj.length - 1];
//     var table = $(".documentUploadStatus");
//     controller.initActions();

// }

// $(document).ready(function() {

//     var winObj = controller.getWindowURLObject();
//     var windowId = winObj[winObj.length - 1];
//     var pageName = winObj[winObj.length - 2];

//     allFormObj[formObj.formName] = formObj; //register object to main form object
//     allFormObj[formObj4.formName] = formObj4; //register object to main form object

//     //formObj.listUrl = formObj.listUrl + company_id;
//     controller.renderCRUDForm("crud_section", formObj, function() {
//         console.log("CRUD Form Rendered");
//     });

//     var authtoken = ""
//     console.log("MY TENDERS")
//         //listen on click event on the login form submit button 
//     $("#btn-login").click(function() {
//         controller.show_progress();
//         var formJson = $("#login-ui").serializeObject();
//         var postData = {
//             "username": formJson['username'],
//             "password": formJson['password']
//         }
//         var formData = JSON.stringify(postData);
//         var url = serverURL + "auth/login";
//         var async_status = true;

//         // alert(formData)

//         controller.request(url, formData, async_status, '', function(data, status) {
//             authtoken = data.token;
//             if (!status) {
//                 console.log(status);
//                 controller.showToastMsg("Login Failed! Wrong Username or password ", "#ff6666");
//             } else {
//                 console.log("Data Found----->" + status);
//                 console.log("Msg------------>" + data.msg);

//                 // if (data.msg == null) {
//                 //     controller.showToastMsg("Kindly Change Pssword ", "#ff6666");

//                 //     // document.getElementById("newPassword").style.display = "block"; //open new password field
//                 //     // document.getElementById("confirmPassword").style.display = "block"; //open confirm password field
//                 //     // document.getElementById('btn-login').style.display = 'none'; //close new submit button
//                 //     // document.getElementById('btn-login-change-password').style.display = 'block'; //open activate button
//                 // } else {
//                 var userObj = JSON.stringify(data); // stringify user data 
//                 console.log(userObj)
//                 localStorage.setItem("userObj", userObj);
//                 var prequalificationTenderItem_id = $("#prequalification_item").val();
//                 controller.participate_in_item(prequalificationTenderItem_id, function(data, status) {
//                         console.log(data);
//                         console.log(status);
//                         if (status) {
//                             controller.showToastMsg("Successful", "#1a5589");
//                             location.reload(true);
//                         } else {
//                             controller.showToastMsg("Item Not Selected", "#ff6666");
//                         }
//                     })
//                     // add the json obj to the local storage
//                     // window.location = serverUIURL +"dashboard.html";
//                     // window.location.href = "main.html"; //redirect to user profile
//                     // }
//             }
//         });
//     });

//     function beforeStartWorkflow(callBack) {
//         callBack(true);
//     }

// });