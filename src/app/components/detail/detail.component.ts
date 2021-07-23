import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  public id: number=0;
  public usuario:Usuario=new Usuario();
  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id)
    this.getUsuario(this.id);
  }
  getUsuario(id: number) {
    this.usuarioService.getUsuario(id).subscribe(x => {
      this.usuario=x;
      console.log(this.usuario)
      
    })
  }

}
