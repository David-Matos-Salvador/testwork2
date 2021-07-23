import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, throwError, zip } from 'rxjs';
import { catchError, finalize, map, switchMap, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService implements OnInit, OnDestroy {

  public _usuarios: Array<Usuario> = [];
  public _usuariosEliminados: Array<number> = [];

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    console.log("inicio")

  }
  ngOnDestroy() {
    console.log("destrosado")

  }

  public getUsuariosBd() {
    if (this._usuarios.length > 0) {
      return of(this._usuarios)
    } else {
      return this.http.get<Array<Usuario>>(
        `${environment.apiUrl}users`
      ).pipe(
        map(usuarios => { this._usuarios = usuarios; return this._usuarios }),
        catchError(this.errorHandler)
      );
    }

  }

  public getUsuario(id: number) {
    if(id>10){
      return of(this._usuarios.find(usuario => usuario.id == id));
    }else{
      return this.http.get<Usuario>(
        `${environment.apiUrl}users/${id}`
      ).pipe(
        map(usuarioBd => {
          let usuarioLocal = this._usuarios.find(usuario => usuario.id == id);
          return usuarioLocal ? usuarioLocal : usuarioBd;
        }
        ), catchError(this.errorHandler)
      );
    }
  }
  public deleteUsuario(id: number) {
    return this.http.delete<any>(
      `${environment.apiUrl}users/${id}`
    ).pipe(
      map(usuarioBd => {
        this._usuarios = this._usuarios.filter((usuario: Usuario) => usuario.id != id)
        return id;
      }
      ), catchError(this.errorHandler)
    );
  }

  public agregarUsuario(usuarioAdd: Usuario) {

    return this.http.post<Usuario>(
      `${environment.apiUrl}users`, JSON.stringify(usuarioAdd), this.httpOptions
    ).pipe(map((usuario) => {
      usuario.id=this.maxValorId()+1;
      this._usuarios.push(usuario);
      console.log(this._usuarios)
      return usuario;
    }), catchError(this.errorHandler))


  //   // of(this.maxValorId()).subscribe(x=>{
  //   //
  //   // })
  //   // return of(this.maxValorId()).pipe(
  //   //   switchMap((idAnterios)=> {
  //   //     usuarioAdd.id=  idAnterios;
  //   //     return this.http.post<Usuario>(
  //   //       `${environment.apiUrl}users`, JSON.stringify(usuarioAdd), this.httpOptions
  //   //     ).pipe(catchError(this.errorHandler))
  //   //   }));

  }

  public updateUsuario(usuarioUpdate: Usuario) {
  
    return this.http.put<any>(
      `${environment.apiUrl}users/${usuarioUpdate.id}`, JSON.stringify(usuarioUpdate), this.httpOptions
    ).pipe(
      map(usuarioBd => {
        let index = this._usuarios.findIndex(usuario => usuario.id == usuarioUpdate.id);      
        this._usuarios[index] = usuarioUpdate;
        return usuarioBd;
      }
      ), catchError(this.errorHandler)
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

  // llenarUsuarios(usuariosBd: Array<Usuario>) {
  //   let ids = this._usuarios.map(usuario => usuario.id);
  //   let usuariosNoactualizados = usuariosBd.filter(usuaribd => !ids.includes(usuaribd.id)||this._usuariosEliminados.includes(usuaribd.id))   
  //   return usuariosNoactualizados.concat(this._usuarios).sort((a, b) => a.id - b.id)

  // }

  // updateDatos() {
  //   let usuarios: Array<Usuario> = [];
  //   forkJoin(this.usuario$, this.usuariosEliminados$).subscribe((rpta) => {      
  //     usuarios = rpta[0].filter((usuario:Usuario)=>!rpta[1].includes(usuario.id))    
  //     console.log(usuarios)
  //     this.addObservableUsuario(usuarios);
  //   })

  // }


  maxValorId() {
    return this._usuarios.reduce((n, m) => Math.max(n, m.id), 0);
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error("----" + errorMessage)
    return throwError(errorMessage);
  }
}
