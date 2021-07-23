import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario, UsuarioT } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.scss']
})
export class EdituserComponent implements OnInit {

  userForm: any;
  urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;


  constructor(private usuarioService: UsuarioService,public dialogoRef: MatDialogRef<EdituserComponent>, @Inject(MAT_DIALOG_DATA) public data: UsuarioT) { }

  ngOnInit(): void {
   
    this.llenarForm();

  }

  llenarForm() {
    this.userForm = new FormGroup({
      id:  new FormControl(this.data.usuario.id),
      name: new FormControl(this.data.usuario.name, [Validators.required, Validators.minLength(5)]),
      username: new FormControl(this.data.usuario.username, [Validators.required, Validators.minLength(4)]),
      email: new FormControl(this.data.usuario.email, [Validators.required, Validators.email]),
      address: new FormGroup({
        city: new FormControl(this.data.usuario.address.city, Validators.minLength(4)),
        street: new FormControl(this.data.usuario.address.street, Validators.minLength(4)),
        suite: new FormControl(this.data.usuario.address.suite),
        zipcode: new FormControl(this.data.usuario.address.zipcode)
      }),
      phone: new FormControl(this.data.usuario.phone),
      website: new FormControl(this.data.usuario.website, Validators.pattern(this.urlRegex)),
      company: new FormGroup({
        name: new FormControl(this.data.usuario.company.name, Validators.minLength(4)),
        catchPhrase: new FormControl(this.data.usuario.company.catchPhrase),
        bs: new FormControl(this.data.usuario.company.bs)
      })
    });
  }

  public get formControls() {
    return this.userForm.controls;
  }
  public get fCtrlsAdress() {
    return this.userForm.controls['address'];
  }
  public get fCtrlsCompany() {
    return this.userForm.controls['company'];
  }

  buttonApretar(){
    console.log(this.fCtrlsAdress.controls['city'])
  }

  submitGuardar() {
    this.dialogoRef.close({
      estado: 1,
      tipo:0,
      dato:this.userForm.value
    });
  }
  submitEditar() {
    this.dialogoRef.close({
      estado: 1,
      tipo:1,
      dato:this.userForm.value
    });
  }

  cancelar(){
    this.dialogoRef.close({
      estado: 0,
      tipo:0,
      dato:null
    });
  }

}

