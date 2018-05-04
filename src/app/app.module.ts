import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { VideoHomePage } from '../pages/video/home/video.home';
import { MusicHomePage } from '../pages/music/home/music.home';
import { ContactPage } from '../pages/contact/contact';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SpotifyProvider } from '../providers/spotify/spotify';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MusicModule } from '../pages/music/music.module';
import { PlayerProvider } from '../providers/spotify/player';

@NgModule({
  declarations: [
    MyApp,
    VideoHomePage,
    ContactPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    MusicModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    VideoHomePage,
    ContactPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PlayerProvider,
    SpotifyProvider
  ]
})
export class AppModule {}
