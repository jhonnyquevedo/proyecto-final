import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './Detalle.css';
import { GiGearStick } from "react-icons/gi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { MdOutlineWatchLater } from "react-icons/md";
import { IoPricetagsOutline } from "react-icons/io5";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { LiaTachometerAltSolid } from "react-icons/lia";
import { IoLogoModelS } from "react-icons/io";
import { LiaClipboardListSolid } from "react-icons/lia";
import Swal from 'sweetalert2';
import { endpoint } from '../../assets/config';

function Detalle() {
    const { id_publicacion } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const usuarioActual = location.state?.usuarioActual || null;
    const [vehiculo, setVehiculo] = useState({});
    const [contacto, setContacto] = useState({})

    useEffect(() => {
        fetchDataVehiculo(id_publicacion);
        getContacto()
    }, []);

    const getContacto = async () => {
        try {
            const res = await fetch(`${endpoint}/detalle/user/${id_publicacion}`)
            const data = await res.json()
            setContacto(data)
        } catch (error) {
            console.log(error)
        }
    }
    console.log(contacto)


    const fetchDataVehiculo = async (id_publicacion) => {
        try {
            const res = await fetch(`${endpoint}/detalle/${id_publicacion}`);
            const data = await res.json();
            if (data.code === 404) {
                Swal.fire({
                    icon: 'error',
                    iconColor: 'red',
                    title: 'Error',
                    text: 'Publicación no encontrada',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#76ABAE',
                }).then(() => {
                    navigate('/vehiculos');
                })
            } else if (data.code === 200) {
                setVehiculo(data.rows[0]);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                iconColor: 'red',
                title: 'Error',
                text: 'Error al obtener los datos del vehículo',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#76ABAE',
            }).then(() => {
                navigate('/vehiculos');
            })
            console.error('Error fetching vehiculo:', error);
        }
    };

    const contactarVendedor = () => {
        Swal.fire({
            title: '¿Deseas contactar al vendedor?',
            showCancelButton: true,
            confirmButtonText: 'Enviar email',
            confirmButtonColor: '#76ABAE',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: 'gray',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    html: `
                        <p><b>Nombre:</b> ${contacto.nombre}</p>
                        <p><b>Email:</b> ${contacto.email}</p>
                        <p><b>Teléfono:</b> ${contacto.telefono}</p>`,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#76ABAE',
                }).then(() => {
                    navigate(`/vehiculos`);
                })
            }
        })
    };


    const esPropietario = vehiculo.id_usuario === usuarioActual;
    console.log(vehiculo)
    return (
        <div className="detalleVehiculo">
            <h1>{vehiculo.titulo}</h1>
            <div className="detalleVehiculo2">

                <div className="imagenVehiculo">
                    <img className='imagen-detalle' src={vehiculo.imagen} alt={vehiculo.titulo} />
                </div>

                <div>
                    <h2> <MdOutlineAttachMoney className='iconoDetalle' />  Precio: {vehiculo.precio}</h2>
                    <hr />
                    <p><b> <MdOutlineWatchLater className='iconoDetalle' />  Estado:</b> {vehiculo.estado}</p>
                    <hr />
                    <p><b> <LiaClipboardListSolid className='iconoDetalle' />  Categoría:</b> {vehiculo.categoria}</p>
                    <hr />
                    <p><b> <IoPricetagsOutline className='iconoDetalle' />  Marca:</b> {vehiculo.marca}</p>
                    <hr />
                    <p><b> <IoLogoModelS className='iconoDetalle' />  Modelo:</b> {vehiculo.modelo}</p>
                    <hr />
                    <p><b> <HiOutlineCalendarDays className='iconoDetalle' />  Año:</b> {vehiculo.año}</p>
                    <hr />
                    <p><b> <LiaTachometerAltSolid className='iconoDetalle' />  Kilometraje:</b> {vehiculo.kilometraje}</p>
                    <hr />
                    <p><b> <GiGearStick className='iconoDetalle' /> Transmisión: </b>{vehiculo.transmision}</p>
                    <hr />

                    <p><b>Descripción:</b> {vehiculo.descripcion}</p>
                </div>
            </div>

            {!esPropietario && (
                <button onClick={() => contactarVendedor(vehiculo.marca)}>Contactar al vendedor</button>
            )}
        </div>
    );
}

export default Detalle;
