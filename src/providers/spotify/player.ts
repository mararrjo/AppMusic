import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import 'rxjs/add/observable/fromPromise';
import "rxjs/add/operator/map";
import { SpotifyProvider } from "./spotify";

declare var Spotify: any;

@Injectable()
export class PlayerProvider {

    public player: any;
    private device_id: string;
    private current_track: any;
    private $current_track: Subject<any>;
    private stateMusicSnapsot: any;
    private $stateMusic: Subject<any>;
    private token: string;
    private $isConnect: Subject<boolean>;
    private $autenticated: Subject<boolean>;

    constructor(private http: HttpClient, private spotify: SpotifyProvider) {

        this.$stateMusic = new Subject<any>();
        this.$current_track = new Subject<any>();
        this.$isConnect = new Subject<boolean>();
        this.$autenticated = new Subject<boolean>();

        // this.token = this.spotify.getToken();
        this.token = sessionStorage.token;
        console.log("Token",this.token);

        setTimeout(() => {

            if (!!Spotify) {

                this.player = new Spotify.Player({
                    name: 'Web Playback SDK Quick Start Player',
                    getOAuthToken: cb => { cb(this.token); }
                });
                // Error handling
                this.player.addListener('initialization_error', ({ message }) => { console.error(message); });
                this.player.addListener('authentication_error', ({ message }) => { console.error(message); sessionStorage.token=""; this.$autenticated.next(false); });
                this.player.addListener('account_error', ({ message }) => { console.error(message); });
                this.player.addListener('playback_error', ({ message }) => { console.error(message); });

                // Playback status updates
                this.player.addListener('player_state_changed', state => {
                    this.stateMusicSnapsot = state;
                    this.$stateMusic.next(this.stateMusicSnapsot);
                    this.current_track = state.track_window ? state.track_window.current_track : null;
                    this.$current_track.next(this.current_track);
                });

                // Ready
                this.player.addListener('ready', ({ device_id }) => {
                    this.device_id = device_id;
                    console.log('Ready with Device ID', device_id);
                    this.$isConnect.next(true);
                    this.$autenticated.next(true);
                });

                // Connect to the player!
                this.player.connect();

            }
        }, 3000);

    }

    public isConnect(): Observable<boolean> {
        return this.$isConnect.asObservable();
    }

    public isAutenticated(): Observable<boolean> {
        return this.$autenticated.asObservable();
    }

    public getState(): Observable<any> {
        return this.$stateMusic.asObservable();
    }

    public getCurrentTrack(): Observable<any> {
        return this.$current_track.asObservable();
    }

    public playList(canciones: Array<string>, cancionActual: number = 0): Observable<any> {

        const spotify_uri = canciones.map(c => "spotify:track:" + c);

        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", "application/json");
        headers = headers.append("Authorization", "Bearer " + this.token);

        return this.http.put(`https://api.spotify.com/v1/me/player/play?device_id=${this.device_id}`, JSON.stringify({uris: spotify_uri, offset: { position: cancionActual} }), {
            headers: headers,
            observe: "response"
        }).map(res => res.body);
    }

    public play (idCancion: string = ""): Observable<any> {

        return Observable.fromPromise(this.player.resume());

        // const spotify_uri = "spotify:track:" + idCancion;

        // let headers = new HttpHeaders();
        // headers = headers.append("Content-Type", "application/json");
        // headers = headers.append("Authorization", "Bearer " + this.token);

        // return this.http.put(`https://api.spotify.com/v1/me/player/play?device_id=${this.device_id}`, JSON.stringify({uris: [spotify_uri]}), {
        //     headers: headers,
        //     observe: "response"
        // }).map(res => res.body);

    }

    public playToggle(): void {
        this.player.togglePlay().then(() => {
        });
    }

    public pause (idCancion: string): Observable<any> {
        return Observable.fromPromise(this.player.pause());
    }

    public openTrack(idCancion: string): Observable<any> {

        const spotify_uri = "spotify:track:" + idCancion;

        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", "application/json");
        headers = headers.append("Authorization", "Bearer " + this.token);

        return this.http.put(`https://api.spotify.com/v1/me/player/play?device_id=${this.device_id}`, JSON.stringify({uris: [spotify_uri]}), {
            headers: headers,
            observe: "response"
        }).map(res => res.body);
    }

    public next (): Observable<any> {

        return Observable.fromPromise(this.player.nextTrack());

        // let headers = new HttpHeaders();
        // headers = headers.append("Content-Type", "application/json");
        // headers = headers.append("Authorization", "Bearer " + this.token);

        // return this.http.post(`https://api.spotify.com/v1/me/player/next?device_id=${this.device_id}`, null, {
        //     headers: headers,
        //     observe: "response"
        // });

    }

    public prev (): Observable<any> {
        return Observable.fromPromise(this.player.previousTrack());
    }

}