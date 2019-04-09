import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'search-modal', loadChildren: './search-modal/search-modal.module#SearchModalPageModule' },
  { path: 'detail', loadChildren: './detail/detail.module#DetailPageModule'},
  { path: 'shop', loadChildren: './shop/shop.module#ShopPageModule'},
  { path: 'login', loadChildren: './login/login.module#LoginPageModule'},
  { path: 'editname', loadChildren: './editname/editname.module#EditnamePageModule'},
  { path: 'collect', loadChildren: './collect/collect.module#CollectPageModule'},
  { path: 'chat', loadChildren: './chat/chat.module#ChatPageModule'},
  { path: 'home', loadChildren: './home/home.module#HomePageModule'},
  { path: 'session', loadChildren: './session/session.module#SessionPageModule'},
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
