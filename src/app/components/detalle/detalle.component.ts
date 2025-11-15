import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Cast, PeliculaDetalle } from 'src/app/interfaces/interfaces';
import { MoviesService } from 'src/app/services/movies.service';
import {SeriesDbService} from "../../services/series-db.service";
import {Auth} from "@angular/fire/auth";

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
})
export class DetalleComponent  implements OnInit {

  @Input() id: any;

  pelicula: PeliculaDetalle = {id:0};
  actores: Cast[] = [];
  oculto = 150;
  star = "star-outline";
  updated = false;

  constructor(private moviesService: MoviesService,
              private modalDtrl: ModalController,
              private dataLocal: SeriesDbService,
              private auth: Auth) { }

  ngOnInit() {
    console.log("id", this.id);

    const uid = this.auth.currentUser?.uid;
    if (uid!=null) {
        this.dataLocal.existeSerie(uid, this.id).then(existe => this.star = (existe) ? 'star': 'star-outline');
    }

    this.moviesService.getPeliculaDetalle(this.id)
      .subscribe( resp => {
        this.pelicula = resp;
        console.log("detalle", resp);
        //  this.populares = resp.results;
      })

    this.moviesService.getActoresPelicula(this.id)
    .subscribe( resp => {
      this.actores = resp.cast;
      console.log("actores", this.actores);
      //  this.populares = resp.results;
    })
  }

  regresar() {
      this.modalDtrl.dismiss({
          updated: this.updated   // devolvemos un flag
      }).then(r => false);
  }

  async favorito() {
    const user = this.auth.currentUser;
    if (!user) {
      console.error("No hay usuario autenticado");
      return;
    }
    const uid = user.uid;   // <-- ESTE ES EL ID DEL USUARIO

    const existeSerie = await this.dataLocal.guardarSerie(uid, this.pelicula);
    this.star = (existeSerie) ? 'star': 'star-outline';
    this.updated = true;
  }
}
