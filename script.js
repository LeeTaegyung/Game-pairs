(()=> {
    const wrap = document.getElementById('wrap');
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
        'jake.svg',
    ];
    const roundInfo = [
        {round: '1R', length: 20, col: 5, row: 4, time: 120},
        {round: '2R', length: 30, col: 6, row: 5, time: 240},
        {round: '3R', length: 42, col: 7, row: 6, time: 300},
    ];
    const aniDelay = 0.3;
    const aniDuration = 1.7;
    let cardList = [];
    let cardOpenList = [];
    let nowRound = 0;
    let isAnimation = false;
    let isFlip = false;
    let isStart = false;
    let timeVal;
    let timeControl;
    
    // 카드 하나당 정보 세팅. 카드 정보는 cardList 변수에 담김.
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
    
    // 카드 생성
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

    // 비동기 처리를 위한 함수. 카드 생성후 애니메이션이 다 끝나면 resolve 반환
    const setStageInCard = () => {
        return new Promise(resolve => {
            cardList.forEach((ele, idx) => {
                createCard(ele, idx);
            })

            setTimeout(function(){
                resolve();
            }, (cardList.length * aniDelay + aniDuration)* 1000);
        })
    }
    
    // 셔플함수. 배열을 넣으면, 셔플해서 배열을 반환
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

    // 타임함수. 다른 카드 뒤집을 때 마다 3초씩 줄어들게 하기 위해서 timeVal을 전역변수로 설정. 타임아웃이 되면 실패문구 뜨고 게임 종료.
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
                result('fail');
            }

        }, 1000)
    }

    // 게임 시작시 카운드 다운. 카운트 다운 종료 후에 게임 시작을 할 수 있도록 promise 사용.
    const countDown = () => {
        return new Promise(resolve => {
            let total = 5;
            const cdInterval = setInterval(function(){
                const cdEl = document.createElement('div');
                cdEl.classList.add('count_down');
                cdEl.innerHTML = total;
                wrap.appendChild(cdEl);
                total--;
                setTimeout(function(){
                    cdEl.remove();
                }, 1000);

                if(total == 0) {
                    clearInterval(cdInterval);
                    setTimeout(function(){
                        resolve();
                    }, 1500)
                }
            }, 1000)
        })
    }

    // 결과 텍스트 생성. fail / clear
    const result = (txt) => {
        const El = document.createElement('span');
        El.classList.add(txt);
        El.innerHTML = txt;
        wrap.appendChild(El);
        setTimeout(function(){
            El.remove();
        }, 1000);
    }

    // 게임 스타트 함수
    const gameStart = () => {
        if(!isStart) {
            isStart = true; // 함수를 한번만 실행할 수 있게 플래그.
            stage.innerHTML = ''; // 스테이지 초기화
            cardList = []; // 카드 정보 초기화
            timeEle.innerHTML = `00:00`; // 시간 초기화

            countDown().then(() => {
                setCardInfo();
                cardList = shuffle(cardList);
                isAnimation = true; //카드 생성후 로딩 애니메이션 진행. 카드 클릭을 막기 위한 변수
                setStageInCard().then(() => {
                    isAnimation = false; // 로딩 애니메이션이 완료 되면, 카드 클릭 할 수 있게 false처리.
                    gameTime(roundInfo[nowRound].time); // 시간 활성화
                })
            })
        }
    }

    const confetti = () => {
        let confettiArea = document.createElement('div');
        confettiArea.classList.add('confetti-container');
        document.body.append(confettiArea);

        const confettiColors = ['#EF2964', '#00C09D', '#2D87B0', '#48485E','#EFFF1D'];
        const confettiAnimations = ['slow', 'medium', 'fast'];
        
        const confettiAction = setInterval(() => {
            const confettiEl = document.createElement('div');
            const confettiSize = (Math.floor(Math.random() * 3) + 7) + 'px';
            const confettiBackground = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            const confettiLeft = (Math.floor(Math.random() * confettiArea.offsetWidth)) + 'px';
            const confettiAnimation = Math.floor(Math.random() * confettiAnimations.length);

            confettiEl.classList.add('confetti');
            confettiEl.style.width = confettiSize;
            confettiEl.style.height = confettiSize;
            confettiEl.style.backgroundColor = confettiBackground;
            confettiEl.style.left = confettiLeft;
            confettiEl.classList.add(confettiAnimations[confettiAnimation]);

            setTimeout(() => {
                confettiEl.parentNode.removeChild(confettiEl);
            }, 3000);

            confettiArea.append(confettiEl);

        }, 25)

    }

    // 스타트 버튼 클릭시, 게임스타트 함수 실행.
    start.addEventListener('click', gameStart);
    
    // 카드 아이템을 스테이지에 추가했기 때문에, DOM으로 읽어올 수 없음.
    document.addEventListener('click', function(e){
        if(e.target.closest('.card') && !isAnimation && !isFlip && isStart) {
            const cardItem = e.target.closest('.card');
            const cardAll = document.querySelectorAll('.card');
            const cardIdx = Array.from(cardAll).indexOf(cardItem);

            // 현재 뒤집은 카드의 개수가 2개 미만이면,
            if(cardOpenList.length < 2) {
                new Promise(resolve => {
                    // 짝을 맞춘 카드이거나 이미 뒤집은 카드이면 promise 종료;
                    if(cardList[cardIdx].isPairs || cardList[cardIdx].isOpen) return;
                    
                    cardItem.classList.add('open');
                    cardList[cardIdx].isOpen = true;
                    cardOpenList.push(cardItem);
                    isFlip = true;

                    setTimeout(function(){
                        // 카드 뒤집는 open 애니메이션 후, 넘기기
                        resolve();
                    }, 300);

                }).then(() => {
                    // 짝을 맞추지 않은 뒤집은 카드만 필터
                    let openCard = cardList.filter(ele => ele.isOpen == true && ele.isPairs == false);
                    let state;
                    // 2개일때
                    if(openCard.length == 2) {
                        if(openCard[0].imgSrc === openCard[1].imgSrc) {
                            // 카드가 같을때
                            openCard.forEach(ele => ele.isPairs = true); // isPairs 값 true로 변경
                            state = 'same'; // 상태값 변경
                        } else {
                            // 카드가 다를때
                            openCard.forEach(ele => ele.isOpen = false); // isOpen 값 false로 변경
                            timeVal-=3; // 3초 차감
                            state = 'shake'; // 상태값 변경
                        }

                        // 모션 추가
                        cardOpenList.forEach((ele, idx) => {
                            ele.classList.add(state); // 같은 카드 / 다른 카드일때 클래스명 다름
                            ele.style.animationDelay = `${0.1*idx}s`
                        });
                        
                        setTimeout(function(){
                            cardOpenList.forEach(ele => {
                                if(state === 'same') { // 같은 카드였을때 모션 클래스 삭제
                                    ele.classList.remove('same');
                                } else if(state === 'shake') { // 다른 카드였을때 모션 클래스 삭제
                                    ele.classList.remove('shake', 'open');
                                }
                            })
                            
                            // 뒤집힌 카드 아이템 초기화
                            cardOpenList = [];
                        }, 300)
                    }
                    isFlip = false; // 모든게 끝나고 다시 카드 클릭 할 수 있게 이 위치에 추가.

                    // 다 뒤집으면
                    if(document.querySelectorAll('.card.open').length === roundInfo[nowRound].length) {
                        result('clear');
                        clearInterval(timeControl); // 시간 멈춤
                        nowRound++;
                        if(nowRound < roundInfo.length) { // 다음 라운드가 있으면, 다음 라운드로 이동
                            setTimeout(function() {
                                isStart = false; // 게임 다시 시작할 수 있게 변수 수정.
                                gameStart();
                            }, 1500)
                        } else { // 마지막 라운드면 게임 종료
                            confetti();
                            alert('게임 종료!');
                        }
                    }

                })
            }

        }

    })


})()