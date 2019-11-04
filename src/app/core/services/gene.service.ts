import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigAssetLoaderService} from './config-asset-loader.service';
import { Gene } from '../../model/bio/gene';

@Injectable({
  providedIn: 'root'
})
export class GeneService {

  private apiServiceUrl;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
  }

  findGenesBySymbol(symbol: string) {
    return this.http.get<Gene[]>(this.apiServiceUrl + '/api/genes?symbol=' + symbol );
  }
}
