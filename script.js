var score=[0,0,0];  //p1 tie p2
const icons = ['<i class="far fa-circle fa-3x" name="circle"></i>', '<i class="fas fa-times fa-3x" name="cross"></i>'];
// const icons1 = ['<i class="far fa-circle" name="circle" fa-1x></i>', '<i class="fas fa-times fa-1x" name="cross"></i>'];
var chance = 0, p1,player1=document.querySelector('.player1'),player2=document.querySelector('.player2'), p2,bot = 1,val = 0,resultGiven=0;
var key = [[document.querySelector('.row0 .col0'), document.querySelector('.row0 .col1'), document.querySelector('.row0 .col2')], [document.querySelector('.row1 .col0'), document.querySelector('.row1 .col1'), document.querySelector('.row1 .col2')], [document.querySelector('.row2 .col0'), document.querySelector('.row2 .col1'), document.querySelector('.row2 .col2')]]

document.getElementById('bot').addEventListener('click', () => takeicon(1));
document.getElementById('user').addEventListener('click', () => takeicon(0));
document.querySelector('.reset').addEventListener('click', () => location.reload());

function takeicon(playwithbot) {
    bot = playwithbot;
    let playWith = document.querySelector('.playWith');
    if (bot) playWith.innerHTML = "Play With: Computer";
    else playWith.innerHTML = "Play With: Human";
    document.querySelector('.mode').style.display = 'none';
    document.querySelector('.icon').style.display = 'flex';
    if (bot) {
        p1 = 'Computer';
        p2 = 'You';
        document.getElementById('cross').addEventListener('click', () => getOrder(0));
        document.getElementById('circle').addEventListener('click', () => getOrder(1));
    }
    else {
        p1 = 'Player1',p2 = 'Player2';
        document.getElementById('cross').addEventListener('click', () => play('a'));
        document.getElementById('circle').addEventListener('click', () => play());
    }
}

function reset() {
    // console.log('hi')
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[i][j] = -1;
            key[i][j].innerHTML = "";
        }
    }
    play(k);
}

function getOrder(chosenIcon) {
    if (chosenIcon) {
        const ty = icons[0];
        icons[0] = icons[1];
        icons[1] = ty;
    }
    document.querySelector('.icon1').innerHTML = `Player : ${icons[1]}`
    document.querySelector('.icon2').innerHTML = `Computer : ${icons[0]}`
    document.querySelector('.icon').style.display = 'none';
    document.querySelector('.order').style.display = 'flex';
    // console.log('hi');
    document.getElementById('userFirst').addEventListener('click', () => play(1));
    document.getElementById('botFirst').addEventListener('click', () => play(0));
}

const board = [[-1, -1, -1],
[-1, -1, -1],
[-1, -1, -1]]

function pt(a, b) {
    this.x = a;
    this.y = b;
}

function checkwinner(arr) {
    let i, j;
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++)if (arr[i][j] == -1 || arr[i][j] != arr[i][0]) break;
        if (j == 3) return arr[i][0];
    }
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 3; i++)if (arr[i][j] == -1 || arr[i][j] != arr[0][j]) break;
        if (i == 3) return arr[0][j];
    }
    if (arr[0][0] != -1 && arr[1][1] == arr[0][0] && arr[2][2] == arr[0][0]) return arr[0][0];
    if (arr[0][2] != -1 && arr[1][1] == arr[0][2] && arr[2][0] == arr[0][2]) return arr[0][2];
    return -1;      // FINAL STATE NOT REACHED
}

cp = (arr) => [arr[0].slice(0), arr[1].slice(0), arr[2].slice(0)];

function findBestMove(arr) {
    let posPoints = [];
    let val = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (arr[i][j] == -1) posPoints.push(new pt(i, j));
        }
    }
    if (!posPoints.length) return undefined;

    for (let i = 0; i < posPoints.length; i++) {
        let c = minmax(cp(arr), posPoints[i].x, posPoints[i].y, 1);
        val.push(c);
    }

    let index = 0;
    for (let i = 1; i < posPoints.length; i++) if (val[i] > val[index]) index = i;
    arr[posPoints[index].x][posPoints[index].y] = 0;
    key[posPoints[index].x][posPoints[index].y].innerHTML = icons[0];
    chance = 1;
    // if(checkwinner(board)!=-1 || movePresent()==0)declareResult()
}

