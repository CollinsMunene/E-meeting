var formObj = {
    url_id: 'supplier_registration',
    formType_id: 51,
    formName: 'supplier_registration',
    tableTitle: "Supplier Registration",
    formIdentifierID: 'supplier_id',
    htmlFormID: "supplier_registration-form",
    crudAdd: false,
    crudEdit: true,
    crudView: true,
    crudStartWorkflow: true,
    htmlFormRelationID: "relation-setup",
    htmlFormDocumentID: "document-setup",
    htmlFormDocumentRelationID: "document-relation-setup",
    childTable: [],
    Mytabs: [
        { tabName: 'PersonalDetails', tabTitle: 'Personal Details', entityName: 'user' },
        { tabName: 'bankdetails', tabTitle: 'Bank Details', entityName: 'supplier' },
        { tabName: 'attachments', tabTitle: ' Attachments', entityName: 'documents' },
    ],
    idType: 1, //1 = _id  or 2 = ID
    fields: [

        {
            'field': 'emailAddress',
            'title': 'Email Address',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'PersonalDetails',
            'disabled': true
        },

        {
            'field': 'fullNames',
            'title': 'Full Names',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'PersonalDetails',
            'disabled': true

        },
        {
            'field': 'username',
            'title': 'Username',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'PersonalDetails',
            'disabled': false
        },
        {
            'field': 'nationalId',
            'title': 'National ID No',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'PersonalDetails',
            'disabled': true
        },
        {
            'field': 'phoneNo',
            'title': 'Phone Number',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': 'country',
            'type': 'text',
            'tab': 'PersonalDetails',
            'disabled': false
        },
        {
            'field': 'kraPIN',
            'title': 'KRA Pin',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'PersonalDetails',
            'disabled': false
        },

        //company details
        {
            'field': 'companyregistrationNumber',
            'title': 'Registration Number',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'PersonalDetails',
            'groupName': 'Company Details',
            'disabled': true
        },
        {
            'field': 'companyName',
            'title': 'Company Name',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': false,
            'type': 'text',
            'groupName': 'Company Details',
            'tab': 'PersonalDetails',
            'disabled': true

        },
        {
            'field': 'companyemail',
            'title': 'Company Website',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': false,
            'type': 'text',
            'groupName': 'Company Details',
            'tab': 'PersonalDetails',
            'disabled': true
        },
        {
            'field': 'registrationNumber',
            'title': 'Registration Number',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'PersonalDetails',
            'groupName': 'Company Details',
            'disabled': false
        },

        //location details
        {
            'field': 'physicalAddress',
            'title': 'Physical Address',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'PersonalDetails',
            'disabled': false,
            'groupName': 'Location Details'
        },
        {
            'field': 'postalCode',
            'title': 'Postal Code',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'PersonalDetails',
            'disabled': false,
            'groupName': 'Location Details'
        },
        {
            'field': 'country',
            'title': 'Country',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': false,
            'type': 'country',
            'tab': 'PersonalDetails',
            'disabled': false,
            'groupName': 'Location Details'
        },

        {
            'field': 'county',
            'title': 'County',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': 'county',
            'type': 'text',
            'tab': 'PersonalDetails',
            'disabled': true,
            'groupName': 'Location Details'
        },
        {
            'field': 'subCounty',
            'title': 'Sub County',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': 'subCounty',
            'tab': 'PersonalDetails',
            'disabled': true,
            'groupName': 'Location Details'
        },
        {
            'field': 'ward',
            'title': 'Ward',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': 'ward',
            'tab': 'PersonalDetails',
            'disabled': true,
            'groupName': 'Location Details'
        },


        //bankk details
        {
            'field': 'bankname',
            'title': 'Bank Name',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': 'banks',
            'tab': 'bankdetails',
            'disabled': true,
            'groupName': 'Location Details'
        },
        {
            'field': 'accountName',
            'title': 'Account Name',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': false,
            'tab': 'bankdetails',
            'disabled': true,
            'groupName': 'Location Details'
        },
        {
            'field': 'accountNumber',
            'title': 'Account Number',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': false,
            'tab': 'bankdetails',
            'disabled': true,
            'groupName': 'Location Details'
        },
        {
            'field': 'accountType',
            'title': 'Account Type',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': 'accountType',
            'tab': 'bankdetails',
            'disabled': true,
            'groupName': 'Location Details'
        },


        //attachments
        {
            'field': 'documents_ID',
            'title': 'Document Name',
            'visible': true,
            'tooltip': '',
            'primary': false,
            'relation': 'accountType',
            'tab': 'attachments',
            'disabled': true,
            'groupName': 'attachments'
        },


    ],
    groupBy: [],
    idType: 1, //1 = _id  or 2 = ID
    relationObjectsFields: [],
    listUrl: serverURL + " ",
    addUrl: serverURL + " ",
    editUrl: serverURL + " ",
    saveMessage: "Saved Successfully",
    nextDocApprovalMessage: "Record has been forwarded to KEPHIS",
    listingsArr: [
        { title: "#", formatter: "rownum", width: 40 },
        {
            title: "Email",
            field: "email",
            align: "middle",
            sorter: "number",
            headerFilter: false
        },
        {
            title: "Company Name",
            field: "companyName",
            align: "middle",
            formatter: "textarea",
            sorter: "number",
            headerFilter: false
        },
        {
            title: "Registration Number",
            field: "registration Number",
            align: "middle",
            sorter: "number",
            headerFilter: false
        },
        {
            title: "Bank Name",
            field: "banks.bankName",
            align: "middle",
            sorter: "number",
            headerFilter: false
        },
        {
            title: "account Number",
            field: "accountname",
            align: "middle",
            sorter: "number",
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
                if (data.docStatus.name == "DRAFT") {
                    formObj.crudStartWorkflow = true;
                } else if (data.docStatus.name == "IN PROGRESS") {
                    formObj.crudEdit = false;
                    formObj2.crudEdit = false;
                    formObj2.crudAdd = false;
                    formObj.crudStartWorkflow = false;
                } else if (data.docStatus.name == "APPROVED") {
                    formObj.crudEdit = false;
                    formObj2.crudEdit = false
                    formObj2.crudAdd = false;
                    formObj.crudStartWorkflow = false;
                } else if (data.docStatus.name == "REJECTED") {
                    formObj.crudEdit = false;
                    formObj.crudStartWorkflow = true;
                } else if (data.docStatus.name == "AMMENDED") {
                    formObj.crudEdit = true;
                    formObj.crudStartWorkflow = true;
                }
                var element = row.getElement();
                var btntype = ['edit', 'delete'];
                return controller.renderListButtons(data, cell, row, formObj2.formName);

            }
        }
    ],
    buttonsArr: [{ "buttonName": "View", "buttonType": "edit", "redirectURL": "" }], //,{"buttonName": "Delete","buttonType": "delete","redirectURL": ""}
    viewButtonsArr: [{ "buttonName": "View", "buttonType": "edit", "redirectURL": "" }] //,{"buttonName": "Delete","buttonType": "delete","redirectURL": ""}        
};


