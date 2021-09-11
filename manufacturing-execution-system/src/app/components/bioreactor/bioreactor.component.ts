import { Component, Input, OnInit } from "@angular/core";
import { BioreactorBatchStatus, BioreactorEvent } from "src/app/model/bioreactor-event.model";
import { Bioreactor } from "src/app/model/bioreactor.model";
import { BioreactorRepoService, ValveStatus } from "src/app/services/bioreactor-repo.service";
import { BroadcastEventKeys, BroadcastService } from "src/app/services/broadcast.service";

@Component({
    selector: 'app-bioreactor',
    templateUrl: './bioreactor.component.html'
})
export class BioreactorComponent {
    private _bioreactorEvent: BioreactorEvent;
    private _updateInterval: any;

    static defaultInterval: number = 1000;

    @Input()
    set bioreactor(source: Bioreactor) {
        this._bioreactorEvent = new BioreactorEvent(source);
        this.openInputValve();
    }

    get bioreactorEvent(): BioreactorEvent {
        return this._bioreactorEvent;
    }

    get bioreactorId(): string {
        return this._bioreactorEvent.bioreactor.id;
    }

    get inAnalysisState(): boolean {
        return [BioreactorBatchStatus.Full, BioreactorBatchStatus.Emptying, BioreactorBatchStatus.Aborted].includes(this._bioreactorEvent.batch_status);
    }

    get inCompleteState(): boolean {
        return this._bioreactorEvent.batch_status === BioreactorBatchStatus.Done;
    }

    constructor(private bioreactorService: BioreactorRepoService) {}

    private updateBatch(): void {
        if (this.inCompleteState) {
            clearInterval(this._updateInterval);
            return;
        }

        this.bioreactorService.getBioreactor(this.bioreactorId);

        if (this.inAnalysisState) {
            if (this.bioreactorEvent.bioreactor.fill_percent === 0) {
                this._bioreactorEvent.batch_status = BioreactorBatchStatus.Done;
                this.closeOutputValve();
            }
            if (this._bioreactorEvent.batch_status === BioreactorBatchStatus.Full) {
                if (this.bioreactorEvent.bioreactor.pressure === 200) {
                    this._bioreactorEvent.batch_status = BioreactorBatchStatus.Aborted;
                    this.openOutputValve();
                } else if (this.bioreactorEvent.bioreactor.temperature >= 80) {
                    this._bioreactorEvent.batch_status = BioreactorBatchStatus.Emptying;
                    this.openOutputValve();
                }
            }
            return;
        }
        
        if (this.bioreactorEvent.bioreactor.fill_percent >= 70) {
            this.closeInputValve();
        }
    }

    openInputValve(): void {
        this._bioreactorEvent.batch_status = BioreactorBatchStatus.Filling;
        this.bioreactorService.setBioreactorInputStatus(this.bioreactorId, ValveStatus.OPEN);
        
        this._updateInterval = setInterval(() => {
            this.updateBatch();
        }, BioreactorComponent.defaultInterval);
    }

    closeInputValve(): void {
        this._bioreactorEvent.batch_status = BioreactorBatchStatus.Full;
        this.bioreactorService.setBioreactorInputStatus(this.bioreactorId, ValveStatus.CLOSE);
    }

    openOutputValve(): void {
        this.bioreactorService.setBioreactorOutputStatus(this.bioreactorId, ValveStatus.OPEN);
    }

    closeOutputValve(): void {
        this.bioreactorService.setBioreactorOutputStatus(this.bioreactorId, ValveStatus.CLOSE);
    }
}
