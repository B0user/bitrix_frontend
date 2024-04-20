import { Outlet, Link, useNavigate} from "react-router-dom"

const PanelLayout = ({ role }) => {
  const navigate = useNavigate();
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <aside className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-cp-nephritis ">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              {role === 2004 ? (
                <>
                  <li className="nav-item">
                    <Link to="/" className="nav-link align-middle px-0">
                      <i className="fs-4 bi-house" /> <span className="ms-1 d-none d-sm-inline">Главная</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/panel" className="nav-link px-0 align-middle">
                      <i className="fs-4 bi-speedometer2" /> <span className="ms-1 d-none d-sm-inline">Админ-панель</span> </Link>
                  </li>
                  <li>
                    <Link to="#submenu-users" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                      <i className="fs-4 bi-grid" /> <span className="ms-1 d-none d-sm-inline">Пользователи</span> </Link>
                    <ul className="collapse nav flex-column ms-4" id="submenu-users" data-bs-parent="#menu">
                      <li className="w-100">
                        <Link to="/panel/users" className="nav-link px-0"> <span className="d-none d-sm-inline">Посмотреть все</span></Link>
                      </li>
                      <li>
                        <Link to="/panel/users/add" className="nav-link px-0"> <span className="d-none d-sm-inline">Добавить новый</span></Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link to="#submenu-models" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                      <i className="fs-4 bi-grid" /> <span className="ms-1 d-none d-sm-inline">Модели</span> </Link>
                    <ul className="collapse nav flex-column ms-4" id="submenu-models" data-bs-parent="#menu">
                      <li className="w-100">
                        <Link to="/panel/models" className="nav-link px-0"> <span className="d-none d-sm-inline">Посмотреть все</span></Link>
                      </li>
                      <li>
                        <Link to="/panel/models/add" className="nav-link px-0"> <span className="d-none d-sm-inline">Добавить новый</span></Link>
                      </li>
                      <li>
                        <Link to="/panel/models/archieve" className="nav-link px-0"> <span className="d-none d-sm-inline">Архив</span></Link>
                      </li>
                    </ul>
                  </li>
                </>
              ) : navigate('')}
            </ul>
          </div>
        </aside>
        <article className="col py-3">
          <Outlet/>
        </article>
      </div>
    </div>
  )
}

export default PanelLayout