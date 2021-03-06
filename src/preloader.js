 define(['Phaser', 'game', 'load', 'boot', 'menu', 'play', 'play2', 'dead', 'win', 'chooseLevel', 'play3'], function (Phaser, game, loadState, bootState, menuState, playState, play2State, deadState, winState, chooseLevelState, play3State) {
     return {
         start: function () {
            // Add all the states
            game.state.add('boot', new bootState());
            game.state.add('load', new loadState());
            game.state.add('menu', new menuState());
            game.state.add('play', new playState());
            game.state.add('play2', new play2State());
            game.state.add('play3', new play3State());
            game.state.add('dead', new deadState());
            game.state.add('win', new winState());
            game.state.add('chooseLevel', new chooseLevelState());
            // game.state.add('snow', new snowState());
            
            game.state.start('boot');
        }
    }
});