import ExportListPage from "./ExportListPage";

class ScoreExport extends ExportListPage{
    constructor(props){
        super(props);
        this.state.queryParams.exportType="exportType";
    }
}

export default ScoreExport