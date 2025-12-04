const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

// Función para quitar acentos, ñ y €
function limpiarTexto(texto) {
  if (!texto) return "";
  return texto
    .replace(/á/g, "a")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u")
    .replace(/Á/g, "A")
    .replace(/É/g, "E")
    .replace(/Í/g, "I")
    .replace(/Ó/g, "O")
    .replace(/Ú/g, "U")
    .replace(/ñ/g, "n")
    .replace(/Ñ/g, "N")
    .replace(/€/g, "EUR");
}

async function imprimirTicket({ mesa_id, items, total }) {
  try {
    let printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: "tcp://192.168.1.50:9100", // ← tu IP real
      characterSet: "CP437",
      removeSpecialCharacters: false,
    });

    await printer.isPrinterConnected();

    printer.alignCenter();
    printer.println("Havana 66");
    printer.println(`Mesa ${mesa_id}`);
    printer.drawLine();

    printer.alignLeft();

    // 🔥 Aquí limpiamos cada texto enviado a la impresora
    items.forEach(item => {
      printer.println(limpiarTexto(item.nombre));
      printer.println(`  (${item.cantidad} uds x ${item.precio}€)`);
      printer.println(`  = ${(item.cantidad * item.precio).toFixed(2)} EUR`);
      printer.drawLine();
    });

    printer.alignRight();
    printer.println(`TOTAL: ${total.toFixed(2)} EUR`);
    printer.newLine();
    printer.newLine();

    await printer.execute();
    console.log("Ticket enviado a la impresora");

  } catch (err) {
    console.error("❌ Error imprimiendo ticket:", err);
  }
}

module.exports = { imprimirTicket };
