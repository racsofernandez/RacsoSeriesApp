import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { Pelicula } from '../../interfaces/interfaces';
import {SplashService} from "../../shared/splash.service";
import {combineLatest, take} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  recientes: Pelicula[] = [];
  populares: Pelicula[] = []
  loaded: boolean = false;

  constructor(private moviesService: MoviesService,  private splash: SplashService) {}

    ngOnInit(): void {
        // Si ya se está mostrando (ej: desde login), no reiniciamos el timer
        this.splash.visible$.pipe(take(1)).subscribe(visible => {
            if (!visible) {
                this.splash.show();
            }
        });

        this.cargarDatos();
    }

    cargarDatos(event?: any) {
        combineLatest([
            this.moviesService.getFeature(),
            this.moviesService.getPopulares()
        ])
            .pipe(take(1))
            .subscribe({
                next: ([recientes, populares]) => {
                    this.recientes = recientes.results;
                    this.populares = populares.results;
                    this.loaded = true;
                    this.splash.hide();
                    if (event) event.target.complete();
                },
                error: err => {
                    console.error(err);
                    this.splash.hide();
                    this.loaded = true;
                    if (event) event.target.complete();
                }
            });
    }

    doRefresh(event: any) {
        this.cargarDatos(event);
    }


  cargarMas() {
    this.getPopulares();
  }

  getPopulares() {
    this.moviesService.getPopulares()
      .subscribe( resp => {
        console.log("Populares", resp);
        //  this.populares = resp.results;
        const arrTemp = [ ...this.populares, ...resp.results ];
        this.populares = arrTemp;
      })
  }
}
