import React from 'react';
import Table from '../component/Table/Table';
import Crumbs from '../component/Crumbs/Crumbs';
import Dropdown from '../component/Dropdown/Dropdown';
import ModalAlert from '../component/ModalAlert/ModalAlert';
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
            message: "", // alert message
            config: {
                colum: [
                    {name: "所属列表", key:"dutyScope", textAlign: "center", width: "10%"},
                    {name: "职级", key:"dutyLevel", textAlign: "center", width: "10%"},
                    {name: "职级积分下线", key:"minScore", textAlign: "center", width: "10%"},
                    {name: "职级积分上线", key:"maxScore", textAlign: "center", width: "10%"},
                    {name: "职级基础分", key:"baseScore", textAlign: "center", width: "10%"},
                    {name: "师徒制积分贡献比例", key:"masterScoreRatio", textAlign: "center", width: "15%"},
                    {name: "师徒制提佣积分贡献系数", key:"masterCommissionRatio", textAlign: "center", width: "15%"},
                    {name: "操作", key:"opt", textAlign: "center", width: "20%", content: [
                        {
                            key: "操作历史",
                            func: (index)=> {
                                console.log(index);
                            }
                        },
                         {
                            key: "修改",
                            func: (index)=> {
                                console.log(index);
                            }
                        }
                    ]}
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
    }
    componentWillMount () {
        this.getCity();
    }
    // 渲染碳层
    renderAlert() {
        const modalProps = {
             show: this.state.showConfirm,
             message: this.state.message,
             type: 'alert',
             cancelClick: () => {this.setState({showConfirm: false});},
           };
        return <ModalAlert {...modalProps} />
    }
    //获取城市
    getCity () {
        this.setState({
            totalCount:20,
            cityData: [ {
              "id": 1,
              "cityName": "义乌",
              "cityCode": "yi_wu"
            },
            {
              "id": 2,
              "cityName": "金华",
              "cityCode": "jin_hua"
            }]
        });
    }
    // 获取指定城市下的公司
    getCompany (value) {
        this.setState({
            companyData: [ {
              'corpCode':'yi_wu_fen_gong_si',
              'corpName':'义乌坐标'
             },
             {
              'corpCode':'jin_hua_fen_gong_si',
              'corpName':'金华坐标'
             }]
        });
    }
    // 选择城市回调
    onSelectCity (value) {
        this.getCompany(value);;
        this.setState({
            cityCode: value,
            corpCode: ""
        });
    }
    // 选择公司回调
    onSelectCompnay (value) {
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
        // console.log(param); // 准备发请求
        const param = {
            ...p,
            pageSize: this.state.pageSize
        }
        this.setState({
            pager: {
                ...this.state.pager,
                currentPage: p.currentPage,
                totalCount: 101
            }
        });
    }


    render() {
        let datas = {
         "id":1,
         "dutyScope": "A",
         "minScore": 50,
         "maxScore": 100,
         "baseScore": 50,
         "createTs": "2017-08-08 12:00:00",
         "updateTs": "2017-08-08 12:00:00",
         "masterCommissionRatio": "0.75",
         "dutyLevel": "A0",
         "masterScoreRatio": "0.2",
         "corpCode": "yi_wu_fen_gong_si"
       };
       let data = [];
     for (let i = 0; i< 10;i++) {
       data.push(datas);
     }
     const drop = [{
       value: "1",
       label: "测试"
     },{
       value: "2",
       label: "测试1"
     }];
     const {config, corpCode, cityCode, cityData, companyData, pager} = this.state;
        return (
            <div className="rank-container">
            {this.renderAlert()}
              <div className="container-title">
                <Crumbs names={this.state.pathNames}/>
                <div className="title-right">
                    <div className="right-company">
                        <span>城市：</span>
                        <Dropdown onSelect={this.onSelectCity} options={cityData} propsValue="cityCode" placeholder="请选择城市" value={cityCode} propsLabel="cityName"/>
                    </div>
                    <div  className="right-company">
                        <span>公司：</span>
                        <Dropdown onSelect={this.onSelectCompnay} options={companyData} propsValue="corpCode" placeholder="请选择公司" propsLabel="corpName" value={corpCode}/>
                    </div>
                </div>
              </div>

                <Table data = {data} config = {config} pager={pager}/>
            </div>
        );
    }
}

export default Rank;
