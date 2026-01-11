import { Component } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { Pelicula, SearchedPelicula } from '../../interfaces/interfaces';
import { ModalController } from '@ionic/angular';
import { DetalleComponent } from '../../components/detalle/detalle.component';
import {GenreListComponent} from "../../components/genre-list/genre-list.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})
export class SearchPage {

  textoBuscar = '';
  buscando = false;
  peliculas: SearchedPelicula[] = [];
  ideas: string[] = ['Modern Family', 'Big Bang Theory', 'Dawnton Abbey', 'The Office'];
  constructor(private movieService: MoviesService, private modalCtrl: ModalController,
              private router: Router) {}

  buscar( event: CustomEvent ) {
    const valor = event.detail.value;
    this.realizarBusqueda(valor);
  }

  seleccionarIdea( idea: string ) {
    this.textoBuscar = idea;
    this.realizarBusqueda(idea);
  }

  realizarBusqueda( valor: string ) {
    if ( valor.length === 0 ) {
      this.buscando = false;
      this.peliculas = [];
      return;
    }

    this.buscando = true;
    console.log("valor", valor);
    this.movieService.buscarPeliculas(valor).subscribe( resp => {
      console.log("search", resp.results);
      this.peliculas = resp.results;
      this.buscando = false;
    });
  }

  async verDetalle(id: number) {
    const modal = await this.modalCtrl.create( {
      component: DetalleComponent,
      componentProps: {
        id
      }
    })

    modal.present();
  }

    async abrirGeneros() {

        const modal = await this.modalCtrl.create({
            component: GenreListComponent
        });

        await modal.present();

        const { data } = await modal.onDidDismiss();

        if (data?.genero) {
            this.router.navigate([
                '/tabs/search/series-genre',
                data.genero.id,
                data.genero.name
            ]);
        }
    }

}
