// equipment.js
import { recipes } from './craft.js';
import { updateStatsUI } from './ui.js';
import { inventory, renderInventory } from './inventory.js';

export let equipped = {
  头: null,
  背: null,
  尾: null,
  鳍: null,
  鳃: null,
  腹: null
};

export let bonusStats = {
  攻击: 0,
  防御: 0,
  命中率: 0,
  闪避率: 0,
  速度: 0
};


export function equip(key) {
  const item = inventory[key];
  if (!item || !recipes[item.名称] || !recipes[item.名称].部位) return;

  const 部位 = recipes[item.名称].部位;
  equipped[部位] = key;

  for (let stat in bonusStats) bonusStats[stat] = 0;
  for (const slot in equipped) {
    const equipKey = equipped[slot];
    const equipItem = inventory[equipKey];
    const base = recipes[equipItem?.名称];
    if (base && base.属性模板) {
      const 等级索引 = ["劣质", "普通", "良好", "优秀", "完美"].indexOf(equipItem.等级 || '普通');
      for (const attr in base.属性模板) {
        const val = parseInt(base.属性模板[attr][等级索引]) || 0;
        if (!isNaN(val)) bonusStats[attr] += val;
      }
    }
  }

  const slotId = `equip-${部位}`;
  const slotElem = document.getElementById(slotId);
  if (slotElem) slotElem.innerText = `${item.等级 || '普通'} ${item.名称}`;

  inventory[key].数量--;
  if (inventory[key].数量 <= 0) delete inventory[key];

  updateStatsUI();
  renderInventory();
}