import { Routes, provideRouter } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { CrearColaboradorComponent } from './components/crear-colaborador/crear-colaborador.component';
import {CrearProveedorComponent} from "./components/crear-proveedor/crear-proveedor.component";
import {PerfilProveedorComponent} from "./components/perfil-proveedor/perfil-proveedor.component";
import {CrearMaterialComponent} from "./components/crear-material/crear-material.component";
import {CrearServicioComponent} from "./components/crear-servicio/crear-servicio.component";
import {CrearOfertaComponent} from "./components/crear-oferta/crear-oferta.component";
import {MaterialComponent} from "./components/material/material.component";
import {ServicioComponent} from "./components/servicio/servicio.component";
import {OfertaComponent} from "./components/oferta/oferta.component";
import {UsuariosComponent} from "./components/usuarios/usuarios.component";
import {MaterialesComponent} from "./components/materiales/materiales.component";
import {ServiciosComponent} from "./components/servicios/servicios.component";
import {CrearObraComponent} from "./components/crear-obra/crear-obra.component";
import {ObraComponent} from "./components/obra/obra.component";
import {CrearPresupuestoComponent} from "./components/crear-presupuesto/crear-presupuesto.component";
import {PresupuestoComponent} from "./components/presupuesto/presupuesto.component";
import {SolicitudCompraComponent} from "./components/solicitud-compra/solicitud-compra.component";
import {SolicitudesComponent} from "./components/solicitudes/solicitudes.component";
import {PresupuestoServicioComponent} from "./components/presupuesto-servicio/presupuesto-servicio.component";
import {CrearTareaComponent} from "./components/crear-tarea/crear-tarea.component";
import {CompraComponent} from "./components/compra/compra.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'perfil/:id', component: PerfilComponent },
  { path: 'crear-colaborador', component: CrearColaboradorComponent },
  { path: 'crear-proveedor', component: CrearProveedorComponent },
  { path: 'proveedor/:id', component: PerfilProveedorComponent },
  { path: 'crear-material/:id', component: CrearMaterialComponent },
  { path: 'crear-servicio/:id', component: CrearServicioComponent },
  { path: 'crear-oferta/:id', component: CrearOfertaComponent },
  { path: 'proveedor/:id', component: PerfilProveedorComponent },
  { path: 'material/:id', component: MaterialComponent },
  { path: 'servicio/:id', component: ServicioComponent },
  { path: 'oferta/:id', component: OfertaComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'materiales', component: MaterialesComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'crear-obra', component: CrearObraComponent },
  { path: 'obra/:id', component: ObraComponent },
  { path: 'crear-presupuesto', component: CrearPresupuestoComponent },
  { path: 'presupuestos/:id', component: PresupuestoComponent },
  { path: 'solicitud-compra', component: SolicitudCompraComponent },
  { path: 'solicitudes', component: SolicitudesComponent },
  { path: 'solicitud-servicio', component: PresupuestoServicioComponent },
  { path: 'crear-tarea', component: CrearTareaComponent },
  { path: 'compra/:id', component: CompraComponent },
];

export const routerProviders = [provideRouter(routes)];

