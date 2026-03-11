const axios = require("axios");

// Cambia esto por tu backend real
const API_BASE_URL = "https://backend-carta.onrender.com/api";

// Revisa pedidos cada 5 segundos
const INTERVAL_MS = 5000;

function agruparPedidos(rows) {
  const pedidosMap = {};

  for (const row of rows) {
    if (!pedidosMap[row.pedido_id]) {
      pedidosMap[row.pedido_id] = {
        pedido_id: row.pedido_id,
        mesa_id: row.mesa_id,
        fecha: row.fecha,
        total: Number(row.total) || 0,
        items: [],
      };
    }

    pedidosMap[row.pedido_id].items.push({
      producto_id: row.producto_id,
      nombre: row.nombre,
      cantidad: Number(row.cantidad) || 0,
      precio: Number(row.precio) || 0,
      categoria: row.categoria,
    });
  }

  return Object.values(pedidosMap);
}

function generarTextoTicket(pedido) {
  const fecha = new Date(pedido.fecha).toLocaleString("es-ES");

  let texto = "";
  texto += "        HAVANA 66\n";
  texto += "------------------------------\n";
  texto += `Pedido: ${pedido.pedido_id}\n`;
  texto += `Mesa: ${pedido.mesa_id}\n`;
  texto += `Fecha: ${fecha}\n`;
  texto += "------------------------------\n";

  for (const item of pedido.items) {
    texto += `${item.cantidad} x ${item.nombre}\n`;
    texto += `   ${item.precio.toFixed(2)} €\n`;
  }

  texto += "------------------------------\n";
  texto += `TOTAL: ${pedido.total.toFixed(2)} €\n`;
  texto += "------------------------------\n\n\n\n";

  return texto;
}

async function obtenerPendientes() {
  const res = await axios.get(`${API_BASE_URL}/pedidos/pendientes-impresion`);
  return res.data;
}

async function marcarComoImpreso(pedidoId) {
  await axios.put(`${API_BASE_URL}/pedidos/${pedidoId}/marcar-impreso`);
}

async function imprimirPedido(pedido) {
  const ticket = generarTextoTicket(pedido);

  console.log("==================================");
  console.log("IMPRIMIENDO PEDIDO");
  console.log(ticket);
  console.log("==================================");
}

async function revisarPedidos() {
  try {
    const rows = await obtenerPendientes();

    if (!Array.isArray(rows) || rows.length === 0) {
      console.log("Sin pedidos pendientes");
      return;
    }

    const pedidos = agruparPedidos(rows);

    for (const pedido of pedidos) {
      await imprimirPedido(pedido);
      await marcarComoImpreso(pedido.pedido_id);
      console.log(`Pedido ${pedido.pedido_id} marcado como impreso`);
    }
  } catch (error) {
    console.error("Error en print server:", error.response?.data || error.message);
  }
}

console.log("Print server iniciado...");
revisarPedidos();
setInterval(revisarPedidos, INTERVAL_MS);