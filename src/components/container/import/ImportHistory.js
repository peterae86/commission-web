import History from '../History';
class ImportHistory extends History{
    constructor(props) {
        super(props);
        this.state.queryUrl = '/api/operateRecord/queryByPage';
        this.state.queryType = 'DAO_RU';
    }
}
export default ImportHistory;
