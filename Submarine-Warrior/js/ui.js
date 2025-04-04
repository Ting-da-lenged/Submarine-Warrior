// ui.js
import { playerBaseStats, getPlayerStats } from './player.js';

export function updateStatsUI() {
  const stats = getPlayerStats();
  document.getElementById('level').innerText = playerBaseStats.等级;
  document.getElementById('exp').innerText = playerBaseStats.当前经验;
  document.getElementById('exp-max').innerText = playerBaseStats.升级经验;
  document.getElementById('exp-bar').style.width = `${(playerBaseStats.当前经验 / playerBaseStats.升级经验) * 100}%`;

  document.getElementById('hp').innerText = stats.生命值;
  document.getElementById('atk').innerText = stats.攻击;
  document.getElementById('def').innerText = stats.防御;
  document.getElementById('spd').innerText = stats.速度;
  document.getElementById('acc').innerText = stats.命中率;
  document.getElementById('eva').innerText = stats.闪避率;
}

export function updateBattleHP(playerHP, enemyHP) {
  document.getElementById('player-hp').innerText = playerHP;
  document.getElementById('enemy-hp').innerText = enemyHP;
}

export function openOverlay(name) {
  const el = document.getElementById(`${name}-overlay`);
  if (el) el.style.display = 'flex';
}

export function closeOverlay(name) {
  const el = document.getElementById(`${name}-overlay`);
  if (el) el.style.display = 'none';
}
