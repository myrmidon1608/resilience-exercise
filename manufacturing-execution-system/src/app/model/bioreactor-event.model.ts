import { Bioreactor } from "./bioreactor.model";

export enum BioreactorBatchStatus {
    None = 'None',
    Filling = 'Filling',
    Full = 'Full',
    Aborted = 'Aborted',
    Emptying = 'Emptying',
    Done = 'Done'
}

export class BioreactorEvent {
    bioreactor: Bioreactor;
    batch_status: BioreactorBatchStatus;
    fill_level: number;
    start_temp: number;
    end_temp: number;
    start_pH: number;
    end_pH: number;
    start_pressure: number;
    end_pressure: number;
    start_time: Date;
    end_time: Date;
    batch_successful: boolean = false;
    fill_cpp_met: boolean = false;
    temp_cpp_met: boolean = false;
    pressure_cpp_met: boolean = false;

    constructor(source: Bioreactor, status: BioreactorBatchStatus = BioreactorBatchStatus.None) {
        this.bioreactor = source;
        this.batch_status = status;
    }
}