/**
 * ATRIBUTOS Y CONSTANTES
 */

let ronda = 1;

let dinero = 0;

let produccion = 0;
let comidaPiscicultura = 0;
let comidaAcuaponia = 0;
let silo = 0;
let campos = 100;

let biofiltro = false;
let bomba = false;

let vidaHidroponia = 3;
let vidaPiscicultura = 2;

let recogioCampos = false;
let recogioSilo = false;

const idCama = {
  1: ["btnCama1", false],
  2: ["btnCama2", false],
  3: ["btnCama3", false],
};

const idPiscicola = {
  1: ["img-alevinos-1", false],
  2: ["img-alevinos-2", false],
  3: ["img-peces-3", false],
};

const infoRonda = {
  1: [3, "un huracán", 20],
  2: [4, "un terremoto", 20],
  3: [3, "una inundación", 20],
  4: [2, "una plaga", 40],
  5: [1, "una sequía", 0],
};

/**
 * COMPORTAMIENTO
 */

/**
 * Muestra u oculta un elemento cambiando el atributo "visibility" de la hoja de estilo
 * @param {String} id Id del elemento en el archivo HTML
 * @param {Boolean} visible
 */
function verElemento(id, visible) {
  if (visible === true) {
    document.getElementById(id).style.visibility = "visible";
  } else {
    document.getElementById(id).style.visibility = "hidden";
  }
}

/**
 * Cambia la imagen de inicio por el tablero y muestra un mensaje al jugador con una descripción general del juego
 */
function inicio() {
  document.getElementById("inicio").hidden = true;
  document.getElementById("tablero").hidden = false;

  Swal.fire({
    title: "¡Bienvenido!",
    text: "Bienvenido a Aquaponics. Tu objetivo es alimentar a 100 personas cada ronda. Para lograrlo debes usar la comida que producen tus campos y la comida de tu sistema de acuaponía, que mezcla peces y plantas",
    confirmButtonText: "Iniciar la primera ronda",
    allowOutsideClick: false,
  }).then(() => {
    inicioPaso1();
  });
}

/**
 * Muestra instrucciones de qué pasará esta ronda e indica que recogan el dinero
 */
function inicioPaso1() {
  document.getElementById("silo").innerText = silo;
  document.getElementById("titulo-ronda").innerText = "Ronda " + ronda;
  let txt = "";
  txt +=
    "<p>En esta ronda recibirás $" +
    infoRonda[ronda][0] +
    "</p><p>Además, " +
    infoRonda[ronda][1] +
    " pasará en esta ronda. Luego de que pase, los campos";
  txt +=
    campos > 40
      ? " solo podrán alimentar a " +
        (campos - infoRonda[ronda][2]) +
        " personas</p>"
      : " no producirán alimentos.</p>";
  txt += "<p>Haz click en el dinero para continuar</p>";
  document.getElementById("descripcion-paso").innerHTML = txt;

  let proximaRonda = "";
  if (ronda < 5) {
    proximaRonda =
      "Viene " +
      infoRonda[ronda + 1][1] +
      " (-" +
      infoRonda[ronda + 1][2] +
      " campos), +$" +
      infoRonda[ronda + 1][0];
  } else {
    proximaRonda = "Esta es la última ronda";
  }
  document.getElementById("proxima-ronda").innerText = proximaRonda;
  verElemento("btn-dinero", true);
  verElemento("btn-continuar", false);
}

/**
 * Una vez se recoge el dinero se muestra en la interfaz.
 */
function paso1() {
  monto = infoRonda[ronda][0];
  dinero = monto + dinero;
  document.getElementById("dinero").innerText = "$" + dinero;
  verElemento("btn-dinero", false);
  inicioPaso2();
}

/**
 * Habilita los botones para comprar el filtro, la bomba, las plántulas y los alevines y muestra una descripción
 */
