import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import { MusicHomePage } from '../music/home/music.home';
import { VideoHomePage } from '../video/home/video.home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MusicHomePage;
  tab2Root = VideoHomePage;
  tab3Root = ContactPage;

  constructor() {

  }
}
