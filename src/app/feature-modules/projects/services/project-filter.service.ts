import { Injectable } from '@angular/core';
import { Filter } from 'src/app/core/model/common/filter';
import { ArrayFilter } from 'src/app/core/model/common/array-filter';

@Injectable({
    providedIn: 'root'
})

export class ProjectFilterService {

    // TPN Filter section
    updateTpnFilter(tpnFilter, filterInput) {
        this.updateFilter(tpnFilter, filterInput, this.isValidTpn);
    }

    // Colony Name Filter section
    updateColonyNameFilter(colonyNameFilter, filterInput) {
        this.updateFilter(colonyNameFilter, filterInput, this.isValidColonyName);
    }

    isValidColonyName(value: string, currentFilterValue): boolean {
        const MINIMUN_SIZE = 3;
        let result = false;
        if (value) {
            result = value.length > MINIMUN_SIZE && value.trim() !== currentFilterValue;
        }
        return result;
    }

    // Phenotyping External Reference Filter section
    updatePhenotypingExternalReflFilter(phenotypingExternalRefFilter, filterInput) {
        this.updateFilter(phenotypingExternalRefFilter, filterInput, this.isValidPhenotypingExternalRef);
    }

    isValidPhenotypingExternalRef(value: string, currentFilterValue): boolean {
        const MINIMUN_SIZE = 3;
        let result = false;
        if (value) {
            result = value.length > MINIMUN_SIZE && value.trim() !== currentFilterValue;
        }
        return result;
    }

    // Marker Symbol Filter section
    updateMarkerSymbolFilter(markerSymboFilter, filterInput) {
        this.updateFilter(markerSymboFilter, filterInput, this.isValidMarkerSymbol);
    }

    isValidMarkerSymbol(value: string, currentFilterValue): boolean {
        const MINIMUN_SIZE = 3;
        let result = false;
        if (value) {
            result = value.length > MINIMUN_SIZE && value.trim() !== currentFilterValue;
        }
        return result;
    }

    // Intentions Filter section
    updateIntentionsFilter(intentionFilter: ArrayFilter, filterInput) {
        this.updateArrayFilter(intentionFilter, filterInput, (a, b) => true);
    }

    // Privacies Filter section
    updatePrivaciesFilter(privaciesFilter: ArrayFilter, filterInput) {
        this.updateArrayFilter(privaciesFilter, filterInput, (a, b) => true);
    }

    // Assignment Status Filter section
    updateAssignmentStatusesFilter(assigmentStatusesFilter: ArrayFilter, filterInput) {
        this.updateArrayFilter(assigmentStatusesFilter, filterInput, (a, b) => true);
    }

    private updateFilter = (filter: Filter, input, validator) => {
        if (input === '' || validator(input, filter.value)) {
            filter.value = input.trim();
        }
    };

    private updateArrayFilter = (filter: ArrayFilter, input, validator) => {
        if (input === '' || validator(input, filter.values)) {
            filter.values = input;
        }
    };

    private isValidTpn = (value: string, currentFilterValue): boolean => {
        const MINIMUN_SIZE = 7;
        let result = false;
        if (value) {
            result = value.toLocaleLowerCase().startsWith('tpn:') && value.length > MINIMUN_SIZE && value !== currentFilterValue;
        }
        return result;
    };
}
