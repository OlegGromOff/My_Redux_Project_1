import { createStore, combineReducers, compose, applyMiddleware } from 'redux';  // compose комбинирует несколько функций в одну
import ReduxThunk from 'redux-thunk';
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';

const stringMiddleware = () => (next) => (action) => { // мой кастомный middleware
    if (typeof action === 'string') {
        return next({
            type: action
        })
    }
    return next(action)
}

const enhancer = (createStore) => (...args) => {
    const store = createStore(...args);

    const oldDispatch = store.dispatch;
    store.dispatch = (action) => {
        if (typeof action === 'string') {
            return oldDispatch({
                type: action
            })
        }
        return oldDispatch(action)
    }
    return store;
}

const store = createStore(
    combineReducers({ heroes, filters }), // скомбинировал редюсеры в один редюсер
    compose(applyMiddleware(ReduxThunk, stringMiddleware), // compose(комбинирую несколько функций)
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())// подключаю redux devtools
);


export default store;