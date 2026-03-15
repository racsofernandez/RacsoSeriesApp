import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
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
     },
  {
    path: 'forgot',
    loadChildren: () => import('./pages/forgot/forgot.module').then( m => m.ForgotPageModule)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./pages/verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
  {
    path: 'series-genre',
    loadChildren: () => import('./pages/series-genre/series-genre.module').then( m => m.SeriesGenrePageModule)
  },
    {
        path: 'series-genre/:id/:name',
        loadChildren: () =>
            import('./pages/series-genre/series-genre.module')
                .then(m => m.SeriesGenrePageModule)
    }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
