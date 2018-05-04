import { Component } from "@angular/core";
import { SpotifyProvider } from "../../../providers/spotify/spotify";
import { NavController } from "ionic-angular";
import { MusicHomePage } from "../home/music.home";

@Component({
    selector: "app-login-music",
    templateUrl: "./login.html"
})
export class MusicLoginPage {

    public client: any;

    constructor(public navCtrl: NavController, private spotifyProvider: SpotifyProvider) {
        this.client = { setting: {} };
        // Old
        // this.client.setting = {
        //     clientId: "a044104fdccc42ddb6174655670a2cdb",
        //     secretId: "656ecacd4abf4905a02f5403d8f9d1fd",
        //     scopes: ["streaming", "user-read-birthdate", "user-read-email", "user-read-private"],
        //     redirect_uri: "http://localhost:8100"
        // };


        this.client.setting = {
            clientId: "e9237e4f93c642698811956544c5d5d9",
            secretId: "c59237ea289a4ce9bb8c5587c8826b1f",
            scopes: ["streaming", "user-read-birthdate", "user-read-email", "user-read-private"],
            redirect_uri: "http://localhost:8100"
        };

        this.spotifyProvider.login().subscribe((res: any) => {
            console.log(res);
            this.navCtrl.setRoot(MusicHomePage);
        });

    }



}