(()=> {
    const start = document.querySelector('.start');
    const stage = document.querySelector('.stage');
    const timeEle = document.querySelector('.time');
    const imgs = [
        'avatar.svg',
        'batman.svg',
        'genie-lamp.svg',
        'iron-man.svg',
        'jerry.svg',
        'keroppi.svg',
        'kiki.svg',
        'lala.svg',
        'my-melody.svg',
        'naruto.svg',
        'pochacco.svg',
        'sailor-moon.svg',
        'scooby-doo.svg',
        'smurf.svg',
        'spongebob.svg',
        'stitch.svg',
        'superman.svg',
        'tom.svg',
        'totoro.svg',
        'woody-woodpecker.svg',
    ];
    const roundInfo = [
        {round: '1R', length: 20, col: 5, row: 4, time: 120},
        {round: '2R', length: 30, col: 6, row: 5, time: 240},
        {round: '3R', length: 40, col: 8, row: 5, time: 360},
    ]
    const aniDelay = 0.3;
    const aniDuration = 1.7;
    let cardList = [];
    let cardOpenList = [];
    let nowRound = 0;
    let isAnimation = false;
    let isReverse = false;
    let isStart = false;
    let timeVal;
    let timeControl;
    
    const setCardInfo = () => {
        const randomImg = shuffle(imgs);
        for(let i = 0; i < roundInfo[nowRound].length; i++) {
            cardList.push({
                isOpen: false,
                isPairs: false,
                imgSrc: randomImg[Math.floor(i/2)],
            })
        }
    }
    
    const createCard = (info, idx) => {
        const card = document.createElement('div');
        let cardItem = `<div class="card_inner">
                            <div class="front"></div>
                            <div class="back" style="background-image: url('./img/${info.imgSrc}')"></div>
                        </div>`;
        card.innerHTML = cardItem;
        card.classList.add('card');

        card.style.width = stage.clientWidth / roundInfo[nowRound].col - 5 + 'px';
        card.style.height = stage.clientHeight / roundInfo[nowRound].row - 6 + 'px';
        card.querySelector('.card_inner').style.animationDelay = `${aniDelay*idx}s`;

        stage.append(card);

    }

    const setCard = () => {
        return new Promise(resolve => {
            cardList.forEach((ele, idx) => {
                createCard(ele, idx);
            })

            setTimeout(function(){
                resolve();
            }, (cardList.length * aniDelay + aniDuration)* 1000);
        })
    }
    
    const shuffle = (arr) => {
        const dupleArr = [...arr];
        for(let i = dupleArr.length - 1; i > 0; i--) {
            const randomNum = Math.floor(Math.random() * (i + 1));

            const temp = dupleArr[i];
            dupleArr[i] = dupleArr[randomNum];
            dupleArr[randomNum] = temp;
        }

        return dupleArr;
    }

    const gameTime = (time) => {
        let min, sec;
        timeVal = time;
        min = Math.floor(timeVal / 60) < 10 ? '0' + Math.floor(timeVal / 60) : Math.floor(timeVal / 60);
        sec = Math.floor(timeVal % 60) < 10 ? '0' + Math.floor(timeVal % 60) : Math.floor(timeVal % 60);
        timeEle.innerHTML = `${min}:${sec}`;
        timeControl = setInterval(function(){
            timeVal--;
            timeVal = timeVal < 0 ? 0 : timeVal;
            min = Math.floor(timeVal / 60) < 10 ? '0' + Math.floor(timeVal / 60) : Math.floor(timeVal / 60);
            sec = Math.floor(timeVal % 60) < 10 ? '0' + Math.floor(timeVal % 60) : Math.floor(timeVal % 60);
            timeEle.innerHTML = `${min}:${sec}`;

            if(timeVal <= 0) {
                isStart = false;
                clearInterval(timeControl);
            }

        }, 1000)
    }

    const gameStart = () => {
        if(!isStart) {
            stage.innerHTML = '';
            cardList = [];
            timeEle.innerHTML = `00:00`;
            setCardInfo();
            cardList = shuffle(cardList);
            isAnimation = true;
            isStart = true;
            setCard().then(() => {
                isAnimation = false;
                gameTime(roundInfo[nowRound].time);
            })
        }
    }

    start.addEventListener('click', gameStart);
    
    document.addEventListener('click', function(e){

        if(e.target.closest('.card') && !isAnimation && !isReverse && isStart) {
            const target = e.target.closest('.card');
            const cardAll = document.querySelectorAll('.card');
            const targetIdx = Array.from(cardAll).findIndex(ele => ele === target);

            let openCard = cardList.filter(ele => ele.isOpen === true && ele.isPairs === false);

            if(openCard.length < 2) {
                new Promise(resolve => {
                    target.classList.add('open');
                    cardList[targetIdx].isOpen = true;
                    if(!cardList[targetIdx].isPairs) cardOpenList.push(target);
                    isReverse = true;

                    setTimeout(function(){
                        // transition 300초 후, 넘기기
                        resolve();
                    }, 300);
                }).then(() => {
                    openCard = cardList.filter(ele => ele.isOpen == true && ele.isPairs == false);
                    // 2개 이상일때
                    if(openCard.length == 2) {
                        if(openCard[0].imgSrc === openCard[1].imgSrc) {
                            // 카드가 같을때
                            openCard.forEach(ele => ele.isPairs = true);
                        } else {
                            // 카드가 다를때
                            cardOpenList.forEach(ele => ele.classList.remove('open'));
                            openCard.forEach(ele => ele.isOpen = false);
                            timeVal-=3;
                            timeEle.classList.add('shake');
                            setTimeout(function(){
                                timeEle.classList.remove('shake');
                            },1000)
                        }
                        cardOpenList = [];
                    }
                    isReverse = false;

                    // 다 뒤집으면 다음 라운드로
                    if(document.querySelectorAll('.card.open').length === roundInfo[nowRound].length) {
                        isStart = false;
                        clearInterval(timeControl);
                        nowRound++;
                        if(nowRound < roundInfo.length) {
                            setTimeout(function() {
                                gameStart();
                            }, 1000)
                        } else {
                            alert('게임 끝!');
                        }
                    }
                })
            }

        }

    })

})()