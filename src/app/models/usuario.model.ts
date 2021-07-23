export class Geo {
    lat: number;
    lng: number;
    constructor() {
        this.lat = 0;
        this.lng = 0;
    }

}
export class Company{
    name:string;
    catchPhrase:string;
    bs:string;
    constructor(){
        this.name='';
        this.catchPhrase='';
        this.bs='';
    }
}
export class Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo:Geo;
    constructor(){
        this.street='';
        this.suite='';
        this.city='';
        this.zipcode='';
        this.geo=new Geo();
    }

}

export class Usuario {
    id:number;
    name:string;
    username:string;
    email:string;
    address:Address;
    phone:string;
    website:string;
    company:Company;
    constructor() {
        this.id=0;
        this.name='';
        this.username='';
        this.email='';
        this.address=new Address();
        this.phone='';
        this.website='';
        this.company=new Company();
    }
}
export class UsuarioT{
    usuario:Usuario;
    tipo:number;//si es 1 es modificar si es 0 es agregar
  }