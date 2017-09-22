import ImportListPage from "./ImportListPage";

class Status extends ImportListPage{
    constructor(props){
        super(props);
        this.state.table.config={
            column: [
                {name: "公司编码", key: "corpCode", textAlign: "center", width: "9%"},
                {name: "公司", key: "corpName", textAlign: "center", width: "9%"},
                {name: "大区编码", key: "regionCode", textAlign: "center", width: "9%"},
                {name: "大区", key: "regionName", textAlign: "center", width: "9%"},
                {name: "店面编码", key: "storeCode", textAlign: "center", width: "9%"},
                {name: "店面", key: "storeName", textAlign: "center", width: "9%"},
                {name: "系统号", key: "userCode", textAlign: "center", width: "9%"},
                {name: "姓名", key: "userName", textAlign: "center", width: "9%"},
                {name: "入职时间", key: "createTs", textAlign: "center", width: "9%"},
                {name: "目前状态", key: "currentStatus", textAlign: "center", width: "10%"},
                {name: "导入时间", key: "onDutyTime", textAlign: "center", width: "9%"},
            ]
        };
        this.state.queryParams.importType = 'STATUS_ADJUST_IMPORT';
    }
}
export default Status