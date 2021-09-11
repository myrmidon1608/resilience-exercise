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

    constructor(source: Bioreactor, status: BioreactorBatchStatus = BioreactorBatchStatus.None) {
        this.bioreactor = source;
        this.batch_status = status;
    }
}