import { CUSTOM_ELEMENTS_SCHEMA, Component, NgModule, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { Pelicula } from '../../interfaces/interfaces';
import {SplashService} from "../../shared/splash.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  recientes: Pelicula[] = [];
  populares: Pelicula[] = []

  constructor(private moviesService: MoviesService,  private splash: SplashService) {}

    ngOnInit(): void {
        this.splash.show();

        forkJoin({
            recientes: this.moviesService.getFeature(),
            populares: this.moviesService.getPopulares()
        }).subscribe({
            next: ({ recientes, populares }) => {
                this.recientes = recientes.results;
                this.populares = populares.results;
            },
            error: err => {
                console.error(err);
                this.splash.hide(); // importante también en error
            },
            complete: () => {
                this.splash.hide();
            }
        });
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
