import React from 'react';
import Table from '../component/Table/Table';
class Rank extends React.Component {
    constructor(props) {
        super(props);
        this.changeValue = this.changeValue.bind(this);
    }

    changeValue (value) {
        console.log(value);
    }

    render() {
        const config = {
            colum: [
                {name: "所属列表", key:"list", textAlign: "center", width: "20%"},
                {name: "职级", key:"rank", textAlign: "center", width: "20%"},
                {name: "职级积分下线", key:"test", textAlign: "center", width: "20%"},
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
        const data = [
        {
            list: "A",
            rank: "A0",
            test: "io"
        },
         {
            list: "A",
            rank: "A0",
            test: "io"
        },
         {
            list: "A",
            rank: "A0",
            test: "io"
        },
         {
            list: "A",
            rank: "A0",
            test: "io"
        },
         {
            list: "A",
            rank: "A0",
            test: "io"
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