import History from '../History';
class ImportHistory extends History{
    constructor(props) {
        super(props);
        this.state.queryUrl = '/data/rankHistory.json';//'/dutyLevelConfig/queryConfigsByCorpCode';
        this.state.queryType = 'DAO_RU';
    }
}
export default ImportHistory;