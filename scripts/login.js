function registrar() {
  var email = document.getElementById("regemail").value;
  var pass = document.getElementById("regpass").value;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, pass)
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
      // ...
    });
}

function ingresar() {
  var email2 = document.getElementById("loginemail").value;
  var pass2 = document.getElementById("loginpass").value;
  firebase
    .auth()
    .signInWithEmailAndPassword(email2, pass2)
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
      location.reload();
      return false;
    });
}

function observador() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user.email !== "rulmamba@hotmail.com") {
      users();
    }
    if (user.email === "rulmamba@hotmail.com") {
      admin();
    }
  });
}
observador();

function admin() {
  var btn = document.getElementById("admin");
  btn.innerHTML = `<h4>Menú de administrador</h4>
  <a href="../CRUD.html" class="btn btn-primary">Ir al CRUD</a>
  <button class="btn" onclick="logout()">Cerrar Sesión</button>`;
}

function users() {
  var btn = document.getElementById("user");
  btn.innerHTML = `<h4>Menú de usuario</h4>
  <a href="../index.html" class="btn btn-primary">Ir a la página principal</a>
  <button class="btn" onclick="logout()">Cerrar Sesión</button>`;
  var registro = document.getElementById("registro");
  registro.innerHTML = ``;
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      console.log("saliendo");
    })
    .catch(function (error) {
      console.log("error");
    });

  location.reload();
  return false;
}
