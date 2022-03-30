import React, {useState, useEffect} from 'react';

export default function Main() {

    // Состояние компонента Main
    const [showPlayersForm, setShowPlayersForm] = useState(true);
    const [showButton, setShowButton] = useState(false); 

    const [player1, setPlayer1] = useState('');
    const [player1Valid, setPlayer1Valid] = useState(true);
    const [player2, setPlayer2] = useState('')
    const [player2Valid, setPlayer2Valid] = useState(true);   
    const [formValid, setFormValid] = useState(true);

    useEffect(() => {
        if (player1.length>2 && player2.length>2) {
            setFormValid(true)
        } else setFormValid(false)
    }, [player1, player1Valid, player2, player2Valid])

    function play(event) {
        // event.preventDefault();
        setShowPlayersForm(true); // спрятали форму
        const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    player1: {name: player1, id: 1, symbol: "X"},
                    player2: {name: player2, id: 2, symbol: "O"}
                    })
            };
            console.log(requestOptions)

        fetch('http://localhost:8080/gameplay/addPlayers', requestOptions)
            .then(async response => {
                console.log(response)
                console.log(response.status)
                if (response.status === 400) {
                    console.log("Ошибка, status - 400!")
                } else {                    
                    window.location.href='/steps'
                }
            })
            .catch(error=>{
                console.log("Серьезная ошибка!")
                console.log(error)
            })
    }

    function showForm() {
        setShowPlayersForm(false);
        setShowButton(true);
    }

    // === Добавляем стилевой класс - error
    function fieldError(fieldNameValid) {
        return (fieldNameValid ? " ": 'input-field-error');
    }

    //======= Валидация plaeyr1 =======
    function validatePlayer1(player1){
        if (player1.length > 2) {
            setPlayer1Valid(true)
        } else {
            setPlayer1Valid(false)
        }
    }

     //======= Валидация plaeyr2 =======
     function validatePlayer2(player2){
        if (player2.length > 2 && player1 != player2) {           
            setPlayer2Valid(true)                      
        } else {
            setPlayer2Valid(false)
        }
    }

    // сработывает при потере полем фокуса
    function blurHandler(event) {
        switch (event.target.name) {
            case 'plaeyr1':
                if (player1.length === 0) {
                    setPlayer1Valid(true) // что бы граница поля не была красного цвета
                }
                break
            case 'plaeyr2':
                if (player2.length === 0) {
                    setPlayer2Valid(true) // что бы граница поля не была красного цвета
                }
                break
        }
    }

    // обработчик поля player1
    function player1Handler(event){
        let editPlayer1 = event.target.value
        setPlayer1(editPlayer1)
        validatePlayer1(editPlayer1)
    }
    function player2Handler(event){
        let editPlayer2 = event.target.value
        setPlayer2(editPlayer2)
        validatePlayer2(editPlayer2)
    }

    function cleanPlayer1() {
        setPlayer1('')  // очистили содержимое
        setPlayer1Valid(false) // поле невалидно
    }
    function cleanPlayer2() {
        setPlayer2('')
        setPlayer2Valid(false)
    }

    return (
        <>
            <div className="flex">
                <div className="space" >
                    <button hidden={showButton}  className="button blue m-top"
                            onClick={() => {showForm()} }>
                            Начать игру
                    </button>
            
                    <div hidden={showPlayersForm} className={"m-top"}>
                        <label className="label">Имя первого игрока</label>
                        <input 
                            type="text"
                            name="name1"
                            placeholder=""
                            className={`input-field ${fieldError(player1Valid)}`}
                            value={player1}
                            onChange={player1Handler}
                            onDoubleClick={cleanPlayer1}
                            onBlur={blurHandler}
                        />
                        <label className="label">Имя второго игрока</label>
                        <input 
                            type="text"
                            name="name2"
                            placeholder=""
                            className={`input-field ${fieldError(player2Valid)}`}
                            value={player2}
                            onChange={player2Handler}
                            onDoubleClick={cleanPlayer2} // срабатывает при двойном клике
                            onBlur={blurHandler}
                        />
                        <button className="button red m-top"
                        onClick={() => {play()} }
                        disabled={!formValid}>
                            Играть
                        </button>

                    </div>                    
                </div>
            </div>
                

                

            {/* <Link to="/set-players" className='main-link'>   
                    Начать новую игру
            </Link> */}
                
        </>        
    );
}