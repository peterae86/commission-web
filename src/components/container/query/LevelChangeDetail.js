import QueryDetail from "./QueryDetail";

class LevelChangeDetail extends QueryDetail {
    constructor(props){
        super(props);
        this.state.table.config={
            column: [
                {name: "发薪年月", key: "period", textAlign: "center", width: "33%"},
                {name: "调整前职级", key: "dutyLevelBefore", textAlign: "center", width: "33%"},
                {name: "调整后职级", key: "dutyLevelAfter", textAlign: "center", width: "34%"},
            ]
        }
    }
}

export default LevelChangeDetail
