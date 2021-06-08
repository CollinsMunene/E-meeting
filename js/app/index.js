var relationObjectsMap = {
    // 'items': "users/getUserCompany",
    // 'mandatoryRequirements': "researcherCategory/ResearcherCategoryList?pageNo=0&pageSize=100",

};

var relationObjectsMapParam = [
    // { 'postType': 'GET', 'entity': 'items', 'name': 'prequalificationTender_id', 'url': 'prequalification/findPrequalificationTenderItems?prequalificationTender_id=parentID'},
    // { 'postType': 'GET', 'entity': 'mandatoryRequirements', 'name': 'prequalificationTender_id', 'url': 'prequalification/findPrequalificationTenderRequirements?prequalificationTender_id=parentIDD' },
];
var url = serverURL + "prequalification/getPrequalificationTenders";


var formObj = {
    url_id: 'prequalificationTender',
    formType_id: 51,
    formName: 'prequalificationTender',
    title: "All Open Tenders",
    tableTitle: "All Open Tenders",
    crudView: true,
    crudAdd:false,
    crudEdit: false,
    childTable: [],
    Mytabs: [
        { tabName: 'tenderDetails', tabTitle: 'Tender Details', entityName: 'prequalificationTender' },
        { tabName: 'mandatoryRequirements', tabTitle: 'Requirements', entityName: 'tenderRequirements' },
        { tabName: 'items', tabTitle: 'Tender Items', entityName: 'tenderItem' },
    ],
    fields: [
        {
            'field': 'description',
            'title': 'Description',
            'visible': true,
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'tenderDetails',
        },
        {
            'field': 'documentNumber',
            'title': 'Document Number',
            'visible': true,
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'tenderDetails',
        },
        {
            'field': 'tenderDate',
            'title': 'Tender Date',
            'visible': true,
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'tenderDetails',
        },
        {
            'field': 'closeDate',
            'title': 'Closing Date',
            'visible': true,
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'tenderDetails',
        },
    ],
    groupBy: [],
    idType: 1, //1 = _id  or 2 = ID
    relationObjects: [],
    relationObjectsFields: [],
    listUrl: url,
    // addUrl: serverURL + "users/createUser",
    // editUrl: serverURL + "users/updateUser",
    // delete: serverURL + "user/deleteUser",
    // getRecUrl :serverURL + "user/getuserByID",
    // printURL : serverURL + "user/printLetter?user_ID=",
    listingsArr: [
        { title: "#", formatter: "rownum", width: 40 },
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

    controller.renderCRUDForm("crud_section", formObj, function() {});;

    // $('.tabs.menu .item').tab({
    //     'onVisible': function() {}
    // });

    // $("#pre-arrival").click(function() {
    //     windows.location = "pre_arrival.html";
    // });

    // function beforeStartWorkflow(callBack) {
    //     callBack(true);
    // }

});
// controller.getRequest(url, true, function(data) {
//     new Tabulator("#tenders-table", {
//         data: data.data, //load row data from array
//         layout: "fitColumns", //fit columns to width of table
//         responsiveLayout: "hide", //hide columns that dont fit on the table
//         tooltips: true, //show tool tips on cells
//         initialSort: [ //set the initial sort order of the data
//             { column: "tenderDate", dir: "asc" },
//         ],
//         columns: [ //define the table columns
//             { title: "Tender Description", field: "description", formatter: "textarea" },
//             { title: "Tender Reference Number", field: "documentNumber", width: 300, },
//             { title: "Tender Date", field: "tenderDate", width: 160, sorter: "date" },
//             { title: "Closing Date", field: "closeDate", width: 160, sorter: "date" },
//             {
//                 align: "center",
//                 width: 200,
//                 title: "Action",
//                 headerSort: false,
//                 formatter: function(cell, formatterParams) {
    
//                     var row = cell.getRow();
//                     var data = row.getData();
//                     var element = row.getElement();
//                     var btntype = ['edit', 'delete'];
//                     return controller.renderListButtons(data, cell, row, formObj.formName);
    
//                 }
//             }

//         ],
//     });
// });