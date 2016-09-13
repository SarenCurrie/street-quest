function totalPlayerAttack() {
	// TODO: go through all items, choose highest attack value
	return 30;
}

function totalPlayerDefense() {
	// TODO: same as totalPlayerAttack() for defense
	return 40;
}

function nextCombatStep(state) {
	var remainingAttack;
	if (state.nextMovePlayer) {
		if (state.monsterDefense >= state.playerAttack) {
			state.monsterDefense -= state.playerAttack;
		} else if (state.monsterDefense > 0) {
			remainingAttack = state.playerAttack - state.monsterDefense;
			state.monsterDefense = 0;
			state.monsterHealth -= remainingAttack;
		} else {
			state.monsterHealth -= state.playerAttack;
		}
		if (state.monsterHealth < 0) {
			state.monsterHealth = 0;
		}
		ui.updateCombat(state.playerHealth, state.playerDefense, state.monsterHealth, state.monsterDefense);
		if (state.monsterHealth <= 0) {
			finishCombat(true);
			return;
		}
		state.nextMovePlayer = false;
		ui.makeDialog(state.playerName, ["Best Attack!"], function() {
			nextCombatStep(state);
		});
	} else {
		if (state.playerDefense >= state.monsterAttack) {
			state.playerDefense -= state.monsterAttack;
		} else if (state.playerDefense > 0) {
			remainingAttack = state.monsterAttack - state.playerDefense;
			state.playerDefense = 0;
			state.playerHealth -= remainingAttack;
		} else {
			state.playerHealth -= state.monsterAttack;
		}
		if (state.playerHealth < 0) {
			state.playerHealth = 0;
		}
		ui.updateCombat(state.playerHealth, state.playerDefense, state.monsterHealth, state.monsterDefense);
		if (state.playerHealth <= 0) {
			finishCombat(false);
			return;
		}
		state.nextMovePlayer = true;
		ui.makeDialog(state.monsterName, ["Scary Attack!"], function() {
			nextCombatStep(state);
		});
	}
}

function finishCombat(monsterDied) {
	ui.finishCombat(monsterDied);
}

function startCombat(monsterName, monsterHealth, monsterAttack, monsterDefense) {
	var combatState = {
		'playerName': getPlayerData().name,
		'playerAttack': totalPlayerAttack(),
		'playerDefense': totalPlayerDefense(),
		'playerHealth': getPlayerData().health,
		'monsterName': monsterName,
		'monsterAttack': monsterAttack,
		'monsterDefense': monsterDefense,
		'monsterHealth': monsterHealth,
		'nextMovePlayer': true
	};
	ui.updateCombat(combatState.playerHealth, combatState.playerDefense, combatState.monsterHealth, combatState.monsterDefense);
	ui.startCombat();
	ui.makeDialog(combatState.playerName, ["Alright, I'm ready for this fight!"], function() {
		nextCombatStep(combatState);
	});
}
