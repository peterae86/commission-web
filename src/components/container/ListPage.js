import React from 'react';
import Table from '../component/Table/Table';
import Crumbs from '../component/Crumbs/Crumbs';
import Dropdown from '../component/Dropdown/Dropdown';
import ModalAlert from '../component/ModalAlert/ModalAlert';
import Modal from '../component/Modal/Modal';
import {requestByFetch, parseParamsGet} from '../../utils/request.js';
import {hashHistory} from "react-router";

class ListPage extends React.Component {
    constructor(props) {
        super(props);
        const self = this;
        this.state = {
            //面包屑
            pathNames: props.pathNames,
            //搜索参数
            queryParams: {
                corpCode: "",
                pageSize: 10, // 默认分页
                currentPage: 0, // 当前页码
                ...props.location.query
            },
            //表单数据
            queryFormData: {
                currentCity: {},
                corpCode: ''
            },
            //表格配置
            table: {
                listData: [], //数据列表
                config: {
                    column: []
                },
                pager: {
                    pageSize: 10,
                    clickPager: function (index) {
                        let p = {
                            ...self.queryParams,
                            currentPage: index
                        };

                        self.onQuery(p);
                    }
                }
            },
            showConfirm: false,
            modifyModal: false,
            message: "", // alert message
        };
        this.onSelectCity = this.onSelectCity.bind(this);
        this.onSelectCompany = this.onSelectCompany.bind(this);
        this.onQuery = this.onQuery.bind(this);
    }

    componentWillMount() {
        this.state.pager.clickPager(0);
    }

    // // 渲染碳层
    // renderAlert() {
    //     const modalProps = {
    //         show: this.state.showConfirm,
    //         message: this.state.message,
    //         type: 'alert',
    //         cancelClick: () => {
    //             this.setState({showConfirm: false});
    //         },
    //     };
    //     return <ModalAlert {...modalProps} />
    // }
    //
    renderModify() {
        return null;
    }

    renderAlert() {
        const modalProps = {
            show: this.state.showConfirm,
            message: this.state.message,
            type: 'alert',
            onCancel: () => {
                this.setState({showConfirm: false});
            },
        };
        return <ModalAlert {...modalProps} />
    }


    // 选择城市回调
    onSelectCity(value) {
        this.setState({
            queryFormData: {
                currentCity: this.props.cities.find(x => x.cityCode === value)
            }
        });
    }

    // 选择公司回调
    onSelectCompany(value) {
        this.setState({
            queryFormData: {
                ...this.state.queryFormData,
                corpCode: value
            }
        });
        if (!value) {
            this.setState({
                showConfirm: true,
                message: "请选择公司"
            });

        }
        const param = {
            corpCode: value,
            currentPage: 0
        };
        this.onQuery(param);
    }

    // 搜索函数
    onQuery(p) {
        const path = this.state.queryUrl + "?" + parseParamsGet(p);//"../data/rankList.json?";
        //    const paths = `/dutyLevelConfig/queryConfigsByCorpCode?${parseParamsGet(param)}`; // 真正接口
        this.setState({
            queryParams: p
        });
        hashHistory.push({
            ...this.props.location,
            query: p
        });
        requestByFetch(path, "GET").then((res) => {
            this.setState({
                table: {
                    ...this.table,
                    listData: res.commissionRatioVoList,
                    pager: {
                        ...this.state.table.pager,
                        currentPage: p.currentPage,
                        totalCount: res.totalCount
                    }
                }
            });
        });


    }


    renderSearchInputs() {
        const {queryFormData} = this.state;
        return <div className="title-right">
            <div className="right-company">
                <span>城市：</span>
                <Dropdown onSelect={this.onSelectCity} options={this.props.cities} propsValue="cityCode"
                          placeholder="请选择城市" value={queryFormData.currentCity.cityCode} propsLabel="cityName"/>
            </div>
            <div className="right-company">
                <span>公司：</span>
                <Dropdown onSelect={this.onSelectCompany} options={queryFormData.currentCity.corps} propsValue="corpCode"
                          placeholder="请选择公司" propsLabel="corpName" value={queryFormData.corpCode}/>
            </div>
        </div>
    }

    render() {
        const {table, pathNames, modifyModal} = this.state;
        return (
            <div className="rank-container">
                {this.renderAlert()}
                {modifyModal ? this.renderModify() : null}
                <div className="container-title">
                    <Crumbs names={pathNames}/>
                    {this.renderSearchInputs()}
                </div>
                <Table data={table.listData} config={table.config} pager={table.pager}/>
            </div>
        );
    }
}

export default ListPage;
