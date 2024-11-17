class UserService {
    static BASE_URL = "http://localhost:8080";

    static async login(email, password) {
        try {
            const response = await fetch(`${UserService.BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Error en el inicio de sesión');
            }
            console.log("ESTA ES UNA RESPUESTA DESDE EL SERVICE REACT: ", response);
            return await response.json();

        } catch (err) {
            throw err;
        }
    }

    static async register(userData, token) {
        try {
            const response = await fetch(`${UserService.BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Error en el registro');
            }

            return await response.json();
        } catch (err) {
            throw err;
        }
    }

    static async getYourProfile(token) {

        try {
            const response = await fetch(`${UserService.BASE_URL}/adminuser/get-profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error en el registro');
            }

            return await response.json();
        } catch (err) {
            throw err;
        }
    }

    static async getAllExtraHoursUsers(token) {
        try {
            console.log("ANTES DE LISTAR LAS HORAS: ");
            const response = await fetch(`${UserService.BASE_URL}/list-eh`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            console.log(`DESPUES DE LISTAR LAS HORAS: ${token}`, response);

            if (!response.ok) {
                throw new Error('Error obteniendo las horas');
            }

            //console.log(`JSON DE LISTAR: `, response.json());

            // Store the JSON response in a variable instead of logging it directly
            const data = await response.json();
            console.log('JSON DE LISTAR: ', data);

            return data;

            //return await response.json();
        } catch (err) {
            console.error("error retornando las horas extras", err);
            throw err;
        }
    }

    static async getAllExtraHoursUsersByUser(token, email) {
        try {
            console.log("TRY HORAS POR USUARIO: ");
            const response = await fetch(`${UserService.BASE_URL}/list-eh-user?email=${email}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            console.log(`DESPUES HORAS POR USER: ${token}`, response);

            if (!response.ok) {
                throw new Error('Error obteniendo las horas');
            }

            //console.log(`JSON DE LISTAR: `, response.json());

            // Store the JSON response in a variable instead of logging it directly
            const data = await response.json();
            console.log('LISTAR HORAS USUARIOS JSON: ', data);

            return data;

            //return await response.json();
        } catch (err) {
            console.error("error retornando las horas extras", err);
            throw err;
        }
    }

    /* método para buscar antes de insertar un registros */
    static async searchUser(token, employeeId) {

        console.log("Token:", token);
        console.log("URL:", `${UserService.BASE_URL}/employee/${employeeId}`);

        try {
            const response = await fetch(`${UserService.BASE_URL}/employee/${employeeId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'  // Agregado por buena práctica
                },
            });
            console.log("RESPUESTA SERVER: ", response, employeeId);

            if (response.status === 403) {
                const error = await response.text();
                console.log("Error de autorización:", error);
                throw new Error('No tiene permisos para realizar esta acción');
            }

            if (!response.ok) {
                const error = await response.text();  // Para ver el mensaje de error
                console.error(`Error al encontrar el empleado: ${error}`);
                throw new Error(`Error al encontrar el empleado: ${error}`);
            }

            // Read the JSON response once and store it
            const employeeData = await response.json();
            console.log("resultado de buscar el empleado: ", employeeData);
            return employeeData;

        } catch (err) {
            console.error("Error eliminanado el usuario: ", err);
            throw err;
        }
    }

    /*Listar los tipos de horas */
    static async getHourTypes(token) {
        try {
            const response = await fetch(`${UserService.BASE_URL}/list-hour-types`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error obteniendo los tipos de horas extras');
            }

            return await response.json();
        } catch (error) {
            console.error("Error al obtener tipos de horas extras:", error);
            throw error;
        }
    }

    /* método para buscar antes de insertar un registros */
    static async insertUserExtraHours(token, formData) {

        console.log("Token:", token);
        console.log("URL:", `${UserService.BASE_URL}/create`);
        console.log("form Data: ", formData);

        try {
            const response = await fetch(`${UserService.BASE_URL}/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'  // Agregado por buena práctica
                },
                body: JSON.stringify(formData)
            });
            console.log("RESPUESTA SERVER: ", response);

            if (response.status === 403) {
                const error = await response.text();
                console.log("Error de autorización:", error);
                throw new Error('No tiene permisos para realizar esta acción');
            }

            if (!response.ok) {
                const error = await response.text();  // Para ver el mensaje de error
                console.error(`Error al encontrar el empleado: ${error}`);
                throw new Error(`Error al encontrar el empleado: ${error}`);
            }

            // Read the JSON response once and store it
            const responseData = await response.json();
            console.log("Resultado de la inserción:", responseData);
            return responseData;

        } catch (err) {
            console.error("Error eliminanado el usuario: ", err);
            throw err;
        }
    }

    static async deleteExtraHour(token, hourId) {
        try {
            const response = await fetch(`${UserService.BASE_URL}/delete/${hourId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

            if (!response.ok) {
                throw new Error('Error eliminando el registro');
            }

            console.log("resultado de eliminar el registro: ", response.json());
            return await response.json();

        } catch (err) {
            console.error("Error eliminanado la hora extra del usuario: ", err);
            throw err;
        }
    }



    /** AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    }

    static isAdmin() {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    }

    static isUser() {
        const role = localStorage.getItem('role');
        return role === 'USER';
    }

    static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }
}

export default UserService;
