import { get, post, put, patch } from "../../../CORE/SERVICES/api.services.js";

const ENDPOINT = "Users";

export async function obtenerUsuarios(pagina = 1, tamanio = 10) {
    return await get(`${ENDPOINT}?PageNumber=${pagina}&PageSize=${tamanio}`);
}

export async function crearUsuario(usuario) {
    return await post(ENDPOINT, usuario);
}

export async function actualizarUsuario(id, usuario) {
    return await put(`${ENDPOINT}/${id}`, usuario);
}

export async function cambiarEstadoUsuario(id, state) {
    return await patch(`${ENDPOINT}/${id}/state?state=${state}`);
}

export async function asignarRol(userId, roleId) {
    return await post(`${ENDPOINT}/assign-role`, { userId, roleId });
}

export async function buscarUsuarioPorNombre(nombre) {
    return await get(`${ENDPOINT}/byname/${nombre}`);
}