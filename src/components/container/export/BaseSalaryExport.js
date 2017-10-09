import ExportListPage from "./ExportListPage";

class BaseSalaryExport extends ExportListPage{
    constructor(props){
        super(props);
        this.state.queryParams.exportType="exportType";
    }
}

export default BaseSalaryExport