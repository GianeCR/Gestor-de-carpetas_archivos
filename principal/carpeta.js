document.addEventListener('DOMContentLoaded', () => {
    const createFolderBtn = document.getElementById('createFolderBtn');
    const folderList = document.getElementById('folderList');

    // Verificar si hay carpetas previamente creadas y mostrarlas al cargar la página
    const folders = JSON.parse(localStorage.getItem('folders')) || [];
    folders.forEach(folder => {
        addFolderToList(folder);
    });

    // Generar nombre aleatorio para la carpeta
    function generateRandomFolderName() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < 3; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    // Crear una nueva carpeta
    createFolderBtn.addEventListener('click', () => {
        const folderName = generateRandomFolderName();
        const folder = { name: folderName };
        folders.push(folder);
        localStorage.setItem('folders', JSON.stringify(folders));
        addFolderToList(folder);
    });

    // Agregar una carpeta a la lista
    function addFolderToList(folder) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${folder.name}</span>
            <a class="openBtn" href="../archivos/archivo.html">Abrir</a>
            <button class="deleteBtn">Eliminar</button>
        `;
        folderList.appendChild(li);

        // Agregar evento para abrir la carpeta
        li.querySelector('.openBtn').addEventListener('click', () => {
            // Lógica para abrir la carpeta...
            console.log(`Abriendo carpeta: ${folder.name}`);
        });

        // Agregar evento para eliminar la carpeta
        li.querySelector('.deleteBtn').addEventListener('click', () => {
            const index = folders.indexOf(folder);
            if (index !== -1) {
                folders.splice(index, 1);
                localStorage.setItem('folders', JSON.stringify(folders));
                li.remove();
            }
        });
    }
});