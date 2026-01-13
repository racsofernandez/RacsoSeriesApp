import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import { register } from 'swiper/element';
import { Storage } from '@ionic/storage-angular';
import { SplashService } from './shared/splash.service';
import {FirebaseAuthentication} from "@capacitor-firebase/authentication";
import {Router} from "@angular/router";
import {Capacitor, PluginListenerHandle} from "@capacitor/core";
import {ModalController, NavController, Platform} from "@ionic/angular";
import {AuthService} from "./services/auth.service";
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
                private platform: Platform, private _location: Location, private modalCtrl: ModalController) {
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
                const modal = await this.modalCtrl.getTop();
                if (modal) {
                    await modal.dismiss();
                    return;
                }

                if (this.router.url === '/login' || this.router.url === '/tabs/home') {
                    processNextHandler();
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
