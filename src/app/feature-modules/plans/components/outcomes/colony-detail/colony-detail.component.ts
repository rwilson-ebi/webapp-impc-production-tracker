import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Colony } from '../../../model/outcomes/colony';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { InputHandlerService } from 'src/app/core/services/input-handler.service';

@Component({
  selector: 'app-colony-detail',
  templateUrl: './colony-detail.component.html',
  styleUrls: ['./colony-detail.component.css']
})
export class ColonyDetailComponent implements OnInit {
  @Input() colony: Colony;
  @Input() canUpdate: boolean;
  @Input() isNew: boolean;

  colonyForm: FormGroup;

  backGroundStrains: NamedValue[];

  configurationData: ConfigurationData;

  constructor(
    private formBuilder: FormBuilder,
    private configurationDataService: ConfigurationDataService,
    private inputHandlerService: InputHandlerService) { }

  ngOnInit(): void {
    this.loadConfigurationData();
    this.colonyForm = this.formBuilder.group({
      name: [''],
    });
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.backGroundStrains = this.configurationData.backgroundStrains.map(x => ({ name: x }));
    });
  }

  onCommentChanged(e) {
    this.colony.genotypingComment = this.inputHandlerService.getValueOrNull(e.target.value);
  }

}
