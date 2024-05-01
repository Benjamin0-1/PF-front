import React, {useState, useEffect} from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";
import './DeleteProductById.css';

const accessToken = localStorage.getItem('accessToken');


function DeleteProductById() {
    const [generalError, setGeneralError] = useState('');
    const [productId, setProductId] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [missingIdError, setMissingIdError] = useState('');
    const [productNotFound, setProductNotFound] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkIsAdmin = async () => {

          try {
            const response = await FetchWithAuth('http://localhost:3001/product/profile-info', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(productId)
            });
            

            const data = await response.json();
            if (!data.is_admin) {
              window.location.href = '/notadmin';
            }
          } catch (error) {
            console.log(`error: ${error}`);
          }
        };
    
        checkIsAdmin();
      }, []);

    const handleDelete = async () => {
        try {

            if (!productId) {
                setMissingIdError('Debe incluir el ID de producto a eliminar');
                setGeneralError('');
                setSuccessMessage('');
                return;
            };
            

            setIsLoading(true);

            const response = await FetchWithAuth(`http://localhost:3001/product/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
            const data = await response.json();

            if (response.status === 404) {
                setProductNotFound(`No se ha encontrado el producto con id: ${productId}`);
                setGeneralError('');
                setMissingIdError('');
                setSuccessMessage('');
                return
            };

            setSuccessMessage(`Producto con id: ${productId} eliminado con exito`);
            setGeneralError('');
            setProductId('');
            setProductNotFound('');
            
        } catch (error) {
            console.log(`error: ${error}`);
            setGeneralError('Ha ocurrido un error');
        } finally{
            setIsLoading(false)
        }
    };

    // <-- of the product deletion components will be rendered inside the ParentProductDelete component.
    // then only that component will be added to the AdminNavBar component.
    return (
        <div className="DeleteProductById">
            <h2>Delete Product by ID</h2>
            <div>
                <input
                    type="text"
                    placeholder="Enter Product ID"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                />
                <button onClick={handleDelete}>Delete</button>
            </div>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
            {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
            {productNotFound && <p style={{color: 'red'}}>{productNotFound}</p>}
            {isLoading && <p> <strong>Deleting product...</strong> </p>}
        </div>
    )


};

export default DeleteProductById;
