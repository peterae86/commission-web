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
        super();
        const self = this;
        this.state = {
            //面包屑
            pathNames: props.pathNames,
            //搜索参数
            queryParams: {
                cityCode: "",
                corpCode: "",
                dutyScope: "",
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
                            ...self.state.queryParams,
                            currentPage: index
                        };

                        self.onQuery(p);
                    }
                }
            },
            showConfirm: false,
            modifyModal: false,
            message: "", // alert message
            formData: [],
        };
        this.onSelectCity = this.onSelectCity.bind(this);
        this.onSelectCompany = this.onSelectCompany.bind(this);
        this.onSelectScope = this.onSelectScope.bind(this);
        this.onQuery = this.onQuery.bind(this);
    }

    componentWillReceiveProps(newProps){
        if(newProps.cities){
            this.setState({
                    queryFormData: {
                        currentCity: newProps.cities.find(x=>x.cityCode===newProps.location.query.cityCode)||{},
                        corpCode: newProps.location.query.corpCode
                    }
                }
            )
        }
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
                corpCode:'',
                currentCity: this.props.cities.find(x => x.cityCode === value)
            },
            queryParams:{
                ...this.state.queryParams
            }
        });
    }
    // 选择所属序列回调
    onSelectScope (value) {
        this.setState({
            queryFormData: {
                ...this.state.queryFormData,
                dutyScope: value
            }
        });
        console.log(this.state,"请选择公司");
        if (!this.state.corpCode) {
            this.setState({
                showConfirm: true,
                message: "请选择公司"
            });
            return false;
        }
        if (!value) {
            this.setState({
                showConfirm: true,
                message: "请选择所属序列"
            });
            return false;
        }
        const param = {
            ...this.state.queryParams,
            dutyScope: value
        };
        this.onQuery(param);
    }

    // 选择公司回调
    onSelectCompany(value) {
        this.setState({
            queryFormData: {
                ...this.state.queryFormData,
                corpCode: value
            }
        });
    }

    // 搜索函数
    onQuery(p) {
        const path = this.state.queryUrl + "?" + parseParamsGet(p);//"../data/rankList.json?";
        //    const paths = `/dutyLevelConfig/queryConfigsByCorpCode?${parseParamsGet(param)}`; // 真正接口
        this.setState({
            queryParams: p
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
                <Dropdown onSelect={this.onSelectCity} options={this.props.cities}
                          placeholder="请选择城市" value={queryFormData.currentCity.cityCode} propsLabel="cityName" propsValue="cityCode"/>
            </div>
            <div className="right-company">
                <span>公司：</span>
                <Dropdown onSelect={this.onSelectCompany} options={queryFormData.currentCity.corps}
                          placeholder="请选择公司" propsLabel="corpName" propsValue="corpCode" value={queryFormData.corpCode}/>
            </div>
            <div className="right-company">
                <span>所属序列：</span>
                <Dropdown onSelect={this.onSelectScope} options={[{"label": "S序列","value": "S"},{"label": "P序列","value": "P"}]}
                          placeholder="全部" value={queryFormData.dutyScope}/>
            </div>
        </div>
    }

    render() {
        const {table, pathNames, modifyModal} = this.state;
        return (
            <div className="rank-container">
                {this.renderAlert()}
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
