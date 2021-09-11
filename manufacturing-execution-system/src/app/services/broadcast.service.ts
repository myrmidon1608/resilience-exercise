import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {map, filter} from 'rxjs/operators';

export interface BroadcastEvent {
    key: any;
    data?: any;
}

export enum BroadcastEventKeys {
    BioreactorAvailable = 'BioreactorAvailable',
    BioreactorInputStatus = 'BioreactorInputStatus',
    BioreactorOutputStatus = 'BioreactorOutputStatus'
}

@Injectable()
export class BroadcastService {
    eventBus: Subject<BroadcastEvent>;

    constructor() {
        this.eventBus = new Subject<BroadcastEvent>();
    }

    broadcast(key: any, data?: any) {
        this.eventBus.next({key, data});
    }

    on<T>(key: any): Observable<T> {
        return this.eventBus.asObservable()
            .pipe(filter(event => event.key === key))
            .pipe(map(event => <T>event.data));
    }
}
