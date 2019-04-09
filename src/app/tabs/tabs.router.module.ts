import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'cloth',
        children: [
          {
            path: '',
            loadChildren: '../cloth/cloth.module#ClothPageModule'
          }
        ]
      },
      {
        path: 'detail',
        children: [
          {
            path: '',
            loadChildren: '../detail/detail.module#DetailPageModule'
          }
        ]
      },
      {
        path: 'dianpu',
        children: [
          {
            path: '',
            loadChildren: '../dianpu/dianpu.module#DianpuPageModule'
          }
        ]
      },
      {
        path: 'cuxiao',
        children: [
          {
            path: '',
            loadChildren: '../cuxiao/cuxiao.module#CuxiaoPageModule'
          }
        ]
      },
      {
        path: 'me',
        children: [
          {
            path: '',
            loadChildren: '../me/me.module#MePageModule'
          }
        ],
        pathMatch: 'prefix'
      },

      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: '../tab2/tab2.module#Tab2PageModule'
          }
        ],
        pathMatch: 'prefix'
      },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/cloth',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
