import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

export enum GameIcons {
  DUST_DEVIL = 'DUST_DEVIL',
  METEOR_SHOWER = 'METEOR_SHOWER',
  DUST_STORM = 'DUST_STORM',
  COLD_WAVE = 'COLD_WAVE',
  RES_WATER = 'RES_WATER',
  RES_CONCRETE = 'RES_CONCRETE',
  RES_METAL = 'RES_METAL',
  RES_RARE_METAL = 'RES_RARE_METAL',
}

const GameAssetIcons: Record<GameIcons, { desc: string; url: string }> = {
  [GameIcons.DUST_DEVIL]: {
    desc: 'dust devil',
    url: './icons/disasters/dust_devil.png',
  },
  [GameIcons.METEOR_SHOWER]: {
    desc: 'meteor shower',
    url: './icons/disasters/meteor_storm.png',
  },
  [GameIcons.DUST_STORM]: {
    desc: 'dust storm',
    url: './icons/disasters/dust_storm.png',
  },
  [GameIcons.COLD_WAVE]: {
    desc: 'cold wave',
    url: './icons/disasters/cold_wave.png',
  },
  [GameIcons.RES_WATER]: {
    desc: 'Water',
    // url: './icons/resources/res_water.png',
    // url: './icons/resources/deposit_water.png',
    url: './icons/resources/deposit_decal_water.png',
  },
  [GameIcons.RES_CONCRETE]: {
    desc: 'Concrete',
    // url: './icons/resources/res_concrete.png',
    // url: './icons/resources/deposit_concrete.png',
    url: './icons/resources/deposit_decal_concrete.png',
  },
  [GameIcons.RES_METAL]: {
    desc: 'Metals',
    // url: './icons/resources/res_metal.png',
    // url: './icons/resources/deposit_subsurface_metals.png',
    url: './icons/resources/deposit_decal_metals.png',
  },
  [GameIcons.RES_RARE_METAL]: {
    desc: 'Rare Metals',
    // url: './icons/resources/res_precious_metals.png',
    // url: './icons/resources/deposit_rare_metals.png',
    url: './icons/resources/deposit_decal_rare_metals.png',
  },
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
        />
        <span class="ml-2 font-medium">{{ value() }}</span>
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
      case GameIcons.RES_CONCRETE:
        this.icon.set(GameAssetIcons.RES_CONCRETE);
        break;
      case GameIcons.RES_WATER:
        this.icon.set(GameAssetIcons.RES_WATER);
        break;
      case GameIcons.RES_METAL:
        this.icon.set(GameAssetIcons.RES_METAL);
        break;
      case GameIcons.RES_RARE_METAL:
        this.icon.set(GameAssetIcons.RES_RARE_METAL);
        break;
      default:
        break;
    }
    return true;
  }
}
