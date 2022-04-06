import React, {useState, useEffect} from 'react';

export default function AllPlayers() {

    const [allPlayers, setAllPlayers] = useState([]);  

    let allPlayersUrl = "http://localhost:8080/gameplay/players";

    const reqOptions = {
        method: 'GET'
    };

    // Выполняется один раз при отрисовки страницы
    useEffect(() => {
        getAllPlayers();
    }, [])


    // Получение игроков
    function getAllPlayers() {    
        fetch(allPlayersUrl, reqOptions)
            .then(async response => {
                console.log(response)
                const  data = await response.json();
                if (response.status !== 200) {
                    console.log("Ошибка, status не 200!")
                } else {
                setAllPlayers(data)
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
                <h3>Список игроков:</h3>            
                {allPlayers.length > 0 ? allPlayers.map(pl =>
                    <li key={pl.id}>
                        {pl.name}, побед - {pl.winsCount}
                    </li> ) : null }
            </div>
        </div>     
           
    </div>
    );
}



