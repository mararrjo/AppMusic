import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SpotifyProvider } from '../../../providers/spotify/spotify';
import { MusicLoginPage } from '../login/login';
import { DetailListPage } from '../detail-list/detail-list';
import { PlayerProvider } from '../../../providers/spotify/player';

@Component({
    selector: 'page-music-home',
    templateUrl: 'music.home.html'
})
export class MusicHomePage {

    public listSearch: Array<any>;
    public limit: number;
    public offset: number;
    public total: number;
    public search: string;
    public typeSearch: string;

    public currentTrack: any;
    public stateMusic: any;
    

    constructor(
        public navCtrl: NavController,
        private spotifyProvider: SpotifyProvider,
        private player: PlayerProvider
    ) {
        this.limit = 20;
        this.offset = 0;
        this.total = 0;
        this.typeSearch = "track";
        this.listSearch = [];
        
        this.currentTrack = null;
        this.player.getCurrentTrack().subscribe(track => {
            this.currentTrack = track;
        });

        this.stateMusic = null;
        this.player.getState().subscribe(state => {
            this.stateMusic = state;
        });

    }

    public getItems(event: any): void {

        let val: string = event.target.value;
        this.search = val;

        if (val && val.trim() != "" && val.length >= 3 ) {
            this.spotifyProvider.searchTracks(val, this.typeSearch, this.limit, this.offset).subscribe(res => {
                this.listSearch = res.items;
                this.total = res.total;
            });
        }else{
            this.listSearch = [];
            this.total = 0;
        }

    }

    public doInfinite(infiniteScroll): void {

        this.offset = this.offset + this.limit;
        this.spotifyProvider.searchTracks(this.search, this.typeSearch, this.limit, this.offset).subscribe(res => {
            res.items.forEach(i => {
                this.listSearch.push(i);
            });
            this.total = res.total;
            infiniteScroll.complete();
        });

    }

    public segmentChanged($event): void {
        this.offset = 0;
        if (this.search && this.search.trim() != "" && this.search.length >= 3 ) {
            this.spotifyProvider.searchTracks(this.search, this.typeSearch, this.limit, this.offset).subscribe(res => {
                this.listSearch = res.items;
                this.total = res.total;
            });
        }else{
            this.listSearch = [];
            this.total = 0;
        }
    }

    public action(index: number, item: any): void {
        if(this.typeSearch !== "track"){
            this.navCtrl.push(DetailListPage, {item: item});
        }else{
            let position = this.listSearch.findIndex(cancion => cancion.id === item.id);
            this.player.playList(this.listSearch.map(l => l.id), position).subscribe();
        }
    }

    public isLoged(): boolean {
        return this.spotifyProvider.getToken() !== "";
    }

    public login(): void {
        this.navCtrl.push(MusicLoginPage);
    }

}
