var db = new localdb('STC');
		var tableexists = db.tableExists('games');
		if(tableexists){
		}else{
			db.createTable('games');
		}
		var tableexists = db.tableExists('players');
		if(tableexists){
		}else{
			db.createTable('players');
		}

		var gameNum = 0;
		var gameStatus = "finished";
		var winningScore = 10;


		function dropDataBase(){
			db.deleteDatabase('STC');
			db = new localdb('STC');
			var tableexists = db.tableExists('games');
			if(tableexists){
			}else{
				db.createTable('games');
			}
			var tableexists = db.tableExists('players');
			if(tableexists){
			}else{
				db.createTable('players');
			}
		}

		function showGameListPage(){
			$('#gameListPage').collapse("show");
			$('#newGamePage').collapse("hide");
			$('#gamePage').collapse("hide");
			$('#newPlayerPage').collapse("hide");
			$('#navbarSupportedContent1').collapse("hide");
			refreshGameList();
		}

		function showNewGamePage() {
		 // db.insert('games', {'gameType': 'Spot the Car', 'gameStatus': 'active'});
		 $('#gameListPage').collapse("hide");
		 $('#newGamePage').collapse("show");
		 $('#gamePage').collapse("hide");
		 $('#newPlayerPage').collapse("hide");
		 document.getElementById("NewGameNameInpt").value = ""
		 document.getElementById("NewGameScoreInpt").value = ""
		}

		function showGamePage(gameId){
			$('#gameListPage').collapse("hide");
			$('#newGamePage').collapse("hide");
			$('#gamePage').collapse("show");
			$('#newPlayerPage').collapse("hide");
			gameNum = gameId;

			refreshGameStatus();
			refreshGameWinningScore();
			getGameName();
			refreshPlayerList();
			refreshGamePageButtons();
		}

		function refreshGameStatus()
		{
			var obj = db.find('games',{'ID':gameNum});
			gameStatus = obj[0].gameStatus;
		}

		function 	refreshGameWinningScore()
		{
			var obj = db.find('games',{'ID':gameNum});
			winningScore = obj[0].gameWinningScore;
		}

		function showAddPlayerPage(){
			$('#gameListPage').collapse("hide");
			$('#newGamePage').collapse("hide");
			$('#gamePage').collapse("hide");
			$('#newPlayerPage').collapse("show");
			document.getElementById('NewPlayerInpt').value = "";
		}


		function getGameName(){
			var result = db.findById('games',parseInt(gameNum,10));
			$("#pgametitle").text(result.gameType);
		}

		function createNewGame(){
		//	db.insert('games', {'gameType': 'Spot the Car', 'gameStatus': 'active'});
			document.getElementById("newGamePage").reportValidity();
			var newGameName = document.getElementById("NewGameNameInpt").value;
			var newGameScore = document.getElementById("NewGameScoreInpt").value;
			if(newGameName != "" && newGameScore != ""){
				db.insert('games', {'gameType': newGameName, 'gameStatus': 'active', 'gameWinningScore':newGameScore});
				showGameListPage();
			}
		}

		function cancelAddPlayerBtn(){
			gotoGame(gameNum);
		}


		function refreshGameList(){
		//	document.getElementById("gameTable").value="";
			var elem = document.getElementById('gameList0');
    	document.getElementById('gameList').removeChild(elem);
			//$('#gameTable').html(getGameList());
			getGameList();
		}



		function getGameList(){
			var table = db.exportData('games');
			var obj = JSON.parse(table);

			/*
			{"totalrows":2,"autoinc":3,"rows":{"1":{"gameType":"Spot the Car","gameStatus":"active","ID":1},"2":{"gameType":"Spot the Car","gameStatus":"active","ID":2}}}
			*/

			var table = document.createElement('table');
			table.className = "table table-hover";
			table.id = "gameList0";
			var thead = document.createElement('thead');
			var thGameNum = document.createElement('th'); thGameNum.appendChild(document.createTextNode("ID"));
			var thGameName = document.createElement('th'); thGameName.appendChild(document.createTextNode("Game Name"));
			var thGameStatus = document.createElement('th'); thGameStatus.appendChild(document.createTextNode("Status"));
			thead.appendChild(thGameNum);thead.appendChild(thGameName);thead.appendChild(thGameStatus);
			table.appendChild(thead);

				for (var j = 1; j <= obj.totalrows; j++) {
					var tdGameNum = document.createElement('td');
					var tdGameName = document.createElement('td');
					var tdGameStatus = document.createElement('td');

					var tr = document.createElement('tr');
					tr.setAttribute("onclick","gotoGame("+obj.rows[j].ID+");");

					table.appendChild(tr);
					tdGameNum.appendChild(document.createTextNode(obj.rows[j].ID));
					tdGameName.appendChild(document.createTextNode(obj.rows[j].gameType));
					tdGameStatus.appendChild(document.createTextNode(obj.rows[j].gameStatus));


					tr.appendChild(tdGameNum);
					tr.appendChild(tdGameName);
					tr.appendChild(tdGameStatus);
				};
				gameCount = obj.totalrows;

			document.getElementById('gameList').appendChild(table);
		}

		function gotoGame(gameId)
		{
			showGamePage(gameId);
		}

		function addNewPlayer(){
		//	db.insert('games', {'gameType': 'Spot the Car', 'gameStatus': 'active'});
			document.getElementById("newPlayerPage").reportValidity();
			if(document.getElementById("NewPlayerInpt").value != ""){
				db.insert('players', {'gameId': gameNum, 'playerName' : document.getElementById("NewPlayerInpt").value, 'score': 0});
				gotoGame(gameNum);
			}
		}


		function cancelAddPlayer()
		{
			gotoGame(gameNum);
		}

		function refreshPlayerList(){
			var elem = document.getElementById('playerList0');
    	document.getElementById('playerList').removeChild(elem);
			getPlayerList();
		}



		function getPlayerList(){
		//	var table = db.exportData('games');
			var obj = db.find('players',{'gameId':gameNum});
			var disabledOrNot = false;
			if(gameStatus == "finished"){disabledOrNot = true};
			/*
			db.insert('players', {'gameId': gameNum, 'playerName' : document.getElementById("NewPlayerInpt").value, 'score': 0});
			{"totalrows":2,"autoinc":3,"rows":{"1":{"gameType":"Spot the Car","gameStatus":"active","ID":1},"2":{"gameType":"Spot the Car","gameStatus":"active","ID":2}}}
			*/

			var table = document.createElement('table');
			table.className = "table table-hover";
			table.id = "playerList0";
			var thead = document.createElement('thead');
			var thPlayerId = document.createElement('th'); thPlayerId.appendChild(document.createTextNode("#"));
			var thPlayerName = document.createElement('th'); thPlayerName.appendChild(document.createTextNode("Player Name"));
			var thScore = document.createElement('th'); thScore.appendChild(document.createTextNode("Score"));
			var thPlayerMin = document.createElement('th'); thPlayerMin.appendChild(document.createTextNode(""));
			var thPlayerPlus = document.createElement('th'); thPlayerPlus.appendChild(document.createTextNode(""));

			thead.appendChild(thPlayerId);thead.appendChild(thPlayerName);thead.appendChild(thScore);thead.appendChild(thPlayerMin);thead.appendChild(thPlayerPlus);
			table.appendChild(thead);
		//	alert("Game: "+gameCount + "and TotalRows :"+obj.totalrows);

				for (var j = 0; j <= obj.length-1; j++) {
					//alert(JSON.stringify(obj[j]));
					var tdPlayerId = document.createElement('td');
					var tdPlayerName = document.createElement('td');
					var tdScore = document.createElement('td');
					var tdPlayerMin = document.createElement('td');tdPlayerMin.id = "tdPlayerMin";
					var tdPlayerPlus = document.createElement('td');

					var tr = document.createElement('tr');

					table.appendChild(tr);

					tdPlayerId.appendChild(document.createTextNode(obj[j].ID))
					tdPlayerName.appendChild(document.createTextNode(obj[j].playerName));
					tdScore.appendChild(document.createTextNode(obj[j].score));

					var ActionButton = document.createElement('button');
					ActionButton.type = "button";
					ActionButton.className = "btn btn-default";
					ActionButton.setAttribute("onclick","updatePlayerPoints("+obj[j].ID+",-1)");
					ActionButton.appendChild(document.createTextNode("-"));
					ActionButton.disabled = disabledOrNot;
					tdPlayerMin.appendChild(ActionButton);

					var ActionButton = document.createElement('button');
					ActionButton.type = "button";
					ActionButton.className = "btn btn-default";
					ActionButton.setAttribute("onclick","updatePlayerPoints("+obj[j].ID+",1)");
					ActionButton.appendChild(document.createTextNode("+"));
					ActionButton.disabled = disabledOrNot;
					tdPlayerPlus.appendChild(ActionButton);


					tr.appendChild(tdPlayerId);
					tr.appendChild(tdPlayerName);
					tr.appendChild(tdScore);
					tr.appendChild(tdPlayerMin);
					tr.appendChild(tdPlayerPlus);

				};
			//	gameCount = obj.totalrows;

			document.getElementById('playerList').appendChild(table);
		}

		function refreshGamePageButtons(){

			var elem = document.getElementById('addPlayerBtn');

			if(document.getElementById('addPlayerDiv') != null){
				document.getElementById('addPlayerDiv').removeChild(elem);
			}

			addPlayerButton();
		}


		function addPlayerButton()
		{
		//	alert("here: " + gameStatus);
			var disabledOrNot = "";
			if(gameStatus == "finished"){disabledOrNot = 'disabled'};
			var button='<button type="button" class="btn btn-secondary btn-lg btn-block" id="addPlayerBtn" onclick="showAddPlayerPage();" '+ disabledOrNot +'>Add Player</button>';
			  $("#addPlayerDiv").append(button);
		}

		function updatePlayerPoints(playerId,point)
		{
			var playerRecord = db.find('players',{'gameId':gameNum, 'ID':playerId});
			if(point > 0){
				var score = playerRecord[0].score + 1;
				db.updateById('players',{'score':score},playerId);
				if(score == winningScore){
					db.updateById('games',{'gameStatus':'finished'},gameNum);
				}
			}
			if(point < 0){
				var score = playerRecord[0].score - 1;

				if(score >= 0)
				{
					db.updateById('players',{'score':score},playerId);
				}
			}
			refreshGameStatus();
			refreshPlayerList();
			refreshGamePageButtons();

			//TODO: checkWinningScore();
		}

