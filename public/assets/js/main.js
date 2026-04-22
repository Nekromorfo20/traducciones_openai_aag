
let translateButton = document.querySelector("#translateButton");

translateButton.addEventListener("click", async () => {
    // Valor a traducir
    let inputText = document.querySelector("#inpuText");
    const text = inputText.value.trim();

    // Lenguaje de destino
    const targetLang = document.querySelector("#targetLang").value;
    if (!text) return false;

    // Meter el mensaje del usuario a la caja de mensajes
    const userMessage = document.createElement("div");
    userMessage.className = "chat__message chat__message--user";
    userMessage.textContent = text;

    const messagesContainer = document.querySelector(".chat__messages");
    messagesContainer.appendChild(userMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Petición AJAX al backend
    try {
        const response = await fetch("/api/traducir", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                targetLang
            })
        });
        
        const data = await response.json();

        // Agregar el mensaje de la IA al chat
        const botMessage = document.createElement("div");
        botMessage.className = "chat__message chat__message--bot";
        botMessage.textContent = data.translatedText;

        messagesContainer.appendChild(botMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch(error) {
        console.log(`Error: ${error}`);
    }

    // Vaciar el input tipo texto
    inputText.value = "";
});