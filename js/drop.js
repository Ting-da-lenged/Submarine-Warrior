
import { addToInventory } from './inventory.js';
import { updateStatsUI } from './ui.js';

export let level = 5;
export let exp = 60;
export let expMax = 100;
export let hp = 100;
export let atk = 20;
export let def = 15;
export let spd = 8;

export function gainExp(amount) {
  exp += amount;
  const log = document.getElementById('battle-log');
  log.innerText += `你获得了 ${amount} 点经验值！\n`;

  if (exp >= expMax) {
    level++;
    exp -= expMax;
    expMax = Math.floor(expMax * 1.2);
    hp += 20;
    atk += 5;
    def += 3;
    spd += 2;

    log.innerText += `🎉 你升级了！现在等级是 ${level}\n`;
  }

  updateStatsUI();
}
