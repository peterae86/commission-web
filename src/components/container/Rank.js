import React from 'react';
import Table from '../component/Table/Table';
import Crumbs from '../component/Crumbs/Crumbs';
import Dropdown from '../component/Dropdown/Dropdown';
import ModalAlert from '../component/ModalAlert/ModalAlert';
class Rank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pathNames: props.pathNames,
            corpCode: "", // 城市公司下编码
            pageSize: 10, // 默认分页
            currentPage: 0, // 当前页码
            cityData: [], // 城市合计
            cityCode: "", //当前选中那个城市
            companyData: [],
            showConfirm: true,
            message: "测试测试", // alert message
        }
        this.config = {
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
        }
        this.onSelectCity = this.onSelectCity.bind(this);
        this.onQuery = this.onQuery.bind(this);
    }
    componentWillMount () {
        this.getCity();
    }
    renderAlert() {
        const modalProps = {
             show: this.state.showConfirm,
             message: this.state.message,
             type: 'alert',
             cancelClick: () => {this.setState({showConfirm: false});},
             confirmClick: () => { this.deleteClick();}
           };
        return <ModalAlert {...modalProps} />
    }
    getCity () {
        this.setState({
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

    onSelectCity (value) {
        this.getCompany(value);
        this.setState({
            cityCode: value,
            corpCode: ""
        });
    }

    onQuery (value) {
        this.setState({
            corpCode: value
        });
        const param = {
            corpCode: value,
            pageSize: this.state.pageSize,
            currentPage: this.state.currentPage
        };
        console.log(param);
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
     const {corpCode, cityCode, cityData, companyData} = this.state;
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
                        <Dropdown onSelect={this.onQuery} options={companyData} propsValue="corpCode" placeholder="请选择公司" propsLabel="corpName" value={corpCode}/>
                    </div>
                </div>
              </div>

                <Table data = {data} config = {this.config} />
            </div>
        );
    }
}

export default Rank;
