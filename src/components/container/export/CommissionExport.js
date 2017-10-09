import ExportListPage from "./ExportListPage";

class CommissionExport extends ExportListPage{
    constructor(props){
        super(props);
        this.state.queryParams.exportType="exportType";
    }
}

export default CommissionExport