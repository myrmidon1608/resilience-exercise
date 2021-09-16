import { Component, Input, OnInit } from "@angular/core";
import { BioreactorBatchStatus, BioreactorEvent } from "src/app/model/bioreactor-event.model";
import { Bioreactor } from "src/app/model/bioreactor.model";
import { BioreactorRepoService, ValveStatus } from "src/app/services/bioreactor-repo.service";

@Component({
    selector: 'app-bioreactor',
    templateUrl: './bioreactor.component.html'
})
export class BioreactorComponent {
    private _bioreactorEvent: BioreactorEvent;
    private _updateInterval: any;
    private displayReport: boolean = false;

    static defaultInterval: number = 1000;

    @Input()
    set bioreactor(source: Bioreactor) {
        this._bioreactorEvent = new BioreactorEvent(source);
        this._bioreactorEvent.start_time = new Date();
        this._bioreactorEvent.start_pH = this._bioreactorEvent.bioreactor.pH;
        this._bioreactorEvent.start_temp = this._bioreactorEvent.bioreactor.temperature;
        this._bioreactorEvent.start_pressure = this._bioreactorEvent.bioreactor.pressure;
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
                this._bioreactorEvent.end_time = new Date();
                this._bioreactorEvent.end_pH = this._bioreactorEvent.bioreactor.pH;
                this._bioreactorEvent.end_temp = this._bioreactorEvent.bioreactor.temperature;
                this._bioreactorEvent.end_pressure = this._bioreactorEvent.bioreactor.pressure;
                this._bioreactorEvent.fill_cpp_met = this.calculateRange(this._bioreactorEvent.fill_level, 70, 2);
                this._bioreactorEvent.temp_cpp_met = this.calculateRange(this._bioreactorEvent.end_temp, 80, 1);
                this._bioreactorEvent.pressure_cpp_met = this.bioreactorEvent.end_pressure < 200;
                this.closeOutputValve();
                this.displayReport = true;
                this._bioreactorEvent.batch_successful = this._bioreactorEvent.batch_status !== BioreactorBatchStatus.Aborted;
                this._bioreactorEvent.batch_status = BioreactorBatchStatus.Done;
            }
            if (this._bioreactorEvent.batch_status === BioreactorBatchStatus.Full) {
                if (this.bioreactorEvent.bioreactor.pressure === 200) {
                    this._bioreactorEvent.batch_status = BioreactorBatchStatus.Aborted;
                    this.openOutputValve();
                } else if (this.bioreactorEvent.bioreactor.temperature >= 79) {
                    this._bioreactorEvent.batch_status = BioreactorBatchStatus.Emptying;
                    this.openOutputValve();
                }
            }
            return;
        }
        
        if (this.bioreactorEvent.bioreactor.fill_percent >= 68) {
            this.closeInputValve();
        }
    }

    private calculateRange(value: number, base: number, range: number) {
        let min_range: number = base - range;
        let max_range: number = base + range;
        return value >= min_range && value <= max_range;
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
        this._bioreactorEvent.fill_level = this._bioreactorEvent.bioreactor.fill_percent;
        this.bioreactorService.setBioreactorInputStatus(this.bioreactorId, ValveStatus.CLOSE);
    }

    openOutputValve(): void {
        this.bioreactorService.setBioreactorOutputStatus(this.bioreactorId, ValveStatus.OPEN);
    }

    closeOutputValve(): void {
        this.bioreactorService.setBioreactorOutputStatus(this.bioreactorId, ValveStatus.CLOSE);
    }
}
