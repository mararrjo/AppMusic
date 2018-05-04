import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { SpotifyProvider } from "../../../providers/spotify/spotify";
import { PlayerProvider } from "../../../providers/spotify/player";

@Component({
    selector: "app-detail-list",
    templateUrl: "./detail-list.html"
})
export class DetailListPage {

    public itemDetail: any;
    public items: Array<any>;
    public currentTrack: any;

    constructor(
        public navController: NavController,
        public navParams: NavParams,
        private spotifyProvider: SpotifyProvider,
        private player: PlayerProvider
    ) {
        this.itemDetail = this.navParams.get("item");

        this.currentTrack = null;
        this.player.getCurrentTrack().subscribe(track => {
            this.currentTrack = track;
        });

        this.spotifyProvider.getTracks(this.itemDetail.id, this.itemDetail.type).subscribe((res) => {
            this.items = res.items;
        });

    }

    public action(index: number, item: any): void {
        if(item.type !== "track"){
            this.navController.push(DetailListPage, {item: item});
        }else{
            let position = this.items.findIndex(cancion => cancion.id === item.id);
            this.player.playList(this.items.map(l => l.id), position).subscribe();
        }
    }

}