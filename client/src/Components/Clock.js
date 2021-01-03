import {observable, action, makeObservable} from 'mobx';
import moment from 'moment';

class Clock {
    time = moment()
    constructor(period = 1000) {
        makeObservable(this, {
            clockTick: action,
            time: observable
        })
        this.interval = setInterval(() => this.clockTick(),
            period);
    }
    clockTick(newTime = moment()) {
        this.time = newTime;
    }
}

const clock = new Clock();

export default clock;