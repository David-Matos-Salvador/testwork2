import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from "./components/main/main.component";
import { DetailComponent } from "./components/detail/detail.component";
const routes: Routes = [
  { path: '', component: MainComponent,pathMatch:'full' },
  { path:'detalle/:id',component:DetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
