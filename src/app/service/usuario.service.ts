import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  public getUsuarios():Observable<Array<Usuario>> {
    return this.http.get<Array<Usuario>>(
      `${environment.apiUrl}users`
    );
  }
}
