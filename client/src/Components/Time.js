import React from 'react';
import moment from 'moment';
import { inject, observer } from 'mobx-react';

const Duration = ({ d }) => {
    let h = d.hours();
    let m = d.minutes();
    let s = d.seconds();

    [h, m, s] = [h, m, s].map(n => n < 10 ? `0${n}` : n)

    return <code>{h}:{m}:{s}</code>
}

const CurrentTime = inject('Clock')(observer(({ Clock }) => (
    <div className="time-container">
        {moment().format('DD/MM/YYYY')}, <Duration d={Clock.time} />
    </div>
)));

const Time = () => <CurrentTime />

export default Time;