function inicioPaso2() {
  let txt = "";
  if (vidaHidroponia > 0 && vidaPiscicultura > 0) {
    txt += "<p>Puedes comprar plantulas y alevines:</p>";
    vidaHidroponia > 0
      ? (txt +=
          "<p>Las plantas alimentarán a " +
          (bomba ? 15 : 10) +
          " personas y estarán listas esta ronda.</p>")
      : (txt +=
          "<p>Tu sistema de hidroponía está dañado y no lo puedes usar</p>");
    vidaPiscicultura > 0
      ? (txt +=
          "<p>Los aluvines alimentarán a " +
          (bomba ? 70 : 50) +
          " y podrán pescarse en la próxima ronda</p>")
      : (txt +=
          "<p>Tu tanque de piscicultura está dañado y no lo puedes usar</p>");
  }

  if (biofiltro === false || bomba === false) {
    txt += "<p>También puedes comprar mejoras para tu sistema:</p>";
    if (bomba === false) {
      verElemento("btn-bomba", true);
      txt +=
        "<p>La bomba aumenta tu producción. Las plántulas del sistema hidropónico alimentarán a 15 personas y los peces a 70 personas</p>";
    }

    if (biofiltro === false) {
      verElemento("btn-biofiltro", true);
      txt +=
        "<p>El biofiltro evita que el sistema acuapónico se deteriore. Si se les acaba la vida no podrás usarlos más.</p>";
      txt +=
        "<p>En este momento al sistema de hidroponía le quedan " +
        vidaHidroponia +
        " usos y al sistema de piscicultura le quedan " +
        vidaPiscicultura +
        " usos</p>";
    }
  }

  if (vidaHidroponia > 0) {
    verElemento("btnCama1", true);
    verElemento("btnCama2", true);
    verElemento("btnCama3", true);
    verElemento("error-vida-hidroponia", false);
  } else {
    verElemento("error-vida-hidroponia", true);
  }

  if (vidaPiscicultura > 0) {
    verElemento("btnComprarAlevines", true);
    verElemento("error-vida-piscicultura", false);
  } else {
    verElemento("error-vida-piscicultura", true);
  }
  document.getElementById("descripcion-paso").innerHTML = txt;

  verElemento("btn-continuar", true);
  document.getElementById("btn-continuar").innerText = "Continuar";
  document.getElementById("btn-continuar").setAttribute("onClick", "paso2()");
}

/**
 * Compra la bomba y la muestra en el tablero
 */
function comprarBomba() {
  if (dinero >= 1) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    bomba = true;
    verElemento("btn-bomba", false);
    verElemento("img-bomba", true);
  }
}

/**
 * Compra el biofiltro y lo muestra en el tablero
 */
function comprarBiofiltro() {
  if (dinero >= 1) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    biofiltro = true;
    verElemento("btn-biofiltro", false);
    verElemento("img-biofiltro", true);
  }
}

/**
 * Oclta los botones para comprar
 */
function paso2() {
  desacivarCamasSinComprar();
  verElemento("btnComprarAlevines", false);
  verElemento("btn-bomba", false);
  verElemento("btn-biofiltro", false);
  inicioPaso3();
}

/**
 * Cambia el booleano que indica si una cama de cultivo de hidroponía está sembrada
 * @param {Number} cama Identificador de la cama de cultivo
 * @param {Boolean} valor
 */
function setCama(cama, valor) {
  idCama[cama][1] = valor;
}

/**
 * Siempra plántulas en una cama de cultivo
 * @param {Number} cama Identificador de la cama de cultivo
 */
function sembrar(cama) {
  if (dinero >= 1) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    idBtn = idCama[cama][0];
    verElemento(idBtn, false);
    verElemento("img-plantula-" + cama, true);
    setCama(cama, true);
  }
}

/**
 * Muestra las imágenes de los aluvines y los peces en el tanque
 */
function mostrarAlevines() {
  for (let i = 1; i <= 3; i++) {
    idPiscicola[i][1]
      ? verElemento(idPiscicola[i][0], true)
      : verElemento(idPiscicola[i][0], false);
  }
}

/**
 * Compra alevines y los muestra en el tablero
 */
function comprarAlevines() {
  if (dinero >= 1 && vidaPiscicultura > 0 && idPiscicola[1][1] === false) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    idPiscicola[1][1] = true;
    mostrarAlevines();
    verElemento("btnComprarAlevines", false);
  }
}

/**
 * Oculta los botones de las camas de hidroponía que no tengan plántulas
 */
function desacivarCamasSinComprar() {
  for (let i = 1; i <= 3; i++) {
    verElemento(idCama[i][0], false);
  }
}

/**
 * Muestra información cuando sucede el desastre y pone una imagen sobre el campo destruido
 */
function inicioPaso3() {
  campos -= infoRonda[ronda][2];
  let txt = "<img src='./img/Terreno - " + ronda + ".png'/>";
  txt += "<p>Sucedió " + infoRonda[ronda][1];
  campos > 0
    ? (txt += ", pierdes " + infoRonda[ronda][2] + " campos")
    : (txt += " los campos no produciran alimento esta ronda.");

  txt += "<p>Para avanzar presiona 'Continuar'</p>";

  document.getElementById("descripcion-paso").innerHTML = txt;

  if (ronda !== 5) {
    verElemento("img-desastre-" + ronda, true);
  }

  if (ronda === 4) {
    verElemento("img-desastre-5", true);
  }
  document
    .getElementById("btn-continuar")
    .setAttribute("onClick", "inicioPaso4()");
}

/**
 * Revisa si hay camas de cultivo, peces, terrenos o recursos en el silo por recoger
 */
