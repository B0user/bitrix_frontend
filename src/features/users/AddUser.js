import { useRef, useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link, useNavigate} from "react-router-dom";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const AddUser = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [roleUser, setRoleUser] = useState(true);
  const [roleClient, setRoleClient] = useState(false);
  const [roleSupport, setRoleSupport] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user])

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd, roleUser, roleClient])

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
        setErrMsg("Invalid Entry");
        return;
    }
    try {
      await axiosPrivate.post(
        '/users/',
        JSON.stringify({ 
            user: user,
            pwd: pwd, 
            roles: {
                User: roleUser,
                Client: roleClient,
                Support: roleSupport
            } 
        })
      );
      setSuccess(true);
      setUser('');
      setPwd('');
      setMatchPwd('');
      setRoleUser(false);
      setRoleClient(false);
      setRoleSupport(false);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        setErrMsg("Add process failed");
      }
      errRef.current.focus();
    }
  };

  const onRolesChange = (role, value) => {
    switch(role){
        case 'user':
            setRoleUser(value);
            break;
        case 'client':
            setRoleClient(value);
            break;
        case 'support':
            setRoleSupport(value);
            break;
    }
  }

  return (
    <>
      {success ? navigate('/panel/users') : (
        <>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Добавить нового пользователя</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username" className="form-label">
                Username:
                <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
            </label>
            <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                className="form-control"
                required
                aria-invalid={validName ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
            />
            <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                От 4 до 24 символов.<br />
                Должен содержать буквы.<br />
                Буквы, цифры, подчеркивания, символы разрешены.
            </p>


            <label htmlFor="password" className="form-label">
                Пароль:
                <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
            </label>
            <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                className="form-control"
                required
                aria-invalid={validPwd ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
            />
            <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                От 8 до 24 символов.<br />
                Должен содержать верхний и нижний регистр, цифру и специальный знак.<br />
                Разрешенные спец знаки: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </p>


            <label htmlFor="confirm_pwd" className="form-label">
                Подтверждение пароля:
                <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
            </label>
            <input
                type="password"
                id="confirm_pwd"
                onChange={(e) => setMatchPwd(e.target.value)}
                value={matchPwd}
                className="form-control"
                required
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
            />
            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                Должен совпадать с заданным паролем.
            </p>
            <br />            
            <fieldset>
                <legend>Роли:</legend>
                <div>
                    <input 
                        type="checkbox" 
                        id="user" 
                        onChange={(e)=>onRolesChange('user', e.target.checked)}
                        checked={roleUser}
                    />
                    <label htmlFor="user">Пользователь</label>
                </div>
                <div>
                    <input 
                        type="checkbox" 
                        id="client" 
                        onChange={(e) => onRolesChange('client', e.target.checked)}
                        checked={roleClient}
                    />
                    <label htmlFor="client">Клиент</label>
                </div>
                <div>
                    <input 
                        type="checkbox" 
                        id="support" 
                        onChange={(e) => onRolesChange('support', e.target.checked)}
                        checked={roleSupport}
                    />
                    <label htmlFor="support">Поддержка</label>
                </div>
            </fieldset>
            <br />
            <button disabled={!validName || !validPwd || !validMatch ? true : false}  className="btn btn-danger">Добавить</button>
          </form>
          <p>
            <span className="line">
              <Link to="/panel/users">Отмена</Link>
            </span>
          </p>
        </>
      )}
    </>
  );
};

export default AddUser;
