let CursorText = document.querySelectorAll(".CursorText");

CursorText.forEach((CT) => {
    let ToWorkOnText = CT.textContent;
    CT.textContent = "";

    let i = 0;

    let interval = setInterval(() => {
        CT.textContent += ToWorkOnText.charAt(i);
        console.log(CT.textContent);

        i++;

        // Stop when all characters are printed
        if (i >= ToWorkOnText.length) {
            clearInterval(interval);
        }
    }, 200); // 500ms = 0.5 second
});