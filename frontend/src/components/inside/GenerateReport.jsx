import React from "react";
import * as XLSX from "xlsx";
/*
 * Tipo de Script: Component.
 * Nombre: GenerateReport.
 * Parametros:
 * @param Data: data es un json con la información de las horas extras trabajadas por los empleados.
 * Descripción: Este componente es un boton qu permite generar un reporte en excel con la información generada hasta la fecha al dar click en este.
 */
const GenerateReport = ({ data }) => {
    const handleDownload = () => {
        /*
         * Se crea una hoja de calculo con la información recibida "data"
         * luego se crea un libro y se agrega a la hoja de calculo, despues
         * se genera como tal el archivvo de excel y se procede a la descarga
         */
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Horas Extras Ingeniería");
        XLSX.writeFile(wb, "ReporteHorasExtrasIngenieria.xlsx");
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
