import { useRef, useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { faCommentsDollar } from "@fortawesome/free-solid-svg-icons";

const ADDMODEL_URL = '/models';
const UPLOAD_URL   = '/files/upload/models';

const AddModel = () => {
    const axiosPrivate                  = useAxiosPrivate();
    const navigate                      = useNavigate();
    const errRef                        = useRef();
    
    const [product_id, setProduct_id]   = useState();
    const [sizeA, setSizeA]             = useState();
    const [sizeB, setSizeB]             = useState();
    const [model, setModel]             = useState();
    
    const [errMsg, setErrMsg]           = useState("");
    const [success, setSuccess]         = useState(false);

    const { data:users, status:usersStatus} = useQuery(['users'], () => axiosPrivate.get('/users').then((res) => res.data));
    const { data:products, status:productsStatus} = useQuery(['products'], () => axiosPrivate.get('/products/all').then((res) => res.data));

    if (usersStatus === "error" || productsStatus === "error") return <p>There was error loading data</p>

    const translateClient_id = (_id) => {
        try {
            const found = users.find(person => person._id === _id);
            return found.username;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const product = await products.find((prod)=> prod._id === product_id);
        formData.append('model', model);
        formData.append('client_id', product.client_id);
        formData.append('product_id', product_id);
        try {
            // Add files to media
            const result = await axiosPrivate.post(
                UPLOAD_URL,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            const path = result.data.path;
            // Add to DB
            const response = await axiosPrivate.post(
                `${ADDMODEL_URL}/${product_id}`,
                JSON.stringify({
                    size: `${sizeA}x${sizeB}`,
                    model_path: path
                })
            );
            console.log(response);
            setSuccess(true);

            setProduct_id('');
            setSizeA('');
            setSizeB('');
            setModel('');
        } catch (err) {
            if (!err?.response) setErrMsg("No Server Response");
            else setErrMsg("Addition Failed");
            errRef.current.focus();
        }
    }


    return (
        <>
            {success 
                ? navigate('..', {replace: true }) 
                : (
                    <>
                    <p
                        ref={errRef}
                        className={errMsg ? "errmsg" : "offscreen"}
                        aria-live="assertive"
                    >
                        {errMsg}
                    </p>
                    <h1>Прикрепить модель</h1>
                    <form onSubmit={handleSubmit}>
                        <fieldset>
                            <legend></legend>
                            <label htmlFor="name">Выберите товар:</label>
                            {products?.length && users?.length
                                ? (
                                    <select onChange={(e) => setProduct_id(e.target.value)} 
                                    className="form-select">
                                        <option value="">None</option>
                                        
                                        {products.map( (product, i) => 
                                            <option 
                                            key={i} 
                                            value={product._id}
                                            > 
                                                {product.name} by { translateClient_id(product.client_id)}
                                            </option>
                                        )}
                                    </select>
                                )
                                : <p>Нет товаров</p>
                            }
                            
                            <label htmlFor="size" className="form-label">Размер: (см)</label>
                            <div className="sizes d-flex justify-content-between align-items-center" id="size">
                                <input
                                placeholder="A"
                                type="number"
                                id="sizeA"
                                onChange={(e) => setSizeA(e.target.value)}
                                value={sizeA}
                                className="form-control me-2"
                                required
                                /> 
                                x
                                <input
                                placeholder="B"
                                type="number"
                                id="sizeB"
                                onChange={(e) => setSizeB(e.target.value)}
                                value={sizeB}
                                className="form-control ms-2"
                                required
                                />
                            </div>
                            
                            <label htmlFor="model" className="form-label">Загрузить модель</label> 
                            <input 
                            name="model"
                            type="file" 
                            id="model" 
                            onChange={(e) => setModel(e.target.files[0])}
                            className="form-control"
                            required
                            />
                        
                        </fieldset>
                        <br />
                        <button className="btn btn-danger">Прикрепить</button>
                    </form>
                    <p>
                        <span className="line">
                        <Link to="..">Отмена</Link>
                        </span>
                    </p>

                    </>
            )}
        </>
    )
}

export default AddModel