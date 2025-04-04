// player.js
import { bonusStats } from './equipment.js';
import { updateStatsUI } from './ui.js';


export const playerBaseStats = {
  等级: 1,
  当前经验: 0,
  升级经验: 100,
  最大生命值: 100,
  攻击: 20,
  防御: 10,
  速度: 5
};

export function getPlayerStats() {
  return {
    生命值: playerBaseStats.最大生命值,
    攻击: playerBaseStats.攻击 + (bonusStats.攻击 || 0),
    防御: playerBaseStats.防御 + (bonusStats.防御 || 0),
    速度: playerBaseStats.速度 + (bonusStats.速度 || 0),
    命中率: bonusStats.命中率 || "0%",
    闪避率: bonusStats.闪避率 || "0%"
  };
}

export function gainExp(amount) {
  playerBaseStats.当前经验 += amount;
  while (playerBaseStats.当前经验 >= playerBaseStats.升级经验) {
    playerBaseStats.当前经验 -= playerBaseStats.升级经验;
    playerBaseStats.等级++;
    playerBaseStats.升级经验 = Math.floor(playerBaseStats.升级经验 * 1.2);
    playerBaseStats.最大生命值 += 10;
    playerBaseStats.攻击 += 2;
    playerBaseStats.防御 += 1;
  }

  updateStatsUI();
}
