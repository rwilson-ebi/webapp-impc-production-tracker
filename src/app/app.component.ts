import {Component, OnInit} from '@angular/core';
import { SelectItem } from 'primeng/api';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';

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

  private loadRuntimeDependencies() {
    this.http.get(this.appConfigPath)
        .subscribe((config: JSON) => {
          this.overrideStaticConfiguration(config);
          this.configLoaded = true;
        }, error => {
          console.log('Error: Problem obtaining the appConfig configuration');
        });
  }

  private overrideStaticConfiguration(configObject: JSON) {
    const key = 'apiRootUrl';
    if (configObject[ key ] === '${API_URL}') {
      console.log('Empty API_ROOT_URL ');
    } else {
      environment.baseUrl = configObject[key];
      console.log(environment);
    }
  }
}