function hayRecursosPorRecoger() {
  let txt = "<p>Para continuar debes recoger los recursos<p>";
  hayRecursosPendientes = false;
  if (idPiscicola[3][1] === true) {
    hayRecursosPendientes = true;
    txt += "<p>Para pescar los peces haz click sobre el pescado</p>";
  }
  if (campos !== 0 && !recogioCampos) {
    hayRecursosPendientes = true;
    txt +=
      "<p>Para recoger lo que producen tus campos haz click en la caja 'Terreno'</p>";
  }
  if (!recogioSilo) {
    hayRecursosPendientes = true;
    txt +=
      "<p>Para recoger lo que tienes en el silo haz click en la caja 'Silo'</p>";
  }
  flag = true;
  for (let i = 1; i <= 3; i++) {
    if (idCama[i][1] === true) {
      hayRecursosPendientes = true;
      if (flag) {
        txt +=
          "<p>Para recoger las plantas del sistema hidropónico haz click en la imagen de las plantas</p>";
        flag = false;
      }
    }
  }
  if (hayRecursosPendientes) {
    verElemento("btn-continuar", false);
  } else {
    verElemento("btn-continuar", true);
    txt =
      "<p>Ya se recogieron los recursos. Para avanzar haz click en 'alimentar'";
  }
  document.getElementById("descripcion-paso").innerHTML = txt;
}

/**
 * Avanza los recursos y luego calcula el deterioro de los sitemas
 */
function inicioPaso4() {
  document.getElementById("btn-continuar").setAttribute("onClick", "paso5()");
  document.getElementById("btn-continuar").innerText = "Alimentar personas";
  avanzarRecursos();
  calcularDeterioro();
}

/**
 * Disminuye la vida del sistema de hidroponía y de los tanques, si no hay biofiltro
 */
function calcularDeterioro() {
  if (biofiltro === false) {
    if (vidaHidroponia !== 0) {
      vidaHidroponia -= 1;
      verElemento("vida-hidro-" + vidaHidroponia, true);
    }

    if (vidaPiscicultura > 0) {
      vidaPiscicultura -= 1;
      verElemento("vida-tanque-" + vidaPiscicultura, true);
    }
  }
}

/**
 * Avanza las plántulas y los alevines en caso de que los sistemas aún tengan vida
 */
function avanzarRecursos() {
  if (vidaPiscicultura > 0) {
    if (idPiscicola[2][1]) {
      idPiscicola[2][1] = false;
      idPiscicola[3][1] = true;
    }
    if (idPiscicola[1][1]) {
      idPiscicola[1][1] = false;
      idPiscicola[2][1] = true;
    }
    mostrarAlevines();
  }

  if (vidaHidroponia > 0) {
    for (let i = 1; i <= 3; i++) {
      if (idCama[i][1] === true) {
        verElemento("img-planta-" + i, true);
        verElemento("img-plantula-" + i, false);
      }
    }
  }

  if (campos !== 0) {
    verElemento("marco-terreno", true);
    recogioCampos = false;
  }

  if (silo !== 0) {
    verElemento("btn-silo", true);
    document
      .getElementById("btn-silo")
      .setAttribute("onClick", "recogerSilo()");
    recogioSilo = false;
  } else {
    recogioSilo = true;
  }
  hayRecursosPorRecoger();
}

/**
 * Cosecha una planta del sistema hidropónico
 * @param {Number} cama Identificador de la cama de cultivo
 */
function cosechar(cama) {
  verElemento("img-planta-" + cama, false);
  bomba ? (comidaAcuaponia += 15) : (comidaAcuaponia += 10);
  calcularProduccion();

  //Establece la vaiable de la cama en false para que se pueda comprar en la siguiente ronda
  setCama(cama, false);

  document.getElementById("totalHidroponia").innerText = comidaAcuaponia;
  //Antes de seguir se debe comprobar que se hayan recogido todas las plantas y los alevines
  hayRecursosPorRecoger();
}

/**
 * Calcula la suma de los recursos a medida que se van recolectando
 */
function calcularProduccion() {
  produccion = 0;
  if (recogioSilo) {
    produccion += silo;
  }
  if (recogioCampos) {
    produccion += campos;
  }
  produccion += comidaAcuaponia + comidaPiscicultura;
  document.getElementById("totalPuntos").innerText = produccion;
}

/**
 * Pesca los aluvines y oculta el botón para recogerlos
 */
function recolectarPeces() {
  bomba ? (comidaPiscicultura += 70) : (comidaPiscicultura += 50);

  idPiscicola[3][1] = false;

  document.getElementById("totalPiscicola").innerText = comidaPiscicultura;

  mostrarAlevines();
  hayRecursosPorRecoger();
  calcularProduccion();
}

/**
 * Recoge lo que producen los campos, en caso de que aún produzcan
 */
function recogerCultivos() {
  verElemento("marco-terreno", false);
  document.getElementById("totalCampos").innerText = campos;
  recogioCampos = true;
  hayRecursosPorRecoger();
  calcularProduccion();
}

