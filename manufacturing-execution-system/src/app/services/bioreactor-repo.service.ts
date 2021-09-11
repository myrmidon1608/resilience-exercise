import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BroadcastEventKeys, BroadcastService} from "./broadcast.service";
import {Bioreactor} from "../model/bioreactor.model";

export enum ValveStatus {
    OPEN = 'open',
    CLOSE = 'closed'
}

@Injectable()
export class BioreactorRepoService {

    private baseUrl: string = 'api/';

    constructor(private http: HttpClient, private broadcaster: BroadcastService) {}

    public getBioreactorForUse(): void {
        this.http.get(this.baseUrl + 'bioreactor/0')
            .subscribe((it: any) => {
                this.getBioreactor(it.id);
            });
    }

    public getBioreactor(id: string): void {
        this.http.get(this.baseUrl + 'bioreactor/' + id)
            .subscribe((it: Bioreactor) => {
                it.id = id;
                this.broadcaster.broadcast(BroadcastEventKeys.BioreactorAvailable, it);
            });
    }

    public getBioreactorInputStatus(id: string): void {
        this.http.get(this.baseUrl + 'bioreactor/' + id + '/input-valve')
            .subscribe((it: any) => {
                this.broadcaster.broadcast(BroadcastEventKeys.BioreactorInputStatus, it);
            });
    }

    public setBioreactorInputStatus(id: string, status: ValveStatus): any {
        this.http.put(this.baseUrl + 'bioreactor/' + id + '/input-valve', { state: status })
            .subscribe((it: any) => {});
    }

    public getBioreactorOutputStatus(id: string): void {
        this.http.get(this.baseUrl + 'bioreactor/' + id + '/output-valve')
            .subscribe((it: any) => {
                this.broadcaster.broadcast(BroadcastEventKeys.BioreactorOutputStatus, it);
            });
    }

    public setBioreactorOutputStatus(id: string, status: ValveStatus): any {
        this.http.put(this.baseUrl + 'bioreactor/' + id + '/output-valve', { state: status })
            .subscribe((it: any) => {});
    }
}
