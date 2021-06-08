var relationObjectsMap = {
};

var relationObjectsMapParam = [
    { 'postType': 'GET', 'entity': 'required_attachments', 'name': 'attachment_id', 'url': 'reverseAuction/auctionItems/parentID' },
];
var formObj = {
    url_id: 'all_meetings',
    formType_id: 51,
    formName: 'meetings',
    tableTitle: "All Meetings",
    crudView: true,
    crudEdit: false,
    crudAdd:true,
    childTable: [],
    Mytabs: [
        { tabName: 'required_attachments', tabTitle: 'Contract Documents', entityName: 'required_attachments' },
    ],
    fields: [
    ],
    groupBy: [],
    dateFields:['start_date_time','end_date_time'],
    relationObjects: [],
    listUrl: serverURL + "get_all_meetings/",
    editUrl:serverURL + "update/meeting",
    listingsArr: [
        { title: "#", formatter: "rownum", width: 50 },
        { title: "Meeting Name", width: 254,field: "patient_identifier_id", sorter: "number", headerFilter: false },
        { title: "Agenda", width: 250,field: "patient_gender", formatter: "textarea", sorter: "number", headerFilter: false },
        { title: "Start Date", width: 130,field: "patient_age", formatter: "textarea", sorter: "number", headerFilter: false },
        { title: "End Date",width: 130, field: "diagnosis_description",sorter: "number", headerFilter: false },
        { title: "attendies",width: 130, field: "visit_count",sorter: "number", headerFilter: false },
        {
            align: "center",
            width: 100,
            title: "Action",
            headerSort: false,
            formatter: function(cell, formatterParams) {

                var row = cell.getRow();
                var data = row.getData();
                return controller.renderListButtons(data, cell, row, formObj.formName);

            }
        }
    ],
};

var formObj2 = {
    url_id: 'tab',
    formType_id: 322,
    formName: 'required_attachments',
    crudAdd: false,
    crudView: false,
    crudEdit: false,
    crudDownloadAttachment: true,
    buttonUploadContract:true,
    parentID: 'meetings_id', //primary column for exporter
    linkID: 'meetings_id', //link column in lowrisk
    targetId: 'meetings', //id for target tab
    childTable: [],
    Mytabs: [],
    fields: [{
        'field': 'name',
        'title': 'Description*',
        'visible': true,
        'tooltip': 'Please enter Farm Name',
        'primary': false,
        'relation': false,
        'type': 'text',
        'groupName': 'Farm & Location'
    }, ],
    groupBy: [],
    relationObjects: [],
    listUrl: serverURL + "contract/contractManagementDocument/parentID",
    saveMessage: "Saved Successfully",
    nextDocApprovalMessage: "Record has been forwarded to EAC",
    listingsArr: [
        { title: "#", formatter: "rownum", width: 40 },
        {
            title: "Document Name",
            field: "name",
            align: "middle",
            sorter: "number",
            width: 824,
            headerFilter: false
        },
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
                return controller.renderListButtons(data, cell, row, formObj3.formName);
            },
        }
    ],
};
function saveReturn() {
    window.location = "./#" + urlPage + "/" + formObj.url_id;
}

//After page load
function afterLoad(myFormObj) {
    var winObj = controller.getWindowURLObject();
    windowId = winObj[winObj.length - 1];
    var table = $(".documentUploadStatus");

    $(".save").click(function() {
        $("#listings_edit").hide();
    });

    controller.initActions();
}

$(document).ready(function() {

    var winObj = controller.getWindowURLObject();
    var windowId = winObj[winObj.length - 1];
    var pageName = winObj[winObj.length - 2];


    allFormObj[formObj.formName] = formObj; //register object to main form object
    allFormObj[formObj2.formName] = formObj2;

    controller.renderCRUDForm("crud_section", formObj, function() {});;

    $('.tabs.menu .item').tab({
        'onVisible': function() {}
    });

    $("#pre-arrival").click(function() {
        windows.location = "pre_arrival.html";
    });

    function beforeStartWorkflow(callBack) {
        callBack(true);
    }

});