
const API_URL =
    "https://script.google.com/macros/s/AKfycbxQ6gF1clvOzuqrp6z-fU8o4zZPYZz16Ih19f-94yHNKMZYJEaQPvWiX6z22ZtnVgUe/exec";

async function sendData() {

    const data = {
        productID: window.localStorage.getItem('ProductID'),

        name: document.getElementsByName("name")[0].value,

        address: document.getElementsByName("address")[0].value,

        phone: document.getElementsByName("phone")[0].value,

        productData: window.localStorage.getItem('ProductDataNeed'),



    };

    try {

        await fetch(API_URL, {

            method: "POST",

            mode: "no-cors",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(data)

        });

        document
            .getElementById("status")
            .innerText =
            "Data Sent Successfully";

    }

    catch (error) {

        console.error(error);

        document
            .getElementById("status")
            .innerText =
            "Error Sending Data";

    }

}