import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

export enum GameIcons {
  DUST_DEVIL = 'DUST_DEVIL',
  METEOR_SHOWER = 'METEOR_SHOWER',
  DUST_STORM = 'DUST_STORM',
  COLD_WAVE = 'COLD_WAVE',
}

const GameAssetIcons = {
  /** */
  DUST_DEVIL: { desc: 'dust devil', url: './icons/disasters/dust_devil.png' },
  METEOR_SHOWER: {
    desc: 'meteor shower',
    url: './icons/disasters/meteor_storm.png',
  },
  DUST_STORM: { desc: 'dust storm', url: './icons/disasters/dust_storm.png' },
  COLD_WAVE: { desc: 'cold wave', url: './icons/disasters/cold_wave.png' },
};

@Component({
  selector: 'sms-resource-icon-renderer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <div class="resource-icon">
      @if (value()) {
        <img
          [alt]="icon().desc"
          [src]="icon().url"
          [height]="24"
          :class="logo"
        />
        <span>{{ value() }}</span>
      }
    </div>
  `,
})
export class ResourceIconRenderer implements ICellRendererAngularComp {
  value = signal<number>(null);
  icon = signal({ url: '', desc: '' });

  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.value.set(params.value);
    switch (params.colDef.context.iconName as GameIcons) {
      case GameIcons.METEOR_SHOWER:
        this.icon.set(GameAssetIcons.METEOR_SHOWER);
        break;
      case GameIcons.DUST_DEVIL:
        this.icon.set(GameAssetIcons.DUST_DEVIL);
        break;
      case GameIcons.DUST_STORM:
        this.icon.set(GameAssetIcons.DUST_STORM);
        break;
      case GameIcons.COLD_WAVE:
        this.icon.set(GameAssetIcons.COLD_WAVE);
        break;
      default:
        break;
    }
    return true;
  }
}
