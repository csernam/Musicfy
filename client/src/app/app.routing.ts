import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserEditComponent } from './components/user-edit.component';

const appRoutes: Routes = [
  { path: '', component: UserEditComponent },
  { path: 'profile', component: UserEditComponent },
  { path: '**', component: UserEditComponent }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
