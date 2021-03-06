import {Component, PLATFORM_PIPES} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {provideCloud, CloudSettings} from '@ionic/cloud-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {TranslateLoader, TranslateStaticLoader, TranslateService, TranslatePipe} from "ng2-translate";
import {Http} from "@angular/http";

let prodMode: boolean = !!window.hasOwnProperty('cordava');

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'd33141dc'
  }
}

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  private rootPage: any;

  constructor(private platform: Platform, translate: TranslateService) {
    this.rootPage = HomePage;

    translate.setDefaultLang('fr');
    translate.use('fr');

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp, [
  {
    provide: TranslateLoader,
    useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
    deps: [Http]
  },
  {
    provide: PLATFORM_PIPES,
    useValue: TranslatePipe,
    multi: true
  },
  TranslateService,
  provideCloud(cloudSettings)
], {prodMode: prodMode});
