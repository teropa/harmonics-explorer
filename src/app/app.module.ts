import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { CurveComponent } from './curve.component';
import { PartialComponent } from './partial.component';
import { harmonicsReducer } from './harmonics';

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.provideStore(harmonicsReducer)
  ],
  declarations: [
    AppComponent,
    CurveComponent,
    PartialComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
