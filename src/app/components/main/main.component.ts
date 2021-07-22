import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import {  UsuarioService} from "../../service/usuario.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public  usuarios:Array<Usuario>=[];

  constructor(private usuarioService:UsuarioService) { }

  ngOnInit(): void {
    this.getUsuarios();
  }


  getUsuarios(){
    this.usuarioService.getUsuarios().subscribe(x=>{
        this.usuarios=x;
    })
  }
}
