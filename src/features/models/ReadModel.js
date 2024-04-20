import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link, useNavigate, useParams } from "react-router-dom";
// import QRCode from '../qrcodes/QRCode';
import {BASE_URL} from "../../config";

const UPDATE_URL = "/models/exact";
const UPLOAD_URL = "/files/upload/models";

const ReadModel = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { id } = useParams();
  const errRef = useRef();

  const [product_id, setProduct_id]   = useState();
  const [client_id]   = useState();
  const [sizeA, setSizeA] = useState("");
  const [sizeB, setSizeB] = useState("");
  const [model, setModel] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [changedInfo, setChangedInfo] = useState(false);
  const [changedFile, setChangedFile] = useState(false);

  const [success, setSuccess] = useState(false);

  const { data: users, status: usersStatus } = useQuery(["users"], () =>
    axiosPrivate.get("/users").then((res) => res.data)
  );
  const { data: products, status: productsStatus } = useQuery(
    ["products"],
    () => axiosPrivate.get("/products/all").then((res) => res.data)
  );
  const { status: modelinfoStatus } = useQuery([`modelinfo-${id}`, id], () =>
    axiosPrivate.get(`/models/exact/${id}`).then((res) => {
      const info = res.data;
      setProduct_id(info.product_id);
      setSizeA(info.size.split("x")[0]);
      setSizeB(info.size.split("x")[1]);
      return info;
    })
  );

  if (
    usersStatus === "error" ||
    productsStatus === "error" ||
    modelinfoStatus === "error"
  )
    return <p>There was error loading data</p>;

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("model", model);
    formData.append('client_id', client_id);
    formData.append('product_id', product_id);
    try {

      // Add files to media
      if (changedFile) {
        const result = await axiosPrivate.post(UPLOAD_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const path = result.data.path;
        // Add to DB
        const response = await axiosPrivate.put(
          `${UPDATE_URL}/${id}`,
          JSON.stringify({
            size: `${sizeA}x${sizeB}`,
            model_path: path
          })
        );
        console.log(response);
      } else {
        const response = await axiosPrivate.put(
          `${UPDATE_URL}/${id}`,
          JSON.stringify({
            size: `${sizeA}x${sizeB}`,
          })
        );
        console.log(response);
      }
      setSuccess(true);
      setProduct_id('');
      setSizeA("");
      setSizeB("");
      setModel("");
    } catch (err) {
      if (!err?.response) setErrMsg("No Server Response");
      else setErrMsg("Update process failed");
      console.error(err);
      errRef.current.focus();
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.delete(`/models/${id}`);
      setSuccess(true);
      setSizeA("");
      setSizeB("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Delete process failed");
      }
      errRef.current.focus();
    }
  };
  const translateClient_id = (_id) => {
    try {
        const found = users.find(person => person._id === _id);
        return found.username;
    } catch (err) {
        console.error(err);
        return null;
    }
  }

  return (
    <>
      {success ? (
        navigate("..", { replace: true })
      ) : (
        <>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Информация о модели</h1>
          <form>
            <fieldset>
              <legend></legend>
              <label htmlFor="name">Товар:</label>
              {products?.length && users?.length ? (
                <select
                  disabled
                  value={product_id}
                  className="form-select"
                >
                  <option>None</option>

                  {products.map((prod, i) => (
                    <option key={i} value={prod._id}>
                      {prod.name} by {translateClient_id(prod.client_id)}
                    </option>
                  ))}
                </select>
              ) : (
                <p>нет товаров</p>
              )}

              <label htmlFor="size" className="form-label">
                Размер: (м)
              </label>
              <div
                className="sizes d-flex justify-content-between align-items-center"
                id="size"
              >
                <input
                  placeholder="A"
                  type="number"
                  id="sizeA"
                  onChange={(e) => {
                    setChangedInfo(true);
                    setSizeA(e.target.value);
                  }}
                  value={sizeA}
                  className="form-control me-2"
                  required
                />
                x
                <input
                  placeholder="B"
                  type="number"
                  id="sizeB"
                  onChange={(e) => {
                    setChangedInfo(true);
                    setSizeB(e.target.value);
                  }}
                  value={sizeB}
                  className="form-control ms-2"
                  required
                />
              </div>

              <label htmlFor="model" className="form-label">
                Загрузить модель
              </label>
              <input
                name="model"
                type="file"
                id="model"
                onChange={(e) => {
                  setChangedFile(true);
                  setModel(e.target.files[0]);
                }}
                className="form-control"
                required
              />
            </fieldset>
            <br />
            
            <div className="container-fluid text-white bg-primary text-center py-2">
                <span>Ссылка: <Link to={`${BASE_URL}/modelview/${client_id}/${product_id}?size=${sizeA}x${sizeB}`}>Посмотреть модель</Link></span>
                <br />
            </div>
            <br />
            <div>
              <button
                onClick={(e) => handleUpdate(e)}
                className="btn btn-cp bg-cp-nephritis col-8"
                disabled={(!changedInfo && !changedFile) ? true : false}
              >
                Обновить
              </button>
              <button
                onClick={(e) => handleDelete(e)}
                className="btn btn-cp bg-cp-pomegranate col-3 offset-1"
              >
                Удалить
              </button>
            </div>
          </form>
          <p>
            <span className="line">
            <Link to="..">Отмена</Link>
            </span>
          </p>
        </>
      )}
    </>
  );
};

export default ReadModel;
