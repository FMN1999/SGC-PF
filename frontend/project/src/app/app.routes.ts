import { Routes, provideRouter } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { CrearColaboradorComponent } from './components/crear-colaborador/crear-colaborador.component';
import {CrearProveedorComponent} from "./components/crear-proveedor/crear-proveedor.component";
import {PerfilProveedorComponent} from "./components/perfil-proveedor/perfil-proveedor.component";
import {CrearMaterialComponent} from "./components/crear-material/crear-material.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'crear-colaborador', component: CrearColaboradorComponent },
  { path: 'crear-proveedor', component: CrearProveedorComponent },
  { path: 'proveedor/:id', component: PerfilProveedorComponent },
  { path: 'crear-material/:id', component: CrearMaterialComponent },
];

export const routerProviders = [provideRouter(routes)];