function minmax(ar, x, y, chance) {
    ar[x][y] = 1 - chance;
    let a = checkwinner(ar);
    if (a != -1) {
        if (a == 0) return 2;
        if (a == 1) return 0;
    }
    else {
        if (chance == 1) {
            a = 3;
            for (let i = 0; i < 3; i++)
                for (let j = 0; j < 3; j++)if (ar[i][j] == -1) a = Math.min(a, minmax(cp(ar), i, j, 1 - chance));
            return (a == 3) ? 1 : a;
        }
        else {
            for (let i = 0; i < 3; i++)
                for (let j = 0; j < 3; j++)if (ar[i][j] == -1) a = Math.max(a, minmax(cp(ar), i, j, 1 - chance));
            return (a == -1) ? 1 : a
        }
    }
}

function movePresent() {
    for (i = 0; i < 3; i++)
        for (j = 0; j < 3; j++) if (board[i][j] == -1) return 1;
    return 0;
}

for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        (key[i][j]).addEventListener('click', () => checkAndApply(key[i][j], i, j));
    }
}

function checkAndApply(element, a, b) {
    if (bot && chance && element.innerHTML == "" && checkwinner(board) == -1 && movePresent()) {
        element.innerHTML = icons[1];
        board[a][b] = 1;
        chance = 0;
        if (checkwinner(board) == -1 && movePresent()) findBestMove(board)
        else declareResult();
    }
    else if (element.innerHTML == "" && checkwinner(board) == -1 && movePresent()) {
        element.innerHTML = icons[val];
        board[a][b] = val
        val = 1 - val
    }
    if (checkwinner(board) != -1 || movePresent() == 0) declareResult();
}
var k;
function play(val) {
    resultGiven=0;
    k = val;
    document.querySelector('.p1').innerHTML=`${p1}`
    document.querySelector('.p2').innerHTML=`${p2}`
    document.querySelector('.result').style.display = 'none';
    document.querySelector('.board').style.display = 'block';
    document.querySelector('.score').style.display = 'block';
    document.querySelector('.setting').style.display = 'block';
    if (bot) {
        document.querySelector('.order').style.display = 'none';
        chance = val;
        if (chance == 0) {
            document.querySelector('.firstChance').innerHTML = "First Chance: Computer";
            findBestMove(board);
        }
        else document.querySelector('.firstChance').innerHTML = "First Chance: Player";
    }
    else {
        if (val == 'a') {
            const ty = icons[0];
            icons[0] = icons[1];
            icons[1] = ty;
        }
        document.querySelector('.icon1').innerHTML = `Player1 : ${icons[0]}`;
        document.querySelector('.icon2').innerHTML = `Player2 : ${icons[1]}`;
        document.querySelector('.firstChance').innerHTML = "First Chance: Player1";
        document.querySelector('.icon').style.display = 'none';
        chance = 1;
    }
}

function declareResult() {
    let rematch = document.querySelector('.rematch');
    document.querySelector('.result').style.display = 'block';
    rematch.addEventListener('click', () => reset())
    let res = document.querySelector('.res');
    if(resultGiven==1)return;
    if (checkwinner(board) == 0) {
        res.innerHTML = `${p1} Won.`;
        score[0]++;
        document.querySelector('.p1s').innerHTML=score[0];
    }
    else if (checkwinner(board) == 1) {
        res.innerHTML(`${p2} Won.`);
        score[2]++;
        document.querySelector('.p2s').innerHTML=score[2];
    }
    else {
        res.innerHTML = ('Tie');
        score[1]++;
        document.querySelector('.tis').innerHTML=score[1];
    }
    resultGiven=1;
}