import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutModule }  from './layout/layout.module';
import { AppRoutingModule } from './app.routes';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    LayoutModule,
    AppRoutingModule,
    // HttpClientModule, Material, FormsModule... según necesites
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
