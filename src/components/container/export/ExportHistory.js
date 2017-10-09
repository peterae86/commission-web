import History from '../History';

class ExportHistory extends History {
    constructor(props) {
        super(props);
        // this.state.queryUrl = '../data/rankHistory.json';//'/dutyLevelConfig/queryConfigsByCorpCode';
        this.state.queryUrl = '/api/operateRecord/queryByPage'
        this.state.queryType = 'DAO_CHU';
    }
}

export default ExportHistory;
