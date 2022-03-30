import React, {useState, useEffect} from 'react';

export default function Steps() {

    // Состояние компонента Steps
    const [field, setField] = useState(
        [
            [0, 0, 0], [0, 0, 0], [0, 0, 0]
        ]
    );
    // массив из двух текущих играков
    const [currentPlayers, setCurrentPlayers] = useState('');
    // счетчик ходов
    const [count, setCount] = useState(1);
    // символ, который начинает играть
    const [currentSymbol, setCurrentSymbol] = useState("X");
    // тот, кто ходил последним
    const [lastWentPlayer, setLastWentPlayer] = useState('');
    // тот, кто пойдет сдедующим
    const [nextWentPlayer, setNextWentPlayer] = useState('');
    const [errorText, setErrorText] = useState('');
    // результат игры
    const [result, setResult] = useState('');
    // после завершения игры отключить ячейки
    const [cellDisabled, setCellDisabled] = useState(false);    


    let getGameFieldUrl = "http://localhost:8080/gameplay/get";
    let getNewGameFieldUrl = "http://localhost:8080/gameplay/getNewGame";

    const reqOptions = {
        method: 'GET'
    };

    // Выполняется один раз при отрисовки страницы
    useEffect(() => {
        getGameField(getGameFieldUrl);
    }, [])

    // Получение игровых данных
    function getGameField(url) {
        fetch(url, reqOptions)
            .then(async response => {
                console.log(response)
                console.log(response.status)
                const  data = await response.json()
                if (response.status === 400) {
                    console.log("Ошибка, status - 400!")
                } else {                    
                    setField(data.field);
                    setCurrentPlayers(data.currentPlayers);
                    setLastWentPlayer(data.lastWentPlayer);
                    const res = data.result;                    
                    setResult(res.result);
                    if(res.result.length > 0) {
                        setCellDisabled(true);
                    }         
                    console.log(data);
                    console.log(res.result);
                    console.log(data.lastWentPlayer.name);

                }
            })
            .catch(error=>{
                console.log("Ошибка сервера, необходимо все проверить!")
                console.log(error)
            })
    }
// В зависимости от значения рисуем О или Х
    let f = function ifZero(i) {
        if(i === 2) {
            return "O";
        } else{
            if(i === 7) {
                return "X";
            }
        }
        return "-";      
    }

    // Кто ходит? Возвращаем id игрока
    let pl = function isPlayer() {
        if(count%2 === 1) {
            setCurrentSymbol("X");
            setNextWentPlayer(currentPlayers[0].name); // имя следующего, кто будет ходить
            return "1";
        } else {
            setCurrentSymbol("O");
            setNextWentPlayer(currentPlayers[1].name);
            return "2";
        }
    }
    
    // Получаем координату ячейки и делаем запрос на запись хода
    function setStep(event) {
        let val = event.target.value;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                num: count, 
                playerId:pl(),
                symbol:currentSymbol,
                coords: val
                })
        };
        fetch('http://localhost:8080/gameplay/steps', requestOptions)
            .then(async response => {
                console.log(response)
                const  data = await response.json();
                if (response.status === 400) {
                    console.log("Ошибка, status - 400!")
                } else {                    
                    console.log(data.message);
                   if(data.message === "Yes"){
                        setCount(() => setCount(count + 1));
                        setErrorText('');
                        getGameField(getGameFieldUrl);
                   } else {
                       setErrorText("Некорректный ход!")
                   }
                }
            })
            .catch(error=>{
                console.log("Ошибка сервера!")
                console.log(error)
            })
    }
    // newGame - Начать новую игру
    function newGame() {        
        window.location.href='/'
        getGameField(getNewGameFieldUrl);
    }

    const fResult = function prepareResult() {
        if(result === "Draw!") {
            return <span> У нас ничья! </span>
        } else {
           return <span> Игру выиграл(а) {result} играя {lastWentPlayer.symbol}. <br/>
           Количество побед составило: {lastWentPlayer.winsCount}
           </span> 
        }
    }

    // Переход на страницу чтения файла
    function getFileData() {
        window.location.href='/file-data';
    }

    return (
        <div className="flex">
            <div className="main flex">

                <div className="space purent">
                    <div className="pls">
                        {currentPlayers[0] != null ?    
                            <div>  Игрок под номером {currentPlayers[0].id}: {currentPlayers[0].name}, 
                                    играет {currentPlayers[0].symbol} 
                                <br/>
                                Игрок под номером {currentPlayers[1].id}: {currentPlayers[1].name}, 
                                    играет {currentPlayers[1].symbol} 
                            </div>  : null
                        }
                        {errorText.length > 0 ? 
                            <div className="m-top">
                                <span className="err label m-top"> {errorText}</span>  <br/>
                                <div>{nextWentPlayer}  выбирите другую ячейку! </div>
                            </div> : null
                        }
                        {cellDisabled ? <div  className="err m-top"> {fResult()} </div> : null}
                    </div>
                    <div>
                        <button className="button red"
                                onClick={() => {newGame(); 
                                                setErrorText(""); 
                                                setCellDisabled(false);
                                                setCount(1);}
                                        }
                                disabled = {!cellDisabled}
                        > Новая игра
                        </button>
                        <button className="button blue"
                                onClick={() => getFileData()}                                        
                                disabled = {!cellDisabled}
                        > Проиграть эту игру
                        </button>
                    </div>    
                </div>

                <div className="space" >
                    <div >
                        <button className='game-button' value={"11"} disabled = {cellDisabled}
                        onClick= {(event) => setStep(event)}> 
                            {f(field[0][0])}
                        </button>
                        <button className='game-button' value={"12"} disabled = {cellDisabled}
                        onClick= {(event) => setStep(event)}>
                            {f(field[0][1])}
                        </button>
                        <button className='game-button' value={"13"} disabled = {cellDisabled}
                        onClick= {(event) => setStep(event)}>
                            {f(field[0][2])}
                        </button>
                    </div>
                    <div>
                        <button className='game-button' value={"21"} disabled = {cellDisabled}
                        onClick= {(event) => setStep(event)}>
                            {f(field[1][0])}
                        </button>
                        <button className='game-button' value={"22"} disabled = {cellDisabled}
                        onClick= {(event) => setStep(event)}>
                            {f(field[1][1])}
                        </button>
                        <button className='game-button'value={"23"} disabled = {cellDisabled}
                        onClick= {(event) => setStep(event)}>
                            {f(field[1][2])}
                        </button>
                    </div>
                    <div>
                        <button className='game-button' value={"31"} disabled = {cellDisabled}
                        onClick= {(event) => setStep(event)}>
                            {f(field[2][0])}
                        </button>
                        <button className='game-button' value={"32"} disabled = {cellDisabled}
                        onClick= {(event) => setStep(event)}>
                            {f(field[2][1])}
                        </button>
                        <button className='game-button'value={"33"} disabled = {cellDisabled}
                        onClick= {(event) => setStep(event)}>
                            {f(field[2][2])}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}