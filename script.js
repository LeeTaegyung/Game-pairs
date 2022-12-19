(()=> {
    const start = document.querySelector('.start');
    const stage = document.querySelector('.stage');
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
        {round: '1R', length: 20, col: 5, row: 4},
        {round: '2R', length: 30, col: 6, row: 5},
        {round: '3R', length: 40, col: 8, row: 5},
    ]
    let cardList = [];
    let nowRound = 0;
    
    // 1R 20 5x4 2분 10
    // 2R 30 6x5 3분 15
    // 3R 40 8x5 5분 20
    // 시간제한
    // game start -> 타이머 시작 -> 1R(카드개수 입력) -> shuffle() -> create() -> card click(돌리는동안 다른카드 클릭 막아야함)
    // 짝을 맞췄을때 상태값 변동, 틀렸을때 시간이 좀더 빨리 줄어들고 다시 엎어야함.
    // 시간내에 다 클리어 했을때, 다음 라운드로 이동(이동 애니메이션 예정)
    // 
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
        card.querySelector('.card_inner').style.animationDelay = `${0.3*idx}s`;

        stage.append(card);

    }
    
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
    

    const gameStart = () => {
        setCardInfo();
        cardList = shuffle(cardList);

        cardList.forEach((ele, idx) => {
            createCard(ele, idx);
        })
    }

    start.addEventListener('click', gameStart);
    
    document.addEventListener('click', function(e){

        const openCard = cardList.filter(ele => ele.isOpen == true && ele.isPairs == false);

        if(e.target.closest('.card') && openCard.length < 2) {
            const target = e.target.closest('.card');
            const cardAll = document.querySelectorAll('.card');
            const targetIdx = Array.from(cardAll).findIndex(ele => ele == target);

            target.classList.add('open');
            cardList[targetIdx].isOpen = true;

        }
        
        if(openCard.length == 2) {
            console.log(openCard);
        }


    })


})()