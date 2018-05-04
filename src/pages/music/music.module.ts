import { NgModule } from "@angular/core";
import { MusicHomePage } from "./home/music.home";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { IonicPageModule } from "ionic-angular";
import { MusicLoginPage } from "./login/login";
import { DetailListPage } from "./detail-list/detail-list";

@NgModule({
    declarations: [
        MusicHomePage,
        MusicLoginPage,
        DetailListPage
    ],
    imports: [
        BrowserModule,
        CommonModule,
        HttpClientModule,
        IonicPageModule.forChild(MusicHomePage)
    ],
    exports: [
        MusicHomePage
    ],
    entryComponents: [
        MusicHomePage,
        MusicLoginPage,
        DetailListPage
    ],
    providers: [

    ]
})
export class MusicModule {}