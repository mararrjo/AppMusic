import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";

/*
  Generated class for the SpotifyProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SpotifyProvider {

    private header: { headers: HttpHeaders, params: HttpParams, response: string };
    private token: string;

    constructor(public http: HttpClient) {
        console.log('Hello SpotifyProvider Provider');
        this.header = { headers: new HttpHeaders(), params: new HttpParams(), response: "observe" };
        this.token = "";
    }

    public login(): Observable<any> {
        
        this.header.params = new HttpParams();
        this.header.headers = new HttpHeaders();

        let my_client_id = "e9237e4f93c642698811956544c5d5d9";
        let my_secret_id = "c59237ea289a4ce9bb8c5587c8826b1f";
        let redirect_uri = "http://localhost:8100";
        let scopes = "streaming,user-read-birthdate,user-read-email,user-read-private";
        let url = 'https://accounts.spotify.com/authorize' +
            '?response_type=token' +
            '&client_id=' + my_client_id +
            (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
            '&redirect_uri=' + encodeURIComponent(redirect_uri);
        return this.http.get(url, this.header).do((res: any) => {
            if (res.redirect.split("#")[1].split('&')[0].split('=')[1]) {
                sessionStorage.token = res.redirect.split("#")[1].split('&')[0].split('=')[1];
                this.token = sessionStorage.token;
                console.log("Actualizado el token", this.token);
            }
        }).map((res) => { return sessionStorage.token });
    }

    public getToken(): string {
        if(this.token === "" && sessionStorage.token){
            this.token = sessionStorage.token;
        }
        return this.token;
    }

    public searchTracks(search: string, type: string = "track", limit: number = 20, offset: number = 0): Observable<any> {
        this.header.headers = new HttpHeaders();
        this.header.headers = this.header.headers.append("Authorization", "Bearer " + this.getToken());
        this.header.params = new HttpParams();
        this.header.params = this.header.params.append("q", search);
        this.header.params = this.header.params.append("type", type);
        this.header.params = this.header.params.append("limit", limit.toString());
        this.header.params = this.header.params.append("offset", offset.toString());
        return this.http.get("https://api.spotify.com/v1/search", this.header)
        .catch((e, c) => {
            console.log(e,c);
            if(e.status === 401){
                sessionStorage.token = "";
                this.token = "";
            }
            return Observable.throw(new Error("Token expirado"));
        })
        .map((res: any) => res[type+"s"]);
    }

    public getTracks(id: string, type: string = "album"): Observable<any> {
        // https://api.spotify.com/v1/albums/{id}/tracks
        this.header.headers = new HttpHeaders();
        this.header.params = new HttpParams();
        this.header.headers = this.header.headers.append("Authorization", "Bearer " + this.getToken());
        if(type === "album"){
            return this.http.get("https://api.spotify.com/v1/albums/"+id+"/tracks", this.header);
        }
        if(type === "artist"){
            return this.http.get("https://api.spotify.com/v1/artists/"+id+"/albums", this.header);
        }
    }

    

}
