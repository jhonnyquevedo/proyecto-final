import './EditarPublicacion.css'
import { useState, useEffect } from "react"
import { opciones } from "../../../public/opciones"; // de aca nos estamos trayendo las opciones que deberian estar en la base de datos, para poder mapear las opciones disponibles
import { useParams, useNavigate } from 'react-router-dom';

const formatNumber = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

function EditarPublicacion() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [vehiculoEditado, setVehiculoEditado] = useState({
        titulo: '',
        precio: '',
        estado: '',
        marca: '',
        modelo: '',
        año: '',
        kilometros: '',
        transmision: '',
        categoria: '',
        descripcion: '',
        imagen: '',
    });

    useEffect(() => {
        getPublicacionById(id) // llamado a la api de la data de la publicacionque estamos editando
    }, [id])

    const getPublicacionById = async (id) => {
        try {
            const res = await fetch(`/vehiculos/${id}`);
            const dataDePublicacion = await res.json();
            setVehiculoEditado(dataDePublicacion);
        } catch (error) {
            console.log("Error al obtener la publicación:", error);
        }
    };

    const handleChangeMarca = (event) => {
        const { name, value } = event.target;
        setVehiculoEditado({ ...vehiculoEditado, [name]: value });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
    
        // Si el campo es 'precio', elimina los puntos para que se pueda formatear correctamente
        if (name === 'precio' || name === 'kilometros') {
          const rawValue = value.replace(/\./g, '');
          if (!isNaN(Number(rawValue))) {
            setVehiculoEditado({ ...vehiculoEditado, [name]: formatNumber(rawValue) });
          }
        } else {
          setVehiculoEditado({ ...vehiculoEditado, [name]: value });
        }
      };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setVehiculoEditado({ ...vehiculoEditado, imagen: URL.createObjectURL(file) });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // hacer la peticion PUT con el id_publicacion para actualizar
        console.log('Datos del vehículo:', vehiculoEditado);
        alert('Datos enviados exitosamente. Revisa la consola para ver los datos.');
        navigate('/mis-publicaciones')
    };

    const getModeloPorMarca = (marca) => {
        const marcaElegida = opciones[0].opcionMarcaYModelo.find(element => element.nombre === marca);
        return marcaElegida ? marcaElegida.modelos : [];
    };

    return (
        <div className="container-edit-publicacion">
            <h1 className="title-edit-publicacion">Editar información de tu aviso</h1>

            <form onSubmit={handleSubmit} className="form-vehiculo">
                <label>
                    Título
                    <input
                        type="text"
                        name="titulo"
                        value={vehiculoEditado.titulo}
                        onChange={handleChange}
                        required
                    />
                </label>
                <div className="inline-fields">

                    <label>
                        Estado
                        <select
                            name="estado"
                            value={vehiculoEditado.estado}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Estado</option>
                            {opciones[0].opcionesEstado?.map((estado, index) =>
                                <option value={estado} key={index} >{estado}</option>
                            )}
                        </select>
                    </label>
                    <label>
                        Categoría
                        <select
                            name="categoria"
                            value={vehiculoEditado.categoria}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Categoria</option>
                            {opciones[0].opcionesCategoria?.map((categoria, index) =>
                                <option value={categoria} key={index}>{categoria}</option>
                            )}
                        </select>
                    </label>
                </div>
                <div className="inline-fields">
                    <label>
                        Marca
                        <select
                            name="marca"
                            value={vehiculoEditado.marca}
                            onChange={handleChangeMarca}
                            required
                        >
                            <option value="">Marca</option>
                            {opciones[0].opcionMarcaYModelo?.map((marca, index) =>
                                <option value={marca.nombre} key={index}>{marca.nombre}</option>
                            )}
                        </select>
                    </label>
                    <label>
                        Modelo
                        <select
                            name="modelo"
                            value={vehiculoEditado.modelo}
                            disabled={!vehiculoEditado.marca}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Modelo</option>
                            {getModeloPorMarca(vehiculoEditado.marca).map((modelo, index) =>
                                <option value={modelo} key={index}>{modelo}</option>
                            )}
                        </select>
                    </label>
                </div>
                <div className="inline-fields">
                    <label>
                        Año
                        <select
                            type="number"
                            name="año"
                            value={vehiculoEditado.año}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Año</option>
                            {opciones[0].opcionAño?.map((año, index) =>
                                <option value={año} key={index}>{año}</option>
                            )}
                        </select>
                    </label>
                    <label>
                        Kilómetros
                        <input
                            type="text"
                            name="kilometros"
                            value={vehiculoEditado.kilometros}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div className="inline-fields">
                    <label>
                        Transmisión
                        <select
                            name="transmision"
                            value={vehiculoEditado.transmision}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Transmision</option>
                            {opciones[0].opcionTransmision.map((transmision, index) =>
                                <option value={transmision} key={index}>{transmision}</option>
                            )}
                        </select>
                    </label>
                    <label>
                        Precio
                        <input
                            type="text"
                            name="precio"
                            value={vehiculoEditado.precio}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <label>
                    Descripción
                    <textarea
                        name="descripcion"
                        value={vehiculoEditado.descripcion}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Imagen
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                </label>
                {vehiculoEditado.imagen && <img src={vehiculoEditado.imagen} alt="Vehículo" className="imagen-vehiculo" />}

            </form>
            <div className="btn-editar">
                <button type="submit" className="boton-editar-aviso">Actualizar</button>
            </div>
        </div>

    )
}

export default EditarPublicacion