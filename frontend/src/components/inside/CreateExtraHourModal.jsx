import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import UserService from '../service/UserService';
import { AuthContext } from '../context/AuthContext';
import { Select, Input } from "antd";
const { Search } = Input;

const CreateModal = () => {

    //const [employeeId, setEmployeeId] = useState('');
    const { isAuthenticated, auth, logout } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hourTypes, setHourTypes] = useState([]);

    const initialFormState = {
        employeeId: '',
        employeeName: '',
        jobName: '',
        salary: '',
        areaName: '',
        percentage: '',
        description: '',
        startDatetime: '',
        endDatetime: '',
        hourPrice: '',
        amountExtraHours: '',
        comments: '',
        totalExtraHour: '',
        totalPayment: '',
        hourTypeId: undefined,
        //id: undefined,
    }

    const [formData, setFormData] = useState({ initialFormState });

    //Para calcular en pantalla la cantidad de horas extras
    const calculateHours = useMemo(() => (startDate, endDate) => {
        if (!startDate || !endDate) return 0;

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Diferencia en milisegundos
        const diff = end - start;

        // Convertir a horas con dos decimales
        //const hours = (diff / (1000 * 60 * 60)).toFixed(2);
        //return parseFloat(hours);
        return parseFloat((diff / (1000 * 60 * 60)).toFixed(2));

    }, []);

    //Calcular l salario total con la suma de horas extras
    const calculateTotals = useMemo(() => (hours, hourPrice, percentage, salary) => {
        if (!hours || !hourPrice || !percentage || !salary) return { totalExtraHour: 0, totalPayment: 0 };

        // Convertir los valores a números
        const numHours = parseFloat(hours);
        const numHourPrice = parseFloat(hourPrice);
        const numPercentage = parseFloat(percentage);
        const numSalary = parseFloat(salary);

        // Calcular totalExtraHour
        const totalExtra = (numHourPrice * (numPercentage / 100)).toFixed(2);

        // Calcular totalPayment
        const totalPay = (numSalary + parseFloat(totalExtra)).toFixed(2);

        return {
            totalExtraHour: totalExtra,
            totalPayment: totalPay
        };
    }, []);

    //Para cangar el combox o menú del tipo de horas
    useEffect(() => {
        const loadHourTypes = async () => {
            try {
                const types = await UserService.getHourTypes(auth.token);
                setHourTypes(types);
            } catch (error) {
                console.error("Error cargando tipos de horas:", error.message);
            }
        };

        if (isAuthenticated) {
            loadHourTypes();
        }

    }, [auth.token, isAuthenticated]);

    const searchUser = useCallback(async (employeeId) => {
        if (!employeeId) return;

        //e.preventDefault();
        setIsLoading(true);
        try {
            //setLoading(true);
            const userData = await UserService.searchUser(auth.token, employeeId);
            //setError(null);
            //return userData;
            console.log("RESPUESTA DESDE LA BUSQUEDA: ", userData);
            // Check if the response is okay
            /*if (!userData.ok) {
                throw new Error('Error fetching employee information', userData);
            }*/

            // Since userData is already a parsed object, we can use it directly
            setFormData(prev => ({
                ...prev,
                employeeId: userData.employeeId,
                employeeName: userData.employeeName,
                jobName: userData.jobName,
                salary: userData.salary?.toString() || '',
                hourPrice: userData.hourPrice?.toString() || '',
                areaName: userData.areaName,
            }));

            //return userData;
            setError(null);

        } catch (err) {
            console.error('Error consultado el empleado:', err);
            setError('Error consultado el empleado:' + err.message);
            //return null;
            setFormData(initialFormState);
        } finally {
            setIsLoading(false);
        }
    }, [auth.token, initialFormState]);

    //Para ir capturando el valor del campo tipo de horas
    const handleHourTypeChange = useCallback((value) => {
        const selectedType = hourTypes.find(type => type.id === value);
        if (!selectedType) {
            alert("Tipo de hora extra inválido");
            return;
        }
        setFormData(prev => ({
            ...prev,
            hourTypeId: value,
            //id: value,
            percentage: selectedType?.percentage || '',
            description: selectedType?.description || ''
        }));
    }, [hourTypes]);

    //Para ir capturando el valor de los campos (fechas, precio hora, porcentaje, salario) cuando se va escribiendo
    const handleDateChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Calcular horas si tenemos ambas fechas
            if (newData.startDatetime && newData.endDatetime) {
                const hours = calculateHours(newData.startDatetime, newData.endDatetime);
                newData.amountExtraHours = hours;

                // Calcular totales si tenemos todos los datos necesarios
                if (hours && newData.hourPrice && newData.percentage && newData.salary) {
                    const totals = calculateTotals(
                        hours,
                        newData.hourPrice,
                        newData.percentage,
                        newData.salary
                    );
                    newData.totalExtraHour = totals.totalExtraHour;
                    newData.totalPayment = totals.totalPayment;
                }
            }

            return newData;
        });
    }, [calculateHours, calculateTotals]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Check authentication first
        if (!isAuthenticated) {
            setError('Usuario no autenticado');
            return;
        }

        // Validate required fields
        if (!formData.employeeId || !formData.comments) {
            //alert('Por favor ingrese el ID del empleado y los comentarios');
            //setIsLoading(false);
            setError('Por favor ingrese el ID del empleado y los comentarios');
            return;
        }

        setIsLoading(true);

        try {

            // Prepare the request data
            const requestData = {
                hourPrice: parseFloat(formData.hourPrice),
                startDatetime: formData.startDatetime,
                endDatetime: formData.endDatetime,
                amountExtraHours: parseInt(formData.amountExtraHours),
                comments: formData.comments,
                totalExtraHour: parseFloat(formData.totalExtraHour),
                totalPayment: parseFloat(formData.totalPayment),
                percentage: formData.percentage,
                description: formData.description,
                employee: {
                    employeeId: formData.employeeId
                },
                extraHourType: {
                    id: formData.hourTypeId
                    //id: formData.id
                }
            };

            console.log("CONST DATA", requestData);

            // Update the UserService method to accept the form data
            const response = await UserService.insertUserExtraHours(auth.token, requestData);

            // Handle successful response
            //if (response.success) {
            if (response.ok) {
                alert(`Datos guardados con éxito.`);
                //`Datos guardados con éxito. ${response.message}. Registro: ${JSON.stringify(response.record)}`

                // Optional: Reset form or close modal
                setFormData(initialFormState);
                // onClose();
            } else {
                //alert(`Error al insertar la información: ${response.error}`);
                setError(`Error al insertar la información: ${response.error}`);
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            //alert(`Error: ${error.message}`);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            <form id="horasExtrasForm" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <h2>Crear nuevo registro</h2>
                    <div>ID</div>
                    <div className="flex">
                        <Search
                            placeholder="ingrese el id del empleado"
                            onSearch={searchUser}
                            enterButton
                            loading={isLoading}
                        />
                    </div>

                    <div className="col-span-2 space-y-2">
                        <EmployeeInfo formData={formData} />
                    </div>

                    {/*<div className="col-span-2">
                        {/*<h6>Nombre Empleado: <span className="text-red-500">{formData.employeeName}</span></h6>*/}
                    {/*<h6>Nombre Empleado: <p style={{ color: 'red' }}>{formData.employeeName}</p></h6>
                        <h6>Cargo: <p style={{ color: 'red' }}>{formData.jobName}</p></h6>
                        <h6>Salario: <p style={{ color: 'red' }}>{formData.salary}</p></h6>
                        <h6>Area: <p style={{ color: 'red' }}>{formData.areaName}</p></h6>
                        <h6>Hour Price: <p style={{ color: 'red' }}>{formData.hourPrice}</p></h6>
                    </div>*/}

                    <div>Tipo de Hora Extra</div>
                    <Select
                        name="hourTypeId"
                        value={formData.hourTypeId}
                        onChange={handleHourTypeChange}
                        placeholder="Seleccione el tipo de hora extra"
                        options={hourTypes.map(type => ({
                            value: type.id,
                            label: `${type.description} (${type.percentage}%)`
                        }))}
                    />

                    {/* Example fields to use with div labels */}
                    {/*<div>% H/Extra</div>
                    <Input name="percentage" label="% H/Extra" value={formData.percentage} onChange={handleHourTypeChange} />*/}

                    {/*<div>Desc H/Extra</div>
                    <Input name="description" label="Desc H/Extra" value={formData.description} onChange={handleHourTypeChange} />*/}

                    {/*<div>startDatetime</div>
                    <Input name="startDatetime" label="startDatetime" value={formData.startDatetime} onChange={handleDateChange} />

                    <div>endDatetime</div>
                    <Input name="endDatetime" label="endDatetime" value={formData.endDatetime} onChange={handleDateChange} />*/}

                    <FormField
                        label="Start Date"
                        type="datetime-local"
                        name="startDatetime"
                        value={formData.startDatetime}
                        onChange={handleDateChange}
                    />

                    <FormField
                        label="End Date"
                        type="datetime-local"
                        name="endDatetime"
                        value={formData.endDatetime}
                        onChange={handleDateChange}
                    />

                    <FormField
                        label="Extra Hours"
                        name="amountExtraHours"
                        value={formData.amountExtraHours}
                        disabled
                    />

                    <FormField
                        label="Comments"
                        name="comments"
                        value={formData.comments}
                        onChange={handleInputChange}
                    />

                    <FormField
                        label="Total Extra Hours Value"
                        name="totalExtraHour"
                        value={formData.totalExtraHour}
                        disabled
                    />

                    <FormField
                        label="Total Payment with Extra Hours"
                        name="totalPayment"
                        value={formData.totalPayment}
                        disabled
                    />
                </div>
                <button type="submit"
                    disabled={isLoading || !isAuthenticated}
                    className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded ${(isLoading || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                >Send
                    {isLoading ? 'Enviando...' : 'Enviar'}
                </button>
            </form>
        </div>
    );

};

// Extracted components for better organization
const EmployeeInfo = ({ formData }) => (
    <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded">
        <InfoField label="Employee Name" value={formData.employeeName} />
        <InfoField label="Position" value={formData.jobName} />
        <InfoField label="Salary" value={formData.salary} />
        <InfoField label="Area" value={formData.areaName} />
        <InfoField label="Hour Price" value={formData.hourPrice} />
    </div>
);

const InfoField = ({ label, value }) => (
    <div>
        <span className="font-semibold">{label}:</span>
        <span className="ml-2 text-red-500">{value}</span>
    </div>
);

const FormField = ({ label, ...props }) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <Input {...props} className="w-full" />
    </div>
);

export default CreateModal;