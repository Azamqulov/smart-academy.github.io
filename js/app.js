// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB67V9odxs2egcYCnb8IGTt0qV79jJ34nQ",
    authDomain: "samrt-academy.firebaseapp.com",
    databaseURL: "https://samrt-academy-default-rtdb.firebaseio.com",
    projectId: "samrt-academy",
    storageBucket: "samrt-academy.appspot.com",
    messagingSenderId: "58679627098",
    appId: "1:58679627098:web:35d89c2966e6432cce7763"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.querySelector(".exit").addEventListener("click", () => {
    window.location.href = "../index.html";
})

document.addEventListener("DOMContentLoaded", function () {
    let data = []; // Global variable to hold student data
    let currentPage = 1;
    const entriesPerPage = 20;

    const tableBody = document.querySelector("#dataTable tbody");
    const searchName = document.getElementById("searchName");
    const searchSurname = document.getElementById("searchSurname");
    const searchSubject = document.getElementById("searchSubject");
    const searchPayment = document.getElementById("searchPayment");
    const searchTeacher = document.getElementById("searchTeacher");
    const addBtn = document.getElementById("addBtn");

    const addTeacherBtn = document.getElementById("addTeacherBtn");
    const addSubjectBtn = document.getElementById("addSubjectBtn");
    const addTeacherModal = document.getElementById("addTeacherModal");
    const addSubjectModal = document.getElementById("addSubjectModal");

    const formModal = document.getElementById("formModal");
    const closeBtn = document.querySelector(".close");
    const subjectClose = document.querySelector(".subjectClose")
    const closeBtns = document.querySelector(".closes");

    const saveBtn = document.getElementById("saveBtn");
    const entryIdInput = document.getElementById("entryId");
    const nameInput = document.getElementById("name");
    const surnameInput = document.getElementById("surname");
    const phoneInput = document.getElementById("phone");
    const dateInput = document.getElementById("date");

    const subjectInput = document.getElementById("subject");
    const teacherInput = document.getElementById("teacher");
    const paymentInput = document.getElementById("payment");
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");

    const totalStudents = document.getElementById('totalStudents');
    const totalPayment = document.getElementById('totalPayment');
    const totalProfit = document.getElementById('totalProfit');
    const totalRent = document.getElementById('totalRent');


    // Teacher options based on subject


    subjectClose.addEventListener("click", () => {
        addSubjectModal.style.display = "none";
    })

    addTeacherBtn.addEventListener("click", () => {
        addTeacherModal.style.display = "block";
        // addSubjectModal.style.display = "block";

    });

    // addSubjectBtn.addEventListener("click", () => {
    //     addSubjectModal.style.display = "block";
    // });


    closeBtns.addEventListener("click", (event) => {
        addSubjectModal.style.display = "none";
        addTeacherModal.style.display = "none";
        if (event.target == addSubjectModal) {
            addSubjectModal.style.display = "none";
            console.log(erorr);

        }

    });


    window.addEventListener("click", (event) => {
        if (event.target == formModal) {
            formModal.style.display = "none";
        } else if (event.target == addTeacherModal) {
            addTeacherModal.style.display = "none";
        } else if (event.target == addSubjectModal) {
            addSubjectModal.style.display = "none";
        }
    });

    saveTeacherBtn.addEventListener("click", () => {
        const newTeacher = document.getElementById("newTeacher").value.trim();
        if (newTeacher) {
            db.collection("teachers").add({ name: newTeacher })
                .then((docRef) => {
                    showToast("Teacher qo'shildi", "#28a745");
                    addTeacherModal.style.display = "none";
                    populateTeacherOptions(); // Refresh teacher options in the form
                })
                .catch((error) => {
                    console.error("Error adding teacher: ", error);
                    showToast("Failed to add teacher", "#dc3545");
                });
        }
        const newSubject = document.getElementById("newSubject").value.trim();
        if (newSubject) {
            db.collection("subjects").add({ name: newSubject })
                .then((docRef) => {
                    showToast("Fan qo'shildi", "#28a745");
                    addSubjectModal.style.display = "none";
                    populateSubjectSelect(); // Refresh subject options in the form
                })
                .catch((error) => {
                    console.error("Error adding subject: ", error);
                    showToast("Failed to add subject", "#dc3545");
                });
        }
        const newPayment = document.getElementById("newPayment").value.trim()
        if (newPayment) {
            db.collection("payments").add({ name: newPayment })
                .then((docRef) => {
                    showToast("to'lov qo'shildi", "#28a745");
                    addSubjectModal.style.display = "none";
                    populateSubjectSelect(); // Refresh subject options in the form
                })
                .catch((error) => {
                    console.error("Error adding subject: ", error);
                    showToast("Failed to add subject", "#dc3545");
                });
        }
    });
    function populateTeacherOptions() {
        db.collection("teachers").get().then((querySnapshot) => {
            teacherInput.innerHTML = "";
            searchTeacher.innerHTML = '<option value="">All</option>';
            teachers = {};
            querySnapshot.forEach((doc) => {
                const teacherData = { id: doc.id, ...doc.data() };
                teachers[doc.id] = teacherData.name;

                const option = document.createElement("option");
                option.value = doc.id;
                option.textContent = doc.data().name;
                teacherInput.appendChild(option);

                const filterOption = document.createElement("option");
                filterOption.value = doc.id;
                filterOption.textContent = doc.data().name;
                searchTeacher.appendChild(filterOption);
            });
            loadStudents(); // Load students after teachers are loaded
        }).catch((error) => {
            console.error("Error getting teachers: ", error);
            showToast("Failed to fetch teachers", "#dc3545");
        });
    }

    function populateSubjectSelect() {
        db.collection("subjects").get().then((querySnapshot) => {
            subjectInput.innerHTML = "";
            searchSubject.innerHTML = '<option value="">All</option>';
            subjects = {};
            querySnapshot.forEach((doc) => {
                const subjectData = { id: doc.id, ...doc.data() };
                subjects[doc.id] = subjectData.name;

                const option = document.createElement("option");
                option.value = doc.id;
                option.textContent = doc.data().name;
                subjectInput.appendChild(option);

                const filterOption = document.createElement("option");
                filterOption.value = doc.id;
                filterOption.textContent = doc.data().name;
                searchSubject.appendChild(filterOption);
            });
        }).catch((error) => {
            console.error("Error getting subjects: ", error);
            showToast("Failed to fetch subjects", "#dc3545");
        });
    }

    function loadStudents() {
        db.collection("students").get().then((querySnapshot) => {
            data = [];
            querySnapshot.forEach((doc) => {
                const studentData = { id: doc.id, ...doc.data() };
                studentData.teacher = teachers[studentData.teacher] || studentData.teacher; // Replace teacher ID with name
                studentData.subject = subjects[studentData.subject] || studentData.subject; // Replace subject ID with name
                data.push(studentData);
            });
            renderTable();
        }).catch((error) => {
            console.error("Error getting students: ", error);
            showToast("Failed to fetch students", "#dc3545");
        });
    }
    populateSubjectSelect()
    populateTeacherOptions()


    function openModal() {
        formModal.style.display = "block";
    }

    function closeModal() {
        formModal.style.display = "none";
        addTeacherModal.style.display = "none";
        addSubjectModal.style.display = "none";
        entryIdInput.value = "";
        nameInput.value = "";
        surnameInput.value = "";
        phoneInput.value = "";
        dateInput.value = "";
        subjectInput.value = "English";
        populateTeacherOptions();
        paymentInput.value = "140000";
    }



    function renderTable(filteredData = data) {
        tableBody.innerHTML = "";
        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = startIndex + entriesPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);

        pageData.forEach((entry, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td class="indexId">${startIndex + index + 1}</td>
            <td class="text">${entry.name}</td>
            <td class="text">${entry.surname}</td>
            <td>${entry.phone}</td>
            <td class="text">${entry.subject}</td>
            <td class="text">${entry.teacher}</td>
            <td>${entry.date}</td>
            <td>${entry.payment}</td>
            <td class="Actions">
            <button class="deleteBtn" data-id="${entry.id}"><i class="fa-solid fa-trash-can"></i></button>
            <button class="editBtn" data-id="${entry.id}"><i class="fa-solid fa-pen-to-square"></i></button>
            </td>
        `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll(".deleteBtn").forEach(button => {
            button.addEventListener("click", () => {
                const id = button.getAttribute("data-id");
                deleteEntry(id);
            });
        });

        updatePagination(filteredData.length);


        updateSummary(filteredData);

        function updatePagination(totalEntries) {
            const totalPages = Math.ceil(totalEntries / entriesPerPage);
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages;
        }
    }
    // Call updateSummary after any relevant event

    function updateSummary(filteredData) {
        const totalStudentsCount = filteredData.length;
        const totalPaymentAmount = filteredData.reduce((sum, entry) => sum + parseFloat(entry.payment), 0);
        const totalProfitAmount = filteredData.reduce((sum, entry) => {
            if (entry.payment === '140000') {
                return sum + 100000;
            } else if (entry.payment === '120000') {
                return sum + 100000;
            } else if (entry.payment === '100000') {
                return sum + 100000;
            }
            return sum;
        }, 0);

        const totalRentAmount = filteredData.reduce((sum, entry) => {
            if (entry.payment === '140000') {
                return sum + 40000;
            } else if (entry.payment === '120000') {
                return sum + 20000;
            } else if (entry.payment === '100000') {
                return sum + 0;
            }
            return sum;
        }, 0);

        totalStudents.textContent = totalStudentsCount;
        totalPayment.textContent = totalPaymentAmount;
        totalProfit.textContent = totalProfitAmount;
        totalRent.textContent = totalRentAmount;
    }




    function saveEntry() {
        const id = entryIdInput.value;
        const entry = {
            name: nameInput.value,
            surname: surnameInput.value,
            phone: phoneInput.value,
            subject: subjectInput.value,
            date: dateInput.value,
            teacher: teacherInput.value,
            payment: paymentInput.value,
        };
        if (entry.name === "" || entry.surname === "" || entry.phone === "" || entry.subject === "" || entry.date === "" || entry.teacher === "" || entry.payment === "") {
            console.error("Error adding document: ", error);
            showToast("Failed to add entry", "#dc3545");
        }

        if (id) {
            db.collection("students", "subjects").doc(id).update(entry).then(() => {
                const index = data.findIndex(entry => entry.id === id);
                data[index] = { id, ...entry };
                renderTable();
                closeModal();
                showToast("Entry updated successfully", "#28a745");
            }).catch(error => {
                console.error("Error updating document: ", error);
                showToast("Failed to update entry", "#dc3545");
            });
        } else {
            db.collection("students").add(entry).then(docRef => {
                data.push({ id: docRef.id, ...entry });
                renderTable();
                closeModal();
                showToast("Entry added successfully", "#28a745");
            }).catch(error => {
                console.error("Error adding document: ", error);
                showToast("Failed to add entry", "#dc3545");
            });
        }
    }

    //     // Delete function
    function deleteEntry(id, index, updatedEntry) {
        db.collection("students").doc(id).delete().then(() => {
            data = data.filter(entry => entry.id !== id);
            renderTable();
            showToast("Malumot o'chirildi", "#dc3545");
        }).catch(error => {
            console.error("Error deleting document: ", error);
            showToast("Failed to delete entry", "#dc3545");
        });

    }

    // Function to populate form fields when edit button is clicked
    function editEntry(id, index) {
        const entry = data.find(entry => entry.id === id);

        if (entry) {
            entryIdInput.value = entry.id;
            nameInput.value = entry.name;
            surnameInput.value = entry.surname;
            phoneInput.value = entry.phone;
            dateInput.value = entry.date;
            subjectInput.value = entry.subject;
            populateTeacherOptions();
            teacherInput.value = entry.teacher.name;
            paymentInput.value = entry.payment;
            openModal();
        } else {
            console.error("Entry not found");
            showToast("Entry not found", "#dc3545");
        }

    }

    // Event listener for edit buttons
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("editBtn")) {
            const id = event.target.getAttribute("data-id");
            editEntry(id);
        }
    });
    function showToast(message, backgroundColor) {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: backgroundColor
        }).showToast();
    }

    function filterTable() {
        const nameFilter = searchName.value.toLowerCase();
        const surnameFilter = searchSurname.value.toLowerCase();
        const subjectFilter = searchSubject.value;
        const paymentFilter = searchPayment.value;
        const teacherFilter = searchTeacher.value;

        const filteredData = data.filter(entry => {
            return (
                (entry.name.toLowerCase().includes(nameFilter)) &&
                (entry.surname.toLowerCase().includes(surnameFilter)) &&
                (subjectFilter === "" || entry.subject === subjects[subjectFilter]) &&
                (paymentFilter === "" || entry.payment === paymentFilter) &&
                (teacherFilter === "" || entry.teacher === teachers[teacherFilter])
            );
        });

        renderTable(filteredData);
    }

    searchName.addEventListener("input", filterTable);
    searchSurname.addEventListener("input", filterTable);
    searchSubject.addEventListener("change", filterTable);
    searchPayment.addEventListener("change", filterTable);
    searchTeacher.addEventListener("change", filterTable);

    addBtn.addEventListener("click", () => {
        openModal();
    });

    closeBtn.addEventListener("click", () => {
        closeModal();
    });



    saveBtn.addEventListener("click", () => {
        const entryId = entryIdInput.value;
        const name = nameInput.value.trim();
        const surname = surnameInput.value.trim();
        const phone = phoneInput.value.trim();
        const date = dateInput.value.trim();
        const subject = subjectInput.value.trim();
        const teacher = teacherInput.value.trim();
        const payment = paymentInput.value.trim();


        if (!name || !surname || !phone || !date || !subject || !teacher || !payment) {
            showToast("Iltimos, barcha maydonlarni to'ldiring", "#dc3545");
            return;
        }

        db.collection("students")
            .where("name", "==", name)
            .where("surname", "==", surname)
            .where("phone", "==", phone)
            .get()
            .then((querySnapshot) => {
                let isDuplicate = false;

                querySnapshot.forEach((doc) => {
                    if (doc.id !== entryId) {
                        isDuplicate = true;
                    }
                });


                if (isDuplicate) {
                    showToast("Bu talabgor mavjud", "#dc3545");
                } else {
                    if (entryId) {
                        // Mavjud kirishni yangilash
                        db.collection("students").doc(entryId).set({
                            name, surname, phone, date, subject, teacher, payment
                        }).then(() => {
                            showToast("Talabgor muvaffaqiyatli yangilandi", "#28a745");
                            formModal.style.display = "none";
                            fetchData();
                        }).catch((error) => {
                            console.error("Talabgorni yangilashda xato: ", error);
                            showToast("Talabgorni yangilashda xato", "#dc3545");
                        });
                    } else {
                        // Yangi kirishni qo'shish
                        db.collection("students").add({
                            name, surname, phone, date, subject, teacher, payment
                        }).then(() => {
                            showToast("Talabgor muvaffaqiyatli qo'shildi", "#28a745");
                            formModal.style.display = "none";
                            fetchData();
                        }).catch((error) => {
                            console.error("Talabgorni qo'shishda xato: ", error);
                            showToast("Talabgorni qo'shishda xato", "#dc3545");
                        });
                    }
                }
            })
            .catch((error) => {
                console.error("Talabgorni tekshirishda xato: ", error);
                showToast("Talabgorni tekshirishda xato", "#dc3545");
            });
        document.getElementById("name").value = "";
        document.getElementById("surname").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("date").value = "";
        document.getElementById("subject").value = "";
    });

    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextPageBtn.addEventListener("click", () => {
        if (currentPage < Math.ceil(data.length / entriesPerPage)) {
            currentPage++;
            renderTable();
        }
    });
    // Initial data load
    db.collection("students").orderBy("name").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });
        renderTable();
    }).catch(error => {
        console.error("Error getting documents: ", error);
        showToast("Failed to fetch data", "#dc3545");
    });
});





