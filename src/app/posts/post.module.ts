import { AngularMaterialModule } from './../angular-material.module';
import { AppRoutingModule } from './../app-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';

@NgModule({
  declarations: [
    PostCreateComponent,
    PostListComponent
  ],
  imports: [
    ReactiveFormsModule,
    AppRoutingModule,
    CommonModule,
    AngularMaterialModule

  ]
})
export class PostModule{

}
