import ImportListPage from "./ImportListPage";

class Yeji extends ImportListPage{
    constructor(props){
        super(props);
        this.state.table.config={
            column: [
                {name: "公司编码", key: "corpCode", textAlign: "center", width: "7%"},
                {name: "公司", key: "corpName", textAlign: "center", width: "8%"},
                {name: "大区编码", key: "regionCode", textAlign: "center", width: "7%"},
                {name: "大区", key: "regionName", textAlign: "center", width: "8%"},
                {name: "店面编码", key: "storeCode", textAlign: "center", width: "7%"},
                {name: "店面", key: "storeName", textAlign: "center", width: "8%"},
                {name: "姓名", key: "userName", textAlign: "center", width: "7%"},
                {name: "入职时间", key: "onDutyTimeAlia", textAlign: "center", width: "8%"},
                {name: "系统号", key: "userCode", textAlign: "center", width: "5%"},
                {name: "应收业绩", key: "yingShouYeJi", textAlign: "center", width: "7%"},
                {name: "实收业绩", key: "shiShouYeJi", textAlign: "center", width: "7%"},
                {name: "所属序列", key: "dutyScope", textAlign: "center", width: "7%"},
                {name: "业绩年月", key: "yeJiPeriod", textAlign: "center", width: "6%"},
                {name: "导入时间", key: "createTsAlia", textAlign: "center", width: "8%"},
            ]
        };
        this.state.queryParams.importType = 'YE_JI_IMPORT';
    }
}
export default Yeji;
