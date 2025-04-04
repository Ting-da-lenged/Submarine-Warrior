import { inventory, addToInventory, renderInventory } from './inventory.js';
import { closeOverlay } from './ui.js'; 

// craft.js

export const recipes = {
  "章鱼吸盘手套": {
    图标: "🧤",
    主材料: { "章鱼身体": 1 },
    附加材料: { "章鱼吸盘": 2 },
    属性模板: {
      攻击: [2, 4, 6, 8, 10],       // 对应等级从低到高的攻击值
      命中率: ["2%", "3%", "5%", "7%", "10%"]
    },
    描述: "提升近战攻击力与命中率",
    部位: "鳍"
  },
  "墨汁伪装背鳍": {
    图标: "🎽",
    主材料: { "章鱼身体": 1 },
    附加材料: { "章鱼吸盘": 1, "章鱼墨囊": 1 },
    属性: { 防御: 3, 闪避率: "10%" },
    描述: "有几率闪避敌人攻击",
    部位: "背"
  },
  "闪壳头盔": {
    图标: "⚡",
    主材料: { "电虾外壳": 1 },
    附加材料: {},
    属性: { 防御: 4, 抗眩晕率: "5%" },
    描述: "由电刺虾壳制成，可缓解电击",
    部位: "头"
  },
  "反弹护胸": {
    图标: "🪬",
    主材料: { "电虾外壳": 1 },
    附加材料: { "电壳碎片": 1, "弹跳触须": 1 },
    属性: { 攻击: 3, 反击率: "8%" },
    描述: "触须改造而成，可反弹部分伤害",
    部位: "腹"
  },
  "魇能头壳": {
    图标: "👹",
    主材料: { "魔魇头骨": 1 },
    附加材料: { "魇能鳞片": 3 },
    属性: { 防御: 8 },
    描述: "源自魔魇鱼额骨，带有压迫气场",
    部位: "头"
  },
  "影鳃过滤腮": {
    图标: "🌫️",
    主材料: { "魔魇腮": 1 },
    附加材料: { "影腮晶核": 2 },
    属性: { 闪避率: "15%" },
    描述: "可过滤毒素与梦魇能量",
    部位: "鳃"
  },
  "魇尾冲刺器": {
    图标: "🚀",
    主材料: { "魔魇尾": 1 },
    附加材料: { "魇能鳞片": 1, "触魇触手": 2 },
    属性: { 速度: 6 },
    描述: "增强瞬时推进力",
    部位: "尾"
  },
  "魔鳞战甲": {
    图标: "🛡️",
    主材料: { "魔魇腹甲": 1 },
    附加材料: { "魇能鳞片": 3, "触魇触手": 1 },
    属性: { 防御: 10 },
    描述: "厚重魔鳞打造，坚不可摧",
    部位: "腹"
  },
  "触魇斩鳍": {
    图标: "🗡️",
    主材料: { "魔魇鳍": 1 },
    附加材料: { "触魇触手": 3 },
    属性: { 攻击: 10, 命中率: "20%" },
    描述: "具有精神穿透力的攻击鳍",
    部位: "鳍"
  },
  "暗影披鳍": {
    图标: "🩳",
    主材料: { "魔魇背鳍": 1 },
    附加材料: { "魇能鳞片": 1, "影腮晶核": 1 },
    属性: { 闪避率: "10%", 速度: 3 },
    描述: "可令身形模糊不清",
    部位: "背"
  }
};

const 等级顺序 = ["完美", "优秀", "良好", "普通", "劣质"];

export function openCraftSelectUI(itemName) {
  const recipe = recipes[itemName];
  const container = document.getElementById('craft-select-content');
  container.innerHTML = '';

  const mainMaterialName = Object.keys(recipe.主材料)[0];
  const candidates = Object.values(inventory)
    .filter(i => i.名称 === mainMaterialName && i.等级)
    .sort((a, b) => 等级顺序.indexOf(a.等级) - 等级顺序.indexOf(b.等级));

  if (candidates.length === 0) {
    container.innerHTML = `<p>你没有任何 ${mainMaterialName} 可用于合成。</p>`;
    return;
  }

  candidates.forEach((item) => {
    const btn = document.createElement('button');
    btn.className = 'craft-grade-button';
    btn.innerText = `使用【${item.等级}】${item.名称}（x${item.数量}）合成`;
    btn.onclick = () => {
      tryCraft(itemName, item.等级);
      closeOverlay('craft-select');
    };
    container.appendChild(btn);
  });

  document.getElementById('craft-select-title').innerText = `选择 ${mainMaterialName} 等级来合成：${itemName}`;
  document.getElementById('craft-select-overlay').style.display = 'flex';
}



export function tryCraft(equipName, 等级) {
  const recipe = recipes[equipName];
  if (!recipe) return;

  const mainMatName = Object.keys(recipe.主材料)[0];
  const mainMatCount = recipe.主材料[mainMatName];
  const mainKey = `${等级}|${mainMatName}`;

  if (!inventory[mainKey] || inventory[mainKey].数量 < mainMatCount) {
    alert(`❌ 缺少主材料：${等级} ${mainMatName}`);
    return;
  }

  for (const mat in recipe.附加材料) {
    const required = recipe.附加材料[mat];
    const total = Object.values(inventory).filter(i => i.名称 === mat).reduce((s, i) => s + i.数量, 0);
    if (total < required) {
      alert(`❌ 缺少附加材料：${mat}`);
      return;
    }
  }

  // 扣除主材料
  inventory[mainKey].数量 -= mainMatCount;
  if (inventory[mainKey].数量 <= 0) delete inventory[mainKey];

  // 扣除附加材料
  for (const mat in recipe.附加材料) {
    let remaining = recipe.附加材料[mat];
    for (const key in inventory) {
      if (inventory[key].名称 === mat) {
        const take = Math.min(remaining, inventory[key].数量);
        inventory[key].数量 -= take;
        if (inventory[key].数量 <= 0) delete inventory[key];
        remaining -= take;
        if (remaining <= 0) break;
      }
    }
  }

  // 添加装备
  addToInventory([{ 名称: equipName, 等级 }]);
  alert(`✅ 合成成功：${等级} ${equipName}！`);
  renderInventory();
  closeOverlay('craft');
}
