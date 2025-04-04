// battle.js

import { addToInventory } from './inventory.js';
import { getPlayerStats, gainExp } from './player.js';
import { updateBattleHP, closeOverlay, openOverlay } from './ui.js';
import { monsters } from './monster.js';
import { skills } from './skills.js';

let playerCurrentHP = 0;
let enemyCurrentHP = 0;
let enemyMaxHP = 0;
let battleInterval = null;
let dropItems = [];
let enemyName = "";
let enemyStats = {};
let skillCooldowns = {};
let damageShield = false;
let battleEnded = false;

export function initBattle(name) {
  const monster = monsters[name];
  if (!monster) return;

  enemyName = name;
  enemyStats = monster;
  dropItems = monster.掉落;
  enemyCurrentHP = monster.生命值;
  enemyMaxHP = monster.生命值;

  const playerStats = getPlayerStats();
  playerCurrentHP = playerStats.生命值;

  skillCooldowns = {};
  damageShield = false;
  battleEnded = false;

  const log = document.getElementById('battle-log');
  log.innerText = `你遇到了 ${monster.图标} ${enemyName}（Lv.${monster.等级}）！准备战斗！`;

  updateBattleHP(playerCurrentHP, enemyCurrentHP);
  renderSkillButtons();
  //startTurn();
}

function renderSkillButtons() {
  const container = document.getElementById('skill-buttons');
  container.innerHTML = '';
  skills.forEach(skill => {
    const btn = document.createElement('button');
    const isCooling = skillCooldowns[skill.名称] > 0;
    btn.innerText = isCooling ? `${skill.名称} (${skillCooldowns[skill.名称]})` : skill.名称;
    btn.disabled = isCooling;
    btn.onclick = () => useSkill(skill);
    container.appendChild(btn);
  });
}

function useSkill(skill) {
  if (battleEnded) return;

  const log = document.getElementById('battle-log');
  const playerStats = getPlayerStats();

  log.innerText += `\n你使用了技能「${skill.名称}」！`;

  if (skill.类型 === "攻击") {
    const value = skill.执行({ atk: playerStats.攻击, def: enemyStats.防御 });
    enemyCurrentHP = Math.max(0, enemyCurrentHP - value);
    log.innerText += `\n造成了 ${value} 点伤害！`;
    updateBattleHP(playerCurrentHP, enemyCurrentHP);
  } else if (skill.类型 === "防御") {
    damageShield = true;
    log.innerText += `\n你获得了泡泡护盾，减少下次伤害。`;
  } else if (skill.类型 === "干扰") {
    log.innerText += `\n你释放了干扰技能（效果待实现）`;
  }

  skillCooldowns[skill.名称] = skill.冷却;
  renderSkillButtons();

  if (enemyCurrentHP <= 0) return endBattle(true,enemyName);
  //setTimeout(() => monsterAttack(), 1000);
  monsterAttack();
}

function monsterAttack() {
  const log = document.getElementById('battle-log');
  const enemyAtk = enemyStats.攻击;
  const playerStats = getPlayerStats();

  let enemyDamage = Math.max(1, Math.floor(Math.random() * 5) + enemyAtk - playerStats.防御);
  if (damageShield) {
    enemyDamage = Math.floor(enemyDamage / 2);
    damageShield = false;
  }

  playerCurrentHP = Math.max(0, playerCurrentHP - enemyDamage);
  log.innerText += `\n${enemyName} 攻击了你，造成 ${enemyDamage} 点伤害！`;
  updateBattleHP(playerCurrentHP, enemyCurrentHP);

  Object.keys(skillCooldowns).forEach(k => {
    if (skillCooldowns[k] > 0) skillCooldowns[k]--;
  });
  renderSkillButtons();

  if (playerCurrentHP <= 0) return endBattle(false,enemyName);
}

const 等级池 = ["劣质", "普通", "良好", "优秀", "完美"];

export function endBattle(victory, enemyName) {
  clearInterval(battleInterval);
  const log = document.getElementById('battle-log');

  const monster = monsters[enemyName];
  if (!monster) return;

  if (victory) {
    log.innerText += `\n你打败了 ${enemyName}！🎉`;

    const drops = [];

    // 随机从主素材中掉落 0~1 个
    if (Math.random() < 0.7 && monster.主素材.length > 0) {
      const main = monster.主素材[Math.floor(Math.random() * monster.主素材.length)];
      const 等级 = 等级池[Math.floor(Math.random() * 等级池.length)];
      drops.push({ 名称: main.名称, 等级 });
    }

    // 随机从附加素材中掉落 1~2 个
    const count = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < count; i++) {
      const mat = monster.附加素材[Math.floor(Math.random() * monster.附加素材.length)];
      if (mat) drops.push({ 名称: mat.名称 });
    }

    addToInventory(drops);
    gainExp(monster.掉落经验);

    const dropText = drops.map(i => `${i.等级 ? i.等级 + ' ' : ''}${i.名称}`).join("、");
    log.innerText += `\n你获得了 ${monster.掉落经验} 经验 和掉落：${dropText}`;
  } else {
    log.innerText += `\n你被 ${enemyName} 击败了... 💀`;
  }
}

export function startBattle(monsterName) {
  closeOverlay('monster-select');
  initBattle(monsterName);
  openOverlay('battle');
}
