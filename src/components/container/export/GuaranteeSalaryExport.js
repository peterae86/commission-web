import ExportListPage from "./ExportListPage";

class GuaranteeSalaryExport extends ExportListPage{
    constructor(props){
        super(props);
        this.state.queryParams.exportType="exportType";
    }
}

export default GuaranteeSalaryExport