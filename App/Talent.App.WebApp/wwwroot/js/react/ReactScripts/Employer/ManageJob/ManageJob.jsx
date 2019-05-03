import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
            //your functions go here
        this.handleSortChange = this.handleSortChange.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.loadData(() =>
            this.setState({ loaderData }));//comment this

        //set loaderData.isLoading to false after getting data
        //this.loadData(() =>
        //    this.setState({ loaderData })
        //)

        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
    };

    handleSortChange(e, { value, name }) {
        this.state.sortBy[name] = value;
        this.loadNewData({ sortBy: this.state.sortBy });
    }

    handleClick(e, titleProps) {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        // your ajax call and other logic goes here
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            data: {
                activePage: this.state.activePage,
                sortByDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired
            },
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                console.log(res);
                this.setState({ loadJobs: res.myJobs, totalPages: Math.ceil(res.totalCount / 6) }, callback);
            }.bind(this),
            error: function (res) {
                console.log(res)
            }
        })
    }

    handlePaginationChange(e, { activePage }) {
        this.loadNewData({ activePage: activePage });
    }

    handleFilter(e, { checked, name }) {
        this.state.filter[name] = checked;
        this.setState({
            filter: this.state.filter
        })
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }



render() {
    var res = undefined;
    if (this.state.loadJobs.length > 0) {

        res = this.state.loadJobs.map(x =>
            <JobSummaryCard
                key={x.id}
                data={x}
                reloadData={this.loadData}
            />);
    }
    const options = [
        {
            key: 'desc',
            text: 'Newest first',
            value: 'desc',
            content: 'Newest first',
        },
        {
            key: 'asc',
            text: 'Oldest first',
            value: 'asc',
            content: 'Oldest first',
        }
    ];
    const { activeIndex } = this.state;
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <div className="ui grid">
                        <div className="row">
                            <div className="sixteen wide column">
                                <h1>List of Jobs</h1>
                                <div>
                                    <i className="filter icon" /> {"Filter:  "}
                                    <Dropdown button floating simple text="Choose filter">
                                        <Dropdown.Menu>
                                            <Dropdown.Item key={"status"}>
                                                <Accordion>
                                                    <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
                                                        <Icon name='dropdown' />
                                                        By Status
                                                    </Accordion.Title>
                                                    <Accordion.Content active={activeIndex === 1}>
                                                        <Form>
                                                            <Form.Group grouped>
                                                                <Form.Checkbox label='Active Jobs'
                                                                    name="showActive" onChange={this.handleFilter} checked={this.state.filter.showActive} />
                                                                <Form.Checkbox label='Closed Jobs'
                                                                    name="showClosed" onChange={this.handleFilter} checked={this.state.filter.showClosed} />
                                                                <Form.Checkbox label='Drafts'
                                                                    name="showDraft" onChange={this.handleFilter} checked={this.state.filter.showDraft} />
                                                            </Form.Group>
                                                        </Form>
                                                    </Accordion.Content>
                                                </Accordion>
                                            </Dropdown.Item>
                                            <Dropdown.Item key={"expiryDate"}>
                                                <Accordion>
                                                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                                                        <Icon name='dropdown' />
                                                        By Expiry Date
                                                    </Accordion.Title>
                                                    <Accordion.Content active={activeIndex === 0}>
                                                        <Form>
                                                            <Form.Group grouped>
                                                                <Form.Checkbox label='Expired Jobs'
                                                                    name="showExpired" onChange={this.handleFilter} checked={this.state.filter.showExpired} />
                                                                <Form.Checkbox label='Unexpired Jobs'
                                                                    name="showUnexpired" onChange={this.handleFilter} checked={this.state.filter.showUnexpired} />
                                                            </Form.Group>
                                                        </Form>
                                                    </Accordion.Content>
                                                </Accordion>
                                            </Dropdown.Item>
                                            <button className="ui blue small button"
                                                style={{ width: "100%", borderRadius: "0" }}
                                                onClick={() => this.loadNewData({ activePage: 1 })}
                                            >
                                                <i className="filter icon" />
                                                Filter
                                                </button>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div>
                                    <i className="calendar icon" />
                                    {"Sort by date: "}
                                    <Dropdown button floating simple options={options}
                                        name="date"
                                        onChange={this.handleSortChange}
                                        className="manage-jobs"
                                        value={this.state.sortBy.date}
                                    />
                                </div>
                               
                                <div className="ui three cards">
                                    {
                                        res != undefined ?
                                            res
                                            : <React.Fragment>
                                                <p style={{
                                                    paddingTop: 10,
                                                    paddingBottom: 10,
                                                    marginLeft: 10
                                                }}>No Jobs Found</p>
                                            </React.Fragment>
                                    }
                                            </div>
     
                            </div>
                        </div>
                        <div className="centered row">
                            <Pagination                            
                                totalPages={this.state.totalPages}
                                activePage={this.state.activePage}
                                onPageChange={this.handlePaginationChange}
                            />
                        </div>
                        <div className="row">
                        </div>
                    </div>
                </div>
            </BodyWrapper>
        )
    }
}