import React from 'react';
import Table from '../../component/Table/Table';
import Crumbs from '../../component/Crumbs/Crumbs';
import Dropdown from '../../component/Dropdown/Dropdown';
import ModalAlert from '../../component/ModalAlert/ModalAlert';
import Modal from '../../component/Modal/Modal';
import {requestByFetch, parseParamsGet} from '../../../utils/request.js';

class Rank extends React.Component {
    constructor(props) {
        super(props);
        const self = this;
        this.state = {
            pathNames: props.pathNames,
            corpCode: "", // 城市公司下编码
            pageSize: 10, // 默认分页
            currentPage: 0, // 当前页码
            totalCount: 0, // 分页总条数
            cityData: [], // 城市合计
            cityCode: "", //当前选中那个城市
            companyData: [],
            showConfirm: false,
            modifyModal: false,
            listData: [], //数据列表
            message: "", // alert message
            formData: [],
            config: {
                column: [
                    {name: "所属列表", key: "dutyScope", textAlign: "center", width: "10%"},
                    {name: "职级", key: "dutyLevel", textAlign: "center", width: "10%"},
                    {name: "职级积分下线", key: "minScore", textAlign: "center", width: "10%"},
                    {name: "职级积分上线", key: "maxScore", textAlign: "center", width: "10%"},
                    {name: "职级基础分", key: "baseScore", textAlign: "center", width: "10%"},
                    {name: "师徒制积分贡献比例", key: "masterScoreRatio", textAlign: "center", width: "15%"},
                    {name: "师徒制提佣积分贡献系数", key: "masterCommissionRatio", textAlign: "center", width: "15%"},
                    {
                        name: "操作", key: "opt", textAlign: "center", width: "20%", content: [
                        {
                            key: "操作历史",
                            func: (index) => {
                                this.props.onJump('/rank/history?id=' + this.state.listData[index].id);
                            }
                        },
                        {
                            key: "修改",
                            func: (index) => {
                                this.setState({
                                    modifyModal: true,
                                    formData: [{
                                        label: "vesh ",
                                        value: "333"
                                    }]
                                });
                            }
                        }
                    ]
                    }
                ]
            },
            pager: {
                pageSize: 10,
                clickPager: function (index) {
                    self.onQuery({
                        corpCode: self.state.corpCode,
                        currentPage: index
                    })
                }
            }
        }
        this.onSelectCity = this.onSelectCity.bind(this);
        this.onSelectCompnay = this.onSelectCompnay.bind(this);
        this.onQuery = this.onQuery.bind(this);
        this.jumpToHistory.bind(this);
    }

    componentWillMount() {
        this.getCity();
        this.state.pager.clickPager(0);
    }

    jumpToHistory(index) {
        this.props.onJump();
    }

    // 渲染碳层
    renderAlert() {
        const modalProps = {
            show: this.state.showConfirm,
            message: this.state.message,
            type: 'alert',
            cancelClick: () => {
                this.setState({showConfirm: false});
            },
        };
        return <ModalAlert {...modalProps} />
    }
    renderModify () {
        const modal = {
            show: this.state.modifyModal,
            formData: this.state.formData
        };
        return <Modal {...modal} />
    }

    //获取城市
    getCity() {
        const path = "../data/rankCity.json?";
        //const path = "/cityconfig/queryByStatus?status=0"; // 真正接口
        requestByFetch(path, "GET").then((res) => {
            this.setState({
                cityData: res
            });
        });

    }

    // 获取指定城市下的公司
    getCompany(value) {
        const path = "../data/rankCompany.json";
        //const path = `/cityConfig/queryCorpsByCityCode?cityCode=${value}`&corpStatus=0; // 真正接口
        requestByFetch(path, "GET").then((res) => {
            this.setState({
                companyData: res
            });
        });
    }

    // 选择城市回调
    onSelectCity(value) {
        this.getCompany(value);
        ;
        this.setState({
            cityCode: value,
            corpCode: ""
        });
    }

    // 选择公司回调
    onSelectCompnay(value) {
        this.setState({
            corpCode: value
        });
        if (!value) {
            this.setState({
                showConfirm: true,
                message: "请选择公司"
            });
            return false;
        }
        const param = {
            corpCode: value,
            currentPage: 0
        };
        this.onQuery(param);
    }

    // 搜索函数
    onQuery(p) {
        const param = {
            ...p,
            pageSize: this.state.pageSize
        }

        const path = "../data/rankList.json?";
        //    const paths = `/dutyLevelConfig/queryConfigsByCorpCode?${parseParamsGet(param)}`; // 真正接口
        requestByFetch(path, "GET").then((res) => {
            this.setState({
                listData: res.dutyLevelInfoList,
                pager: {
                    ...this.state.pager,
                    currentPage: p.currentPage,
                    totalCount: res.totalCount
                }
            });
        });
    }


    render() {
        const {listData, config, corpCode, cityCode, cityData, companyData, pager} = this.state;
        return (
            <div className="rank-container">
                {this.renderAlert()}
                {this.renderModify()}
                <div className="container-title">
                    <Crumbs names={this.state.pathNames}/>
                    <div className="title-right">
                        <div className="right-company">
                            <span>城市：</span>
                            <Dropdown onSelect={this.onSelectCity} options={cityData} propsValue="cityCode"
                                      placeholder="请选择城市" value={cityCode} propsLabel="cityName"/>
                        </div>
                        <div className="right-company">
                            <span>公司：</span>
                            <Dropdown onSelect={this.onSelectCompnay} options={companyData} propsValue="corpCode"
                                      placeholder="请选择公司" propsLabel="corpName" value={corpCode}/>
                        </div>
                    </div>
                </div>

                <Table data={listData} config={config} pager={pager}/>
            </div>
        );
    }
}

export default Rank;
