import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, throwError, zip } from 'rxjs';
import { catchError, finalize, map, switchMap, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService implements OnInit,OnDestroy{

  public _usuariosSubjet: BehaviorSubject<Array<Usuario>> = new BehaviorSubject<Array<Usuario>>([]);
  public _usuariosEliminadosSubjet: BehaviorSubject<Array<number>> = new BehaviorSubject<Array<number>>([]);
  public usuario$: Observable<Array<Usuario>>;
  public usuariosEliminados$: Observable<Array<number>>;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) {
    this.usuario$ = this._usuariosSubjet.asObservable().pipe();//para no llenar memoria
    this.usuariosEliminados$ = this._usuariosEliminadosSubjet.asObservable().pipe();
    this.updateDatos();
   
  }

  ngOnInit(): void {
    console.log("inicio")    
     
  }
  ngOnDestroy() {
    console.log("destrosado")

  }

  public addObservableUsuario(users: Array<Usuario>) {    
    this._usuariosSubjet.next(users);
  }
  public addObservableUsuarioEliminado(ids: Array<number>) {
    this._usuariosEliminadosSubjet.next(ids);
  }


  public getUsuariosBd() {
    this.http.get<Array<Usuario>>(
      `${environment.apiUrl}users`
    ).pipe(
      catchError(this.errorHandler)
    ).subscribe(usuarios => { this.addObservableUsuario(usuarios) });
  }

  // public getUsuario(id: number) {
  //   return this.http.get<Usuario>(
  //     `${environment.apiUrl}users/${id}`
  //   ).pipe(
  //     map(usuarioBd => {
  //       let usuarioLocal = this._usuarios.find(usuario => usuario.id == id);
  //       return usuarioLocal ? usuarioLocal : usuarioBd;
  //     }
  //     ), catchError(this.errorHandler)
  //   );
  // }
  public deleteUsuario(id: number) {
    return this.http.delete<any>(
      `${environment.apiUrl}users/${id}`
    ).pipe(
      map(usuarioBd => {
        this.usuariosEliminados$.subscribe(ids=>{
          ids.push(id)          
        this.addObservableUsuarioEliminado(ids);
        })
        this.usuario$.subscribe(usuarios=>{
          let newUsuarios= usuarios.filter((usuario:Usuario)=>usuario.id!=id)
          this.addObservableUsuario(newUsuarios);
        })
        return usuarioBd;
      }
      ), catchError(this.errorHandler)
    );
  }

  // public agregarUsuario(usuarioAdd: Usuario) {

  //   return this.http.post<Usuario>(
  //     `${environment.apiUrl}users`, JSON.stringify(usuarioAdd), this.httpOptions
  //   ).pipe(map((usuario) => {
  //     this._usuarios.push(usuario);
  //     console.log(this._usuarios)
  //     return usuario;
  //   }), catchError(this.errorHandler))


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

  // }

  // public updateUsuario(usuarioUpdate: Usuario) {

  //   return this.http.put<any>(
  //     `${environment.apiUrl}users/${usuarioUpdate.id}`, JSON.stringify(usuarioUpdate), this.httpOptions
  //   ).pipe(
  //     map(usuarioBd => {
  //       let index = this._usuarios.findIndex(usuario => usuario.id != usuarioUpdate.id);
  //       this._usuarios[index] = usuarioUpdate;
  //       return usuarioBd;
  //     }
  //     ), catchError(this.errorHandler)
  //   );
  // }



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

  updateDatos() {
    let usuarios: Array<Usuario> = [];
    forkJoin(this.usuario$, this.usuariosEliminados$).subscribe((rpta) => {      
      usuarios = rpta[0].filter((usuario:Usuario)=>!rpta[1].includes(usuario.id))    
      console.log(usuarios)
      this.addObservableUsuario(usuarios);
    })

  }


  // maxValorId() {
  //   return of(this._usuarios.reduce((n, m) => Math.max(n, m.id), 0));
  // }

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
