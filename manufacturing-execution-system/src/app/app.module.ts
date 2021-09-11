import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {BioreactorRepoService} from "./services/bioreactor-repo.service";
import {BroadcastService} from "./services/broadcast.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [
        BioreactorRepoService,
        BroadcastService,
        HttpClient
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
