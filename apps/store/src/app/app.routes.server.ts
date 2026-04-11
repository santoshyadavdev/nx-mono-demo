import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'products/:id',
    renderMode: RenderMode.Server,
  },
  {
    // Routes that fetch from the API must not be prerendered
    path: '**',
    renderMode: RenderMode.Client,
  },
];
