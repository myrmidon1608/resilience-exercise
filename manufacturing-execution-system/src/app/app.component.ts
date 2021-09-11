import {Component, OnInit} from '@angular/core';
import {BroadcastEventKeys, BroadcastService} from "./services/broadcast.service";
import {BioreactorRepoService} from "./services/bioreactor-repo.service";
import {Bioreactor} from "./model/bioreactor.model";

@Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    private title: string = 'Resilience: Manufacturing Execution System';
    private currentBioreactor: Bioreactor;

    constructor(private broadcaster: BroadcastService, private bioreactorService: BioreactorRepoService) {
        this.broadcaster.on(BroadcastEventKeys.BioreactorAvailable)
        .subscribe((it: Bioreactor) => { this.currentBioreactor = it });
    }

    ngOnInit() {
        this.bioreactorService.getBioreactorForUse();
    }
}
