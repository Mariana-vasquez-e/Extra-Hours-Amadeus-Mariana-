import React, { useState, useEffect, useContext, useCallback } from 'react';
import UserService from '../service/UserService';
//import background from '../../assets/images/mainBackground.png';
import { AuthContext } from '../context/AuthContext';
import { Outlet, Link, useNavigate, Form } from 'react-router-dom';
import CreateModal from './CreateExtraHourModal';
//import UpdateModal from './UpdateExtraHoursModal';
//import DeleteModal from './DeleteExtraHoursModal';
import { Table, Button, Modal } from "antd";
import UpdateExtraHoursModal from './UpdateExtraHours';
import GenerateReport from "./GenerateReport";
//import EmployeeSearchModal from './EmployeeSearchModela';

const UsersExtraHours = () => {

    const [extraHours, setExtraHours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    //const [isModalOpen, setIsModalOpen] = useState(false);
    //const [selectedHour, setSelectedHour] = useState(null);
    const [selectedHour, setSelectedHour] = useState({});
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

    const showAddModal = () => {
        setIsAddModalVisible(true);
    };

    const handleAddOk = () => {
        setIsAddModalVisible(false);
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

    //useEffect(() => {

    //const FetchExtraHoursUsersByUser = async (email) => {
    const fetchExtraHoursUsersByUser = async () => {
        try {
            const data = await UserService.getAllExtraHoursUsersByUser(auth.token, auth.email);
            console.log("RESPUESTA DESDE EL SERVER: ", data);
            // Map the response to the structure expected by extraHours
            const formattedData = data.map(hour => ({
                id: hour.employeeId,
                employee: {
                    employeeId: hour.employeeId,
                    employeeName: hour.employeeName,
                    salary: hour.salary,
                    area: { areaName: hour.areaName },
                    job: { jobName: hour.jobName }
                },
                amountExtraHours: hour.amountExtraHours,
                startDatetime: hour.startDatetime,
                endDatetime: hour.endDatetime,
                totalExtraHour: hour.totalExtraHour,
                totalPayment: hour.totalPayment,
                extraHourType: {
                    description: hour.extraHourTypeDescription
                }
            }));
            setExtraHours(formattedData);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching user extra hours:', err);
            setError('Error loading user extra hours data');
            setLoading(false);
        }
    };

    useEffect(() => {

        if (isAuthenticated && auth.role === 'USER' && auth.email) {
            console.log("Auth state:", { isAuthenticated, role: auth.role, email: auth.email });
            fetchExtraHoursUsersByUser();
        }
    }, [isAuthenticated, auth.role, auth.email]);

    //}, [isAuthenticated, auth]);
    //useEffect(() => {


    console.log("ENTRA AL USE EFFECT");
    const fetchExtraHoursUsers = async () => {
        console.log("ENTRA AL USE EFFECT FECTH ADMIN");
        try {
            const data = await UserService.getAllExtraHoursUsers(auth.token);
            setExtraHours(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching extra hours:', err);
            setError('Error loading extra hours data');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && auth.role === 'ADMIN') {
            console.log("Auth state:", { isAuthenticated, role: auth.role, email: auth.email });
            fetchExtraHoursUsers();
        }
    }, [isAuthenticated, auth.role]);

    // Función para confirmar la eliminación
    const handleDeleteOk = async (e) => {
        e.preventDefault();
        if (!selectedHour || !selectedHour.id) {
            alert("No se pudo encontrar el registro a eliminar.");
            return;
        }

        try {
            await UserService.deleteExtraHour(auth.token, selectedHour.id);
            //setExtraHours(extraHours.filter((hour) => hour.id !== id));
            //setDeleteModalOpen(false);            
            setExtraHours((prev) => prev.filter((hour) => hour.id !== selectedHour.id)); // Elimina el registro localmente
            setIsDeleteModalVisible(false); // Cierra el modal
            setSelectedHour(null); // Limpia el estado
            //window.location.reload(); // Recarga toda la página
        } catch (err) {
            console.error('Error deleting extra hour:', err);
            setError('Error deleting extra hour');
        } finally {
            setIsDeleteModalVisible(false);
            setSelectedHour(null); // Limpia el estado
        }
    };

    // Función para abrir el modal de confirmación de eliminación
    const handleDeleteClick = (hour) => {
        setSelectedHour(hour);
        setIsDeleteModalVisible(true);
        //setIsUpdateModalVisible(false); // Asegura que el modal de actualizar esté cerrado
    };

    // Función para cancelar la eliminación
    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
        setSelectedHour(null);
    };

    //Actulizar
    const handleUpdateOk = () => {
        setIsUpdateModalVisible(false);
    };

    const handleUpdateCancel = () => {
        setIsUpdateModalVisible(false);
    };

    const handleUpdateClick = (hour) => {
        setSelectedHour(hour);
        setIsUpdateModalVisible(true);
        setIsDeleteModalVisible(false); // Asegura que el modal de eliminar esté cerrado
    };

    if (loading) {
        return <div className="flex justify-center items-center p-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="table-container">
            <h2>Horas Extra Amadeus</h2>
            <Button
                type="primary"
                onClick={showAddModal}
                style={{ marginBottom: "16px" }}
            >
                Añadir horas extra
            </Button>
            <GenerateReport data={extraHours} />
            {extraHours.length > 0 ? (
                <div className="overflow-x-auto">
                    <center>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Id empleado</th>
                                    <th>Nombre Empleado</th>
                                    <th>Cargo</th>
                                    <th>Salario</th>
                                    <th>Area</th>
                                    <th>% H/Extra</th>
                                    <th>Desc H/Extra</th>
                                    <th>startDatetime</th>
                                    <th>endDatetime</th>
                                    <th>hourPrice</th>
                                    <th>amountExtraHours</th>
                                    <th>comments</th>
                                    <th>totalExtraHour</th>
                                    <th>totalPayment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {extraHours.map((hour) => (
                                    <tr key={hour.id} className="hover:bg-gray-50">
                                        <td>{hour.id}</td>
                                        <td>{hour.employee.employeeId}</td>
                                        <td >{hour.employee.employeeName}</td>
                                        <td>{hour.employee.job.jobName}</td>
                                        <td>{hour.employee.salary}</td>
                                        <td>{hour.employee.area.areaName}</td>
                                        <td>{hour.extraHourType.percentage}</td>
                                        <td>{hour.extraHourType.percentage}</td>
                                        <td>{hour.startDatetime}</td>
                                        <td>{hour.endDatetime}</td>
                                        <td>{hour.hourPrice}</td>
                                        <td>{hour.amountExtraHours}</td>
                                        <td>{hour.comments}</td>
                                        <td>{hour.totalExtraHour}</td>
                                        <td>{hour.totalPayment}</td>
                                        {auth.role === "ADMIN"?<td>
                                            <Button className="update-button"
                                                type="primary"
                                                danger
                                                style={{ marginBottom: "16px" }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleUpdateClick(hour)
                                                }}
                                            >
                                                Actualizar
                                            </Button>
                                            <Button
                                                type="primary"
                                                danger
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteClick(hour)
                                                }} // Pasas el registro actual
                                            >
                                                Eliminar
                                            </Button>

                                            {/*<button className="update-button">
                                                <Link to={`/update-user/${hour.id}`}>
                                                    Update
                                                </Link>
                                                <button
                                                    className="update-button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedHour(hour);
                                                        setUpdateModalOpen(true);
                                                    }}
                                                >
                                                    Update
                                                </button>
                                            </button>
                                            <button className="delete-button">Delete</button>*/}
                                        </td>: <></>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </center>
                </div>
            ) : (
                <div className="text-center py-4 text-gray-500">
                    No se encontraron registros de horas extra
                </div>
            )}

            {/*<CreateModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreate={handleCreate}
                onSearch={searchUser}
            />*/}
            {/* Modal displaying the ExtraHours component */}
            <Modal
                title="Añadir Hora Extra"
                open={isAddModalVisible}
                onOk={handleAddOk}
                onCancel={handleAddCancel}
                footer={null} // Optional: Remove default footer if you want custom buttons
            >
                <CreateModal onClose={handleAddCancel}  setExtraHours={setExtraHours}/> {/* Render the ExtraHours form here */}
            </Modal>
            {/* Modal para actualizar horas extras */}
            <Modal
                title="Actualizar Hora Extra Empleado"
                open={isUpdateModalVisible}
                onOk={handleUpdateOk}
                onCancel={handleUpdateCancel}
                footer={null}
            >
                {selectedHour && <UpdateExtraHoursModal selectedHour={selectedHour} />}
            </Modal>
            <Modal
                title="Confirmar eliminación"
                open={isDeleteModalVisible}
                onOk={handleDeleteOk}
                onCancel={handleDeleteCancel}
                okText="Sí"
                cancelText="No"            >
                <p>
                    ¿Estás seguro de que deseas eliminar este registro?
                    <br />
                    ID: {selectedHour?.id} - Nombre: {selectedHour?.employee?.employeeName}
                </p>
            </Modal>
        </div>
    );
};

export default UsersExtraHours;