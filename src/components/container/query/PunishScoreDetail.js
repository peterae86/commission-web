import QueryDetail from "./QueryDetail";

class PunishScoreDetail extends QueryDetail {
    constructor(props){
        super(props);
        this.state.table.config={
            column: [
                {name: "发薪年月", key: "period", textAlign: "center", width: "33%"},
                {name: "职级", key: "dutyLevel", textAlign: "center", width: "33%"},
                {name: "惩罚积分", key: "punishScore", textAlign: "center", width: "34%"},
            ]
        }
    }
}

export default PunishScoreDetail