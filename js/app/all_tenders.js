var relationObjectsMap = {
    'roles': 'roles/roleList?pageNo=0&pageSize=100',
    'department': 'department/departmentList?pageNo=0&pageSize=100',
};

var formObj = {
    url_id: 'user',
    formType_id: 51,
    formName: 'users',
    tableTitle: "Our Patients",
    crudView: true,
    crudEdit: false,
    childTable: [],
    Mytabs: [],
    fields: [
    
        {
            'field': 'first_name',
            'postField': 'firstName',
            'title': 'First Name',
            'visible': true,
            'tooltip': 'Please enter first name',
            'primary': false,
            'relation': false,
            'type': 'text',
        },
        {
            'field': 'last_name',
            'postField': 'lastName',
            'title': 'Last Name',
            'visible': true,
            'tooltip': 'Please enter last name',
            'primary': false,
            'relation': false,
            'type': 'text',
        },
        {
            'field': 'users_id',
            'title': '',
            'visible': true,
            'tooltip': '',
            'primary': true,
            'relation': false,
            'type': 'hidden',
            'tab': 'PersonalDetails'
        }
    ],
    groupBy: [],
    idType: 1, //1 = _id  or 2 = ID
    relationObjects: [],
    relationObjectsFields: [],
    listUrl: serverURL + "users",
    listingsArr: [
        { title: "#", formatter: "rownum", width: 50 },
        { title: "Patient Name", field: "username", sorter: "number", headerFilter: false },
        { title: "Email", field: "email", formatter: "textarea", sorter: "number", headerFilter: false },
        { title: "Phone No", field: "phone_number",sorter: "number", headerFilter: false },
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