import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import 'zone.js'

import { AppModuleNgFactory } from './app/app.module.ngfactory';

enableProdMode();

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
