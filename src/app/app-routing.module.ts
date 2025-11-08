import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
    },
    {
        path: 'tabs',
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
    }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFirestoreModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
