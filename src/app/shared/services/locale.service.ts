import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BreakthroughMapping,
  type BreakthroughId,
  type BreakthroughLocaleSchema,
  type BreakthroughName,
  type BreakthroughSourceLocaleSchema,
} from '../schemas';
import { forkJoin, map, tap } from 'rxjs';
import Papa from 'papaparse';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly httpClient = inject(HttpClient);

  private readonly _localeBreakName$ = this.httpClient
    .get('./data/locale/bt_names.csv', {
      responseType: 'text',
    })
    .pipe(
      map((csvData) => this.parseCSV<BreakthroughSourceLocaleSchema>(csvData)),
      // tap((data) => (this._localeNames = data)),
    );
  private readonly _localeBreakDesc$ = this.httpClient
    .get('./data/locale/bt_desc.csv', { responseType: 'text' })
    .pipe(
      map((csvData) => this.parseCSV<BreakthroughSourceLocaleSchema>(csvData)),
      // tap((data) => (this._localeDesc = data)),
    );

  initializeLocaleData() {
    return forkJoin([this._localeBreakName$, this._localeBreakDesc$]).pipe(
      tap(([localeNames, LocaleDesc]) => {
        this.mapBreakthroughLocale({ names: localeNames, desc: LocaleDesc });
      }),
    );
  }

  // private _localeNames: BreakthroughSourceLocaleSchema[] = [];
  // private _localeDesc: BreakthroughSourceLocaleSchema[] = [];

  private _breakthroughLocales!: Record<
    BreakthroughId,
    BreakthroughLocaleSchema
  >;

  getAllBreakthroughLocales() {
    return this._breakthroughLocales;
  }

  getBreakthroughLocale(name: BreakthroughName) {
    /** Just in case we pass it without trimming. */
    const cleanName = name.trim() as BreakthroughName;
    const brId = BreakthroughMapping[cleanName];
    return this._breakthroughLocales[brId];
  }

  /**
   * Inspired by the following code:
   *
   * https://github.com/Ocelloid/surviving-maps-3d/blob/5f25cb365e5d6ba7b9482038580c11762890e197/src/app/_components/admin/Breakthroughs.tsx#L42
   *
   * @param str
   * @returns
   */
  private removeStyling = (str: string) => {
    return str
      .replaceAll('()', '')
      .replaceAll('<color flavor>', '')
      .replaceAll('<color em>', '')
      .replaceAll('</color>', '')
      .replaceAll('<right>', '')
      .replaceAll('</right>', '')
      .replaceAll('<left>', '')
      .replaceAll('</left>', '')
      .replaceAll('<hide>', '')
      .replaceAll('</hide>', '')
      .replaceAll(' (6<image UI/Icons/res_colonist.tga 1300> )', '')
      .replaceAll('<image UI/Icons/res_water_2.tga 1300>', '')
      .replaceAll('<image UI/Icons/res_temperature.tga 1300>', '');
  };

  private mapBreakthroughLocale(config: {
    names: BreakthroughSourceLocaleSchema[];
    desc: BreakthroughSourceLocaleSchema[];
  }) {
    this._breakthroughLocales = Object.values(BreakthroughMapping).reduce(
      (dict, brId) => {
        const localeName = config.names.find((x) => x.break_id === brId);
        const localeDesc = config.desc.find((x) => x.break_id === brId);
        dict[brId] = {
          id: brId,
          name_loc: {
            en: localeName.name_en,
            br: localeName.name_br,
            fr: localeName.name_fr,
          },
          desc_loc: {
            en: this.removeStyling(localeDesc.name_en),
            br: this.removeStyling(localeDesc.name_br),
            fr: this.removeStyling(localeDesc.name_fr),
          },
        };
        return dict;
      },
      {} as Record<BreakthroughId, BreakthroughLocaleSchema>,
    );
  }

  private readonly parseCSV = <T>(csvData: string): T[] => {
    const csv = Papa.parse<T>(csvData, {
      skipEmptyLines: true,
      header: true,
      dynamicTyping: true, // Automatically convert numbers and booleans
    });
    return csv.data;
  };
}
