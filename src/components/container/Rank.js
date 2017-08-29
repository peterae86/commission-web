import React from 'react';
import Table from '../component/Table/Table';
class Rank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        }
        this.changeValue = this.changeValue.bind(this);
    }

    changeValue (value) {
        console.log(value);
    }

    render() {

        const config = {
            colum: [
                {name: "所属列表", key:"dutyScope", textAlign: "center", width: "20%"},
                {name: "职级", key:"dutyLevel", textAlign: "center", width: "20%"},
                {name: "职级积分下线", key:"minScore", textAlign: "center", width: "20%"},
                {name: "职级积分上线", key:"maxScore", textAlign: "center", width: "20%"},
                {name: "职级基础分", key:"baseScore", textAlign: "center", width: "20%"},
                {name: "师徒制积分贡献比例", key:"masterScoreRatio", textAlign: "center", width: "20%"},
                {name: "师徒制提佣积分贡献系数", key:"masterCommissionRatio", textAlign: "center", width: "20%"},
                {name: "操作", key:"opt", textAlign: "center", width: "40%", content: [
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
        const data =[
         {
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
       }
     ];

        return (
            <div className="rank-container">
                <Table data = {data} config = {config}/>
            </div>
        );
    }
}

export default Rank;
