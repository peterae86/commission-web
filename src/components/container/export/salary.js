import ExportListPage from "./ExportListPage1";

class SalaryExport extends ExportListPage{
    constructor(props){
        super(props);
        this.state.queryParams.exportType="PAYMENT_EXPORT";
        this.state.table.config = {
            column: [
                {name: "公司", key: "corpName", textAlign: "center", width: "10%"},
                {name: "大区编号", key: "regionCode", textAlign: "center", width: "12%"},
                {name: "大区", key: "regionName", textAlign: "center", width: "10%"},
                {name: "店面编号", key: "storeCode", textAlign: "center", width: "12%"},
                {name: "店面", key: "storeName", textAlign: "center", width: "12%"},
                {name: "姓名", key: "userName", textAlign: "center", width: "10%"},
                {name: "入职时间", key: "onDutyTimeAlia", textAlign: "center", width: "12%"},
                {name: "系统号", key: "userCode", textAlign: "center", width: "10%"},
                {name: "薪酬", key: "baseSalary", textAlign: "center", width: "12%"},
            ]
        };
    }
}

export default SalaryExport