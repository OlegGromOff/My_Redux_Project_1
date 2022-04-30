import { createStore, combineReducers, compose, applyMiddleware } from 'redux';  // compose комбинирует несколько функций в одну
import ReduxThunk from 'redux-thunk';
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';

const stringMiddleware = () => (next) => (action) => { // мой кастомный middleware
    if (typeof action === 'string') {
        return next({
            type: action //теперь dispatch может получать строку, теперь строка может выступать полем
        })
    }
    return next(action)
}

// const myAction = (dispatch) => { // асинхронная функция
//     setTimeout(() => dispatch({
//         type: 'DELAYED_ACTION'
//     }), 2000);
// };

// store.dispatch(myAction); // диспатчу функцию, это можно сделать благодаря ReduxThunk

const store = createStore(
    combineReducers({ heroes, filters }), // скомбинировал редюсеры в один редюсер
    compose(applyMiddleware(ReduxThunk, stringMiddleware), // compose(комбинирую несколько функций чтобы подключить devtools)
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())// подключаю redux devtools
);


export default store;