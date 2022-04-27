import { useHttp } from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // useSelector - с его помощью получаем значение напрямую из стора
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { createSelector } from 'reselect' // используй reselect чтобы мемоизировать состяние для useSelector (если значение в useSelector не изменилось, пусть не происходит его перерендер)  npm i reselect --save

import { fetchHeroes, heroDeleted } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {

    const filteredHeroesSelector = createSelector(  // мемоизирую значения в useSelector (если в state изменилось ничего не изменилось, чтобы ВЕСЬ стейт не перерендеривался (перерендеривается оно бывает из-за того что передевая в стейт таое же значение мы получаем уже другой объект с таким же значением, а объекты никогда не равны друг другу))
        (state) => state.filters.activeFilter, // получил первое значение кооторое мне нужно
        (state) => state.heroes.heroes, // получил второе значение кооторое мне нужно
        (filter, heroes) => { // filter это первое значение которое я получил чуть выше, а heroes второе
            if (filter === 'all') { // тут в useSelector обращаюсь к двум разным редюсерам через .filters и .heroes
                console.log('render');
                return heroes; // получить всех героев если фильтр all
            } else {
                return heroes.filter(item => item.element === filter) // отображать героев которые соответствуют фильтру (.filter создает ноывй массив так что иммутабельность сохраняется)
            }
        }
    )

    // вариант без createSelector (reselect), тут происходило много лишних ререндеров
    // const filteredHeroes = useSelector(state => { // разные фильры лучше всего писать в useSelector 
    //     if (state.filters.activeFilter === 'all') { // тут в useSelector обращаюсь к двум разным редюсерам через .filters и .heroes
    //         return state.heroes.heroes; // получить всех героев если фильтр all
    //     } else {
    //         return state.heroes.heroes.filter(item => item.element === state.filters.activeFilter) // отображать героев которые соответствуют фильтру (.filter создает ноывй массив так что иммутабельность сохраняется)
    //     }
    // });

    const filteredHeroes = useSelector(filteredHeroesSelector); // назначаю переменной значение в useSelector из reselect (createSelector) В скобках в useSelector свойства которые мы передаем в filteredHeroes
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes(request)); // отображаю всех героев

        // eslint-disable-next-line
    }, []);

    const onDelete = useCallback((id) => { // тут использую useCallback, так как эта функция будет прокидываться ниже и чтобы она не перерендеривалась много раз  
        request(`http://localhost:3001/heroes/${id}`, "DELETE") // обращаемся к нашему персонажу на сервере по id и удаляем его с помощью DELETE (команда для работы с сервером)
            .then(data => console.log(data, 'Deleted'))
            .then(dispatch(heroDeleted(id)))
            .catch(err => console.log(err));
        // eslint-disable-next-line  
    }, [request]);

    if (heroesLoadingStatus === "loading") {
        return <Spinner />;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }



    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition
                    timeout={0}
                    classNames="hero">
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }

        return arr.map(({ id, ...props }) => {
            return (
                <CSSTransition
                    key={id}
                    timeout={500}
                    classNames="hero">
                    <HeroesListItem  {...props} onDelete={() => onDelete(id)} />
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filteredHeroes);

    return (
        <TransitionGroup component="ul">
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;