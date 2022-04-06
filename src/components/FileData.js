import React, {useState, useEffect} from 'react';

export default function FileData() {

    // Состояние компонента FileData
    const [field, setField] = useState(
        [
            [0, 0, 0], [0, 0, 0], [0, 0, 0]
        ]
    );
    // массив играков, данные файла
    const [fCurPlayers, setFCurPlayers] = useState('');
    const [stepArr, setStepArr] = useState([]);
    const [resultStr, setResultStr] = useState('');
    const [hiddenResultStr, setHiddenResultStr] = useState(true);
    const [isRead, setIsRead] = useState(false);

    let getFiledUrl = "http://localhost:8080/gameplay/get-file";

    const reqOptions = {
        method: 'GET'
    };

    // Выполняется один раз
    useEffect(() => {
        getFileFn();
    }, [])

    // Запрос
    function getFileFn() {
        fetch(getFiledUrl, reqOptions)
            .then(async response => {
                console.log(response)
                const  data = await response.json()
                if (response.status !== 200) {
                    console.log("Ошибка!!!")
                } else {
                console.log(data);                
                setFCurPlayers(data.crPayerList);
                setStepArr(data.plSteps);
                setResultStr(data.winnerOrDraw);
                }
            })
            .catch(error => {
                console.log("Ошибка сервера!")
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

    function readFields() {
        for (var i = 0; i < stepArr.length; i++) {        
            (function (i) {
                setTimeout(function () {
                    setField(stepArr[i]);
                }, 1000 * i);
            })(i);
            
            if(i === stepArr.length-1) {
                (function (i) {
                    setTimeout(function () {
                        setHiddenResultStr(false); 
                        setIsRead(true);
                    }, 1000 * i);
                })(i);                
            }
        };          
    }

    function back() {
        window.location.href='/steps';
        setHiddenResultStr(true);
    }
    return (
        <div className="flex">
            <div className="main flex">

                <div className="space purent">
                    <div className="pls" >
                        {fCurPlayers != null ?    
                            <div>                           
                                {fCurPlayers[0]} <br/> {fCurPlayers[1]} 
                                <br/>
                                <div className="err m-top" hidden={hiddenResultStr}>
                                {resultStr}
                                </div>
                                
                            </div>  : null
                        }
                    </div> 

                    <div>
                        <button className="button red"
                                onClick={() => readFields()}  
                                disabled={isRead}                                      
                        > Воспроизвести игру
                        </button>
                        <button className="button blue"
                                onClick={() => back()}
                        > Вернуться
                        </button>
                    </div>    
                </div>

                <div className="space" >
                    <div >
                        <button className='game-button' value={"11"} > 
                            {f(field[0][0])}
                        </button>
                        <button className='game-button' value={"12"} >
                            {f(field[0][1])}
                        </button>
                        <button className='game-button' value={"13"} >
                            {f(field[0][2])}
                        </button>
                    </div>
                    <div>
                        <button className='game-button' value={"21"} >
                            {f(field[1][0])}
                        </button>
                        <button className='game-button' value={"22"} >
                            {f(field[1][1])}
                        </button>
                        <button className='game-button'value={"23"} >
                            {f(field[1][2])}
                        </button>
                    </div>
                    <div>
                        <button className='game-button' value={"31"} >
                            {f(field[2][0])}
                        </button>
                        <button className='game-button' value={"32"} >
                            {f(field[2][1])}
                        </button>
                        <button className='game-button'value={"33"} >
                            {f(field[2][2])}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}