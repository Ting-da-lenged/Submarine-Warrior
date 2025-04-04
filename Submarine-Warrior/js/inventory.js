// inventory.js
import { equip } from './equipment.js';
import { recipes } from './craft.js';
import { closeOverlay } from './ui.js';

export let inventory = {};

export function addToInventory(items) {
  items.forEach(item => {
    const key = `${item.等级 || '普通'}|${item.名称}`;
    if (!inventory[key]) {
      inventory[key] = { ...item, 数量: 1 };
    } else {
      inventory[key].数量++;
    }
  });
  renderInventory();
}

export function renderInventory() {
  const grid = document.getElementById('inventory-grid');
  grid.innerHTML = '';

  for (const key in inventory) {
    const { 名称, 等级, 数量 } = inventory[key];

    const div = document.createElement('div');
    div.className = 'inventory-item';

    let displayName = 名称;
    const isEquippable = recipes[名称] && recipes[名称].部位;

    // 所有带等级的装备或主材料都显示等级
    if (等级) {
      displayName = `${等级} ${名称}`;
    }

    div.innerHTML = `<div>📦</div><div>${displayName}</div><div>x${数量}</div>`;

    div.onclick = () => {
      if (isEquippable) {
        equip(`${等级}|${名称}`);
        alert(`你穿上了 ${等级} ${名称}`);
        closeOverlay('inventory');
      } else {
        alert(`${名称} 是材料，无法穿戴`);
      }
    };

    grid.appendChild(div);
  }
}
