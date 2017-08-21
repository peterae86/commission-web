import React from 'react';
import {Route, IndexRoute} from 'react-router';

import Home from './Home';

export default (
    <Route path="/" >
        <Route path="/statics" component={Home}>
            <IndexRoute component={Home}/>
            <Route path="home" component={Home} />
        </Route>
    </Route>
);
