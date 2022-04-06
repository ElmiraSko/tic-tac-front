import React, {useState, useEffect} from 'react';

export default function AllGames() {

    const [allGames, setAllGames] = useState([]);  

    let allGamesUrl = "http://localhost:8080/gameplay/get-games";

    const reqOptions = {
        method: 'GET'
    };

    // Выполняется один раз при отрисовки страницы
    useEffect(() => {
        getAllPlayers();
    }, [])


    // Получение игроков
    function getAllPlayers() {    
        fetch(allGamesUrl, reqOptions)
            .then(async response => {
                console.log(response)
                const  data = await response.json();
                if (response.status !== 200) {
                    console.log("Ошибка, status не 200!")
                } else {
                    setAllGames(data)
                }
            })
            .catch(error=>{
                console.log("Ошибка сервера!")
                console.log(error)
            })
    }

    function back() {
        window.location.href='/steps';
    }

    return (
    <div className=" flex">
        <div className="main">
            <div className="left">
            <button className="link m-top"
                onClick={() => back()}
                > Вернуться
            </button>
            </div>
            
            <div>
                <h3>Страница в разработке</h3>            
                {allGames.length > 0 ? allGames.map(game =>
                    <li key={game.id}>
                        Игра - {game.id}
                    </li> ) : null }
            </div>
        </div>     
           
    </div>
    );
}