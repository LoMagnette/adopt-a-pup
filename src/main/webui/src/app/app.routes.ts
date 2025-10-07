import { Routes } from '@angular/router';

import {ContactComponent} from './components/contact.component';
import {HomeComponent} from './components/home.component';
import {PuppiesListComponent} from './components/puppies-list.component';
import {PuppyDetailComponent} from './components/puppy-detail.component';
import {AboutComponent} from './components/about.component';
import {AdoptionFormComponent} from './components/adoption-form.component';
import {SuccessComponent} from './components/success.component';
import {ChatComponent} from "./components/chat.component";
import {MaxiChatComponent} from "./components/maxi-chat.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'puppies', component: PuppiesListComponent },
  { path: 'puppies/:id', component: PuppyDetailComponent },
  { path: 'adopt/:id', component: MaxiChatComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' } // Redirect to home for any unknown route
];
