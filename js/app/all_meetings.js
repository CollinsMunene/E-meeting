var relationObjectsMap = {

};

var relationObjectsMapParam = [{
        'postType': 'GET',
        'entity': 'all_meetings',
        'name': 'meeting_id',
        'url': 'get_all_meetings'
    },
    {
        'postType': 'GET',
        'entity': 'meeting_documents',
        'name': 'meeting_id',
        'url': 'meeting_documents/parentID'
    },
    {
        'postType': 'GET',
        'entity': 'meeting_issues',
        'name': 'meeting_id',
        'url': 'meeting_issues/parentID'
    },
    {
        'postType': 'GET',
        'entity': 'participants',
        'name': 'participant_id',
        'url': 'get_all_participants/parentID'
    },
];

var formObj = {
    url_id: 'all_meetings',
    formType_id: 51,
    formName: 'all_meetings',
    tableTitle: "All Meetings",
    crudView: true,
    crudEdit: true,
    crudAdd: true,
    dateFields: ['start_date_time', 'end_date_time'],
    Mytabs: [{
            tabName: 'meeting_details',
            tabTitle: 'Meeting Details',
            entityName: 'all_meetings'
        },
        {
            tabName: 'meeting_documents',
            tabTitle: 'Documents',
            entityName: 'meeting_documents'
        },
        {
            tabName: 'meeting_issues',
            tabTitle: 'Raised Issues',
            entityName: 'meeting_issues'
        },
        {
            tabName: 'participants',
            tabTitle: 'Participants & Votes',
            entityName: 'participants'
        },
    ],
    childTable: [],
    fields: [{
            'field': 'meeting_name',
            'title': 'Meeting Name',
            'visible': true,
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'meeting_details',
        },
        {
            'field': 'meeting_agenda',
            'title': 'Meeting Agenda',
            'visible': true,
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'meeting_details',
        },
        {
            'field': 'start_date_time',
            'title': 'Start Date & Time',
            'visible': true,
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'meeting_details',
        },
        {
            'field': 'end_date_time',
            'title': 'End Date & Time',
            'visible': true,
            'primary': false,
            'relation': false,
            'type': 'text',
            'tab': 'meeting_details',
        },
        {
            'field': 'meeting_id',
            'title': '',
            'visible': false,
            'tooltip': '',
            'primary': true,
            'relation': false,
            'type': 'hidden',
            'disabled': true,
        },
    ],
    relationObjects: [],
    listUrl: serverURL + "get_all_meetings",
    listingsArr: [{
            title: "#",
            formatter: "rownum",
            width: 50
        },
        {
            title: "Meeting Name",
            width: 200,
            field: "meeting_name",
            formatter: "textarea",
            headerFilter: true
        },
        {
            title: "Agenda",
            width: 250,
            field: "meeting_agenda",
            formatter: "textarea",
            headerFilter: false
        },
        {
            title: "Start Date",
            width: 130,
            sorter: "datetime",
            sorterParams: {
                format: "DD/MM/YYYY hh:mm:ss"
            },
            formatter: "textarea",
            field: "start_date_time",
            headerFilter: false
        },
        {
            title: "End Date",
            width: 130,
            formatter: "textarea",
            field: "end_date_time",
            headerFilter: false
        },
        {
            align: "center",
            width: 365,
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
    formName: 'meeting_documents',
    crudView: false,
    crudAdd: true,
    crudEdit: false,
    crudDownloadAttachment: true,
    parentID: 'meeting_id', //primary column
    linkID: 'meeting_id', //link column
    childTable: [],
    Mytabs: [],
    fields: [{
            'field': 'document_name',
            'title': 'Document Name',
            'visible': true,
            'tooltip': 'Please enter Farm Name',
            'primary': false,
            'relation': false,
            'type': 'text',
        },
        {
            'field': 'document_id',
            'title': '',
            'visible': false,
            'tooltip': '',
            'primary': true,
            'relation': false,
            'type': 'hidden'
        },
    ],
    groupBy: [],
    relationObjects: [],
    listUrl: serverURL + "meeting_documents/parentID",
    listingsArr: [{
            title: "#",
            formatter: "rownum",
            width: 40
        },
        {
            title: "Document Name",
            field: "document_name",
            align: "middle",
            sorter: "number",
            width: 600,
            headerFilter: false
        },
        {
            align: "center",
            width: 412,
            title: "Action",
            headerSort: false,
            formatter: function(cell, formatterParams) {

                var row = cell.getRow();
                var data = row.getData();
                return controller.renderListButtons(data, cell, row, formObj2.formName);
            },
        }
    ],
};

var formObj3 = {
    url_id: 'tab',
    formName: 'meeting_issues',
    childTable: [],
    Mytabs: [],
    crudUpvote: true,
    crudDownvote: true,
    crudView: false,
    crudAdd: true,
    crudEdit: false,
    parentID: 'meeting_id', //primary column
    linkID: 'meeting_id', //link column
    targetId: 'meeting', //name for target tab
    fields: [{
            'field': 'issue_name',
            'title': 'Issue Name',
            'visible': true,
            'tooltip': 'Please enter ',
            'primary': false,
            'relation': false
        },
        {
            'field': 'meeting_issue_id',
            'title': '',
            'visible': false,
            'tooltip': '',
            'primary': true,
            'relation': false,
            'type': 'hidden',
            'disabled': true,
        },

    ],
    groupBy: [],
    relationObjects: [],
    listUrl: serverURL + "meeting_issues/parentID",
    listingsArr: [{
            title: "#",
            formatter: "rownum",
            width: 40
        },
        {
            title: "Issue",
            field: "issue_name",
            width: 350,
            align: "middle",
            formatter: "textarea",
            headerFilter: false
        },
        {
            title: "Total Votes",
            field: "votes",
            width: 250,
            align: "middle",
            headerFilter: false
        },
        {
            align: "center",
            width: 410,
            title: "Action",
            headerSort: false,
            formatter: function(cell, formatterParams) {
                var row = cell.getRow();
                var data = row.getData();
                return controller.renderListButtons(data, cell, row, formObj3.formName);
            }
        }
    ],
};

var formObj4 = {
    url_id: 'tab',
    formName: 'participants',
    childTable: [],
    Mytabs: [],
    crudView: false,
    crudAdd: false,
    crudEdit: false,
    parentID: 'meeting_id', //primary column 
    linkID: 'meeting_id', //link column
    targetId: 'meeting', //name for target tab
    fields: [],
    groupBy: ['issue.issue_name', 'vote'],
    relationObjects: [],
    listUrl: serverURL + "get_all_participants/parentID",
    listingsArr: [{
            title: "#",
            formatter: "rownum",
            width: 40
        },
        {
            title: "Participant",
            field: "user.email",
            width: 350,
            align: "middle",
            headerFilter: false
        },
        {
            title: "Issue",
            field: "issue.issue_name",
            width: 291,
            align: "middle",
            formatter: "textarea",
            headerFilter: false
        },
        {
            title: "Vote",
            field: "vote",
            width: 370,
            align: "middle",
            headerFilter: false
        },
    ],
};



function saveReturn() {
    window.location = "./#" + urlPage + "/" + formObj.url_id;
}

//After page load
function afterLoad(myFormObj) {

    var winObj = controller.getWindowURLObject();
    windowId = winObj[winObj.length - 1];
    controller.initActions();

}

$(document).ready(function() {

    allFormObj[formObj.formName] = formObj; //register object to main form object
    allFormObj[formObj2.formName] = formObj2; //register object to main form object
    allFormObj[formObj3.formName] = formObj3; //register object to main form object
    allFormObj[formObj4.formName] = formObj4;

    controller.renderCRUDForm("crud_section", formObj, function() {
        console.log("CRUD Form Rendered");
    });

    function beforeStartWorkflow(callBack) {
        callBack(true);
    }

});