import { get, post, put, patch } from "../../CORE/SERVICES/api.services.js";

const ENDPOINT = "Customers";

export async function obtenerClientes(pagina = 1, tamanio = 10) {
    return await get(`${ENDPOINT}?PageNumber=${pagina}&PageSize=${tamanio}`);
}

export async function crearCliente(cliente) {
    return await post(ENDPOINT, cliente);
}

export async function actualizarCliente(id, cliente) {
    return await put(`${ENDPOINT}/${id}`, cliente);
}

export async function cambiarEstadoCliente(id) {
    return await patch(`${ENDPOINT}/${id}/state`);
}

export async function buscarClientePorNombre(nombre) {
    return await get(`${ENDPOINT}/byname/${nombre}`);
}