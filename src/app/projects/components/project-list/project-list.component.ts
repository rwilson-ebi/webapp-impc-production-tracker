import { Component, OnInit } from '@angular/core';
import { ProjectSummary, ProjectSummaryAdapter } from 'src/app/projects/model/projectSummary';
import { first } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { LoggedUserService } from 'src/app/core/services/logged-user.service';
import { ConfigurationData } from 'src/app/core/model/configuration-data';
import { ConfigurationDataService } from 'src/app/core/services/configuration-data.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: ProjectSummary[] = [];
  username: any;
  p = 1;
  page: any = {};
  loading = false;
  planTypes: SelectItem[];
  workUnits: SelectItem[];
  workGroups: SelectItem[];
  statuses: SelectItem[];
  priorities: SelectItem[];
  privacies: SelectItem[];

  workUnitFilterValues: string[] = [];
  workGroupFilterValues: string[] = [];
  planTypeFilterValues: string[] = [];
  statusFilterValues: string[] = [];
  prioritiesFilterValues: string[] = [];
  privaciesFilterValues: string[] = [];

  configurationData: ConfigurationData;

  constructor(
    private projectService: ProjectService,
    private adapter: ProjectSummaryAdapter,
    private loggedUserService: LoggedUserService,
    private configurationDataService: ConfigurationDataService) { }

  ngOnInit() {
    this.configurationData = this.configurationDataService.getConfigurationInfo();
    if (this.configurationData ) {
      this.planTypes = this.configurationData.planTypes.map(p => { return { label: p, value: p } });
      this.workGroups = this.configurationData.workGroups.map(p => { return { label: p, value: p } });
      this.workUnits = this.configurationData.workUnits.map(p => { return { label: p, value: p } });
      this.privacies = this.configurationData.privacies.map(p => { return { label: p, value: p } });
      this.priorities = this.configurationData.priorities.map(p => { return { label: p, value: p } });
      this.statuses = this.configurationData.statuses.map(p => { return { label: p, value: p } });
    }
    this.getPage(1);
  }

  getPage(pageNumber: number) {
    this.loading = true;
    // The end point starts page in number 0, while the component starts with 1.
    const apiPageNumber = pageNumber - 1;
    const workUnitNameFilter = this.getWorkUnitNameFilter();
    this.projectService.getPaginatedProjectSummariesWithFilters(
      apiPageNumber,
      [],
      workUnitNameFilter,
      this.getWorkGroupFilter(),
      this.getPlanTypeFilter(),
      this.getStatusFilter(),
      this.getPriorityFilter(),
      this.getPrivacyFilter()).pipe(first()).subscribe(data => {
        if (data['_embedded']) {
          this.projects = data['_embedded']['projectSummaryDToes'];
          this.projects = this.projects.map(x => this.adapter.adapt(x));
        } else {
          this.projects = [];
        }
        this.page = data['page'];
        this.p = pageNumber;
      });
  }

  getWorkUnitNameFilter() {
    const loggedUser = this.loggedUserService.getLoggerUser();
    let workUnitFilter = [];
    if (loggedUser) {
      if ('admin' != loggedUser.role) {
        if (loggedUser.workUnitName) {
          workUnitFilter.push(loggedUser.workUnitName);
        } else {
          console.error('The logged user does not have a defined workUnit.');
          workUnitFilter.push('---');
        }
      }
    } else {
      console.error('User must be logged into the application');
      workUnitFilter.push('---');
    }
    console.log('workUnitFilter: ', workUnitFilter);

    return workUnitFilter;
  }

  filter(e, column) {
    console.log('Filtering with ', e, 'over', column);
    switch (column) {
      case 'work_unit':
        this.workUnitFilterValues = e;
        break;
      case 'work_group':
        this.workGroupFilterValues = e;
        break;
      case 'plan_type':
        this.planTypeFilterValues = e;
        break;
      case 'status':
        this.statusFilterValues = e;
        break;
      case 'priority':
        this.prioritiesFilterValues = e;
        break;
      case 'privacy':
        this.privaciesFilterValues = e;
        break;
      default:
        console.error('invalid option', column);
    }
    this.getPage(1);
  }

  getWorkUnitFilter(): string[] {
    if (this.workUnitFilterValues.length === this.workUnits.length) {
      return [];
    } else {
      return this.workUnitFilterValues;
    }
  }

  getWorkGroupFilter(): string[] {
    if (this.workGroupFilterValues.length === this.workGroups.length) {
      return [];
    } else {
      return this.workGroupFilterValues;
    }
  }

  getPlanTypeFilter(): string[] {
    if (this.planTypeFilterValues.length === this.planTypes.length) {
      return [];
    } else {
      return this.planTypeFilterValues;
    }
  }

  getStatusFilter(): string[] {
    if (this.statusFilterValues.length === this.statuses.length) {
      return [];
    } else {
      return this.statusFilterValues;
    }
  }

  getPriorityFilter(): string[] {
    if (this.prioritiesFilterValues.length === this.priorities.length) {
      return [];
    } else {
      return this.prioritiesFilterValues;
    }
  }

  getPrivacyFilter(): string[] {
    if (this.privaciesFilterValues.length === this.privacies.length) {
      return [];
    } else {
      return this.privaciesFilterValues;
    }
  }

}
