import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from "../../service/usuario.service";
import { EdituserComponent } from '../popups/edituser/edituser.component';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public usuarios: Array<Usuario> = [];
  public deleting: boolean = false;

  constructor(private usuarioService: UsuarioService, public modal: MatDialog, private _snackBar: MatSnackBar) { }
  usuario: Usuario = {
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
    this.getUsuariosBd();
    // this.getUsuarios();

    // this.updateUsuario(this.usuario);
    // this.agregarUsuario(this.usuario);
    //this.deleteUsuario(2)
  }


  // getUsuarios() {
  //   this.usuarioService.usuario$.subscribe(x => {
  //     console.log(x)
  //     this.usuarios = x;
  //   })
  // }
  getUsuariosBd() {
    this.usuarioService.getUsuariosBd().subscribe(usuarios => {
      this.usuarios = usuarios;
    })
  }

  deleteUsuario(id: number) {
    if (this.deleting) {
      return
    }
    this.deleting = true;
    this.usuarioService.deleteUsuario(id).subscribe(x => {
      this.getUsuariosBd();
      this.showSnackBar("!!El proceso fue exitoso ", "Eliminado");
      this.deleting = false;
    },
      (error) => { this.deleting = false; },
      () => { this.deleting = false; });

  }

  agregarUsuario(usuario: Usuario) {
    this.usuarioService.agregarUsuario(usuario).subscribe(x => {
      this.showSnackBar("!!El proceso fue exitoso ", "Agregado");
    });
    this.getUsuariosBd();


  }

  updateUsuario(usuario: Usuario) {
    this.usuarioService.updateUsuario(usuario).subscribe(x => {
      this.showSnackBar("!!El proceso fue exitoso ", "Actulizado");
    })
  }

  openModal(tipo: number, usuario: Usuario = new Usuario()) {
    const modalRef = this.modal.open(EdituserComponent, {
      data: { usuario, tipo: tipo },
      disableClose: true,
    });
    modalRef.afterClosed().subscribe(rpta => {
      if (rpta.estado) {

        if (rpta.tipo == 0) {
          //guardar
          console.log("gurdar")
          this.agregarUsuario(rpta.dato);
        }
        else if (rpta.tipo == 1) {
          //actualizar
          console.log("actualizar")
          this.updateUsuario(rpta.dato);
        }
      }
    })
  }

  showSnackBar(message: string, action: string) {
    // this._snackBar.open("!!El proceso fue existo ", "Eliminado", { duration: 1000 });
    this._snackBar.open(message, action, { duration: 1000 });
  }


}
