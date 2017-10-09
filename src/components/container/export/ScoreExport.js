import ExportListPage from "./ExportListPage";

class ScoreExport extends ExportListPage{
    constructor(props){
        super(props);
        this.state.queryParams.exportType="SCORE_EXPORT";
        this.state.table.config = {
            column: [
                {name: "公司", key: "corpName", textAlign: "center", width: "10%"},
                {name: "大区编号", key: "regionCode", textAlign: "center", width: "10%"},
                {name: "大区", key: "regionName", textAlign: "center", width: "10%"},
                {name: "店面编号", key: "storeCode", textAlign: "center", width: "10%"},
                {name: "店面", key: "storeName", textAlign: "center", width: "10%"},
                {name: "姓名", key: "userName", textAlign: "center", width: "10%"},
                {name: "入职时间", key: "onDutyTime", textAlign: "center", width: "10%"},
                {name: "系统号", key: "userCode", textAlign: "center", width: "10%"},
                {name: "积分", key: "score", textAlign: "center", width: "10%"},
            ]
        };
    }
}

export default ScoreExport