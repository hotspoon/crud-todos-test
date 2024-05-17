let main_table = null
let idData
$(document).ready(function () {
  // Your code here
  main_table = $("#example").DataTable({})
})
fetchData()

async function fetchData() {
  try {
    const res = await fetch("http://localhost:8000/data")
    const data = await res.json()
    console.log(data)
    fillTable(data)
  } catch (error) {
    console.log(error)
    alert("Terjadi kesalahan saat mengambil data")
  }
}

// fetchbyid
async function fetchDataById(id) {
  try {
    const res = await fetch("http://localhost:8000/data/" + id)
    const data = await res.json()
    const { name, todosTitle, todosStatus, postTitle, postText } = data
    $("#name-edit").val(name)
    $("#todosTitle-edit").val(todosTitle)
    $("#todosStatus-edit").val(todosStatus)
    $("#postTitle-edit").val(postTitle)
    $("#postText-edit").val(postText)

    idData = id
    $("#modal-edit").modal("show")
  } catch (error) {
    console.log(error)
    alert("Terjadi kesalahan saat mengambil data")
  }
}

const fillTable = (data) => {
  main_table.clear()
  for (const [i, val] of data.entries()) {
    let todosStatusValue
    if (val.todosStatus === "finished") {
      todosStatusValue = "Finished"
    } else if (val.todosStatus === "not_finished") {
      todosStatusValue = "Not Finished"
    } else {
      todosStatusValue = "Unknown Status" // Default value
    }
    main_table.row.add([
      val.name,
      val.todosTitle,
      todosStatusValue,
      val.postTitle,
      val.postText,
      `<div class="d-flex justify-content-center gap-2">
            <button type="button" class="btn btn-primary" onclick="fetchDataById(${val.id})">Edit</button>
            <button type="button" class="btn btn-danger" onclick="if (confirm('Are you sure you want to delete this item?')) deleteData(${val.id})">Delete</button>
        </div>`
    ])
  }
  main_table.draw()
}

async function addData() {
  try {
    let dataPost = {
      name: $("#name").val(),
      todosTitle: $("#todosTitle").val(),
      todosStatus: $("#todosStatus option:selected").val(),
      postTitle: $("#postTitle").val(),
      postText: $("#postText").val()
    }
    const res = await postData("POST", "http://localhost:8000/data", dataPost)
    if (!res) {
      return alert("Terjadi kesalahan saat menambahkan data")
    }
    alert("Data berhasil ditambahkan")

    $("#modal-tambah").modal("hide")
    fetchData()
  } catch (error) {
    alert("Terjadi kesalahan saat menambahkan data")
  }
}

// button btn-add-data
$("#btn-add-data").click(function () {
  addData()
})

// button btn-edit-data
$("#btn-edit-data").click(function () {
  editData()
})

function editData() {
  let dataPost = {
    name: $("#name-edit").val(),
    todosTitle: $("#todosTitle-edit").val(),
    todosStatus: $("#todosStatus-edit option:selected").val(),
    postTitle: $("#postTitle-edit").val(),
    postText: $("#postText-edit").val()
  }

  postData("PUT", `http://localhost:8000/data/${idData}`, dataPost).then((res) => {
    if (!res) {
      return alert("Terjadi kesalahan saat mengedit data")
    }
    alert("Data berhasil diubah")
    $("#modal-edit").modal("hide")
    fetchData()
  })
}

async function deleteData(id) {
  try {
    const url = `http://localhost:8000/data/${id}` // replace with your URL and resource ID
    const response = await fetch(url, {
      method: "DELETE"
    })

    if (!response.ok) {
      throw new Error("HTTP error " + response.status)
    }

    alert("Data berhasil dihapus")
    fetchData() // refresh your data
  } catch (error) {
    alert("Terjadi kesalahan saat menghapus data")
  }
}

const postData = async (method, url, data) => {
  try {
    const res = await fetch(url, {
      method: method,
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data)
    }).then((res) => res.json())
    return res
  } catch (err) {
    console.log(err)
    return null
  }
}
