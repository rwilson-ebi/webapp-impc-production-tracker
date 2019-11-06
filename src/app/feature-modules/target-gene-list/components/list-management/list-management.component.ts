import { Component, OnInit, ViewChild } from '@angular/core';
import { FileLoaderService } from 'src/app/core/services/file-loader.service';
import { Gene, TargetListElement, ConsortiumList } from 'src/app/model';
import { TargetGeneListService } from '../../services/target-gene-list.service';
import { Target } from 'src/app/model/bio/target_gene_list/gene-result';
import { ManagedListsService, LoggedUserService, PermissionsService, GeneService } from 'src/app/core';
import { EntityValues } from 'src/app/feature-modules/admin/model/entity-values';
import { MatPaginator } from '@angular/material';

export class TargetListTableRecord {
  consortiumName: string;
  targetListElement: TargetListElement;
}

@Component({
  selector: 'app-list-management',
  templateUrl: './list-management.component.html',
  styleUrls: ['./list-management.component.css']
})
export class ListManagementComponent implements OnInit {

  public dataSource: TargetListTableRecord[] = [];
  consortiumLists: ConsortiumList[];

  consortia: NamedValue[] = [];

  listsByUser: EntityValues[];
  canUpdateList: boolean;

  page: any = {};

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private fileLoaderService: FileLoaderService,
    private targetGeneListService: TargetGeneListService,
    private managedListsService: ManagedListsService,
    private loggedUserService: LoggedUserService) { }

  ngOnInit() {
    this.loadPermissions();
    this.getPage(0);
  }

  public getPage(pageNumber: number) {
    this.targetGeneListService.getAll(pageNumber).subscribe(data => {
      /* tslint:disable:no-string-literal */
      const lists = data['_embedded'].listsByConsortium;
      this.page = data['page'];
      /* tslint:enable:no-string-literal */
      this.consortiumLists = lists;
      this.getDataSource(this.consortiumLists);
    });
  }

  loadPermissions(): void {
    this.loggedUserService.getLoggerUser().subscribe(x => {
      this.canUpdateList = PermissionsService.canExecuteAction(x, PermissionsService.MANAGE_GENE_LISTS);
      if (this.canUpdateList) {
        this.managedListsService.getManagedListsByUser().subscribe(data => {
          this.listsByUser = data;
          this.initLists();
        });
      }
    });
  }

  private initLists() {
    this.consortia = this.managedListsService.getValuesByEntity(this.listsByUser, 'consortia');
  }

  private getDataSource(consortiumLists: ConsortiumList[]) {
    if (consortiumLists) {
      consortiumLists.forEach(x => {
        const consortiumName = x.consortiumName;
        const list = x.list;
        if (list) {
          list.forEach(element => {
            const targetListTableRecord: TargetListTableRecord = new TargetListTableRecord();
            targetListTableRecord.consortiumName = consortiumName;
            targetListTableRecord.targetListElement = element;
            this.dataSource.push(targetListTableRecord);
          });
        }
      });
    }
    console.log('this.dataSource', this.dataSource);
  }

  changeLists(csvRecords) {
    const mappedData = this.buildDataSourceByCsvRecords(csvRecords);
    const consortiumLists = this.buildConsortiumLists(mappedData);
    this.consortiumLists = [...consortiumLists];
    this.getDataSource(this.consortiumLists);
  }

  buildDataSourceByCsvRecords(csvRecords): Map<string, TargetListElement[]> {
    const consortiaNames = this.fileLoaderService.getRecordsByColumn(csvRecords, 'consortium');
    const targets = this.fileLoaderService.getRecordsByColumn(csvRecords, 'target(s)');
    const notes = this.fileLoaderService.getRecordsByColumn(csvRecords, 'note');

    const mappedData: Map<string, TargetListElement[]> = new Map();
    targets.forEach((item, index) => {
      const consortiumName = consortiaNames[index];
      const geneSymbols = item.split(',');
      const note = notes[index];
      const targetListElement = this.buildTargetListElement(geneSymbols, note);

      if (mappedData.get(consortiumName)) {
        const consortiumData = mappedData.get(consortiumName);
        consortiumData.push(targetListElement);
      } else {
        mappedData.set(consortiumName, [targetListElement]);
      }
    });
    return mappedData;
  }

  buildTargetListElement(geneSymbols: string[], note) {
    const targetListElement: TargetListElement = new TargetListElement();
    const genes: Gene[] = [];
    if (geneSymbols) {
      geneSymbols.map(x => {
        const gene = new Gene();
        gene.symbol = x;
        genes.push(gene);
      });
    }
    const genesResults: Target[] = genes.map(x => ({ gene: x }));
    targetListElement.targets = genesResults;
    targetListElement.note = note;
    return targetListElement;
  }

  buildConsortiumLists(mappedData: Map<string, TargetListElement[]>): ConsortiumList[] {
    const consortiumLists: ConsortiumList[] = [];
    mappedData.forEach((value, key) => {
      const consortiumList: ConsortiumList = new ConsortiumList();
      consortiumList.consortiumName = key;
      consortiumList.list = value;
      consortiumLists.push(consortiumList);
    });
    return consortiumLists;
  }

  public getGenesSymbols(targetListTableRecord: TargetListTableRecord): string[] {
    const targetsByRecord: Target[] = targetListTableRecord.targetListElement.targets;
    return targetsByRecord.map(x => x.gene.symbol);
  }

  updateLists() {
    console.log('to be implemented');
  }

}
