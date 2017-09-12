import History from '../History';

class BaseSalaryHistory extends History {
    constructor(props) {
        super(props);
        this.state.queryUrl = '/data/rankHistory.json';//'/dutyLevelConfig/queryConfigsByCorpCode';
        this.state.queryType = 'ZHI_JI_GUAN_LI';
    }
}

export default BaseSalaryHistory;