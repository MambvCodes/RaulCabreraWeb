const db = firebase.firestore();
const Formproyecto = document.getElementById("form-proyecto");
const Containerproyecto = document.getElementById("container-proyecto");

let editStatus = false;
let id = "";

async function uploadImage(file) {
  const ref = firebase.storage().ref();
  const name = new Date() + "-" + file.name;
  const metadata = { contentType: file.type };
  const snapshot = await ref.child(name).put(file, metadata);
  const url = await snapshot.ref.getDownloadURL();
  return url;
}

const saveProyecto = (title, description, categoria, fileurl) =>
  db.collection("proyectos").doc().set({
    title,
    description,
    categoria,
    fileurl
  });

const getproyect = () => db.collection("proyectos").get();

const onGetproyect = (callback) =>
  db.collection("proyectos").onSnapshot(callback);

const deleteproyecto = (id) => db.collection("proyectos").doc(id).delete();

const getproyecto = (id) => db.collection("proyectos").doc(id).get();

const updateProyecto = (id, updatedproyecto) =>
  db.collection("proyectos").doc(id).update(updatedproyecto);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetproyect((querySnapshot) => {
    Containerproyecto.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const proyecto = doc.data();
      proyecto.id = doc.id;
      if (!proyecto.fileurl) {
        proyecto.fileurl =
          "https://firebasestorage.googleapis.com/v0/b/raul-cabrera-c6884.appspot.com/o/default-slider-image.png?alt=media&token=bd04dde2-d34f-4e2d-a463-55a28f6ff811";
      }

      Containerproyecto.innerHTML += `<div class="card card-body mt-2 border-primary">
    <h3 class="h5">${proyecto.title}</h3>
    <p>${proyecto.description}</p>
    <img class="img-fluid" src="${proyecto.fileurl}" />
                
    <div>
    <p class="badge badge-pill badge-light">${proyecto.categoria}</p><br>
      <button class="btn btn-primary btn-delete" data-id="${proyecto.id}">Eliminar proyecto
      </button>
      <button class="btn btn-secondary btn-edit" data-id="${proyecto.id}">Editar proyecto
      </button>
    </div>
  </div>`;
    });

    const btnsDelete = Containerproyecto.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        await deleteproyecto(e.target.dataset.id);
      });
    });

    const btnsEdit = Containerproyecto.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const proyecto = await getproyecto(e.target.dataset.id);

        editStatus = true;
        id = proyecto.id;
        Formproyecto["titulo-proyecto"].value = proyecto.data().title;
        Formproyecto[
          "descripcion-proyecto"
        ].value = proyecto.data().description;
        Formproyecto["categoria-proyecto"].value = proyecto.data().categoria;
        Formproyecto["btn-proyecto-form"].innerText = "Actualizar";
      });
    });
  });
});

Formproyecto.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = Formproyecto["titulo-proyecto"];
  const description = Formproyecto["descripcion-proyecto"];
  const categoria = Formproyecto["categoria-proyecto"];
  const file = Formproyecto["task-image"].files[0];

  let fileurl = null;

  if (file) {
    fileurl = await uploadImage(file);
  }

  if (!editStatus) {
    await saveProyecto(
      title.value,
      description.value,
      categoria.value,
      fileurl
    );
  } else {
    if (file) {
      await updateProyecto(id, {
        title: title.value,
        description: description.value,
        categoria: categoria.value,
        fileurl
      });
    } else {
      await updateProyecto(id, {
        title: title.value,
        description: description.value,
        categoria: categoria.value
      });
    }

    editStatus = false;
    id = "";
    Formproyecto["btn-proyecto-form"].innerText = "Guardar";
  }
  getproyect();
  Formproyecto.reset();
  title.focus();
});
