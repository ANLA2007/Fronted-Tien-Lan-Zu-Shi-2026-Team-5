import { get, post, put, patch } from "../../../CORE/SERVICES/api.services.js";

const ENDPOINT = "Roles";

export async function obtenerRoles(pagina = 1, tamanio = 10) {
    return await get(`${ENDPOINT}?PageNumber=${pagina}&PageSize=${tamanio}`);
}

export async function crearRol(rol) {
    return await post(ENDPOINT, rol);
}

export async function actualizarRol(id, rol) {
    return await put(`${ENDPOINT}/${id}`, rol);
}

export async function cambiarEstadoRol(id) {
    return await patch(`${ENDPOINT}/${id}/state`);
}

export async function buscarRolPorNombre(name) {
    return await get(`${ENDPOINT}/byname/${name}`);
}