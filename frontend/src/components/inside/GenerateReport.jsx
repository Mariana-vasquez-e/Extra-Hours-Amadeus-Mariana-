import React, {useState, useEffect } from "react";
import * as XLSX from "xlsx";
/*
 * Tipo de Script: Component.
 * Nombre: GenerateReport.
 * Parametros:
 * @param Data: data es un json con la información de las horas extras trabajadas por los empleados.
 * Descripción: Este componente es un boton qu permite generar un reporte en excel con la información generada hasta la fecha al dar click en este.
 */
const GenerateReport = ({ data }) => {
    const [extraHours, setExtraHours] = useState([]);
    let newData = data.map((hour) => ({
                id: hour.id,
                employeeId: hour.employee.employeeId,
                employeeName: hour.employee.employeeName,
                jobName: hour.employee.job.jobName ,
                salary: hour.employee.salary,
                areaName: hour.employee.area.areaName,
                amountExtraHours: hour.amountExtraHours,
                startDatetime: hour.startDatetime,
                endDatetime: hour.endDatetime,
                totalExtraHour: hour.totalExtraHour,
                totalPayment: hour.totalPayment,
                comments: hour.comments,
            }));
    const handleDownload = () => {
        /*
         * Se crea una hoja de calculo con la información recibida "data"
         * luego se crea un libro y se agrega a la hoja de calculo, despues
         * se genera como tal el archivvo de excel y se procede a la descarga
         */
        const ws = XLSX.utils.json_to_sheet(newData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Horas Extras reporte");
        XLSX.writeFile(wb, "ReporteHorasExtrasreporte.xlsx");
    };
    return (
        <button
            onClick={handleDownload}
            type="primary"
            style={{
                marginBottom: "16px",
                borderRadius: "5px",
                backgroundColor: "#0A66C2",
                color: "#fff",
                padding: "10px",
                borderColor: "#0A66C2",
                margin: "20px",
            }}
        >
            Descargar Reporte
        </button>
    );
};

export default GenerateReport;
