import QueryDetail from "./QueryDetail";

class BaseScoreDetail extends QueryDetail {
    constructor(props){
        super(props);
        this.state.table.config={
            column: [
                {name: "发薪年月", key: "period", textAlign: "center", width: "33%"},
                {name: "职级", key: "dutyLevel", textAlign: "center", width: "33%"},
                {name: "基础积分", key: "baseScore", textAlign: "center", width: "34%"},
            ]
        }
    }
}

export default BaseScoreDetail