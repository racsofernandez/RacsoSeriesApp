import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import { register } from 'swiper/element';
import { Storage } from '@ionic/storage-angular';
import { SplashService } from './shared/splash.service';
import {FirebaseAuthentication} from "@capacitor-firebase/authentication";
import {Router} from "@angular/router";
import {Capacitor, PluginListenerHandle} from "@capacitor/core";
import {NavController} from "@ionic/angular";
import {AuthService} from "./services/auth.service";


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
                private ngZone: NgZone, private navCtrl: NavController, private authService: AuthService) {
        this.initAuthListener();
    }

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();
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
