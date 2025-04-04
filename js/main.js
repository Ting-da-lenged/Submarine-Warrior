import {updateStatsUI,updateBattleHP,openOverlay,closeOverlay} from './ui.js';

import { startBattle } from './battle.js';
import { inventory,renderInventory,addToInventory } from './inventory.js';
import { recipes, tryCraft,openCraftSelectUI } from './craft.js';
import { equip } from './equipment.js';

window.equip = equip;
window.tryCraft = tryCraft;
window.startBattle = startBattle;
window.openCraftSelectUI = openCraftSelectUI;

window.onload = () => {
  updateStatsUI();
  renderInventory();

  document.getElementById('challenge-btn').onclick = () => {
    openOverlay('monster-select');
    //initBattle(); // 原来的战斗逻辑
  };
  
  document.getElementById('toggle-inventory-btn').onclick = () => {
    openOverlay('inventory');
    renderInventory(); // 保证刷新内容
  };


  document.getElementById('open-craft-btn').onclick = () => {
    renderCraftingUI();
    openOverlay('craft');
  };

  document.getElementById('close-battle-btn').onclick = () => closeOverlay('battle');

  document.getElementById('close-inventory-btn').onclick = () => closeOverlay('inventory');

  document.getElementById('close-craft-btn').onclick = () => closeOverlay('craft');

  document.getElementById('toggle-extra-attr-btn').onclick = () => {
    const block = document.getElementById('extra-attributes');
    const btn = document.getElementById('toggle-extra-attr-btn');
    const isHidden = block.classList.contains('hidden');
  
    if (isHidden) {
      block.classList.remove('hidden');
      btn.innerText = "▼ 收起额外属性";
    } else {
      block.classList.add('hidden');
      btn.innerText = "▶ 展开额外属性";
    }
  };
  

  addToInventory([
    { 名称: "章鱼身体", 等级: "完美" },
    { 名称: "章鱼身体", 等级: "普通" },
    { 名称: "章鱼吸盘" },
    { 名称: "章鱼吸盘" }
  ]);
};

function getTotalCountByName(itemName) {
  return Object.values(inventory)
    .filter(i => i.名称 === itemName)
    .reduce((sum, i) => sum + i.数量, 0);
}

export function renderCraftingUI() {
  const container = document.getElementById('craft-content');
  container.innerHTML = '';

  for (const name in recipes) {
    const data = recipes[name];
    const div = document.createElement('div');
    div.className = 'craft-item';

    const mainMaterialName = Object.keys(data.主材料)[0];
    const mainRequired = data.主材料[mainMaterialName];
    const mainOwned = getTotalCountByName(mainMaterialName);
    let materialText = `🔹 主材料：${mainMaterialName} x${mainRequired}（你有：${mainOwned}）\n`;
    let canCraft = mainOwned >= mainRequired;

    for (const mat in data.附加材料) {
      const required = data.附加材料[mat];
      const owned = getTotalCountByName(mat);
      materialText += `🔸 ${mat} x${required}（你有：${owned}）\n`;
      if (owned < required) canCraft = false;
    }

    let attrText = '';
    const base = recipes[name];
    if (base?.属性模板) {
      const index = 2; // 良好
      attrText = Object.entries(base.属性模板)
        .map(([k, v]) => `${k}：${v[index] || v[1]}`)
        .join('，');
    }

    div.innerHTML = `
      <strong>${data.图标} ${name}</strong><br/>
      <div><b>属性：</b>${attrText}</div>
      <div style="color:#4e342e; margin: 4px 0;">🌟 <b>特殊效果：</b>${data.描述}</div>
      <pre style="margin:5px 0;">${materialText}</pre>
      <button ${canCraft ? '' : 'disabled'} onclick="openCraftSelectUI('${name}')">合成</button>
    `;

    container.appendChild(div);
  }
}

