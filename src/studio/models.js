import * as THREE from 'three';

// Shared scene infrastructure, three independently constructed models.
export function createModel(kind, group) {
  const resources = [];
  const keep = value => { resources.push(value); return value; };
  const material = (color, metalness = .7) => keep(new THREE.MeshPhysicalMaterial({
    color, metalness, roughness: .19, clearcoat: 1, clearcoatRoughness: .1,
  }));
  const lime = material('#d5ff35');
  const pink = material('#ff248e');
  const violet = material('#7447ff');
  const chrome = material('#e4dfff', .95);
  let update;

  if (kind === 'reactor') {
    const core = new THREE.Mesh(keep(new THREE.IcosahedronGeometry(.76, 0)), pink);
    group.add(core);
    const rings = [];
    for (let i = 0; i < 3; i++) {
      const pivot = new THREE.Group();
      const radius = 1.25 + i * .39;
      const ring = new THREE.Mesh(keep(new THREE.TorusGeometry(radius, .065, 10, 72)), [lime, violet, chrome][i]);
      pivot.add(ring);
      const node = new THREE.Mesh(keep(new THREE.OctahedronGeometry(.17)), pink);
      node.position.x = radius;
      pivot.add(node);
      group.add(pivot);
      rings.push(pivot);
    }
    update = (time, spread) => {
      core.rotation.set(time * .25, time * .4, .2);
      core.scale.setScalar(1 + spread * .3);
      rings.forEach((ring, i) => {
        ring.rotation.set(i * .9 + time * (.12 + i * .04), i * .65 + time * .2, time * .1);
        ring.scale.setScalar(1 + spread * (.12 + i * .08));
      });
    };
  } else if (kind === 'bloom') {
    const crystal = keep(new THREE.OctahedronGeometry(.55, 0));
    const petals = [];
    const count = 22;
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const angle = i * Math.PI * (3 - Math.sqrt(5));
      const direction = new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      const petal = new THREE.Mesh(crystal, [pink, violet, chrome, lime][i % 4]);
      petal.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      petal.scale.set(.68, 1.7, .68);
      group.add(petal);
      petals.push({ petal, direction, i });
    }
    const core = new THREE.Mesh(keep(new THREE.IcosahedronGeometry(.65, 1)), violet);
    group.add(core);
    update = (time, spread) => {
      petals.forEach(({ petal, direction, i }) => {
        petal.position.copy(direction).multiplyScalar(.95 + spread * .75 + Math.sin(time * .8 + i * .35) * .08);
        petal.scale.y = 1.7 + Math.sin(time + i * .2) * .12;
      });
      core.rotation.y = time * .25;
    };
  } else {
    const geometry = keep(new THREE.BoxGeometry(2.7, .115, 1.7));
    const layers = [];
    for (let i = 0; i < 34; i++) {
      const block = new THREE.Mesh(geometry, i < 12 ? pink : i < 23 ? violet : lime);
      group.add(block);
      layers.push({ block, y: (i - 16.5) * .14, angle: i * .13 });
    }
    update = (time, spread) => layers.forEach(({ block, y, angle }, i) => {
      block.position.set(Math.sin(angle) * spread * .75, y * (1 + spread * .5), 0);
      block.rotation.y = angle + Math.sin(time * .6 + i * .1) * .18 + spread * angle * .3;
    });
  }
  update(0, 0);
  return { update, dispose: () => resources.forEach(resource => resource.dispose()) };
}
