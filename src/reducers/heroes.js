// В редюсере пиши простые операции без разных фильтров и сложных условий

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
}

const heroes = (state = initialState, action) => {
    switch (action.type) {
        case 'HEROES_FETCHING':
            return {
                ...state,
                heroesLoadingStatus: 'loading'
            }
        case 'HEROES_FETCHED':
            return {
                ...state,
                heroes: action.payload,
                heroesLoadingStatus: 'idle'
            }
        case 'HEROES_FETCHING_ERROR':
            return {
                ...state,
                heroesLoadingStatus: 'error'
            }

        case 'HERO_CREATED':
            // Формируем новый массив    
            return {
                ...state,
                heroes: [...state.heroes, action.payload] //добавляю нового героя
            }
        case 'HERO_DELETED':
            // Формируем новый массив
            return {
                ...state,
                heroes: state.heroes.filter(item => item.id !== action.payload) // filter возвращает новый массив(иммутабельность) оставляю только героев у которых id не равен id выбранного(удаленного) героя // отобразать героев без удаленного героя
            }
        default: return state
    }
}

export default heroes;