var formObj1 = {
    url_id: 'tab',
    formType_id: 0001,
    formName: 'bankdetails',
    list: 'banks',
    formIdentifierID: 'bankdetails',
    childTable: [],
    Mytabs: [],
    crudView: true,
    parentID: 'supplierID', //primary column for exporter
    linkID: 'supplierID', //link column in product
    targetId: 'Supplier', //id for target tab
    fields: [{
            'field': 'banks_ID',
            'postField': 'banks_ID',
            'title': 'Bank',
            'visible': true,
            'tooltip': 'Please enter name',
            'primary': false,
            'relation': 'banks',
            'type': 'select'
        },


    ],
    groupBy: [],
    idType: 2, //1 = _id  or 2 = ID
    relationObjects: ['banks'],
    listUrl: serverURL + " ",
    addUrl: serverURL + " ",
    editUrl: serverURL + " ",
    deleteUrl: serverURL + " ",
    listingsArr: [
        { title: "#", formatter: "rownum", width: 40 },
        { title: "Bank", field: "banks.name", align: "middle", sorter: "number", headerFilter: false, width: 200 },
        {
            align: "center",
            width: 200,
            title: "Action",
            headerSort: false,
            formatter: function(cell, formatterParams) {
                var row = cell.getRow();
                var data = row.getData();
                var element = row.getElement();
                return controller.renderListButtons(data, cell, row, formObj2.formName);
            }
        }
    ],
    buttonsArr: [{ "buttonName": "View", "buttonType": "edit", "redirectURL": "" }], //,{"buttonName": "Delete","buttonType": "delete","redirectURL": ""}
    viewButtonsArr: [{ "buttonName": "View", "buttonType": "edit", "redirectURL": "" }] //,{"buttonName": "Delete","buttonType": "delete","redirectURL": ""}        
};


var formObj2 = {
    url_id: 'tab',
    formType_id: 0000,
    formName: 'documents',
    staticData: true, //used when you want to pick child object from a main object
    title: "Documents",
    formIdentifierID: 'supplierID',
    formIdentifierDocumentID: 'supplierDocument_id',
    parentID: 'supplierID',
    parentTable: 'supplier_registration',
    linkID: 'supplierID', //link column in lowrisk
    childTable: [],
    Mytabs: [],
    fields: [

    ],
    groupBy: [],
    idType: 1, //1 = _id  or 2 = ID
    relationObjects: ['roles', 'department'],
    relationObjectsFields: [{
        'roles': 'name',
    }],
    listUrl: serverURL + " ",
    addUrl: serverURL + " ",
    editUrl: serverURL + " ",
    deleteUrl: serverURL + " ",
    getRecUrl: serverURL + " ",
    printURL: serverURL + " ",
    documentTypeList: serverURL + " ",
    getDocImageUrl: serverURL + " ",
    saveMessage: "Saved Successfully",
    nextDocApprovalMessage: "Record has been forwarded to KEPHIS",
    listingsArr: [
        { title: "#", formatter: "rownum", width: 40 },
        { title: "Document Name", field: "documentName", align: "middle", sorter: "number", headerFilter: false },
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
                return controller.renderListButtons(data, cell, row, formObj6.formObj);

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

    allFormObj[formObj1.formName] = formObj1; //register object to main form object
    allFormObj[formObj2.formName] = formObj2; //register object to main form object
    allFormObj[formObj3.formName] = formObj3; //register object to main form object


    //formObj.listUrl = formObj.listUrl + company_id;
    controller.renderCRUDForm("crud_section", formObj, function() {
        console.log("CRUD Form Rendered");
    });

    controller.requestWithToken(serverURL + ' ', function(data1, status) {
        var exporterID = data1[0].exporterID;
        var url = serverURL + ' ' + exporterID;
        controller.setUpObjInitializeSpecificOne(url, ' ', function() {


        });
    });

    function beforeStartWorkflow(callBack) {
        callBack(true);
    }

});