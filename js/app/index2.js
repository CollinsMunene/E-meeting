var relationObjectsMap = {

};

var relationObjectsMapParam = [
    { 'postType': 'GET', 'entity': 'prequalificationTender', 'name': 'prequalificationTender_id', 'url': 'prequalification/getPrequalificationTenders' },
    { 'postType': 'GET', 'entity': 'prequalificationTenderItem', 'name': 'prequalificationTender_id', 'url': 'prequalification/findPrequalificationTenderItems/parentID' },
    { 'postType': 'GET', 'entity': 'prequalificationTenderRequirements', 'name': 'prequalificationTender_id', 'url': 'prequalification/findPrequalificationTenderRequirements/parentID' },
    // { 'postType': 'GET', 'entity': 'exporterLowRiskCommodity', 'name': 'exporterID', 'url': 'exporterLowRiskCommodity/getExporterLowRiskCommodityByExporter?exporterID=parentID' },
    // { 'postType': 'GET', 'entity': 'exporterProduct', 'name': 'exporterID', 'url': 'exporterProduct/getExporterProductByExporter?exporterID=parentID' },
    // { 'postType': 'GET', 'entity': 'exporterFarm', 'name': 'exporterFarmID', 'url': 'exporterFarm/getExporterFarmByID?exporterFarmID=parentID' }
];

var formObj = {
    url_id: 'prequalificationTender',
    formType_id: 51,
    formName: 'prequalificationTender',
    title: "All Open Tenders",
    tableTitle: "All Open Tenders",
    crudView: true,
    crudAdd: false,
    crudEdit: false,
    idType: 1, //1 = _id  or 2 = ID
    dateFields: [],
    Mytabs: [{ tabName: 'prequalificationTender', tabTitle: 'Tender Details', entityName: 'prequalificationTender' },
        { tabName: 'prequalificationTenderRequirements', tabTitle: 'Tender Requirements', entityName: 'prequalificationTenderRequirements' },
        { tabName: 'prequalificationTenderItem', tabTitle: 'Tender Items', entityName: 'prequalificationTenderItem' },

    ],
    childTable: [],
    fields: [{
            'field': 'description',
            'title': 'Description',
            'visible': true,
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'prequalificationTender',
        },
        {
            'field': 'documentNumber',
            'title': 'Document Number',
            'visible': true,
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'prequalificationTender',
        },
        {
            'field': 'tenderDate',
            'title': 'Tender Date',
            'visible': true,
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'prequalificationTender',
        },
        {
            'field': 'closeDate',
            'title': 'Closing Date',
            'visible': true,
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'prequalificationTender',
        },
        { 'field': 'prequalificationTender_id', 'title': '', 'visible': false, 'tooltip': '', 'primary': true, 'relation': false, 'type': 'hidden', 'disabled': true, },
    ],
    relationObjects: [],
    listUrl: serverURL + "prequalification/getPrequalificationTenders",
    listingsArr: [
        { title: "#", formatter: "rownum", headerSort: false, width: 40 },
        { title: "Tender Description", field: "description", formatter: "textarea" },
        { title: "Tender Reference Number", field: "documentNumber", width: 300, },
        { title: "Tender Date", field: "tenderDate", width: 160, sorter: "date" },
        { title: "Closing Date", field: "closeDate", width: 160, sorter: "date" },
        {
            align: "center",
            width: 200,
            title: "Action",
            headerSort: false,
            formatter: function(cell, formatterParams) {

                var row = cell.getRow();
                var data = row.getData();
                var element = row.getElement();
                var btntype = ['edit', 'delete'];
                return controller.renderListButtons(data, cell, row, formObj.formName);
            },
        }
    ],
    buttonsArr: [{ "buttonName": "View", "buttonType": "edit", "redirectURL": "" }], //,{"buttonName": "Delete","buttonType": "delete","redirectURL": ""}
    viewButtonsArr: [{ "buttonName": "View", "buttonType": "edit", "redirectURL": "" }] //,{"buttonName": "Delete","buttonType": "delete","redirectURL": ""}        
};

var formObj2 = {
    url_id: 'tab',
    formName: 'prequalificationTenderRequirements',
    crudView: false,
    crudAdd: false,
    crudEdit: false,
    parentID: 'prequalificationTender_id', //primary column for exporter
    linkID: 'prequalificationTender_id', //link column in product
    childTable: [],
    Mytabs: [],
    fields: [{
            'field': 'description',
            'title': 'Description*',
            'visible': true,
            'tooltip': 'Please enter Farm Name',
            'primary': false,
            'relation': false,
            'type': 'text',
            'groupName': 'Farm & Location'
        },
        { 'field': 'marks', 'title': 'Marks', 'visible': true, 'tooltip': 'Please enter ', 'primary': false, 'relation': false },
        {
            'field': 'exporterFarmID',
            'title': '',
            'visible': false,
            'tooltip': '',
            'primary': true,
            'relation': false,
            'type': 'hidden'
        },
    ],
    groupBy: [],
    idType: 1, //1 = _id  or 2 = ID
    relationObjects: [],
    listUrl: serverURL + "prequalification/findPrequalificationTenderRequirements/parentID",
    listingsArr: [{
            title: "#",
            formatter: "rownum",
            width: 40
        },
        {
            title: "Description",
            field: "description",
            align: "middle",
            sorter: "number",
            width: 824,
            headerFilter: false
        },

        {
            title: "marks",
            field: "marks",
            align: "middle",
            sorter: "number",
            width: 183,
            headerFilter: false
        },
    ],
    buttonsArr: [{
        "buttonName": "View",
        "buttonType": "edit",
        "redirectURL": ""
    }], //,{"buttonName": "Delete","buttonType": "delete","redirectURL": ""}
    viewButtonsArr: [{
            "buttonName": "View",
            "buttonType": "edit",
            "redirectURL": ""
        }] //,{"buttonName": "Delete","buttonType": "delete","redirectURL": ""}        
};

