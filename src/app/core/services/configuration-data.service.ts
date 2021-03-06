import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationData } from '../model/conf/configuration-data';
import { ConfigAssetLoaderService } from './config-asset-loader.service';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { BASE_API_URL_TOKEN } from 'src/app/injectors';


@Injectable({
  providedIn: 'root'
})
export class ConfigurationDataService {

  private cache$: Observable<ConfigurationData>;
  private apiServiceUrl;

  constructor(
    @Inject(BASE_API_URL_TOKEN) public baseUrl: string,
    private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
    if (this.apiServiceUrl === undefined) {
      this.apiServiceUrl = baseUrl;
    }
  }

  public getConfigurationData() {
    if (!this.cache$) {
      this.cache$ = this.fetchConf().pipe(
        shareReplay(1)
      );
    }
    return this.cache$;
  }

  private fetchConf() {
    return this.http.get<ConfigurationData>(this.apiServiceUrl + '/api/conf');
  }
}
