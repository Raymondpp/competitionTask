import React from 'react';
import Cookies from 'js-cookie';
import { Popup } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');

        $.ajax({
            url: 'http://localhost:51689/listing/listing/closeJob',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(id),
            success: function (res) {
                if (res.success) {
                    TalentUtil.notification.show(res.message, "success", null, null);
                }
                else {
                    TalentUtil.notification.show(res.message, "error", null, null);
                }
            }.bind(this)
        })
    }

    render() {
        var data = this.props.data
        var caseSwitch = undefined;
        if (data.status == 0) {
            caseSwitch =
                <div className="ui right floated mini buttons">
                    <button
                    className="right floated ui mini blue button"
                        onClick={() => this.selectJob(data.id)}
                    >
                        <i className="ban icon" />Close
                    </button>
                    <button
                    className="right floated ui mini blue button"
                        onClick={() => { window.location = "/EditJob/" + data.id }}
                    >
                        <i className="edit icon" />Edit
                    </button>
                    <button
                    className="right floated ui mini blue button"
                        onClick={() => { window.location = "/PostJob/" + data.id }}>
                        <i className="copy icon" />Copy
                    </button>
                </div>
        }
        else {
            caseSwitch =
                <span>
                    <button
                    className="right floated ui mini blue button"
                        onClick={() => { window.location = "/PostJob/" + data.id }}>
                        Copy This Job
                    </button>
                    <label className="ui black left floated label">
                        <i className="ban icon" />Job closed</label>
                </span>;
        }

        return (
            <div className="card manage-job">
                <div className="content">
                    <div className="header">{data.title} </div>
                    <Popup trigger={
                        <a className="ui orange right floating label">
                            <i className="user icon"></i>{data.noOfSuggestions}
                        </a>
                    }>
                        <span>Suggested Talents</span>
                    </Popup>

                    <div className="meta"> {data.location.city}, {data.location.country}</div>

                    <div className="description job-summary">
                        {data.summary}
                    </div>
                </div>
                <div className="extra content">
                    {caseSwitch != undefined ? caseSwitch : null}
                    {
                        moment(data.expiryDate) < moment() ?
                            <label className="ui red left floated label">
                                Expired
                    </label> : null}
                </div>
            </div>
        )
    }
}