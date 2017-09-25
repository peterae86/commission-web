import ImportListPage from "./ImportListPage";

class ScoreCorrect extends ImportListPage{
    constructor(props){
        super(props);
        this.state.table.config={
            column: [
                {name: "公司编码", key: "corpCode", textAlign: "center", width: "8%"},
                {name: "公司", key: "corpName", textAlign: "center", width: "8%"},
                {name: "大区编码", key: "regionCode", textAlign: "center", width: "8%"},
                {name: "大区", key: "regionName", textAlign: "center", width: "6%"},
                {name: "店面编码", key: "storeCode", textAlign: "center", width: "8%"},
                {name: "店面", key: "storeName", textAlign: "center", width: "7%"},
                {name: "姓名", key: "userName", textAlign: "center", width: "4%"},
                {name: "入职时间", key: "onDutyTimeAlia", textAlign: "center", width: "8%"},
                {name: "系统号", key: "userCode", textAlign: "center", width: "5%"},
                {name: "积分类别", key: "scoreType", textAlign: "center", width: "8%"},
                {name: "积分值", key: "scoreValue", textAlign: "center", width: "8%"},
                {name: "描述", key: "scoreDesc", textAlign: "center", width: "6%"},
                {name: "生效年月", key: "scoreActivePeriod", textAlign: "center", width: "8%"},
                {name: "导入时间", key: "createTsAlia", textAlign: "center", width: "8%"},
            ]
        };
        this.state.queryParams.importType = 'SCORE_CORRECT_IMPORT';
    }
}
export default ScoreCorrect;
