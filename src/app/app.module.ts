import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';

import { ColorPickerComponent } from './color-picker/color-picker.component';

@NgModule({
    declarations: [ColorPickerComponent],
    imports: [BrowserModule, ReactiveFormsModule],
    entryComponents: [ColorPickerComponent]
})
export class AppModule {
    constructor(private injector: Injector) {
        customElements.define('color-picker', createCustomElement(ColorPickerComponent, { injector }));
    }
    
    ngDoBootstrap() {}
}
