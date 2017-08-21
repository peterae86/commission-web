import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';
import routes from './route';
import configureStore from './store/configureStore';
require('lie/polyfill');

import './index.scss'; // Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.
import {syncHistoryWithStore} from 'react-router-redux';
const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store);
history.listen((location) => {
    const { action, pathname } = location;
    const TDAPP = window.TDAPP || '';
    TDAPP && TDAPP.onEvent(pathname, action);
});

render(
    <Provider store={store}>
        <Router history={history} routes={routes}/>
    </Provider>, document.getElementById('app')
);
