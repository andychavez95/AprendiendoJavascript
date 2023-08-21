const getById = id => document.getElementById(id);
//Retorna un array con todos los elementos que coincidan con el parametros
const getAll = sel => document.querySelectorAll(sel);

//Retorna un objeto.
const getIO = () => ({
    text: getAll("#text")[0]
        .value
        .normalize(),
    search: getAll("#search")[0]
        .value
        .normalize(),
    view: getAll("#view")[0]
});

//Retorna una cadena de caracteres con letras, dígitos y signos de puntuación.
const clean_string = (text) =>
    text
        //Cambia caracteres escapados por espacios en blanco
        .replace(/[\n\r\t]+/igm, " ")
        //Solo deja letras, dígitos y signos de puntuación.
        .replace(/[^a-zñáéíóú0-9 \.,;:()¿?¡!“”❝❞«»❛❜'‘’\-_]+/igm, "")
        //Si hay muchos espacios en blanco seguido, solo deja uno.
        .replace(/ +/gm, " ");

//Devuelve un array donde cada elemento es una caracter de la cadena original.
const char_array = (text) =>
    clean_string(text)
        //Quita los espacios en blanco, signos de puntuación y dígitos.
        .replace(/[^a-zñáéíóú]+/igm, "")
        //Crea un array donde cada caracter es un elemento.
        .split("")
        //remove empty string elem
        .filter((w) => (w !== ""));

//Retorna un arreglo donde cada elemento es una palabra
const word_array = (text) =>
    clean_string(text)
        //Quita signos como: .:;?!
        .replace(/[^a-zñáéíóúü ]+/igm, "")
        //Crea array donde el delimitador es " "
        .split(' ')
        .filter((elemento) => (elemento !== ""));

const sentence_array = (text) =>
    clean_string(text)
        .replace(/([\.:;?!\n]+)/gm, "$1+")
        //Agrega un + después de ": .:;?!\n"
        .split("+")
        //Quita elementos vacios del arrglo
        .filter((w) => (w !== ""))
        //Quita espacios varios sobrantes
        .map((s) => (s.replace(/^[ 0-9]+(.*$)/, "$1")));

/*Recibe un arreglo ordenado y cuenta 
la cantidad de elementos de cada elemento.*/
const repetitions = (ordered_array) =>
    ordered_array
        .reduce((acumulador, elemento, indice, arreglo) => {
            if (indice === 0) {
                acumulador.push({ item: elemento, cantidad: 1 });
            } else if (elemento === arreglo[indice - 1]) {
                acumulador[acumulador.length - 1].cantidad++;
            } else {
                acumulador.push({ item: elemento, cantidad: 1 })
            }
            return acumulador;
        }, []);

const count = () => {
    let { text, view } = getIO();

    let //Longuitd del array
        result = `Caracteres: ${char_array(text).length}\n`;

    result += `Palabras: ${word_array(text).length}\n`;

    result += `Frases: ${sentence_array(text).length}\n`;
    //Cantidad de lineas del textarea
    result += `Lineas: ${text.split("\n").length}\n`;

    view.innerHTML = result;
};

const letter_index = () => {
    let { text, view } = getIO();

    //Ordena el arreglo de elementos
    let ordered_letters = char_array(text)
        .map(el => el.toLowerCase())
        .sort();

    let result = repetitions(ordered_letters)
        .map(el => `${el.item}: ${el.cantidad}`)
        .join("\n");

    view.innerHTML = result;
};

// TODO
const word_index = () => {
    let { text, view } = getIO();

    let ordered_words =
        word_array(text)
            .map(elemento => elemento.toLowerCase())
            .sort();

    let result = repetitions(ordered_words)
        .map(elemento => `${elemento.item}: ${elemento.cantidad}`)
        .join("\n");

    view.innerHTML = result;
};

const sentence_index = () => {
    let { text, view } = getIO();

    let ordered_sentences =
        sentence_array(text)
            .map(el => el.toLowerCase())
            .sort();

    let result =
        repetitions(ordered_sentences)
            .map(el => `${el.item}: ${el.cantidad}`)
            .join("\n");

    view.innerHTML = result;
};

const search_letters = () => {
    let { text, view, search } = getIO();

    let ordered_letters =
        char_array(text)
            .map(el => el.toLowerCase())
            .filter(el => el.includes(search.toLowerCase()))
            .sort();

    let result = 'Hay ' + ordered_letters.length + ' ocurrencias de la letra ' +
        search + '.\n\n';

    result +=
        repetitions(ordered_letters)
            .map(el => `${el.cantidad} repeticiones de: ${el.item}`)
            .join("\n");

    view.innerHTML = result;
};

// TODO
const search_words = () => {
    let { text, view, search } = getIO();

    let ordered_words = 
        word_array(text)
            .map(el => el.toLowerCase())
            .filter(el => el.includes(search.toLowerCase()))
            .sort();

    let result = 'Hay ' + ordered_words.length + ' palabras que contienen ' +
        search + '.\n\n';
    
        result += 
            repetitions(ordered_words)
            .map(elemento => elemento.cantidad + ' repeticiones de: ' +
                elemento.item)
            .join("\n");
    
    view.innerHTML = result;
};

const search_sentences = () => {
    let { text, view, search } = getIO();

    let searched_sentences =
        sentence_array(text)
            .filter(el => el.includes(search))
            .sort();

    let result = 'Hay ' + searched_sentences.length + ' frases que contienen ' +
        search + '.\n\n';

    result +=
        repetitions(searched_sentences)
            .map(el => `${el.cantidad} repeticiones de: ${el.item}`)
            .join("\n");

    view.innerHTML = result;
};

// ROUTER de eventos
document.addEventListener('click', ev => {
    if (ev.target.matches('.count')) count();
    else if (ev.target.matches('.letter_index')) letter_index();
    else if (ev.target.matches('.word_index')) word_index();
    else if (ev.target.matches('.sentence_index')) sentence_index();
    else if (ev.target.matches('.search_letters')) search_letters();
    else if (ev.target.matches('.search_words')) search_words();
    else if (ev.target.matches('.search_sentences')) search_sentences();
});
