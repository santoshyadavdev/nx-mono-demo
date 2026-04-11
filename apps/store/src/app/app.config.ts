import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { productReducer, cartReducer } from '@nx-ecom-app/data-access';
import * as productEffects from '@nx-ecom-app/data-access';
import * as cartEffects from '@nx-ecom-app/data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    provideStore({
      products: productReducer,
      cart: cartReducer,
    }),
    provideEffects({
      loadProducts$: productEffects.loadProducts$,
      loadProduct$: productEffects.loadProduct$,
      loadCart$: cartEffects.loadCart$,
      apiAddItem$: cartEffects.apiAddItem$,
      apiRemoveItem$: cartEffects.apiRemoveItem$,
      apiUpdateItem$: cartEffects.apiUpdateItem$,
      apiClearCart$: cartEffects.apiClearCart$,
    }),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ],
};
