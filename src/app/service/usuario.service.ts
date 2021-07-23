import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public _usuarios: Array<Usuario> = [{
    address: { street: "Kulas Light", suite: "Apt. 556", city: "Gwenborough", zipcode: "92998-3874", geo: { lat: 0, lng: 0 } },
    company: { name: "Romaguera-Crona", catchPhrase: "Multi-layered client-server neural-net", bs: "harness real-time e-markets" },
    email: "brok504@april.biz",
    id: 1,
    name: "Leanne Graham",
    phone: "1-770-736-8031 x56442",
    username: "Bret",
    website: ''
  }];

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  public _usuariosEliminados:Array<number> =[];

  constructor(private http: HttpClient) { }

  public getUsuarios(): Observable<Array<Usuario>> {
    return this.http.get<Array<Usuario>>(
      `${environment.apiUrl}users`
    ).pipe(
      map(usuarios => {
        return this.llenarUsuarios(usuarios)
      }
      ),catchError(this.errorHandler)
    );
  }

  public getUsuario(id: number) {
    return this.http.get<Usuario>(
      `${environment.apiUrl}users/${id}`
    ).pipe(
      map(usuarioBd => {
        let usuarioLocal = this._usuarios.find(usuario => usuario.id == id);
        return usuarioLocal ? usuarioLocal : usuarioBd;
      }
      ),catchError(this.errorHandler)
    );
  }
  public deleteUsuario(id: number) {
    return this.http.delete<any>(
      `${environment.apiUrl}users/${id}`
    ).pipe(
      map(usuarioBd => {
        this._usuariosEliminados.push(id);
        this._usuarios = this._usuarios.filter(usuario => usuario.id != id);
        return usuarioBd;
      }
      ),catchError(this.errorHandler)
    );
  }

  public updateUsuario(usuarioUpdate: Usuario) {
    return this.http.put<any>(
      `${environment.apiUrl}users/${usuarioUpdate.id}`,JSON.stringify(usuarioUpdate),this.httpOptions
    ).pipe(
      map(usuarioBd => {
       let index=this._usuarios.findIndex(usuario => usuario.id != usuarioUpdate.id);
       this._usuarios[index]=usuarioUpdate;
        return usuarioBd;
      }
      ),catchError(this.errorHandler)
    );
  }



  // actualizarUsuarios(usuariosBd: Array<Usuario>) {

  //   let addUsuarios: Set<Usuario> = new Set();
  //   usuariosBd = usuariosBd.map(usuarioBd => {
  //     this._usuarios.map(usuarioLocal => {
  //       if (usuarioBd.id === usuarioLocal.id) {
  //         usuarioBd = usuarioLocal;
  //         console.log(usuarioBd)
  //       } else {
  //         addUsuarios.add(usuarioLocal); //addUsuarios  es un tipo de dato set
  //       }

  //     });
  //     return usuarioBd;
  //   })
  //   console.log(usuariosBd)
  //   usuariosBd.concat(Array.from(addUsuarios))
  //   console.log(usuariosBd)
  //   return usuariosBd;

  // }
  llenarUsuarios(usuariosBd: Array<Usuario>) {
    let ids = this._usuarios.map(usuario => usuario.id);
    let usuariosNoactualizados = usuariosBd.filter(usuaribd => !ids.includes(usuaribd.id)||this._usuariosEliminados.includes(usuaribd.id))   
    return usuariosNoactualizados.concat(this._usuarios).sort((a, b) => a.id - b.id)

  }




  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error("----"+errorMessage)
    return throwError(errorMessage);
  }
}
