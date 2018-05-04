import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-video-home',
    templateUrl: 'video.home.html'
})
export class VideoHomePage {

    private apikey: string;

    constructor(public navCtrl: NavController) {
        this.apikey = "AIzaSyAfUDn1T8zaQ7WaG1THWEIN4JfPoDqRRsQ";
    }

}
