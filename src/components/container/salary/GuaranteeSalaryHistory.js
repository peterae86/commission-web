import History from '../History';

class GuaranteeSalaryHistory extends History {
    constructor(props) {
        super(props);
        this.state.queryUrl = '/api/operateRecord/queryByPage';
        // this.state.queryUrl = '/data/rankHistory.json';//'/dutyLevelConfig/queryConfigsByCorpCode';
        this.state.queryType = 'XIN_CHOU_BAO_ZHANG';
    }
}

export default GuaranteeSalaryHistory;
