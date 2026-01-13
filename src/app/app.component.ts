import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import { register } from 'swiper/element';
import { Storage } from '@ionic/storage-angular';
import { SplashService } from './shared/splash.service';
import {FirebaseAuthentication} from "@capacitor-firebase/authentication";
import {Router} from "@angular/router";
import {Capacitor, PluginListenerHandle} from "@capacitor/core";
import {ModalController, NavController, Platform} from "@ionic/angular";
import {AuthService} from "./services/auth.service";
import {App} from "@capacitor/app";
import {Location} from "@angular/common";


register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
    splash$ = this.splash.visible$;
    private authListener?: PluginListenerHandle;

    constructor(private storage: Storage, public splash: SplashService, private router: Router,
                private ngZone: NgZone, private navCtrl: NavController, private authService: AuthService,
                private platform: Platform, private modalCtrl: ModalController, private _location: Location) {
        this.initAuthListener();
        this.initializeApp();
    }

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();
  }

    initializeApp() {
        this.platform.ready().then(() => {
            this.platform.backButton.subscribeWithPriority(9999, async (processNextHandler) => {
                try {
                    const modal = await this.modalCtrl.getTop();
                    if (modal) {
                        await modal.dismiss();
                        return;
                    }
                } catch (error) {
                    console.error('Error checking modal:', error);
                }

                if (this.router.url === '/tabs/home' || this.router.url === '/login') {
                    App.exitApp();
                } else {
                    this._location.back();
                }
            });
        });
    }

    private async initAuthListener() {
        // if (!Capacitor.isNativePlatform()) return;

        // this.authListener = await FirebaseAuthentication.addListener(
        //     'idTokenChange',
        //     ({ token }) => {
        //         console.log('🔥 ID TOKEN CHANGE (ROOT):', token);
        //
        //         this.ngZone.run(() => {
        //             console.log('Inside ngZone');
        //             if (token) {
        //                 console.log('Token is not null');
        //                 this.navCtrl.navigateRoot('/tabs');
        //             } else {
        //                 console.log('Token has not been initialized');
        //                 this.navCtrl.navigateRoot('/login');
        //             }
        //         });
        //     }
        // );
        this.authService.user$.subscribe((user: any) => {
            if (user) {
                this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
            } else {
                this.router.navigateByUrl('/login', { replaceUrl: true });
            }
        });

    }

    // ngOnDestroy() {
    //     this.authListener?.remove();
    // }

}
