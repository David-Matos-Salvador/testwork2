import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from "../../service/usuario.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public usuarios: Array<Usuario> = [];

  constructor(private usuarioService: UsuarioService) { }
  usuario:Usuario={
    address: { street: "Vamos a ir papap", suite: "Apt. 556", city: "Gwenborough", zipcode: "92998-3874", geo: { lat: 0, lng: 0 } },
    company: { name: "Romaguera-Crona", catchPhrase: "Multi-layered client-server neural-net", bs: "harness real-time e-markets" },
    email: "brok504@april.biz",
    id: 1,
    name: "Leanne Graham",
    phone: "1-770-736-8031 x56442",
    username: "Bret",
    website: ''
  };
  ngOnInit(): void {
    this.getUsuarios();
    this.deleteUsuario();    
    this.updateUsuario(this.usuario);
  }


  getUsuarios() {
    this.usuarioService.getUsuarios().subscribe(x => {
      this.usuarios = x;
    })
  }
  
  deleteUsuario(){
    this.usuarioService.deleteUsuario(9).subscribe(x => {
      console.log(x)
    })
  }
  updateUsuario(usuario:Usuario){
    this.usuarioService.updateUsuario(usuario).subscribe(x=>{
      console.log(x)
    })
  }

}
