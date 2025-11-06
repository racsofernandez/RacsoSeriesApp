import { Component } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { Pelicula, SearchedPelicula } from '../../interfaces/interfaces';
import { ModalController } from '@ionic/angular';
import { DetalleComponent } from '../../components/detalle/detalle.component';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})
export class SearchPage {

  textoBuscar = '';
  buscando = false;
  peliculas: SearchedPelicula[] = [];
  ideas: string[] = ['Spiderman', 'Avenger', 'El señor de los anillos', 'La vida es bella'];
  constructor(private movieService: MoviesService, private modalCtrl: ModalController) {}

  buscar( event: CustomEvent ) {
    this.buscando = true;
    console.log("event", event);
    const valor = event.detail.value;
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

}
