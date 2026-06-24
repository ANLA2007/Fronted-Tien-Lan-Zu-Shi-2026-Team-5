import { get, post, put, patch } from "../../CORE/SERVICES/api.services.js";

const ENDPOINT = "Sales";

export async function obtenerVentas(pagina = 1, tamanio = 10) {
    return await get(`${ENDPOINT}/GetAllSales?PageNumber=${pagina}&PageSize=${tamanio}`);
}

export async function obtenerVentaPorId(id) {
    return await get(`${ENDPOINT}/${id}/details-list`);
}

export async function crearVenta(venta) {
    return await post(ENDPOINT, venta);

}

export async function obtenerVentasPorFecha(startDate, endDate) {
    return await get(`${ENDPOINT}/bydaterange?startDate=${startDate}&endDate=${endDate}`);
}

export async function marcarFacturaImpresa() {
    return await get("Invoices/ToPrint");
}

