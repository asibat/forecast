import React from 'react'
import { Provider} from 'mobx-react'
import {configure} from 'mobx'

import './App.css'

import {WeatherStore} from './WeatherStore'
import Clock from './Components/Clock'
import Time from './Components/Time'
import {WeatherView} from './WeatherView'

const weatherStore = new WeatherStore()
configure({enforceActions: true})

function App() {
    return (
        <Provider Clock={Clock}>
            <div className="App">
                <Time/>
                <WeatherView weatherStore={weatherStore}/>
            </div>
        </Provider>

    );
}

export default App;
