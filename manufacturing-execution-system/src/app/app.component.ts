import {Component, OnInit} from '@angular/core';
import {BroadcastEventKeys, BroadcastService} from "./services/broadcast.service";
import {BioreactorRepoService} from "./services/bioreactor-repo.service";
import {Bioreactor} from "./model/bioreactor.model";

@Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
})
export class AppComponent {
    private bioreactorLookup: Map<string, Bioreactor> = new Map<string, Bioreactor>();
    private bioreactors: Bioreactor[] = [];

    constructor(private broadcaster: BroadcastService, private bioreactorService: BioreactorRepoService) {
        this.broadcaster.on(BroadcastEventKeys.BioreactorAvailable)
        .subscribe((it: Bioreactor) => { this.updateBioreactor(it); });
    }

    startExecution(): void {
        this.bioreactorService.getBioreactorForUse();
    }

    private updateBioreactor(source: Bioreactor): void {
        let currentBioreactor: Bioreactor = this.bioreactorLookup.get(source.id);
        if (!currentBioreactor) {
            this.bioreactorLookup.set(source.id, source);
            this.bioreactors.push(this.bioreactorLookup.get(source.id));
        } else {
            currentBioreactor.fill_percent = source.fill_percent;
            currentBioreactor.pH = source.pH;
            currentBioreactor.pressure = source.pressure;
            currentBioreactor.temperature = source.temperature;
        }
    }
}
