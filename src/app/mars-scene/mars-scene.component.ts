import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { beforeRender, extend, NgtArgs, NgtVector3 } from 'angular-three';
import {
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshBasicMaterialParameters,
  SphereGeometry,
} from 'three';

extend({ Color, Mesh, SphereGeometry, MeshBasicMaterial });

/**
 * - `CUSTOM_ELEMENTS_SCHEMA` is required to use Angular Three components.
 */
@Component({
  selector: 'sms-mars-scene',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  //   standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtArgs],
  template: `
    <ngt-color attach="background" *args="['#303030']" />

    <ngt-mesh #sphereMeshRef [position]="meshPosition()">
      <ngt-sphere-geometry
        *args="sphereGeoArgs"
        (attached)="onAttachSphere($event)"
      />

      <ngt-mesh-basic-material [parameters]="meshMatParams" />
    </ngt-mesh>
  `,
})
export class MarsScene {
  protected meshPosition = input<NgtVector3>(0);
  protected meshMatParams: MeshBasicMaterialParameters = {
    color: '#bd5417',
    wireframe: false,
  };

  protected sphereGeoArgs: ConstructorParameters<typeof SphereGeometry> = [
    8, 64, 64,
  ];

  /** Obtain the mesh reference with `viewChild` signal. */
  sphereMeshRef = viewChild.required<ElementRef<Mesh>>('sphereMeshRef');

  onAttachSphere({ node, parent }: { node: SphereGeometry; parent: Mesh }) {
    console.log('Sphere node: ', node);
    console.log('Parent: ', parent);
  }

  /** Add the animation to the Three-js loop with `beforeRender` */
  constructor() {
    beforeRender(() => {
      this.animateSphere();
    });
  }

  /**
   * Perform all animation related configurations here.
   */
  private animateSphere() {
    const sphereMeshEl = this.sphereMeshRef().nativeElement;
    sphereMeshEl.rotateX(0.0005);
    sphereMeshEl.rotateY(0.005);
  }
}