/*
		function checkGameActive()
		{
			var result = db.findById('games',parseInt(gameNum,10));
			var gameStatus = result.gameStatus;
			if(gameStatus == 'active'){
				getElementById('gamePageButtonContainer').style.visibility = "hidden";
			}
		}
*/

		function getDebugDB(){
			var table = db.exportData('games');

			var obj = JSON.parse(table);
			alert(obj.totalrows);
		}

/*
	LocalDB https://github.com/mike183/localDB
*/

    //Loading a database
    //var db = new localdb('foo');

    //Deleteing a database
    //removeDatabase = function(){
    //  db.deleteDatabase("foo");
    //};

    //Creating a Table
    //db.createTable('users');

    //Deleting a Table
    //db.dropTable('users');

    //Get Table Meta Data
    //var meta = db.tableMeta('users');

    //Inserting Data
    //db.insert('users', {'username': 'john', 'firstname': 'John', 'lastname': 'Smith'});

    //Updating Data
    //db.update('users', {'username': 'johnny'}, {'username': 'john'});
    //db.updateById('users', {'username': 'johnny'}, 42);

    //Removing Data
    //db.remove('users', {'username': 'john'});
    //db.removeById('users', 42);

    //Finding Data
    //var result = db.find('users', {'username': 'john'});
    //var result = db.find('users', {'firstname': 'John'}, 5, 0);
    //var result = db.find('users', {'title': 'Mr', 'firstname': 'John'}, 5, 0, 'OR');

    //Checking Database Exists
    //var dbexists = db.dbExists('bar');

    //Checking Table Exists
    //var tableexists = db.tableExists('users');

    //Exporting Data
    //var table = db.exportData('users');
    //var database = db.exportData(); d
