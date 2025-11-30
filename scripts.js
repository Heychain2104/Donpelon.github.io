// ========== SISTEMA DE USUARIOS ==========
if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify({}));
}

function registrar(user, pass) {
    let db = JSON.parse(localStorage.getItem("usuarios"));

    if (db[user]) return false;

    db[user] = {
        pass,
        nombre: user,
        avatar: "default.png",
        puntos: 0,
        nivel: 1,
        logros: [],
        amigos: [],
        mensajes: [],
        juegos: []
    };

    localStorage.setItem("usuarios", JSON.stringify(db));
    return true;
}

function login(user, pass) {
    let db = JSON.parse(localStorage.getItem("usuarios"));

    if (db[user] && db[user].pass === pass) {
        localStorage.setItem("sesion", user);
        return true;
    }

    return false;
}

function getUser() {
    const id = localStorage.getItem("sesion");
    let db = JSON.parse(localStorage.getItem("usuarios"));
    return db[id];
}

function saveUser(data) {
    let db = JSON.parse(localStorage.getItem("usuarios"));
    const id = localStorage.getItem("sesion");
    db[id] = data;
    localStorage.setItem("usuarios", JSON.stringify(db));
}

// ========== PUNTOS AUTOMÁTICOS ==========
function iniciarPuntos() {
    setInterval(() => {
        let u = getUser();
        u.puntos++;

        // Subir nivel
        u.nivel = 1 + Math.floor(u.puntos / 100);

        saveUser(u);
    }, 1000);
}

// ========== REGISTRAR JUEGO JUGADO ==========
function registrarJuego(nombre) {
    let u = getUser();
    if (!u.juegos.includes(nombre)) {
        u.juegos.push(nombre);
        saveUser(u);
    }
}

// ========== AGREGAR AMIGO ==========
function agregarAmigo(nombre) {
    let u = getUser();
    if (!u.amigos.includes(nombre)) {
        u.amigos.push(nombre);
        saveUser(u);
        return true;
    }
    return false;
}

// ========== ENVIAR MENSAJE ==========
function enviarMensaje(para, texto) {
    let db = JSON.parse(localStorage.getItem("usuarios"));
    if (!db[para]) return false;

    db[para].mensajes.push({
        de: localStorage.getItem("sesion"),
        texto,
        fecha: new Date().toLocaleString()
    });

    localStorage.setItem("usuarios", JSON.stringify(db));
    return true;
}

// ========== MOSTRAR PERFIL ARRIBA A LA DERECHA ==========
function mostrarPerfil() {
    const usuario = getUser();
    if (!usuario) return;

    // Crear contenedor si no existe
    let cont = document.getElementById("perfil");
    if (!cont) {
        cont = document.createElement("div");
        cont.id = "perfil";
        cont.style.position = "fixed";
        cont.style.top = "10px";
        cont.style.right = "10px";
        cont.style.display = "flex";
        cont.style.alignItems = "center";
        cont.style.gap = "10px";
        cont.style.background = "rgba(0,0,0,0.5)";
        cont.style.padding = "5px 10px";
        cont.style.borderRadius = "10px";
        cont.style.zIndex = "20";
        cont.style.color = "white";
        cont.style.fontWeight = "bold";
        document.body.appendChild(cont);
    }

    // Foto
    let foto = document.getElementById("perfil-foto");
    if (!foto) {
        foto = document.createElement("img");
        foto.id = "perfil-foto";
        foto.style.width = "40px";
        foto.style.height = "40px";
        foto.style.borderRadius = "50%";
        foto.style.objectFit = "cover";
        cont.appendChild(foto);
    }

    // Nombre
    let nombre = document.getElementById("perfil-nombre");
    if (!nombre) {
        nombre = document.createElement("span");
        nombre.id = "perfil-nombre";
        cont.appendChild(nombre);
    }

    foto.src = usuario.avatar || "default.png";
    nombre.textContent = usuario.nombre || localStorage.getItem("sesion");
}

// Ejecutar al cargar la página
window.addEventListener("load", mostrarPerfil);
