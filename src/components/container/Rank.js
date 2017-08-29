import React from 'react';
import Table from '../component/Table/Table';
import Crumbs from '../component/Crumbs/Crumbs';
import Dropdown from '../component/Dropdown/Dropdown';
class Rank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pathNames: props.pathNames
        }
        this.changeValue = this.changeValue.bind(this);
    }
    changeValue (value) {
        console.log(value);
    }

    render() {
        const config = {
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
     for (let i = 0; i< 20;i++) {
       data.push(datas);
     }
     const drop = [{
       value: "1",
       label: "测试"
     },{
       value: "2",
       label: "测试1"
     }];
        return (
            <div className="rank-container">
              <div className="container-title">
                <Crumbs names={this.state.pathNames}/>
                <div className="title-right">
                    <div className="right-company">
                        <span>城市：</span>
                        <Dropdown options={drop} />
                    </div>
                    <div  className="right-company">
                        <span>公司：</span>
                        <Dropdown options={drop} value="1"/>
                    </div>
                </div>
              </div>

                <Table data = {data} config = {config}/>
            </div>
        );
    }
}

export default Rank;