var formObj3 = {
    url_id: 'tab',
    formName: 'prequalificationTenderItem',
    list: 'prequalificationTenderItem',
    childTable: [],
    Mytabs: [],
    crudTenderParticipate: true,
    crudView: false,
    crudAdd: false,
    crudEdit: false,
    parentID: 'prequalificationTender_id', //primary column for exporter
    linkID: 'prequalificationTender_id', //link column in product
    targetId: 'prequalificationTender', //id for target tab
    fields: [
        { 'field': 'description', 'title': 'Description', 'visible': true, 'tooltip': 'Please enter ', 'primary': false, 'relation': false },
        { 'field': 'mandatoryRequirement_id', 'title': '', 'visible': false, 'tooltip': '', 'primary': true, 'relation': false, 'type': 'hidden', 'disabled': true, },

    ],
    groupBy: [],
    idType: 1, //1 = _id  or 2 = ID
    relationObjects: [], //,'designation','gender','docStatus','documentUploadType'],
    listUrl: serverURL + "prequalification/findPrequalificationTenderItems/parentID",
    listingsArr: [
        { title: "#", formatter: "rownum", width: 40 },
        { title: "Description", field: "description", width: 813, align: "middle", sorter: "number", headerFilter: false },
        {
            align: "center",
            width: 149,
            title: "Action",
            headerSort: false,
            formatter: function(cell, formatterParams) {
                var row = cell.getRow();
                var data = row.getData();
                var element = row.getElement();
                return controller.renderListButtons(data, cell, row, formObj3.formName);
            }
        }
    ],
    buttonsArr: [{ "buttonName": "View", "buttonType": "edit", "redirectURL": "" }], //,{"buttonName": "Delete","buttonType": "delete","redirectURL": ""}
    viewButtonsArr: [{ "buttonName": "View", "buttonType": "edit", "redirectURL": "" }] //,{"buttonName": "Delete","buttonType": "delete","redirectURL": ""}        
};

function saveReturn() {
    window.location = "./#" + urlPage + "/" + formObj.url_id;
}

//After page load
function afterLoad(myFormObj) {

    var winObj = controller.getWindowURLObject();
    windowId = winObj[winObj.length - 1];
    var table = $(".documentUploadStatus");
    controller.initActions();

}

$(document).ready(function() {

    var winObj = controller.getWindowURLObject();
    var windowId = winObj[winObj.length - 1];
    var pageName = winObj[winObj.length - 2];

    allFormObj[formObj.formName] = formObj; //register object to main form object
    allFormObj[formObj2.formName] = formObj2; //register object to main form object
    allFormObj[formObj3.formName] = formObj3; //register object to main form object

    //formObj.listUrl = formObj.listUrl + company_id;
    controller.renderCRUDForm("crud_section", formObj, function() {
        console.log("CRUD Form Rendered");
    });

    var authtoken = ""
    
        //listen on click event on the login form submit button 
    $("#btn-login").click(function() {
        alert("ALL TENDERS")
        controller.show_progress();
        var formJson = $("#login-ui").serializeObject();
        var postData = {
            "username": formJson['username'],
            "password": formJson['password']
        }
        var formData = JSON.stringify(postData);
        var url = serverURL + "auth/login";
        var async_status = true;

        // alert(formData)

        controller.request(url, formData, async_status,'', function(data, status) {
            authtoken = data.token;
            if (!status) {
                console.log(status);
                controller.showToastMsg("Login Failed! Wrong Username or password ", "#ff6666");
            } else {
                $('.modal.fade.login').modal('hide');
                console.log("Data Found----->" + status);
                console.log("Msg------------>" + data.msg);

                // if (data.msg == null) {
                //     controller.showToastMsg("Kindly Change Pssword ", "#ff6666");

                //     // document.getElementById("newPassword").style.display = "block"; //open new password field
                //     // document.getElementById("confirmPassword").style.display = "block"; //open confirm password field
                //     // document.getElementById('btn-login').style.display = 'none'; //close new submit button
                //     // document.getElementById('btn-login-change-password').style.display = 'block'; //open activate button
                // } else {
                var userObj = JSON.stringify(data); // stringify user data 
                console.log(userObj)
                localStorage.setItem("userObj", userObj);
                var prequalificationTenderItem_id = $("#prequalification_item").val();
                controller.participate_in_item(prequalificationTenderItem_id, function(data, status) {
                        console.log(data);
                        console.log(status);
                        if (status) {
                            controller.showToastMsg("Successful", "#1a5589");
                            setTimeout(() => { location.reload(true) }, 2000);
                        } else {
                            controller.showToastMsg("Item Not Selected", "#ff6666");
                            setTimeout(() => { location.reload(true) }, 2000);

                        }
                    })
                    // add the json obj to the local storage
                    // window.location = serverUIURL +"dashboard.html";
                    // window.location.href = "main.html"; //redirect to user profile
                    // }
            }
        });
    });

    function beforeStartWorkflow(callBack) {
        callBack(true);
    }

});