/**
 * Toma los recusos que haya en el silo y los muestra en el contador de puntos
 */
function recogerSilo() {
  verElemento("btn-silo", false);
  document.getElementById("totalSilo").innerText = silo;
  document.getElementById("silo").innerText = 0;
  recogioSilo = true;
  hayRecursosPorRecoger();
  calcularProduccion();
}

/**
 * Alimenta a la poblacion (-100)
 * Si no se cuenta con una produccion suficiente (>= 100) notifica al usuario que ha perdido
 */
function paso5() {
  if (produccion >= 100) {
    let txt = "<p>Lograste alimentar a las 100 personas, ¡felicidades!</p>";
    document.getElementById("descripcion-paso").innerHTML = txt;
    // La persona puede avanzar a la siguiente ronda
    produccion -= 100;
    comidaAcuaponia = 0;
    comidaPiscicultura = 0;
    silo = 0;
    document.getElementById("totalPuntos").innerText = produccion;
    document.getElementById("totalPiscicola").innerText = comidaPiscicultura;
    document.getElementById("totalHidroponia").innerText = comidaAcuaponia;
    document.getElementById("totalSilo").innerText = silo;
    document.getElementById("totalCampos").innerText = 0;
    inicioPaso6();
    if (ronda === 5) {
      Swal.fire({
        icon: "success",
        title: "¡Felicidades!",
        text: "¡Ganaste!",
        confirmButtonText: "Jugar de Nuevo",
        allowOutsideClick: false,
      }).then((result) => {
        reiniciarVariables();
      });
    }
  } else {
    // La persona perdió
    Swal.fire({
      icon: "warning",
      title: "¡¡Oh no!!!",
      text: "No cuentas con suficiete comida",
      confirmButtonText: "Jugar de Nuevo",
      allowOutsideClick: false,
    }).then(() => {
      reiniciarVariables();
    });
  }
}

/**
 * Habilita el botón para almacenar en el silo luego de alimentar. Si no hay excedente continúa
 */
function inicioPaso6() {
  if (produccion === 0) {
    paso7();
  } else {
    let txt =
      "<p>Como produjiste excedentes hay que guardarlos en el silo. Haz click en la caja 'silo'</p>";
    document.getElementById("descripcion-paso").innerHTML = txt;
    silo = produccion;
    produccion = 0;
    document.getElementById("btn-silo").setAttribute("onClick", "paso7()");
    verElemento("btn-silo", true);
    verElemento("btn-continuar", false);
  }
}

/**
 * Se almacena el excedente en el silo y se inicia la siguiente ronda
 */
function paso7() {
  document.getElementById("totalPuntos").innerText = produccion;
  document.getElementById("silo").innerText = silo;
  verElemento("btn-silo", false);
  let txt = "<p>Para avanzar a la siguiente ronda haz click en 'continuar'</p>";
  document.getElementById("descripcion-paso").innerHTML = txt;
  document
    .getElementById("btn-continuar")
    .setAttribute("onClick", "inicioPaso1()");
  document.getElementById("btn-continuar").innerText = "Continuar";
  verElemento("btn-continuar", true);

  ronda += 1;
}

/**
 * Se ponen las variables de nuevo en ceros
 */
function reiniciarVariables() {
  document.getElementById("totalPuntos").innerText = 0;
  document.getElementById("totalPiscicola").innerText = 0;
  document.getElementById("totalHidroponia").innerText = 0;
  document.getElementById("totalSilo").innerText = 0;
  document.getElementById("totalCampos").innerText = 0;
  document.getElementById("dinero").innerText = 0;
  document.getElementById("silo").innerText = 0;
  verElemento("btn-silo", false);

  ronda = 1;
  biofiltro = false;
  verElemento("img-biofiltro", false);
  bomba = false;
  verElemento("img-bomba", false);
  produccion = 0;
  comidaAcuaponia = 0;
  comidaPiscicultura = 0;
  silo = 0;
  campos = 100;
  dinero = 0;
  vidaHidroponia = 3;
  vidaPiscicultura = 2;
  recogioCampos = false;
  for (let i = 0; i < 2; i++) {
    verElemento("vida-hidro-" + i, false);
    verElemento("vida-tanque-" + i, false);
  }

  for (let i = 1; i <= 5; i++) {
    verElemento("img-desastre-" + i, false);
  }

  verElemento("vida-hidro-2", false);
  verElemento("error-vida-hidroponia", false);
  verElemento("error-vida-piscicultura", false);
  verElemento("btn-continuar", false);

  for (let i = 1; i <= 3; i++) {
    idPiscicola[i][1] = false;
  }
  mostrarAlevines();
  document.getElementById("inicio").hidden = false;
  document.getElementById("tablero").hidden = true;
}
