import {Component, OnInit} from '@angular/core';
import { SelectItem } from 'primeng/api';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'web-production-tracker';
  configLoaded = false;
  appConfigPath = '/assets/appConfig.json';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRuntimeDependencies();
  }

  private loadRuntimeDependencies(){
    setTimeout(() => {
      this.http.get(this.appConfigPath)
        .subscribe((config: JSON) => {
          this.overrideStaticConfiguration(config);
          this.configLoaded = true;
        });
    }, 5000);
  }

  private configMissingErrorHandler(error: Response | any){
    console.warn('runtime config warning');
    this.configLoaded = true;
    return Observable.prototype;
  }

  private overrideStaticConfiguration(configObject: JSON) {
    const key = 'apiRootUrl';
    if (configObject[ key ] === '${API_URL}') {
      console.log('Empty API_ROOT_URL ');
    } else {
      environment.baseUrl = configObject[key];
    }
  }
}
