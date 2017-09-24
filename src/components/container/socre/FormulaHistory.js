import History from '../History';

class FormulaHistory extends History {
    constructor(props) {
        super(props);
        this.state.queryUrl = '/api/operateRecord/queryByPage';
        // this.state.queryUrl = '../data/rankHistory.json';
        this.state.queryType = 'JI_FEN_GONG_SHI';
    }
}

export default FormulaHistory;
