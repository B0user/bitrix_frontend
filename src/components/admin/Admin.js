import { Link } from "react-router-dom";

const Admin = () => {
    return (
        <>
            <h1>Админ-панель</h1>
            <br />
            <Link to="users">Пользователи</Link>
            <br />
            <Link to="models">Модели</Link>
            <br />
            <div className="flexGrow">
                <Link to="/">Главная</Link>
            </div>
        </>
    )
}

export default Admin
