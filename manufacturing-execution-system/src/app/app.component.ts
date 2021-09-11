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
    private title: string = 'Resilience: Manufacturing Execution System';
    private bioreactors: Map<string, Bioreactor> = new Map<string, Bioreactor>();

    constructor(private broadcaster: BroadcastService, private bioreactorService: BioreactorRepoService) {
        this.broadcaster.on(BroadcastEventKeys.BioreactorAvailable)
        .subscribe((it: Bioreactor) => { this.updateBioreactor(it); });
    }

    startExecution(): void {
        this.bioreactorService.getBioreactorForUse();
    }

    private updateBioreactor(source: Bioreactor): void {
        let currentBioreactor: Bioreactor = this.bioreactors.get(source.id);
        if (!currentBioreactor) {
            this.bioreactors.set(source.id, source);
        } else {
            currentBioreactor.fill_percent = source.fill_percent;
            currentBioreactor.pH = source.pH;
            currentBioreactor.pressure = source.pressure;
            currentBioreactor.temperature = source.temperature;
        }
    }
}
