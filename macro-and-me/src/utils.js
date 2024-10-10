function choice(options) {
    return options[Math.floor(Math.random() * options.length)];
}

export default choice;