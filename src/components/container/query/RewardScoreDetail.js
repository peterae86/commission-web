import QueryDetail from "./QueryDetail";

class RewardScoreDetail extends QueryDetail {
    constructor(props){
        super(props);
        this.state.table.config={
            column: [
                {name: "发薪年月", key: "period", textAlign: "center", width: "33%"},
                {name: "职级", key: "dutyLevel", textAlign: "center", width: "33%"},
                {name: "奖励积分", key: "rewardScore", textAlign: "center", width: "34%"},
            ]
        }
    }
}

export default RewardScoreDetail